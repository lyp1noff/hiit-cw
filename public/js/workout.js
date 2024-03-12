export function loadWorkoutPage() {
    const contentSection = document.querySelector(`main > div[data-route="workout"]`);
    contentSection.classList.add('active');

    const exerciseName = "exercise #";
    const timerDuration = 60;

    let startTime = 0;
    let pausedTime = 0;
    let timerInterval = null;

    const exerciseLabel = document.querySelector('#exerciseLabel');
    exerciseLabel.innerText = exerciseName;

    const startBtn = document.querySelector('#startBtn');
    startBtn.addEventListener('click', () => {
        if (!startTime) {
            start();
        } else if (startTime) {
            pause();
        }
    });

    const stopBtn = document.querySelector('#stopBtn');
    stopBtn.addEventListener('click', () => {
        stop();
    });

    loadState();
    if (startTime) {
        start();
    } else if (pausedTime) {
        startBtn.textContent = 'Resume';
    }

    function start() {
        startBtn.textContent = 'Pause';

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
        startBtn.textContent = 'Resume';
        clearInterval(timerInterval);
        pausedTime = Date.now() - startTime;
        startTime = 0;
        saveState();
    }

    function stop() {
        startBtn.textContent = 'Start Workout';
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
            startTime: startTime,
            pausedTime: pausedTime
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
}
