import { routeTo } from './router.js';
import {
  convertToSeconds,
  convertToTimeComponents,
  editWorkout,
  fetchExercise,
  fetchExercises,
  fetchWorkout, getUserUUID,
  postWorkout, showAlert,
} from './common.js';

let exercises = {};

export async function loadWorkoutEditPage() {
  exercises = await fetchExercises();

  updateExerciseDropdown();
  updateExerciseDescription();

  document.querySelector('#add-exercise').addEventListener('click', addExerciseClick);
  document.querySelector('#save-exercise').addEventListener('click', saveWorkout);
  document.querySelector('#exit-exercise').addEventListener('click', exitWorkout);

  const sortableList = document.querySelector('.sortable-list');
  sortableList.addEventListener('dragover', initSortableList);
  sortableList.addEventListener('dragenter', e => e.preventDefault());
}

document.addEventListener('contentChanged', async (e) => {
  const activeSection = e.detail.route === 'workout-edit';
  if (activeSection) {
    resetMenu();
    await activeWorkoutEdit();
    await activeWorkoutExport();
  } else {
    localStorage.removeItem('workoutEdit');
    localStorage.removeItem('workoutExport');
  }
});

async function activeWorkoutExport() {
  const activeWorkoutExportData = JSON.parse(localStorage.getItem('workoutExport'));
  if (!activeWorkoutExportData) return;
  for (const exercise of JSON.parse(activeWorkoutExportData.data)) {
    const fetchedExercise = await fetchExercise(exercise.id);
    const { minutes, seconds } = convertToTimeComponents(exercise.time);
    addExercise(fetchedExercise.name, exercise.id, minutes, seconds);
  }
  document.querySelector('#editor-workout-name-input').value = activeWorkoutExportData.name;
}

async function activeWorkoutEdit() {
  const activeWorkoutEditData = JSON.parse(localStorage.getItem('workoutEdit'));
  if (!activeWorkoutEditData) return;

  const workout = await fetchWorkout(activeWorkoutEditData.workoutUUID);
  const workoutData = JSON.parse(workout.data);
  for (const exercise of workoutData) {
    const fetchedExercise = await fetchExercise(exercise.id);
    const { minutes, seconds } = convertToTimeComponents(exercise.time);
    addExercise(fetchedExercise.name, exercise.id, minutes, seconds);
  }
  document.querySelector('#editor-workout-name-input').value = workout.name;
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
  const exerciseDescription = document.querySelector('#editor-exercise-description');
  const selectedExerciseData = exercises.find(exercise => exercise.id === parseInt(exerciseDropdown.value));
  exerciseDescription.textContent = selectedExerciseData.description;
}

function addExerciseClick() {
  const exerciseDropdown = document.querySelector('#exercise-dropdown');
  const selectedOption = exerciseDropdown.options[exerciseDropdown.selectedIndex];

  const exerciseName = selectedOption.textContent;
  const exerciseId = exerciseDropdown.value;

  const exerciseMinutes = document.querySelector('#exercise-minutes');
  const exerciseSeconds = document.querySelector('#exercise-seconds');
  const minutes = exerciseMinutes.value.trim() === '' ? 0 : parseInt(exerciseMinutes.value);
  const seconds = exerciseSeconds.value.trim() === '' ? 0 : parseInt(exerciseSeconds.value);

  if (!(minutes || seconds) || !exerciseDropdown.value) {
    showAlert('Error', 'Enter time for exercise');
    return;
  }

  addExercise(exerciseName, exerciseId, minutes, seconds);
}

function addExercise(exerciseName, exerciseId, minutes, seconds) {
  const template = document.querySelector('#exercise-item-template');
  const cloned = template.content.cloneNode(true);
  const span = cloned.querySelector('span');
  span.innerText = `${exerciseName} (${minutes} min, ${seconds} sec)`;

  span.dataset.id = exerciseId;
  span.dataset.time = convertToSeconds(minutes, seconds);

  const removeBtn = cloned.querySelector('#exercise-remove');
  removeBtn.addEventListener('click', removeExercise);

  const sortableList = document.querySelector('.sortable-list');
  if (sortableList.style.display === 'none') sortableList.style.display = 'block';
  sortableList.append(cloned);

  const obj = sortableList.lastElementChild;
  obj.addEventListener('dragstart', () => {
    setTimeout(() => obj.classList.add('dragging'), 0);
  });
  obj.addEventListener('dragend', () => obj.classList.remove('dragging'));
}

function removeExercise(e) {
  e.currentTarget.parentElement.remove();
  const sortableList = document.querySelector('.sortable-list');
  if (sortableList.childElementCount === 0) sortableList.style.display = 'none';
}

async function saveWorkout() {
  const workoutName = document.querySelector('#editor-workout-name-input');
  if (!workoutName.value) {
    showAlert('Error', 'Workout name is required');
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

  const activeWorkout = JSON.parse(localStorage.getItem('workoutEdit'));
  if (activeWorkout) {
    await editWorkout(activeWorkout.workoutUUID, name, data);
    exitWorkout();
    return;
  }

  await postWorkout(getUserUUID(), name, data);
  exitWorkout();
}

function exitWorkout() {
  localStorage.removeItem('workoutEdit');
  localStorage.removeItem('workoutExport');
  resetMenu();
  routeTo('workouts');
}

function resetMenu() {
  const sortableList = document.querySelector('.sortable-list');
  sortableList.innerHTML = '';
  sortableList.style.display = 'none';
  document.querySelector('#exercise-dropdown').selectedIndex = 0;
  document.querySelector('#editor-workout-name-input').value = '';
  document.querySelector('#exercise-minutes').value = '';
  document.querySelector('#exercise-seconds').value = '';
  document.querySelector('#editor-exercise-description').textContent = '';
  updateExerciseDescription();
}

const initSortableList = (e) => {
  e.preventDefault();
  const sortableList = document.querySelector('.sortable-list');
  const draggingItem = document.querySelector('.dragging');
  const siblings = [...sortableList.querySelectorAll('.item:not(.dragging)')];
  const mouseYWithScroll = e.clientY + window.scrollY;
  const nextSibling = siblings.find(sibling => {
    return mouseYWithScroll <= sibling.offsetTop + sibling.offsetHeight / 2;
  });
  sortableList.insertBefore(draggingItem, nextSibling);
};
