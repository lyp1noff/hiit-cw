export function getUserUUID() {
  return localStorage.getItem('user');
}

export function convertToTimeComponents(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return { minutes, seconds };
}

export function convertToSeconds(minutes, seconds) {
  return minutes * 60 + seconds;
}

export function showAlert(header, message) {
  const alertBox = document.querySelector('.alertbox');
  const alertBoxHeader = document.querySelector('.alertbox-header');
  const alertBoxMessage = document.querySelector('.alertbox-message');
  alertBoxHeader.textContent = header;
  alertBoxMessage.textContent = message;
  alertBox.style.display = 'block';

  setTimeout(() => { alertBox.style.display = 'none'; }, 3000);
}

export async function generateUUID() {
  const response = await fetch('/api/uuid');
  const data = await response.json();
  return data.uuid;
}

export async function fetchWorkout(uuid) {
  const response = await fetch(`/api/workout/${uuid}`);
  return await response.json();
}

export async function deleteWorkout(uuid) {
  await fetch(`/api/workout/${uuid}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function editWorkout(uuid, newName, newData) {
  await fetch(`/api/workout/${uuid}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: newName,
      data: newData,
    }),
  });
}

export async function fetchExercise(id) {
  const response = await fetch(`/api/exercise/${id}`);
  return await response.json();
}

export async function fetchExercises() {
  const response = await fetch('/api/exercises');
  return await response.json();
}

export async function fetchWorkouts(uuid) {
  const response = await fetch(`/api/workouts/${uuid}`);
  return await response.json();
}

export async function fetchGlobalWorkouts() {
  const response = await fetch('/api/globalWorkouts/');
  return await response.json();
}

export async function postWorkout(userUUID, name, data) {
  await fetch('/api/workout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userUUID, name, data }),
  });
}

export async function postUser(uuid) {
  await fetch('/api/user', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ uuid }),
  });
}

export async function fetchUser(uuid) {
  const response = await fetch(`/api/user/${uuid}`);
  return await response.json();
}
