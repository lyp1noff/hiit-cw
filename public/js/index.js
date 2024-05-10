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

function showAlert(message) {
  const alertBox = document.querySelector('.alertBox');
  const alertBoxHeader = document.querySelector('.alertbox-header');
  const alertBoxMessage = document.querySelector('.alertbox-message');
  alertBoxHeader.textContent = message;
  alertBoxMessage.textContent = message;
  alertBox.style.display = 'block';

  // Auto-hide after 5 seconds
  setTimeout(function () {
    alertBox.style.display = 'none';
  }, 5000);
}

// Example usage:
showAlert('This is your alert message.');


document.addEventListener('DOMContentLoaded', init);
window.addEventListener('popstate', handleUrlChange);
