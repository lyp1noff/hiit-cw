import { fetchWorkout } from './common.js';

const baseDomain = '/app/';
const routes = [
  'home',
  'workout',
  'workouts',
  'settings',
];

export function showContent(route) {
  document.querySelectorAll('.screen').forEach(section => {
    section.classList.remove('active');
  });

  const contentSection = document.querySelector(`.screen[data-route="${route}"]`);
  if (contentSection) {
    contentSection.classList.add('active');
    const event = new CustomEvent('contentChanged', { detail: { route: contentSection.dataset.route } });
    document.dispatchEvent(event);
  }
}

export function routeTo(route) {
  history.pushState(route, null, baseDomain + route);
  showContent(route);
}

export async function handleUrlChange() {
  const route = window.location.pathname.substring(5);

  if (route.includes('export')) {
    if (await checkExportURL(route)) return;
  }

  if (routes.includes(route)) {
    showContent(route);
  } else {
    routeTo('home');
  }
}

async function checkExportURL(route) {
  const uuid = route.substring(7);
  if (uuid.length !== 36) return false;

  const res = await fetchWorkout(uuid);
  if (res.error || !res.uuid) return false;

  localStorage.setItem('workoutExport', JSON.stringify({ uuid: res.uuid, name: res.name, data: res.data }));
  showContent('workout-edit');
  return true;
}
