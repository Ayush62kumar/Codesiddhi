// Tab toggle (Chat / Work)
const tabButtons = document.querySelectorAll('.toggle button');
tabButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    tabButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});

// Send button sends the typed prompt
const input = document.getElementById('prompt-input');
const sendBtn = document.getElementById('send-btn');

function sendPrompt() {
  const value = input.value.trim();
  if (!value) return;
  console.log('Prompt submitted:', value);
  input.value = '';
}

sendBtn.addEventListener('click', sendPrompt);
input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') sendPrompt();
});

// Plus button popup menu
const attachBtn = document.getElementById('attach-pdf-btn');
const plusPopup = document.getElementById('plus-popup-menu');
const uploadPdfOption = document.getElementById('upload-pdf-option');
const pdfFileInput = document.getElementById('pdf-upload-input');

if (attachBtn && plusPopup) {
  attachBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isHidden = plusPopup.classList.toggle('hidden');
    attachBtn.setAttribute('aria-expanded', String(!isHidden));
  });

  uploadPdfOption.addEventListener('click', () => {
    plusPopup.classList.add('hidden');
    attachBtn.setAttribute('aria-expanded', 'false');
    pdfFileInput.click();
  });

  document.addEventListener('click', (e) => {
    if (!plusPopup.classList.contains('hidden') &&
        !attachBtn.contains(e.target) &&
        !plusPopup.contains(e.target)) {
      plusPopup.classList.add('hidden');
      attachBtn.setAttribute('aria-expanded', 'false');
    }
  });
}

const listBtn = document.getElementById('list-btn');
const listMenu = document.getElementById('list-menu');
const progressFill = listMenu ? listMenu.querySelector('.progress-bar-fill') : null;

function toggleMenu(open) {
  const shouldOpen = open !== undefined ? open : !listMenu.classList.contains('open');
  if (shouldOpen) {
    listMenu.classList.add('open');
    listBtn.setAttribute('aria-expanded', 'true');
    // Animate progress bar fill smoothly
    if (progressFill) {
      progressFill.style.width = '0%';
      setTimeout(() => {
        progressFill.style.width = '78%';
      }, 50);
    }
  } else {
    listMenu.classList.remove('open');
    listBtn.setAttribute('aria-expanded', 'false');
  }
}

listBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  toggleMenu();
});

document.addEventListener('click', (e) => {
  if (!listMenu.contains(e.target) && !listBtn.contains(e.target)) {
    toggleMenu(false);
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (listMenu.classList.contains('open')) toggleMenu(false);
    if (authModal && authModal.classList.contains('open')) closeAuthModal();
    if (profilePopup && !profilePopup.classList.contains('hidden')) closeProfilePopup();
  }
});

// Auth Modal Logic (Login & Signup)
const authModal = document.getElementById('auth-modal');
const authCloseBtn = document.getElementById('auth-modal-close');
const loginBtn = document.getElementById('login-btn');
const signupBtn = document.getElementById('signup-btn');
const tabLogin = document.getElementById('tab-login');
const tabSignup = document.getElementById('tab-signup');
const formLogin = document.getElementById('form-login');
const formSignup = document.getElementById('form-signup');

function openAuthModal(mode) {
  if (!authModal) return;
  toggleMenu(false); // Close dropdown menu if open
  authModal.classList.add('open');
  authModal.setAttribute('aria-hidden', 'false');
  switchAuthTab(mode || 'login');
}

function closeAuthModal() {
  if (!authModal) return;
  authModal.classList.remove('open');
  authModal.setAttribute('aria-hidden', 'true');
}

function switchAuthTab(mode) {
  if (mode === 'signup') {
    tabSignup.classList.add('active');
    tabLogin.classList.remove('active');
    formSignup.classList.remove('hidden');
    formLogin.classList.add('hidden');
  } else {
    tabLogin.classList.add('active');
    tabSignup.classList.remove('active');
    formLogin.classList.remove('hidden');
    formSignup.classList.add('hidden');
  }
}

if (loginBtn) loginBtn.addEventListener('click', () => openAuthModal('login'));
if (signupBtn) signupBtn.addEventListener('click', () => openAuthModal('signup'));

if (tabLogin) tabLogin.addEventListener('click', () => switchAuthTab('login'));
if (tabSignup) tabSignup.addEventListener('click', () => switchAuthTab('signup'));

if (authCloseBtn) authCloseBtn.addEventListener('click', closeAuthModal);

if (authModal) {
  authModal.addEventListener('click', (e) => {
    if (e.target === authModal) closeAuthModal();
  });
}

// Menu items: Pinned & History
const menuHistoryBtn = document.getElementById('menu-history-btn');
const menuPinnedBtn = document.getElementById('menu-pinned-btn');

if (menuHistoryBtn) {
  menuHistoryBtn.addEventListener('click', () => {
    toggleMenu(false);
    const historyTab = document.querySelector('.toggle button[data-tab="History"]');
    if (historyTab) historyTab.click();
  });
}

if (menuPinnedBtn) {
  menuPinnedBtn.addEventListener('click', () => {
    toggleMenu(false);
    alert('Pinned chats opened.');
  });
}

// Authentication State Management
const USER_KEY = 'gyaan_auth_user';
const logoutBtn = document.getElementById('menu-logout-btn');

function getInitials(name, email) {
  const source = name || email || '';
  const parts = source.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return source.slice(0, 2).toUpperCase();
}

function updateProfilePopup(isLoggedIn, user) {
  const avatarEl = document.getElementById('avatar-el');
  const popupAvatarEl = document.getElementById('popup-avatar-initials');
  const popupNameEl = document.getElementById('popup-name');
  const popupEmailEl = document.getElementById('popup-email');
  if (isLoggedIn && user) {
    const initials = getInitials(user.name, user.email);
    if (avatarEl) avatarEl.textContent = initials;
    if (popupAvatarEl) popupAvatarEl.textContent = initials;
    if (popupNameEl) popupNameEl.textContent = user.name || user.email || 'Learner';
    if (popupEmailEl) popupEmailEl.textContent = user.email || '';
  } else {
    if (avatarEl) avatarEl.textContent = '';
    if (popupAvatarEl) popupAvatarEl.textContent = '';
    if (popupNameEl) popupNameEl.textContent = '';
    if (popupEmailEl) popupEmailEl.textContent = '';
  }
}

function setAuthState(isLoggedIn, user = null) {
  if (isLoggedIn) {
    document.body.setAttribute('data-auth', 'logged-in');
    localStorage.setItem('gyaan_logged_in', 'true');
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      const userNameEl = document.getElementById('user-name-display');
      if (userNameEl) userNameEl.textContent = user.name || user.email || 'Learner';
    }
  } else {
    document.body.setAttribute('data-auth', 'logged-out');
    localStorage.removeItem('gyaan_logged_in');
    localStorage.removeItem(USER_KEY);
    const userNameEl = document.getElementById('user-name-display');
    if (userNameEl) userNameEl.textContent = 'GyaanIQ AI';
  }
  updateProfilePopup(isLoggedIn, user);
}

// Profile popup toggle
const userChip = document.getElementById('user-chip');
const profilePopup = document.getElementById('profile-popup');

function openProfilePopup() {
  if (!profilePopup) return;
  profilePopup.classList.remove('hidden');
  userChip.setAttribute('aria-expanded', 'true');
}

function closeProfilePopup() {
  if (!profilePopup) return;
  profilePopup.classList.add('hidden');
  userChip.setAttribute('aria-expanded', 'false');
}

if (userChip && profilePopup) {
  userChip.addEventListener('click', (e) => {
    e.stopPropagation();
    profilePopup.classList.contains('hidden') ? openProfilePopup() : closeProfilePopup();
  });

  document.addEventListener('click', (e) => {
    if (!profilePopup.classList.contains('hidden') &&
        !userChip.contains(e.target) &&
        !profilePopup.contains(e.target)) {
      closeProfilePopup();
    }
  });
}

// In-popup logout
const popupLogoutBtn = document.getElementById('popup-logout-btn');
if (popupLogoutBtn) {
  popupLogoutBtn.addEventListener('click', () => {
    setAuthState(false);
    closeProfilePopup();
  });
}

// In-popup login / signup
const popupLoginBtn = document.getElementById('popup-login-btn');
const popupSignupBtn = document.getElementById('popup-signup-btn');
if (popupLoginBtn) {
  popupLoginBtn.addEventListener('click', () => {
    closeProfilePopup();
    openAuthModal('login');
  });
}
if (popupSignupBtn) {
  popupSignupBtn.addEventListener('click', () => {
    closeProfilePopup();
    openAuthModal('signup');
  });
}

// Initial auth state on page load
const savedLoggedIn = localStorage.getItem('gyaan_logged_in') === 'true';
let savedUser = null;
try {
  savedUser = localStorage.getItem(USER_KEY) ? JSON.parse(localStorage.getItem(USER_KEY)) : null;
} catch (err) {
  savedUser = null;
}
setAuthState(savedLoggedIn, savedUser);

// Logout click handler
if (logoutBtn) {
  logoutBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    setAuthState(false);
    toggleMenu(false);
    alert('Logged out successfully.');
  });
}

// Handle Form Submissions
if (formLogin) {
  formLogin.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const displayName = email.split('@')[0];
    setAuthState(true, { email, name: displayName });
    closeAuthModal();
    alert(`Logged in successfully as ${email}`);
  });
}

if (formSignup) {
  formSignup.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('signup-name').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const displayName = name || email.split('@')[0];
    setAuthState(true, { email, name: displayName });
    closeAuthModal();
    alert(`Account created! Welcome, ${displayName}`);
  });
}