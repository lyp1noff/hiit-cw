import Timer from './Timer.js';

document.addEventListener('DOMContentLoaded', () => {
    const exerciseLabel = document.querySelector('#exerciseLabel');
    const startBtn = document.querySelector('#startBtn');
    const stopBtn = document.querySelector('#stopBtn');
    const timerDisplay = document.querySelector('#timerDisplay');

    const exerciseName = "exercise #";
    const time = 60;

    exerciseLabel.innerText = exerciseName;

    const timer = new Timer(time, timerDisplay);
    const timerState = JSON.parse(localStorage.getItem('timerState'));
    if (timerState) {
        if (timerState.startTime) {
            timer.start();
            startBtn.textContent = 'Pause';
        } else {
            startBtn.textContent = 'Resume';
        }
    }

    startBtn.addEventListener('click', () => {
        if (startBtn.textContent === 'Start Workout' || startBtn.textContent === 'Resume') {
            timer.start();
            startBtn.textContent = 'Pause';
        } else if (startBtn.textContent === 'Pause') {
            timer.pause();
            startBtn.textContent = 'Resume';
        }
    });

    stopBtn.addEventListener('click', () => {
        timer.stop();
        startBtn.textContent = 'Start Workout';
    });
});
