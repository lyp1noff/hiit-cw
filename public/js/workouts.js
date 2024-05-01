import { routeTo, showContent } from './router.js';
import { fetchWorkouts } from './common.js';

export async function loadWorkoutsPage() {
  const addWorkoutBtn = document.querySelector('#addWorkout');
  addWorkoutBtn.addEventListener('click', () => showContent('workout-edit'));
  await refreshUI();
}

document.addEventListener('contentChanged', async (e) => {
  const activeSection = e.detail.route === 'workouts';
  if (activeSection) {
    await refreshUI();
  }
});

function openWorkout(e) {
  if (e.target.tagName !== 'LI') return;
  if (e.target.classList.contains('active-dropdown')) {
    e.target.classList.remove('active-dropdown');
    e.target.removeChild(e.target.querySelector('#dropdown'));
    return;
  }

  const targetWorkoutUUID = e.target.dataset.uuid;
  e.target.classList.add('active-dropdown');

  const startButton = document.createElement('button');
  startButton.id = 'start-workout';
  startButton.textContent = 'Start';
  startButton.addEventListener('click', () => startWorkout(targetWorkoutUUID));

  const editButton = document.createElement('button');
  editButton.id = 'edit-workout';
  editButton.textContent = 'Edit';
  editButton.addEventListener('click', () => editWorkout(targetWorkoutUUID));

  const deleteButton = document.createElement('button');
  deleteButton.id = 'delete-workout';
  deleteButton.textContent = 'Delete';
  deleteButton.addEventListener('click', () => deleteWorkout(targetWorkoutUUID));

  const containerDiv = document.createElement('div');
  containerDiv.id = 'dropdown';
  containerDiv.appendChild(startButton);
  containerDiv.appendChild(editButton);
  containerDiv.appendChild(deleteButton);

  e.target.appendChild(containerDiv);
}

function startWorkout(targetWorkoutUUID) {
  const workout = localStorage.getItem('workout');
  if (!workout || JSON.parse(workout).activeExerciseIndex === -1) {
    localStorage.setItem('workout', JSON.stringify({ workoutUUID: targetWorkoutUUID, activeExerciseIndex: 0 }));
  } else {
    if (targetWorkoutUUID === JSON.parse(workout).workoutUUID) {
      console.log('This workout is already active.');
      routeTo('workout');
      return;
    } else {
      console.log('There is another already active workout.');
      return;
    }
  }
  routeTo('workout');
}

function editWorkout(targetWorkoutUUID) {
  console.log(targetWorkoutUUID);
}

function deleteWorkout(targetWorkoutUUID) {
  console.log(targetWorkoutUUID);
}

async function refreshUI() {
  const workouts = await fetchWorkouts();
  const workoutsContainer = document.querySelector('.workouts-container');
  workoutsContainer.innerHTML = '';
  if (workouts.length < 1) {
    const p = document.createElement('p');
    p.textContent = 'Go ahead and add new Workout!';
    workoutsContainer.appendChild(p);
  } else {
    const ul = document.createElement('ul');
    ul.setAttribute('id', 'workouts-list');
    workouts.forEach(workout => {
      const li = document.createElement('li');
      li.textContent = workout.name;
      li.classList.add('item');
      li.dataset.uuid = workout.uuid;
      li.addEventListener('click', openWorkout);
      ul.appendChild(li);
      workoutsContainer.appendChild(ul);
    });
  }
}
