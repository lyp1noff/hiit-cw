const ui = {};

let timerDuration = 60;
let startTime = 0;
let pausedTime = 0;
let timerInterval = null;

export function loadWorkoutPage() {
  ui.exerciseLabel = document.querySelector('#exerciseLabel');
  ui.startBtn = document.querySelector('#startBtn');
  ui.stopBtn = document.querySelector('#stopBtn');

  ui.startBtn.addEventListener('click', () => {
    if (!startTime) {
      start();
    } else if (startTime) {
      pause();
    }
  });

  ui.stopBtn.addEventListener('click', () => {
    stop();
  });

  loadState();
  if (startTime) {
    start();
  } else if (pausedTime) {
    ui.startBtn.textContent = 'Resume';
  }
}

document.addEventListener('contentChanged', async (e) => {
  const activeSection = e.detail.route === 'workout';
  if (activeSection) {
    const activeWorkout = localStorage.getItem('workout');
    if (activeWorkout) {
      const workout = await fetchWorkout(activeWorkout);
      const data = JSON.parse(workout.data);
      const exercise1 = await fetchExercise(data[0].id);

      ui.exerciseLabel.innerText = exercise1.name;
      timerDuration = parseInt(data[0].time) * 60;
    }
  }
});

function start() {
  ui.startBtn.textContent = 'Pause';

  if (!startTime) {
    startTime = Date.now() - pausedTime;
  }

  tick();
  timerInterval = setInterval(tick, 100);
  saveState();
}

function tick() {
  const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
  const remainingSeconds = timerDuration - elapsedTime;
  if (remainingSeconds <= 0) {
    stop();
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

function stop() {
  ui.startBtn.textContent = 'Start Workout';
  clearInterval(timerInterval);
  pausedTime = 0;
  startTime = 0;
  localStorage.removeItem('timerState');
  updateDisplay(0);
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

function loadState() {
  const savedState = JSON.parse(localStorage.getItem('timerState'));
  if (savedState) {
    startTime = savedState.startTime;
    pausedTime = savedState.pausedTime;
    if (!startTime) {
      updateDisplay(timerDuration - Math.floor(pausedTime / 1000));
    }
  }
}

async function fetchWorkout(uuid) {
  const response = await fetch(`/api/workout/${uuid}`);
  return await response.json();
}

async function fetchExercise(id) {
  const response = await fetch(`/api/exercise/${id}`);
  return await response.json();
}
