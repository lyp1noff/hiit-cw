const sortableList = document.querySelector(".sortable-list");

document.addEventListener('DOMContentLoaded', async () => {
    const exercises = await fetchExercises();
    const exercisesList = document.querySelector("#exercisesList");

    exercises.forEach(item => {
        const li = document.createElement("li");
        li.appendChild(document.createTextNode(item.name));
        li.addEventListener("click", () => addExercise(item))
        exercisesList.appendChild(li);
    })
})

function addExercise(item) {
    let template = document.querySelector('#exerciseItemTemplate');
    const cloned = template.content.cloneNode(true);
    cloned.querySelector("span").innerText = item.name;
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

sortableList.addEventListener("dragover", initSortableList);
sortableList.addEventListener("dragenter", e => e.preventDefault());