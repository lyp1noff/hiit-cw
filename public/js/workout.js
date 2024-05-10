import { fetchWorkout, fetchExercise, convertToTimeComponents, showAlert } from './common.js';
import { routeTo } from './router.js';

const ui = {};

let timerDuration = 0;
let startTime = 0;
let pausedTime = 0;
let timerInterval = null;
let workout = null;
let activeExerciseIndex = null;

export async function loadWorkoutPage() {
  ui.exerciseNameLabel = document.querySelector('#exercise-label');
  ui.exerciseDescriptionLabel = document.querySelector('#exercise-description-label');
  ui.startBtn = document.querySelector('#start-button');
  ui.stopBtn = document.querySelector('#stop-button');
  ui.nextBtn = document.querySelector('#next-button');

  ui.startBtn.addEventListener('click', async () => {
    if (!startTime) {
      await start();
    } else if (startTime) {
      pause();
    }
  });

  ui.stopBtn.addEventListener('click', () => {
    stop();
  });

  ui.nextBtn.addEventListener('click', () => {
    nextExercise();
  });

  await loadWorkout();
  loadTimerState();
  if (startTime) {
    await start();
  } else if (pausedTime) {
    ui.startBtn.textContent = 'Resume';
  }
}

document.addEventListener('contentChanged', async (e) => {
  const activeSection = e.detail.route === 'workout';
  if (activeSection) {
    await loadWorkout();
  }
});

async function loadWorkout() {
  const activeWorkout = JSON.parse(localStorage.getItem('workout'));
  if (activeWorkout) {
    workout = await fetchWorkout(activeWorkout.workoutUUID);
    activeExerciseIndex = activeWorkout.activeExerciseIndex;
    const workoutData = JSON.parse(workout.data);
    const activeExercise = workoutData[activeExerciseIndex];
    const activeExerciseData = await fetchExercise(activeExercise.id);
    timerDuration = parseInt(activeExercise.time);
    ui.exerciseNameLabel.innerText = activeExerciseData.name;
    ui.exerciseDescriptionLabel.innerText = activeExerciseData.description;
  }
}

async function start() {
  ui.startBtn.textContent = 'Pause';

  if (!startTime) {
    startTime = Date.now() - pausedTime;
  }

  await tick();
  timerInterval = setInterval(tick, 100);
  saveState();
}

async function tick() {
  const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
  const remainingSeconds = timerDuration - elapsedTime;
  if (remainingSeconds <= 0) {
    updateDisplay(0);
    await nextExercise();
    await start();
  }
  updateDisplay(remainingSeconds);
}

function pause() {
  ui.startBtn.textContent = 'Resume';
  clearInterval(timerInterval);
  pausedTime = Date.now() - startTime;
  startTime = 0;
  saveState();
}

async function nextExercise() {
  clearInterval(timerInterval);
  pausedTime = 0;
  startTime = 0;

  localStorage.removeItem('timerState');
  const workoutData = JSON.parse(workout.data);
  if (workoutData.length <= activeExerciseIndex + 1) {
    showAlert('Workout Complete', 'You have completed the workout!');
    stop();
    return;
  }
  activeExerciseIndex++;
  localStorage.setItem('workout', JSON.stringify({ workoutUUID: workout.uuid, activeExerciseIndex }));

  const activeExercise = workoutData[activeExerciseIndex];
  const activeExerciseData = await fetchExercise(activeExercise.id);
  timerDuration = parseInt(activeExercise.time);
  ui.exerciseNameLabel.innerText = activeExerciseData.name;
  ui.exerciseDescriptionLabel.innerText = activeExerciseData.description;
  updateDisplay(0);
  ui.startBtn.textContent = 'Start';
}

function stop() {
  ui.startBtn.textContent = 'Start Workout';
  clearInterval(timerInterval);
  pausedTime = 0;
  startTime = 0;
  localStorage.removeItem('timerState');
  localStorage.removeItem('workout');
  updateDisplay(0);
  routeTo('workouts');
}

function updateDisplay(time) {
  const { minutes, seconds } = convertToTimeComponents(time);
  const timerDisplay = document.querySelector('#timer-display');
  timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function saveState() {
  localStorage.setItem('timerState', JSON.stringify({
    startTime,
    pausedTime,
  }));
}

function loadTimerState() {
  const savedState = JSON.parse(localStorage.getItem('timerState'));
  if (savedState) {
    startTime = savedState.startTime;
    pausedTime = savedState.pausedTime;
    if (!startTime) {
      updateDisplay(timerDuration - Math.floor(pausedTime / 1000));
    }
  }
}
