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

export async function getExercise(id) {
  const db = await dbConn;
  return await db.get('SELECT * FROM exercises WHERE id = ?', [id]);
}

export async function getExercises() {
  const db = await dbConn;
  return await db.all('SELECT * FROM exercises');
}

export async function addWorkout(name, data) {
  const uuid = uuidv4();
  const db = await dbConn;
  return await db.run('INSERT INTO workouts (uuid, name, data) VALUES (?, ?, ?)', [uuid, name, data]);
}

export async function deleteWorkout(uuid) {
  const db = await dbConn;
  return await db.run('DELETE FROM workouts WHERE uuid = ?', [uuid]);
}

export async function getWorkout(uuid) {
  const db = await dbConn;
  return await db.get('SELECT * FROM workouts WHERE uuid = ?', [uuid]);
}

export async function getWorkouts() {
  const db = await dbConn;
  return await db.all('SELECT * FROM workouts');
}

export async function getUsers() {
  const db = await dbConn;
  return await db.all('SELECT * FROM users');
}

export async function addUser(name, email) {
  const db = await dbConn;
  return await db.run('INSERT INTO users (name, email) VALUES (?, ?)', [name, email]);
}
