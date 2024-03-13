import { loadWorkoutsPage } from './workouts.js';
import { loadSettingsPage } from './settings.js';
import { loadWorkoutPage } from './workout.js';
import { loadWorkoutMenuPage } from './workoutMenu.js';
import { loadHomePage } from './home.js';

export async function showContent(path) {
  document.querySelectorAll('main > div').forEach(section => {
    section.classList.remove('active');
  });
  switch (path) {
    case '/':
      loadHomePage();
      break;
    case 'home':
      loadHomePage();
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
      loadHomePage();
      console.log('Unknown route:', path);
  }
}

export async function navigateTo(route) {
  history.pushState(null, null, route);
  await showContent(route);
}

async function handleUrlChange() {
  document.body.addEventListener('click', e => {
    if (e.target.matches('.nav__link')) {
      e.preventDefault();
      navigateTo(e.target.getAttribute('href').substring(1));
    }
  });

  const route = window.location.pathname.substring(1);
  await showContent(route || 'home');
}

document.addEventListener('DOMContentLoaded', handleUrlChange);
window.addEventListener('popstate', handleUrlChange);
