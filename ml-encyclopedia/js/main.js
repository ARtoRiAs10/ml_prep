// ===== SIDEBAR TOGGLE =====
const sidebar = document.getElementById('sidebar');
const hamburger = document.getElementById('hamburger');

hamburger.addEventListener('click', () => {
  sidebar.classList.toggle('open');
});

document.addEventListener('click', (e) => {
  if (window.innerWidth < 768 &&
      sidebar.classList.contains('open') &&
      !sidebar.contains(e.target) &&
      !hamburger.contains(e.target)) {
    sidebar.classList.remove('open');
  }
});

// ===== READING PROGRESS BAR =====
const progressBar = document.createElement('div');
progressBar.id = 'progress-bar';
document.body.appendChild(progressBar);

window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressBar.style.width = pct + '%';
}, { passive: true });

// ===== ACTIVE NAV ON SCROLL =====
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.content-section');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id.replace('section-', '');
      navLinks.forEach(l => l.classList.remove('active'));
      const active = document.querySelector(`.nav-link[data-section="${id}"]`);
      if (active) {
        active.classList.add('active');
        active.scrollIntoView({ block: 'nearest' });
      }
    }
  });
}, { rootMargin: '-20% 0px -60% 0px' });

sections.forEach(s => observer.observe(s));

// ===== SMOOTH SCROLL FOR NAV LINKS =====
navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const href = link.getAttribute('href');
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    // Always close sidebar on mobile after clicking a link
    if (window.innerWidth < 768) {
      sidebar.classList.remove('open');
    }
  });
});

// ===== SEARCH =====
const searchInput = document.getElementById('sidebar-search');
if (searchInput) {
  searchInput.addEventListener('input', () => {
    const q = searchInput.value.toLowerCase().trim();
    const allLinks = document.querySelectorAll('.nav-link');
    const allSectionLabels = document.querySelectorAll('.nav-section-label');

    if (!q) {
      allLinks.forEach(l => l.style.display = '');
      allSectionLabels.forEach(l => l.style.display = '');
      return;
    }

    // Hide section labels, show only matching links
    allSectionLabels.forEach(l => l.style.display = 'none');
    allLinks.forEach(link => {
      const match = link.textContent.toLowerCase().includes(q);
      link.style.display = match ? '' : 'none';
    });
  });

  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      searchInput.value = '';
      searchInput.dispatchEvent(new Event('input'));
    }
  });
}

// ===== DARK/LIGHT THEME TOGGLE =====
const themeToggle = document.getElementById('theme-toggle');
let isLight = false;

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    isLight = !isLight;
    document.documentElement.setAttribute('data-theme', isLight ? 'light' : 'dark');
    themeToggle.textContent = isLight ? '🌙' : '☀️';
    themeToggle.title = isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode';
    localStorage.setItem('ml-enc-theme', isLight ? 'light' : 'dark');
  });

  // Restore saved theme
  const saved = localStorage.getItem('ml-enc-theme');
  if (saved === 'light') {
    isLight = true;
    document.documentElement.setAttribute('data-theme', 'light');
    themeToggle.textContent = '🌙';
    themeToggle.title = 'Switch to Dark Mode';
  }
}

// ===== COPY CODE BLOCKS =====
function addCopyButtons() {
  document.querySelectorAll('.code-block').forEach(block => {
    if (block.querySelector('.copy-btn')) return; // already added
    const btn = document.createElement('button');
    btn.className = 'copy-btn';
    btn.textContent = 'Copy';
    btn.addEventListener('click', () => {
      const code = block.innerText.replace('Copy\n','').replace('\nCopy','').trim();
      navigator.clipboard.writeText(code).then(() => {
        btn.textContent = 'Copied!';
        btn.classList.add('copied');
        setTimeout(() => {
          btn.textContent = 'Copy';
          btn.classList.remove('copied');
        }, 2000);
      });
    });
    block.style.position = 'relative';
    block.appendChild(btn);
  });
}

window.addEventListener('load', addCopyButtons);

// Re-run after Q&A render injects new code blocks
const origRenderQA = window.renderQA;
if (origRenderQA) {
  window.renderQA = function(...args) {
    origRenderQA(...args);
    setTimeout(addCopyButtons, 100);
  };
}

// ===== BACK TO TOP BUTTON =====
const backToTop = document.getElementById('back-to-top');
if (backToTop) {
  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('visible', window.scrollY > 600);
  }, { passive: true });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ===== ACTIVATION FUNCTION CHARTS =====
function drawActivation(canvasId, fn, color = '#c8f73a', yRange = [-1.2, 1.2]) {
  const canvas = document.createElement('canvas');
  canvas.width = 240;
  canvas.height = 90;
  canvas.style.width = '100%';
  canvas.style.height = '90px';
  canvas.style.display = 'block';
  const container = document.getElementById(canvasId);
  if (!container) return;
  container.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const xMin = -4, xMax = 4;
  const [yMin, yMax] = yRange;

  ctx.fillStyle = '#18181f';
  ctx.fillRect(0, 0, W, H);

  ctx.strokeStyle = '#2a2a35';
  ctx.lineWidth = 1;
  const y0 = H - ((0 - yMin) / (yMax - yMin)) * H;
  ctx.beginPath(); ctx.moveTo(0, y0); ctx.lineTo(W, y0); ctx.stroke();
  const x0 = ((0 - xMin) / (xMax - xMin)) * W;
  ctx.beginPath(); ctx.moveTo(x0, 0); ctx.lineTo(x0, H); ctx.stroke();

  ctx.strokeStyle = color;
  ctx.lineWidth = 2.5;
  ctx.lineJoin = 'round';
  ctx.beginPath();
  for (let px = 0; px <= W; px++) {
    const x = xMin + (px / W) * (xMax - xMin);
    const y = fn(x);
    const py = H - ((y - yMin) / (yMax - yMin)) * H;
    if (px === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.stroke();
}

const sigmoid = x => 1 / (1 + Math.exp(-x));
const tanh    = x => Math.tanh(x);
const relu    = x => Math.max(0, x);
const gelu    = x => 0.5 * x * (1 + Math.tanh(Math.sqrt(2/Math.PI) * (x + 0.044715 * x**3)));
const lrelu   = x => x > 0 ? x : 0.1 * x;

window.addEventListener('load', () => {
  drawActivation('chart-sigmoid', sigmoid, '#60a5fa', [-0.1, 1.1]);
  drawActivation('chart-tanh',    tanh,    '#4ade80', [-1.2, 1.2]);
  drawActivation('chart-relu',    relu,    '#c8f73a', [-0.2, 3]);
  drawActivation('chart-gelu',    gelu,    '#c084fc', [-0.5, 3]);
  drawActivation('chart-lrelu',   lrelu,   '#fb923c', [-1.5, 3]);
  drawActivation('chart-softmax', sigmoid, '#f87171', [-0.1, 1.1]);
});

