const accessForm = document.querySelector('#projectAccessForm');
const passwordInput = document.querySelector('#projectPassword');
const accessError = document.querySelector('#projectAccessError');

function unlockProjects() {
  sessionStorage.setItem('projectsAccess', 'granted');
  document.documentElement.classList.replace('project-locked', 'project-unlocked');
  document.querySelector('.project-protected a, .project-protected button')?.focus();
}

accessForm.addEventListener('submit', event => {
  event.preventDefault();

  if (passwordInput.value === 'sysu') {
    unlockProjects();
    return;
  }

  accessError.textContent = '密码错误，请重新输入。';
  passwordInput.value = '';
  passwordInput.focus();
});
