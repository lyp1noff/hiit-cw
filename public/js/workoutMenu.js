import { fetchWorkout } from './common.js';
import { showContent } from './router.js';

export async function loadWorkoutMenuPage() {
  await loadWorkout();
}

document.addEventListener('contentChanged', async (e) => {
  const activeSection = e.detail.route === 'workoutMenu';
  if (activeSection) {
    await refreshUI();
  }
});

async function loadWorkout() {
  await refreshUI();
  const addWorkoutBtn = document.querySelector('#start-workout');
  addWorkoutBtn.addEventListener('click', openWorkout);
}

function openWorkout() {
  const workout = localStorage.getItem('workout');
  localStorage.setItem('workout', JSON.stringify({ workoutUUID: JSON.parse(workout).workoutUUID, activeExerciseIndex: 0 }));
  showContent('workout');
}

async function refreshUI() {
  const activeWorkout = JSON.parse(localStorage.getItem('workout'));
  if (activeWorkout) {
    const label = document.querySelector('#workout-name');
    const workout = await fetchWorkout(activeWorkout.workoutUUID);
    label.textContent = workout.name;
    // activeExerciseIndex = activeWorkout.activeExerciseIndex;
    // const workoutData = JSON.parse(workout.data);
    // const activeExercise = workoutData[activeExerciseIndex];
    // const activeExerciseData = await fetchExercise(activeExercise.id);
    // timerDuration = parseInt(activeExercise.time) * 60;
    // ui.exerciseLabel.innerText = activeExerciseData.name;
  }
}
