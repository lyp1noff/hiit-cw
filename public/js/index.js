import { handleUrlChange, routeTo } from './router.js';
import { loadWorkoutsPage } from './workouts.js';
import { loadSettingsPage } from './settings.js';
import { loadWorkoutPage } from './workout.js';
import { loadWorkoutEditPage } from './workoutEdit.js';
import { loadHomePage } from './home.js';
import { generateUUID, postUser } from './common.js';

async function init() {
  await userAuth();
  await loadPages();
}

async function userAuth() {
  const user = localStorage.getItem('user');
  if (!user) {
    const uuid = await generateUUID();
    await postUser(uuid);
    localStorage.setItem('user', uuid);
  }
}

async function loadPages() {
  loadSettingsPage();
  await loadWorkoutPage();
  await loadWorkoutsPage();
  await loadWorkoutEditPage();
  await loadHomePage();

  document.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', (e) => {
      routeTo(e.target.dataset.route);
    });
  });

  await handleUrlChange();
}

document.addEventListener('DOMContentLoaded', init);
window.addEventListener('popstate', handleUrlChange);
