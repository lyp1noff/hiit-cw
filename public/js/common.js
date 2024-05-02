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

export async function fetchExercise(id) {
  const response = await fetch(`/api/exercise/${id}`);
  return await response.json();
}

export async function fetchWorkouts() {
  const response = await fetch('/api/workouts');
  return await response.json();
}

export async function postWorkouts(name, data) {
  await fetch('/api/workouts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, data }),
  });
}

export async function postUser(name, email) {
  await fetch('/api/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, email }),
  });
}
