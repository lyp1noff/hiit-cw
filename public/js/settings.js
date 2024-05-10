import { fetchUser, getUserUUID } from './common.js';

export function loadSettingsPage() {
  const getBtn = document.querySelector('#restore-session');
  getBtn.addEventListener('click', restoreSession);
  const uuidLabel = document.querySelector('#uuid-label');
  uuidLabel.addEventListener('click', copyUUID);
  uuidLabel.innerText = getUserUUID();
}

async function restoreSession() {
  const inputField = document.querySelector('#uuid-input');
  const inputValue = inputField.value.trim();
  if (inputValue.length !== 36) {
    console.log('Length is not 36');
    return;
  }

  const res = await fetchUser(inputValue);
  if (res.error || !res.uuid) {
    console.log('Wrong UUID');
    return;
  }

  localStorage.setItem('user', res.uuid);
  updateLabel();
}

function updateLabel() {
  const uuidLabel = document.querySelector('#uuid-label');
  uuidLabel.innerText = getUserUUID();
}

function copyUUID() {
  const uuidLabel = document.querySelector('#uuid-label');
  const uuid = uuidLabel.innerText;
  navigator.clipboard.writeText(uuid);
}
