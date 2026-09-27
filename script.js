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
