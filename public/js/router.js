export function showContent(path) {
  document.querySelectorAll('.screen').forEach(section => {
    section.classList.remove('active');
  });

  const contentSection = document.querySelector(`.screen[data-route="${path}"]`);
  if (contentSection) {
    contentSection.classList.add('active');
    const event = new CustomEvent('contentChanged', { detail: { route: contentSection.dataset.route } });
    document.dispatchEvent(event);
  }
}

export function routeTo(route) {
  history.pushState(route, null, route);
  showContent(route);
}
