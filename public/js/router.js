const baseDomain = '/app/';

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
