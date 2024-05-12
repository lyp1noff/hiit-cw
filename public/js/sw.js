function interceptFetch(evt) {
  evt.respondWith(handleFetch(evt.request));
  evt.waitUntil(updateCache(evt.request));
}

async function handleFetch(request) {
  const c = await caches.open(CACHE);
  const cachedCopy = await c.match(request);
  return cachedCopy || Promise.reject(new Error('no-match'));
}

async function updateCache(request) {
  const c = await caches.open(CACHE);
  const response = await fetch(request);
  console.log('Updating cache ', request.url);
  return c.put(request, response);
}

const CACHE = 'hiit-cache';

const CACHEABLE = [
  '/index.html',
  '/manifest.json',
  '/js/alertBox.js',
  '/js/common.js',
  '/js/home.js',
  '/js/index.js',
  '/js/router.js',
  '/js/settings.js',
  '/js/sw.js',
  '/js/workout.js',
  '/js/workoutEdit.js',
  '/js/workouts.js',
  '/css/home.css',
  '/css/index.css',
  '/css/settings.css',
  '/css/workout.css',
  '/css/workoutEdit.css',
  '/css/workouts.css',
  '/img/192.png',
  '/img/512.png',
  '/img/favicon.ico',
  '/img/workouts/1.webp',
  '/img/workouts/2.webp',
  '/img/workouts/3.webp',
];

async function prepareCache() {
  const c = await caches.open(CACHE);
  await c.addAll(CACHEABLE);
  console.log('Cache prepared.');
}

self.addEventListener('install', prepareCache);
self.addEventListener('fetch', interceptFetch);
