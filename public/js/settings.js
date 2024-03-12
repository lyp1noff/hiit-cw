export function loadSettingsPage() {
    const contentSection = document.querySelector(`main > div[data-route="settings"]`);
    contentSection.classList.add('active');

    const getBtn = document.querySelector('#getBtn')
    getBtn.addEventListener('click', async () => {
        let data = await fetchUsers();
        console.log(data);
    })

    const addBtn = document.querySelector('#addBtn')
    addBtn.addEventListener('click', async () => {
        await addUser('Andrew', 'lyp1noff@gmail.com');
    })
}

async function fetchUsers() {
    const response = await fetch('/api/users');
    return await response.json();
}

async function addUser(name, email) {
    await fetch('/api/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email })
    });
}