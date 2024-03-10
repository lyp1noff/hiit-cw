import './index.js'

document.addEventListener('DOMContentLoaded', async () => {
    const addWorkoutBtn = document.querySelector('#addWorkout');
    addWorkoutBtn.addEventListener('click', () => {
        showContent("workoutMenu");
    });
})