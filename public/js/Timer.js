class Timer {
    constructor(time, elem) {
        this.timerDuration = time;
        this.timerDisplay = elem;
        this.startTime = 0;
        this.pausedTime = 0;
        this.timerInterval = null;
        this.loadState();
    }

    start() {
        if (!this.startTime) {
            this.startTime = Date.now() - this.pausedTime;
        }

        // js moment
        const elapsedTime = Math.floor((Date.now() - this.startTime) / 1000);
        const elapsedSeconds = this.timerDuration - elapsedTime;
        this.updateDisplay(elapsedSeconds);

        this.timerInterval = setInterval(() => {
            const elapsedTime = Math.floor((Date.now() - this.startTime) / 1000);
            const elapsedSeconds = this.timerDuration - elapsedTime;
            if (elapsedSeconds <= 0) {
                this.stop();
            }
            this.updateDisplay(elapsedSeconds);
        }, 1000);
        this.saveState();
    }

    pause() {
        clearInterval(this.timerInterval);
        this.pausedTime = Date.now() - this.startTime;
        this.startTime = 0;
        this.saveState();
    }

    stop() {
        clearInterval(this.timerInterval);
        this.startTime = 0;
        this.pausedTime = 0;
        localStorage.removeItem('timerState');
        this.updateDisplay(0);
    }

    updateDisplay(time) {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        this.timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    saveState() {
        localStorage.setItem('timerState', JSON.stringify({
            startTime: this.startTime,
            pausedTime: this.pausedTime
        }));
    }

    loadState() {
        const savedState = JSON.parse(localStorage.getItem('timerState'));
        if (savedState) {
            this.startTime = savedState.startTime;
            this.pausedTime = savedState.pausedTime;
            if (!this.startTime) {
                this.updateDisplay(this.timerDuration - Math.floor(savedState.pausedTime / 1000));
            }
        }
    }
}

export default Timer;
