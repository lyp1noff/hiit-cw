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

    const exerciseBtn = document.querySelector('#exerciseBtn');
    exerciseBtn.addEventListener('click', addExercise)

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
    const template = document.querySelector('#exerciseItemTemplate');
    const cloned = template.content.cloneNode(true);

    const exerciseDropdown = document.querySelector('#exercise-dropdown');
    cloned.querySelector("span").innerText = exerciseDropdown.value;
    sortableList.append(cloned);

    const items = sortableList.querySelectorAll(".item");
    items.forEach(item => {
        item.addEventListener("dragstart", () => {
            setTimeout(() => item.classList.add("dragging"), 0);
        });
        item.addEventListener("dragend", () => item.classList.remove("dragging"));
    });
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