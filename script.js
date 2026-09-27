// --- Theme Management ---
const themeToggleBtn = document.getElementById('themeToggle');
const htmlRoot = document.documentElement;

// Check stored theme or system preference
const storedTheme = localStorage.getItem('theme');
const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

if (storedTheme) {
  htmlRoot.setAttribute('data-theme', storedTheme);
} else {
  htmlRoot.setAttribute('data-theme', systemPrefersDark ? 'dark' : 'light');
}

themeToggleBtn.addEventListener('click', () => {
  const currentTheme = htmlRoot.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  htmlRoot.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  showToast(`Switched to ${newTheme} mode`);
});

// --- Mobile Navigation Menu ---
const mobileToggle = document.getElementById('mobileToggle');
const navMenu = document.getElementById('navMenu');

mobileToggle.addEventListener('click', () => {
  navMenu.classList.toggle('show');
});

// Close mobile menu on clicking any navigation link
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    if (navMenu.classList.contains('show')) {
      navMenu.classList.remove('show');
    }
  });
});

// --- Toast Notification Helper ---
const toastEl = document.getElementById('toast');
let toastTimeout;

function showToast(message) {
  if (!toastEl) return;
  toastEl.textContent = message;
  toastEl.style.display = 'flex';

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toastEl.style.display = 'none';
  }, 3000);
}

// --- Copy to Clipboard Buttons ---
document.querySelectorAll('.copy-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const textToCopy = btn.getAttribute('data-copy');
    if (!textToCopy) return;

    e.preventDefault();
    navigator.clipboard.writeText(textToCopy).then(() => {
      showToast(`Copied to clipboard: ${textToCopy}`);
    }).catch(() => {
      // Fallback
      const tempInput = document.createElement('input');
      tempInput.value = textToCopy;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand('copy');
      document.body.removeChild(tempInput);
      showToast(`Copied: ${textToCopy}`);
    });
  });
});

// --- Contact Form Submission (Mailto Handler) ---
function handleFormSubmit(event) {
  event.preventDefault();
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('senderEmail').value.trim();
  const subject = document.getElementById('subject').value.trim();
  const message = document.getElementById('message').value.trim();

  const formattedSubject = encodeURIComponent(subject || `Connecting with Akshay Balachandran`);
  const formattedBody = encodeURIComponent(
    `Hi Akshay,\n\n${message}\n\nBest regards,\n${name}\n${email}`
  );

  const mailtoUrl = `mailto:balachandranakshay09@gmail.com?subject=${formattedSubject}&body=${formattedBody}`;
  window.location.href = mailtoUrl;

  showToast('Opening your email client...');
}

// --- Active Nav Link on Scroll ---
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  const scrollY = window.pageYOffset + 120;

  sections.forEach(current => {
    const sectionHeight = current.offsetHeight;
    const sectionTop = current.offsetTop;
    const sectionId = current.getAttribute('id');
    const navLink = document.querySelector(`.nav-menu a[href*="${sectionId}"]`);

    if (navLink) {
      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLink.classList.add('active');
      } else {
        navLink.classList.remove('active');
      }
    }
  });
});

// --- Hero Status Pill Click Action ---
const heroStatusPill = document.getElementById('heroStatusPill');
if (heroStatusPill) {
  heroStatusPill.addEventListener('click', (e) => {
    e.preventDefault();
    const expSection = document.getElementById('experience');
    if (expSection) {
      expSection.scrollIntoView({ behavior: 'smooth' });
      
      // Pulse highlight the current Microsoft role
      const currentRole = document.querySelector('.timeline-item.current .timeline-content');
      if (currentRole) {
        currentRole.classList.remove('role-highlight-pulse');
        // Trigger reflow
        void currentRole.offsetWidth;
        currentRole.classList.add('role-highlight-pulse');
      }
      showToast('Navigated to: QA Specialist & Developer (Microsoft Project)');
    }
  });
}

// --- Terminal Window Actions (Close & Minimize) ---
const terminalCard = document.getElementById('terminalCard');
const terminalBody = document.getElementById('terminalBody');
const termCloseBtn = document.getElementById('termCloseBtn');
const termMinBtn = document.getElementById('termMinBtn');
const termMaxBtn = document.getElementById('termMaxBtn');
const reopenTerminalBtn = document.getElementById('reopenTerminalBtn');

// 🔴 Close Window Action
if (termCloseBtn && terminalCard && reopenTerminalBtn) {
  termCloseBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    terminalCard.style.opacity = '0';
    terminalCard.style.transform = 'scale(0.95)';
    setTimeout(() => {
      terminalCard.style.display = 'none';
      reopenTerminalBtn.style.display = 'inline-flex';
    }, 250);
    showToast('Terminal closed. Click "Reopen Terminal" to restore.');
  });
}

// Reopen Terminal Button Action
if (reopenTerminalBtn && terminalCard) {
  reopenTerminalBtn.addEventListener('click', () => {
    reopenTerminalBtn.style.display = 'none';
    terminalCard.style.display = 'block';
    if (terminalBody) terminalBody.classList.remove('minimized');
    setTimeout(() => {
      terminalCard.style.opacity = '1';
      terminalCard.style.transform = 'scale(1)';
    }, 20);
    showToast('Terminal window reopened!');
  });
}

// 🟡 Minimize / Expand Body Action
if (termMinBtn && terminalBody) {
  termMinBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    terminalBody.classList.toggle('minimized');
    const isMinimized = terminalBody.classList.contains('minimized');
    showToast(isMinimized ? 'Terminal window minimized' : 'Terminal window expanded');
  });
}

// 🟢 Restore / Focus Action
if (termMaxBtn && terminalBody) {
  termMaxBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (terminalBody.classList.contains('minimized')) {
      terminalBody.classList.remove('minimized');
      showToast('Terminal window restored');
    } else {
      showToast('Terminal window is active');
    }
  });
}


