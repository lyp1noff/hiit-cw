import * as router from './router.js';
import { loadWorkoutsPage } from './workouts.js';
import { loadSettingsPage } from './settings.js';
import { loadWorkoutPage } from './workout.js';
import { loadWorkoutEditPage } from './workoutEdit.js';

async function loadPages() {
  loadWorkoutPage();
  loadSettingsPage();
  await loadWorkoutsPage();
  await loadWorkoutEditPage();

  document.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', (e) => {
      router.routeTo(e.target.dataset.route);
    });
  });

  handleUrlChange();
}

function handleUrlChange() {
  const route = window.location.pathname.substring(1);
  router.showContent(route || 'home');
}

document.addEventListener('DOMContentLoaded', loadPages);
window.addEventListener('popstate', handleUrlChange);
