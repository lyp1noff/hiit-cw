import { showContent } from './router.js';
import { fetchGlobalWorkouts, fetchWorkout } from './common.js';

export async function loadHomePage() {
  await addWorkoutCards();
}

async function addWorkoutCards() {
  const workouts = await fetchGlobalWorkouts();
  workouts.forEach(workout => {
    addWorkoutCard(workout.uuid, workout.name, workout.description, workout.image_url);
  });
}

function addWorkoutCard(uuid, name, description, imgUrl) {
  const container = document.querySelector('.home-workouts-container');

  const template = document.querySelector('#workout-card-template');
  const cloned = template.content.cloneNode(true);

  const workoutName = cloned.querySelector('.home-workout-name');
  const workoutDescription = cloned.querySelector('.home-workout-description');
  const workoutButton = cloned.querySelector('#home-copy-workout-button');
  const workoutImage = cloned.querySelector('.home-workout-image-container');
  workoutImage.style.backgroundImage = `url(${imgUrl})`;

  workoutName.innerText = name;
  workoutDescription.innerText = description;
  workoutButton.dataset.uuid = uuid;
  workoutButton.addEventListener('click', async (e) => await copyWorkout(e));

  container.append(cloned);
}

async function copyWorkout(e) {
  const uuid = e.target.dataset.uuid;
  const res = await fetchWorkout(uuid);
  if (res.error || !res.uuid) return;
  localStorage.setItem('workoutExport', JSON.stringify({ uuid: res.uuid, name: res.name, data: res.data }));
  showContent('workout-edit');
}
