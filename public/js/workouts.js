import { routeTo, showContent } from './router.js';
import { deleteWorkout, fetchWorkouts, getUserUUID } from './common.js';

export async function loadWorkoutsPage() {
  const addWorkoutBtn = document.querySelector('#add-workout');
  addWorkoutBtn.addEventListener('click', addWorkout);
  await refreshUI();
}

document.addEventListener('contentChanged', async (e) => {
  const activeSection = e.detail.route === 'workouts';
  if (activeSection) {
    await refreshUI();
  }
});

function addWorkout() {
  localStorage.removeItem('workoutEdit');
  showContent('workout-edit');
}

function openWorkout(e) {
  const elem = e.target;

  if (elem.tagName !== 'LI') return;

  if (elem.classList.contains('active-dropdown')) {
    elem.classList.remove('active-dropdown');
    elem.removeChild(elem.querySelector('.dropdown'));
    return;
  }

  const dropdowns = document.querySelectorAll('.active-dropdown');
  dropdowns.forEach(dropdown => {
    dropdown.classList.remove('active-dropdown');
    dropdown.removeChild(dropdown.querySelector('.dropdown'));
  });

  const targetWorkoutUUID = elem.dataset.uuid;
  elem.classList.add('active-dropdown');

  const startButton = document.createElement('button');
  startButton.id = 'start-workout';
  startButton.textContent = 'Start';
  startButton.addEventListener('click', () => startWorkout(targetWorkoutUUID));

  const editButton = document.createElement('button');
  editButton.id = 'edit-workout';
  editButton.textContent = 'Edit';
  editButton.addEventListener('click', () => editWorkoutButtonClick(targetWorkoutUUID));

  const deleteButton = document.createElement('button');
  deleteButton.id = 'delete-workout';
  deleteButton.textContent = 'Delete';
  deleteButton.addEventListener('click', () => deleteWorkoutButtonClick(targetWorkoutUUID));

  const shareButton = document.createElement('button');
  shareButton.id = 'delete-workout';
  shareButton.textContent = 'Share';
  shareButton.addEventListener('click', () => {
    navigator.clipboard.writeText(window.location.origin + '/app/export/' + targetWorkoutUUID);
  });

  const containerDiv = document.createElement('div');
  containerDiv.className = 'dropdown';
  containerDiv.appendChild(startButton);
  containerDiv.appendChild(editButton);
  containerDiv.appendChild(deleteButton);
  containerDiv.appendChild(shareButton);

  elem.appendChild(containerDiv);
}

function startWorkout(targetWorkoutUUID) {
  const workout = localStorage.getItem('workout');
  if (!workout) {
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

function editWorkoutButtonClick(targetWorkoutUUID) {
  localStorage.setItem('workoutEdit', JSON.stringify({ workoutUUID: targetWorkoutUUID }));
  showContent('workout-edit');
}

async function deleteWorkoutButtonClick(targetWorkoutUUID) {
  await deleteWorkout(targetWorkoutUUID);
  await refreshUI();
}

async function refreshUI() {
  const workouts = await fetchWorkouts(getUserUUID());
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
