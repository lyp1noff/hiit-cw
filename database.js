import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import { v4 as uuidv4 } from 'uuid';

async function init() {
  const db = await open({
    filename: './hiit.sqlite',
    driver: sqlite3.Database,
    verbose: true,
  });
  await db.migrate({ migrationsPath: './migrations-sqlite' });
  return db;
}

const dbConn = init();

// USER RELATED
export async function addUserWorkout(userUUID, name, data) {
  const workoutUUID = uuidv4();
  await addWorkout(workoutUUID, name, data);
  await addUserToWorkout(userUUID, workoutUUID);
}

export async function deleteUserWorkout(workoutUUID) {
  await deleteWorkout(workoutUUID);
  await deleteUserToWorkout(workoutUUID);
}


async function addUserToWorkout(userUUID, workoutUUID) {
  const db = await dbConn;
  return await db.run('INSERT INTO user_to_workout (user_uuid, workout_uuid) VALUES (?, ?)', [userUUID, workoutUUID]);
}
async function deleteUserToWorkout(workoutUUID) {
  const db = await dbConn;
  return await db.run('DELETE FROM user_to_workout WHERE workout_uuid = ?', [workoutUUID]);
}

export async function getExercise(id) {
  const db = await dbConn;
  return await db.get('SELECT * FROM exercise WHERE id = ?', [id]);
}

export async function getExercises() {
  const db = await dbConn;
  return await db.all('SELECT * FROM exercise');
}

export async function addWorkout(uuid, name, data) {
  const db = await dbConn;
  return await db.run('INSERT INTO workout (uuid, name, data) VALUES (?, ?, ?)', [uuid, name, data]);
}

export async function editWorkout(uuid, name, data) {
  const db = await dbConn;
  return await db.run('UPDATE workout SET name = ?, data = ? WHERE uuid = ?', [name, data, uuid]);
}

export async function deleteWorkout(uuid) {
  const db = await dbConn;
  return await db.run('DELETE FROM workout WHERE uuid = ?', [uuid]);
}

export async function getWorkout(uuid) {
  const db = await dbConn;
  return await db.get('SELECT * FROM workout WHERE uuid = ?', [uuid]);
}

export async function getGlobalWorkouts() {
  const db = await dbConn;
  return await db.all('SELECT * FROM workout WHERE description IS NOT NULL AND image_url IS NOT NULL');
}

export async function getUserWorkouts(uuid) {
  const db = await dbConn;
  return await db.all('SELECT w.* FROM workout w JOIN user_to_workout uw ON w.uuid = uw.workout_uuid WHERE uw.user_uuid = ?', [uuid]);
}

export async function getUser(uuid) {
  const db = await dbConn;
  return await db.get('SELECT * FROM user WHERE uuid = ?', [uuid]);
}

export async function addUser(uuid) {
  const db = await dbConn;
  return await db.run('INSERT INTO user (uuid) VALUES (?)', [uuid]);
}
