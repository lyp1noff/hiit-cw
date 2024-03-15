import * as router from './router.js';

export async function loadWorkoutsPage() {
  const addWorkoutBtn = document.querySelector('#addWorkout');
  addWorkoutBtn.addEventListener('click', () => router.showContent('workout-edit'));
  await refreshUI();
}

document.addEventListener('contentChanged', async (e) => {
  const activeSection = e.detail.route === 'workouts';
  if (activeSection) {
    await refreshUI();
  }
});

function openWorkout(e) {
  const workout = e.target.dataset.uuid;
  localStorage.setItem('workout', workout);
  router.routeTo('workout');
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

async function fetchWorkouts() {
  const response = await fetch('/api/workouts');
  return await response.json();
}
