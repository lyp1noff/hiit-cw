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
  const targetWorkoutUUID = e.target.dataset.uuid;
  const workout = localStorage.getItem('workout');
  if (!workout || JSON.parse(workout).activeExerciseIndex === -1) {
    localStorage.setItem('workout', JSON.stringify({ workoutUUID: targetWorkoutUUID, activeExerciseIndex: -1 }));
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
  routeTo('workoutMenu');
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
