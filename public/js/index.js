function showContent(route) {
    document.querySelectorAll('main > div').forEach(section => {
        section.classList.remove('active');
    });

    const contentSection = document.querySelector(`main > div[data-route="${route}"]`);
    if (contentSection) {
        contentSection.classList.add('active');
    }
}

function navigateTo(route) {
    history.pushState(null, null, route);
    showContent(route);
}

function handleUrlChange() {
    document.body.addEventListener("click", e => {
        if (e.target.matches(".nav__link")) {
            e.preventDefault();
            navigateTo(e.target.getAttribute('href').substring(1));
        }
    });

    const route = window.location.pathname.substring(1);
    showContent(route || 'home');
}

document.addEventListener('DOMContentLoaded', handleUrlChange);
window.addEventListener('popstate', handleUrlChange);