import { loadWorkoutsPage } from './workouts.js';
import { loadSettingsPage } from './settings.js';
import { loadWorkoutPage } from './workout.js';
import { loadWorkoutMenuPage } from './workoutMenu.js';

export async function showContent(path) {
  loadPage(path);
  switch (path) {
    case 'home':
      break;
    case 'workout':
      await loadWorkoutPage();
      break;
    case 'workoutMenu':
      await loadWorkoutMenuPage();
      break;
    case 'workouts':
      await loadWorkoutsPage();
      break;
    case 'settings':
      loadSettingsPage();
      break;
    default:
      console.log('Unknown route:', path);
  }
}

function loadPage(path) {
  document.querySelectorAll('main > div').forEach(section => {
    section.classList.remove('active');
  });

  // Handle load page js

  const contentSection = document.querySelector(`main > div[data-route="${path}"]`);
  contentSection.classList.add('active');
}

export async function navigateTo(route) {
  history.pushState(null, null, route);
  await showContent(route);
}

async function handleUrlChange() {
  document.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', (e) => {
      navigateTo(e.target.dataset.route);
    });
  });

  const route = window.location.pathname.substring(1);
  await showContent(route || 'home');
}

document.addEventListener('DOMContentLoaded', handleUrlChange);
window.addEventListener('popstate', handleUrlChange);
