import { fetchWorkout } from './common.js';

export async function loadWorkoutMenuPage() {
  await loadWorkout();
}

async function loadWorkout() {
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
