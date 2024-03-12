let exercises = {}
const sortableList = document.querySelector(".sortable-list");

document.addEventListener('DOMContentLoaded', async () => {
    exercises = await fetchExercises();

    const exerciseDropdown = document.querySelector('#exercise-dropdown');
    exercises.forEach(exercise => {
        const option = document.createElement('option');
        option.value = exercise.name;
        option.textContent = exercise.name;
        exerciseDropdown.appendChild(option);
    });
    updateExerciseDescription()

    exerciseDropdown.addEventListener('change', updateExerciseDescription);

    const exerciseAddBtn = document.querySelector('#exerciseAddBtn');
    exerciseAddBtn.addEventListener('click', addExercise);
    const exerciseSaveBtn = document.querySelector('#exerciseSave');
    exerciseSaveBtn.addEventListener('click', saveWorkout);
    const exerciseExitBtn = document.querySelector('#exerciseExit');
    exerciseExitBtn.addEventListener('click', exitWorkout);

    sortableList.addEventListener("dragover", initSortableList);
    sortableList.addEventListener("dragenter", e => e.preventDefault());
})

function updateExerciseDescription() {
    const exerciseDropdown = document.querySelector('#exercise-dropdown');
    const exerciseDescription = document.querySelector('#exercise-description');
    const selectedExercise = exerciseDropdown.value;
    const selectedExerciseData = exercises.find(exercise => exercise.name === selectedExercise);
    exerciseDescription.textContent = selectedExerciseData.description;
}

function addExercise() {
    const exerciseDropdown = document.querySelector('#exercise-dropdown');
    const exerciseTime = document.querySelector('#exercise-time');

    if (!exerciseTime.value || !exerciseDropdown.value) {
        console.log("Empty values")
        return;
    }

    const template = document.querySelector('#exerciseItemTemplate');
    const cloned = template.content.cloneNode(true);
    const span = cloned.querySelector("span");
    span.innerText = `${exerciseDropdown.value} (${exerciseTime.value} min)`;
    span.dataset.name = exerciseDropdown.value;
    span.dataset.time = exerciseTime.value;

    const removeBtn = cloned.querySelector("#exercise-remove");
    removeBtn.addEventListener('click', removeExercise)
    const editBtn = cloned.querySelector("#exercise-edit");
    editBtn.addEventListener('click', editExercise)

    sortableList.append(cloned);

    const items = sortableList.querySelectorAll(".item");
    items.forEach(item => {
        item.addEventListener("dragstart", () => {
            setTimeout(() => item.classList.add("dragging"), 0);
        });
        item.addEventListener("dragend", () => item.classList.remove("dragging"));
    });
}

function removeExercise(e) {
    e.currentTarget.parentElement.remove();
}

function editExercise(e) {
    console.log(e.currentTarget.parentElement);
}

async function saveWorkout() {
    const exercises = [];
    const listItems = document.querySelectorAll('.sortable-list .item span');
    listItems.forEach(listItem => {
        exercises.push({
            name: listItem.dataset.name,
            time: parseInt(listItem.dataset.time)
        });
    });

    console.log(exercises);

    const response = await fetch('/api/workouts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(exercises)
    });

    // console.log(response);
}

function exitWorkout() {
    resetMenu();
    navigateTo('workouts');
}

function resetMenu() {
    const sortableList = document.querySelector('.sortable-list');
    while (sortableList.firstChild) {
        sortableList.removeChild(sortableList.firstChild);
    }
    document.querySelector('#exercise-dropdown').selectedIndex = 0;
    document.querySelector('#exercise-time').value = '';
    document.querySelector('#exercise-description').textContent = '';
    updateExerciseDescription()
}

async function fetchExercises() {
    const response = await fetch('/api/exercises');
    return await response.json();
}

const initSortableList = (e) => {
    e.preventDefault();
    const draggingItem = document.querySelector(".dragging");
    let siblings = [...sortableList.querySelectorAll(".item:not(.dragging)")];
    let nextSibling = siblings.find(sibling => {
        return e.clientY <= sibling.offsetTop + sibling.offsetHeight / 2;
    });

    sortableList.insertBefore(draggingItem, nextSibling);
}