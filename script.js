/* ============================================================
   CIPHERSHIELD — MAIN JAVASCRIPT
   ============================================================ */

// ─── MATRIX RAIN ───────────────────────────────────────────
(function initMatrix() {
  const canvas = document.getElementById('matrix-canvas');
  const ctx    = canvas.getContext('2d');

  let W, H, cols, drops;

  const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*(){}[];:?/\\'.split('');

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    cols  = Math.floor(W / 18);
    drops = Array(cols).fill(1);
  }

  function draw() {
    ctx.fillStyle = 'rgba(4,10,14,0.05)';
    ctx.fillRect(0, 0, W, H);

    ctx.font      = '14px Share Tech Mono';
    ctx.fillStyle = '#00ff8c';

    drops.forEach((y, i) => {
      const char = chars[Math.floor(Math.random() * chars.length)];
      ctx.fillStyle = Math.random() > 0.95 ? '#ffffff' : '#00ff8c';
      ctx.fillText(char, i * 18, y * 18);

      if (y * 18 > H && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    });
  }

  resize();
  window.addEventListener('resize', resize);
  setInterval(draw, 60);
})();


// ─── NAVBAR HAMBURGER ───────────────────────────────────────
(function initNavbar() {
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.querySelector('.nav-links');

  hamburger.addEventListener('click', () => {
    navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
    navLinks.style.flexDirection = 'column';
    navLinks.style.position  = 'absolute';
    navLinks.style.top       = '70px';
    navLinks.style.left      = '0';
    navLinks.style.width     = '100%';
    navLinks.style.background = 'var(--bg2)';
    navLinks.style.padding   = '1rem 2rem';
    navLinks.style.zIndex    = '999';
    navLinks.style.borderBottom = '1px solid var(--border)';
  });
})();


// ─── MODAL ─────────────────────────────────────────────────
(function initModal() {
  const overlay    = document.getElementById('modalOverlay');
  const openBtns   = [document.getElementById('openLogin'), document.getElementById('openLoginHero')];
  const closeBtn   = document.getElementById('closeModal');

  function openModal() {
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  openBtns.forEach(btn => btn && btn.addEventListener('click', openModal));
  closeBtn.addEventListener('click', closeModal);

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
})();


// ─── TABS ──────────────────────────────────────────────────
(function initTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;

      // Deactivate all
      tabBtns.forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(tc => tc.classList.remove('active'));

      // Activate selected
      btn.classList.add('active');
      document.getElementById('tab-' + target).classList.add('active');
    });
  });
})();


// ─── OTP INPUTS ────────────────────────────────────────────
(function initOTP() {
  const inputs = document.querySelectorAll('.otp-input');

  inputs.forEach((input, idx) => {
    input.addEventListener('input', () => {
      input.value = input.value.replace(/\D/g, '').slice(0, 1);
      if (input.value && idx < inputs.length - 1) {
        inputs[idx + 1].focus();
      }
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace' && !input.value && idx > 0) {
        inputs[idx - 1].focus();
      }
    });

    input.addEventListener('paste', (e) => {
      e.preventDefault();
      const pasted = (e.clipboardData || window.clipboardData).getData('text').replace(/\D/g, '').slice(0, 6);
      [...pasted].forEach((ch, i) => {
        if (inputs[i]) inputs[i].value = ch;
      });
      if (inputs[Math.min(pasted.length, inputs.length - 1)]) {
        inputs[Math.min(pasted.length, inputs.length - 1)].focus();
      }
    });
  });
})();


// ─── TOGGLE PASSWORD ────────────────────────────────────────
(function initPasswordToggle() {
  document.querySelectorAll('.toggle-pass').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = document.getElementById(btn.dataset.target);
      if (!input) return;
      input.type = input.type === 'password' ? 'text' : 'password';
      btn.textContent = input.type === 'password' ? '👁' : '🙈';
    });
  });
})();


// ─── PASSWORD STRENGTH ──────────────────────────────────────
(function initStrength() {
  const passInput    = document.getElementById('regPass');
  const strengthFill = document.getElementById('strengthFill');
  const strengthLbl  = document.getElementById('strengthLabel');

  if (!passInput) return;

  passInput.addEventListener('input', () => {
    const val = passInput.value;
    let score = 0;

    if (val.length >= 8)  score++;
    if (val.length >= 12) score++;
    if (/[A-Z]/.test(val)) score++;
    if (/[0-9]/.test(val)) score++;
    if (/[^A-Za-z0-9]/.test(val)) score++;

    const levels = [
      { width: '0%',   color: 'transparent',  label: 'Password strength' },
      { width: '20%',  color: '#ff3a3a',       label: 'Very Weak' },
      { width: '40%',  color: '#ff7700',       label: 'Weak' },
      { width: '60%',  color: '#ffaa00',       label: 'Moderate' },
      { width: '80%',  color: '#00c8ff',       label: 'Strong' },
      { width: '100%', color: '#00ff8c',       label: 'Very Strong ✔' },
    ];

    const lvl = levels[score] || levels[0];
    strengthFill.style.width      = lvl.width;
    strengthFill.style.background = lvl.color;
    strengthLbl.textContent       = lvl.label;
    strengthLbl.style.color       = lvl.color;
  });
})();


// ─── LOGIN FORM ─────────────────────────────────────────────
(function initLoginForm() {
  const loginBtn    = document.getElementById('loginBtn');
  const loginLoader = document.getElementById('loginLoader');
  const loginMsg    = document.getElementById('loginMsg');

  if (!loginBtn) return;

  loginBtn.addEventListener('click', () => {
    const user = document.getElementById('loginUser').value.trim();
    const pass = document.getElementById('loginPass').value.trim();
    const otp  = [...document.querySelectorAll('.otp-input')].map(i => i.value).join('');

    if (!user || !pass) {
      showMsg(loginMsg, 'ERROR: Operator ID and Access Key required.', 'error');
      return;
    }

    if (otp.length < 6) {
      showMsg(loginMsg, 'ERROR: Complete 6-digit 2FA token required.', 'error');
      return;
    }

    loginBtn.disabled = true;
    loginLoader.classList.add('active');
    loginMsg.textContent = '';

    setTimeout(() => {
      loginLoader.classList.remove('active');
      loginBtn.disabled = false;

      // Simulated auth — accept any complete input
      showMsg(loginMsg, '✔ AUTHENTICATION SUCCESSFUL. Redirecting...', 'success');
      setTimeout(() => {
        document.getElementById('modalOverlay').classList.remove('open');
        document.body.style.overflow = '';
        loginMsg.textContent = '';
      }, 2000);
    }, 1800);
  });
})();


// ─── REGISTER FORM ──────────────────────────────────────────
(function initRegisterForm() {
  const regBtn    = document.getElementById('registerBtn');
  const regLoader = document.getElementById('registerLoader');
  const regMsg    = document.getElementById('registerMsg');

  if (!regBtn) return;

  regBtn.addEventListener('click', () => {
    const name  = document.getElementById('regName').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const pass  = document.getElementById('regPass').value.trim();

    if (!name || !email || !pass) {
      showMsg(regMsg, 'ERROR: All fields are required.', 'error');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showMsg(regMsg, 'ERROR: Invalid email address format.', 'error');
      return;
    }

    if (pass.length < 12) {
      showMsg(regMsg, 'ERROR: Password must be at least 12 characters.', 'error');
      return;
    }

    regBtn.disabled = true;
    regLoader.classList.add('active');
    regMsg.textContent = '';

    setTimeout(() => {
      regLoader.classList.remove('active');
      regBtn.disabled = false;
      showMsg(regMsg, '✔ REQUEST SUBMITTED. Security review in progress.', 'success');
    }, 2000);
  });
})();


// ─── HELPER ─────────────────────────────────────────────────
function showMsg(el, text, type) {
  el.textContent  = text;
  el.className    = 'modal-message ' + type;
}


// ─── COUNTER ANIMATION ──────────────────────────────────────
(function initCounters() {
  const counters = document.querySelectorAll('.stat-num');

  const animateCounter = (el) => {
    const target   = parseFloat(el.dataset.target);
    const isDecimal = target % 1 !== 0;
    const duration = 2000;
    const step     = 16;
    const increment = target / (duration / step);
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = isDecimal ? current.toFixed(1) : Math.floor(current).toLocaleString();
    }, step);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
})();


// ─── SERVICE CARD REVEAL ────────────────────────────────────
(function initCardReveal() {
  const cards = document.querySelectorAll('.service-card');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.dataset.delay || 0);
        setTimeout(() => entry.target.classList.add('visible'), delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  cards.forEach(card => observer.observe(card));
})();


// ─── THREAT TICKER ──────────────────────────────────────────
(function initTicker() {
  const threats = [
    { loc: 'RU → US', type: 'DDoS', severity: 'HIGH',     target: 'Financial Sector' },
    { loc: 'CN → EU', type: 'APT', severity: 'CRITICAL',  target: 'Gov Infrastructure' },
    { loc: 'KP → JP', type: 'Ransomware', severity: 'CRITICAL', target: 'Healthcare' },
    { loc: 'IR → SA', type: 'Phishing', severity: 'MEDIUM', target: 'Energy Grid' },
    { loc: 'BR → US', type: 'Botnet', severity: 'LOW',    target: 'Retail Networks' },
    { loc: 'NG → UK', type: 'BEC', severity: 'HIGH',      target: 'Banking' },
    { loc: 'RU → DE', type: 'SQL Injection', severity: 'MEDIUM', target: 'E-Commerce' },
    { loc: 'CN → AU', type: 'Zero-Day', severity: 'CRITICAL', target: 'Telecom' },
    { loc: 'US → CN', type: 'Recon', severity: 'LOW',     target: 'Military Assets' },
  ];

  const container = document.getElementById('tickerContent');
  if (!container) return;

  // Double the list for seamless loop
  const allThreats = [...threats, ...threats];

  allThreats.forEach(t => {
    const el = document.createElement('span');
    el.className = 'ticker-item';
    el.innerHTML = `<span>[${t.severity}]</span> ${t.type} DETECTED &nbsp; ${t.loc} &nbsp; TARGET: ${t.target} &nbsp;|&nbsp; `;
    container.appendChild(el);
  });
})();


// ─── TERMINAL ANIMATION ──────────────────────────────────────
(function initTerminal() {
  const body = document.getElementById('terminalBody');
  if (!body) return;

  const lines = [
    { text: '$ initializing security sweep...', type: 'dim', delay: 400 },
    { text: '> scanning 2,847 endpoints...', type: 'dim', delay: 900 },
    { text: '✔ endpoint scan complete', type: 'ok', delay: 1600 },
    { text: '> analyzing network traffic...', type: 'dim', delay: 2100 },
    { text: '⚠ anomaly detected: 185.234.218.xxx', type: 'warn', delay: 2800 },
    { text: '> cross-referencing threat database...', type: 'dim', delay: 3300 },
    { text: '✖ BLOCKED: APT29 signature match', type: 'err', delay: 3900 },
    { text: '> updating firewall rules...', type: 'dim', delay: 4400 },
    { text: '✔ rule XF-2291 applied globally', type: 'ok', delay: 4900 },
    { text: '> running integrity check...', type: 'dim', delay: 5400 },
    { text: '✔ all systems nominal', type: 'ok', delay: 6000 },
    { text: '> monitoring active... ■', type: 'ok', delay: 6500 },
  ];

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        lines.forEach(({ text, type, delay }) => {
          setTimeout(() => {
            const div = document.createElement('div');
            div.className = 't-line ' + type;
            div.innerHTML = `<span class="t-prompt">›</span> ${text}`;
            body.appendChild(div);
            body.scrollTop = body.scrollHeight;
          }, delay);
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  observer.observe(body);
})();


// ─── SMOOTH ANCHOR SCROLL ────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});


// ─── ACTIVE NAV HIGHLIGHT ────────────────────────────────────
(function initNavHighlight() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(a => a.classList.remove('active-nav'));
        const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active-nav');
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => observer.observe(s));
})();
