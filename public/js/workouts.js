document.addEventListener('DOMContentLoaded', async () => {
    const addWorkoutBtn = document.querySelector('#addWorkout');
    addWorkoutBtn.addEventListener('click', () => showContent("workoutMenu"));
})

document.addEventListener('contentChanged', async (e) => {
    const activeSection = e.detail.route === 'workouts';
    if (activeSection) {
        await updateUI();
    }
})

async function handleClick(e) {
    const workout = await fetchWorkout(e.target.dataset.uuid)
    console.log(workout.data);
    navigateTo('workout');
}

async function updateUI() {
    const workouts = await fetchWorkouts();
    const workoutsContainer = document.querySelector('.workouts-container');
    workoutsContainer.innerHTML = '';
    if (workouts.length < 1) {
        const p = document.createElement('p')
        p.textContent = 'Go ahead and add new Workout!';
        workoutsContainer.appendChild(p);
    } else {
        const ul = document.createElement('ul')
        ul.setAttribute('id', 'workouts-list');
        workouts.forEach(workout => {
            const li = document.createElement('li')
            li.textContent = workout.name;
            li.classList.add("item");
            li.dataset.uuid = workout.uuid;
            li.addEventListener('click', handleClick);
            ul.appendChild(li);
            workoutsContainer.appendChild(ul);
        })
    }
}

async function fetchWorkout(uuid) {
    const response = await fetch(`/api/workout/${uuid}`);
    return await response.json();
}

async function fetchWorkouts() {
    const response = await fetch('/api/workouts');
    return await response.json();
}