import * as router from './index.js';

let exercises = {};

export async function loadWorkoutMenuPage() {
  const contentSection = document.querySelector('main > div[data-route="workoutMenu"]');
  contentSection.classList.add('active');

  exercises = await fetchExercises();

  updateExerciseDropdown();
  updateExerciseDescription();

  document.querySelector('#exerciseAddBtn').addEventListener('click', addExercise);
  document.querySelector('#exerciseSave').addEventListener('click', saveWorkout);
  document.querySelector('#exerciseExit').addEventListener('click', exitWorkout);

  const sortableList = document.querySelector('.sortable-list');
  sortableList.addEventListener('dragover', initSortableList);
  sortableList.addEventListener('dragenter', e => e.preventDefault());
}

function updateExerciseDropdown() {
  const exerciseDropdown = document.querySelector('#exercise-dropdown');
  exerciseDropdown.innerHTML = '';
  exercises.forEach(exercise => {
    const option = document.createElement('option');
    option.value = exercise.id;
    option.textContent = exercise.name;
    exerciseDropdown.appendChild(option);
  });
  exerciseDropdown.addEventListener('change', updateExerciseDescription);
}

function updateExerciseDescription() {
  const exerciseDropdown = document.querySelector('#exercise-dropdown');
  const exerciseDescription = document.querySelector('#exercise-description');
  const selectedExerciseData = exercises.find(exercise => exercise.id === parseInt(exerciseDropdown.value));
  exerciseDescription.textContent = selectedExerciseData.description;
}

function addExercise() {
  const exerciseDropdown = document.querySelector('#exercise-dropdown');
  const selectedOption = exerciseDropdown.options[exerciseDropdown.selectedIndex];
  const exerciseTime = document.querySelector('#exercise-time');

  if (!exerciseTime.value || !exerciseDropdown.value) {
    console.log('Empty values');
    return;
  }

  const template = document.querySelector('#exerciseItemTemplate');
  const cloned = template.content.cloneNode(true);
  const span = cloned.querySelector('span');
  span.innerText = `${selectedOption.textContent} (${exerciseTime.value} min)`;
  span.dataset.id = exerciseDropdown.value;
  span.dataset.time = exerciseTime.value;

  const removeBtn = cloned.querySelector('#exercise-remove');
  removeBtn.addEventListener('click', removeExercise);
  const editBtn = cloned.querySelector('#exercise-edit');
  editBtn.addEventListener('click', editExercise);

  const sortableList = document.querySelector('.sortable-list');
  sortableList.append(cloned);

  const items = sortableList.querySelectorAll('.item');
  items.forEach(item => {
    item.addEventListener('dragstart', () => {
      setTimeout(() => item.classList.add('dragging'), 0);
    });
    item.addEventListener('dragend', () => item.classList.remove('dragging'));
  });
}

function removeExercise(e) {
  e.currentTarget.parentElement.remove();
}

function editExercise(e) {
  console.log(e.currentTarget.parentElement);
}

async function saveWorkout() {
  const workoutName = document.querySelector('#workout-name');
  if (!workoutName.value) {
    console.log('Empty values');
    return;
  }

  const listItems = document.querySelectorAll('.sortable-list .item span');
  if (listItems.length < 1) return;
  const exercises = [];
  listItems.forEach(listItem => {
    exercises.push({
      id: listItem.dataset.id,
      time: parseInt(listItem.dataset.time),
    });
  });

  const name = workoutName.value;
  const data = JSON.stringify(exercises);
  await fetch('/api/workouts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, data }),
  });

  await exitWorkout();
}

async function exitWorkout() {
  resetMenu();
  await router.navigateTo('workouts');
}

function resetMenu() {
  const sortableList = document.querySelector('.sortable-list');
  sortableList.innerHTML = '';
  document.querySelector('#exercise-dropdown').selectedIndex = 0;
  document.querySelector('#exercise-time').value = '';
  document.querySelector('#exercise-description').textContent = '';
  updateExerciseDescription();
}

async function fetchExercises() {
  const response = await fetch('/api/exercises');
  return await response.json();
}

const initSortableList = (e) => {
  e.preventDefault();
  const sortableList = document.querySelector('.sortable-list');
  const draggingItem = document.querySelector('.dragging');
  const siblings = [...sortableList.querySelectorAll('.item:not(.dragging)')];
  const nextSibling = siblings.find(sibling => {
    return e.clientY <= sibling.offsetTop + sibling.offsetHeight / 2;
  });
  sortableList.insertBefore(draggingItem, nextSibling);
};
