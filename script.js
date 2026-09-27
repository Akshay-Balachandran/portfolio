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

// --- Terminal Window Interactive Controls ---
const terminalCard = document.getElementById('terminalCard');
const terminalBody = document.getElementById('terminalBody');
const termCloseBtn = document.getElementById('termCloseBtn');
const termMinBtn = document.getElementById('termMinBtn');
const termMaxBtn = document.getElementById('termMaxBtn');
const termClosedMsg = document.getElementById('termClosedMsg');
const termExtraOutput = document.getElementById('termExtraOutput');

// Red Dot: Close / Minimize entire terminal
if (termCloseBtn && terminalCard) {
  termCloseBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    terminalCard.classList.add('closed');
    showToast('Terminal session closed. Click banner to reopen.');
  });
}

// Click closed banner to restart/reopen
if (termClosedMsg && terminalCard) {
  termClosedMsg.addEventListener('click', () => {
    terminalCard.classList.remove('closed');
    if (terminalBody) terminalBody.classList.remove('minimized');
    showToast('Terminal session restored!');
  });
}

// Yellow Dot: Minimize / Expand terminal body
if (termMinBtn && terminalBody) {
  termMinBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    terminalBody.classList.toggle('minimized');
    const isMin = terminalBody.classList.contains('minimized');
    showToast(isMin ? 'Terminal window minimized' : 'Terminal window expanded');
  });
}

// Green Dot: Run Live Diagnostic Suite
let diagnosticRunning = false;
if (termMaxBtn && termExtraOutput) {
  termMaxBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    
    // Ensure body is visible
    if (terminalCard) terminalCard.classList.remove('closed');
    if (terminalBody) terminalBody.classList.remove('minimized');

    if (diagnosticRunning) return;
    diagnosticRunning = true;

    showToast('Running live Copilot & MCP agent test suite...');
    termExtraOutput.innerHTML = `
      <div class="code-line"><span class="cmd-prompt">$</span> <span class="cmd-run">./run_mcp_agent_test --target=copilot-agent-365</span></div>
      <div class="diagnostic-block">
        <div>⏳ Initializing handshake with MCP Server... <strong>[OK]</strong></div>
        <div>🔍 Validating tool execution pipeline across Teams & M365 Hubs...</div>
        <div>⚡ Context Grounding Accuracy: <strong>99.4%</strong> (Passed)</div>
        <div>🛡️ Safety & Hallucination Guardrails: <strong>Passed (0 edge violations)</strong></div>
        <div style="margin-top:6px; color:#a78bfa;"><strong>✔ Status: All 15 AI Agent test suites PASSED (Latency: 142ms)</strong></div>
      </div>
    `;

    setTimeout(() => {
      diagnosticRunning = false;
      showToast('All 15 Agentic AI tests passed!');
    }, 1200);
  });
}

