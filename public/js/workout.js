import { fetchWorkout, fetchExercise } from './common.js';
import { routeTo } from './router.js';

const ui = {};

let timerDuration = 0;
let startTime = 0;
let pausedTime = 0;
let timerInterval = null;
let workout = null;
let activeExerciseIndex = null;

export async function loadWorkoutPage() {
  ui.exerciseLabel = document.querySelector('#exerciseLabel');
  ui.startBtn = document.querySelector('#startBtn');
  ui.stopBtn = document.querySelector('#stopBtn');
  ui.nextBtn = document.querySelector('#nextBtn');

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
    timerDuration = parseInt(activeExercise.time) * 60;
    ui.exerciseLabel.innerText = activeExerciseData.name;
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
    stop();
    return;
  }
  activeExerciseIndex++;
  localStorage.setItem('workout', JSON.stringify({ workoutUUID: workout.uuid, activeExerciseIndex }));

  const activeExercise = workoutData[activeExerciseIndex];
  const activeExerciseData = await fetchExercise(activeExercise.id);
  timerDuration = parseInt(activeExercise.time) * 60;
  ui.exerciseLabel.innerText = activeExerciseData.name;
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
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  const timerDisplay = document.querySelector('#timerDisplay');
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
