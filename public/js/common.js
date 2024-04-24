export async function fetchWorkout(uuid) {
  const response = await fetch(`/api/workout/${uuid}`);
  return await response.json();
}

export async function fetchExercise(id) {
  const response = await fetch(`/api/exercise/${id}`);
  return await response.json();
}

export async function fetchWorkouts() {
  const response = await fetch('/api/workouts');
  return await response.json();
}
