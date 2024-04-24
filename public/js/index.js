import { routeTo } from './router.js';
import { loadWorkoutsPage } from './workouts.js';
import { loadSettingsPage } from './settings.js';
import { loadWorkoutPage } from './workout.js';
import { loadWorkoutMenuPage } from './workoutMenu.js';
import { loadWorkoutEditPage } from './workoutEdit.js';

async function loadPages() {
  loadSettingsPage();
  await loadWorkoutPage();
  await loadWorkoutsPage();
  await loadWorkoutMenuPage();
  await loadWorkoutEditPage();

  document.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', (e) => {
      routeTo(e.target.dataset.route);
    });
  });

  handleUrlChange();
}

function handleUrlChange() {
  const route = window.location.pathname.substring(5);
  routeTo(route || 'home');
}

document.addEventListener('DOMContentLoaded', loadPages);
window.addEventListener('popstate', handleUrlChange);
