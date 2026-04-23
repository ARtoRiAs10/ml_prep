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

// ===== ACTIVATION FUNCTION CHARTS =====
function drawActivation(canvasId, fn, color = '#c8f73a', yRange = [-1.2, 1.2]) {
  const canvas = document.createElement('canvas');
  canvas.width = 200;
  canvas.height = 80;
  const container = document.getElementById(canvasId);
  if (!container) return;
  container.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const xMin = -4, xMax = 4;
  const [yMin, yMax] = yRange;

  // Background
  ctx.fillStyle = '#18181f';
  ctx.fillRect(0, 0, W, H);

  // Grid lines
  ctx.strokeStyle = '#2a2a35';
  ctx.lineWidth = 1;
  // x-axis
  const y0 = H - ((0 - yMin) / (yMax - yMin)) * H;
  ctx.beginPath();
  ctx.moveTo(0, y0);
  ctx.lineTo(W, y0);
  ctx.stroke();
  // y-axis
  const x0 = ((0 - xMin) / (xMax - xMin)) * W;
  ctx.beginPath();
  ctx.moveTo(x0, 0);
  ctx.lineTo(x0, H);
  ctx.stroke();

  // Function curve
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
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
const tanh = x => Math.tanh(x);
const relu = x => Math.max(0, x);
const gelu = x => 0.5 * x * (1 + Math.tanh(Math.sqrt(2/Math.PI) * (x + 0.044715 * x**3)));
const lrelu = x => x > 0 ? x : 0.1 * x;

window.addEventListener('load', () => {
  drawActivation('chart-sigmoid', sigmoid, '#60a5fa', [-0.1, 1.1]);
  drawActivation('chart-tanh',    tanh,    '#4ade80', [-1.2, 1.2]);
  drawActivation('chart-relu',    relu,    '#c8f73a', [-0.2, 3]);
  drawActivation('chart-gelu',    gelu,    '#c084fc', [-0.5, 3]);
  drawActivation('chart-lrelu',   lrelu,   '#fb923c', [-1.5, 3]);
  drawActivation('chart-softmax', x => sigmoid(x), '#f87171', [-0.1, 1.1]);
});

// ===== SMOOTH SCROLL FOR NAV LINKS =====
navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const href = link.getAttribute('href');
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      if (window.innerWidth < 768) {
        sidebar.classList.remove('open');
      }
    }
  });
});
