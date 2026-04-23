// ===== CANVAS DIAGRAMS =====

window.addEventListener('load', () => {
  drawFFNN();
  drawLSTM();
  drawTransformer();
  drawAttention();
});

// ============================
// FEED-FORWARD NETWORK DIAGRAM
// ============================
function drawFFNN() {
  const canvas = document.getElementById('ffnn-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;

  ctx.clearRect(0, 0, W, H);

  const layers = [
    { x: 50,  nodes: 4, label: 'Input\n(x)', color: '#60a5fa' },
    { x: 145, nodes: 5, label: 'Hidden 1\n(256)', color: '#c084fc' },
    { x: 240, nodes: 4, label: 'Hidden 2\n(128)', color: '#c084fc' },
    { x: 310, nodes: 3, label: 'Output\n(10)', color: '#4ade80' },
  ];

  const r = 11;

  function nodePositions(layer) {
    const n = layer.nodes;
    const spacing = Math.min(50, (H - 60) / n);
    const totalH = (n - 1) * spacing;
    const startY = (H - totalH) / 2;
    return Array.from({ length: n }, (_, i) => ({
      x: layer.x,
      y: startY + i * spacing
    }));
  }

  // Draw connections first (behind nodes)
  for (let li = 0; li < layers.length - 1; li++) {
    const fromPos = nodePositions(layers[li]);
    const toPos = nodePositions(layers[li + 1]);
    fromPos.forEach(fp => {
      toPos.forEach(tp => {
        ctx.beginPath();
        ctx.moveTo(fp.x + r, fp.y);
        ctx.lineTo(tp.x - r, tp.y);
        ctx.strokeStyle = 'rgba(255,255,255,0.06)';
        ctx.lineWidth = 1;
        ctx.stroke();
      });
    });
  }

  // Draw nodes
  layers.forEach(layer => {
    const positions = nodePositions(layer);
    positions.forEach((pos, i) => {
      // Glow
      const grad = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, r * 2.5);
      grad.addColorStop(0, layer.color + '30');
      grad.addColorStop(1, 'transparent');
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, r * 2.5, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      // Node circle
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, r, 0, Math.PI * 2);
      ctx.fillStyle = '#111118';
      ctx.fill();
      ctx.strokeStyle = layer.color;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Inner dot
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 3, 0, Math.PI * 2);
      ctx.fillStyle = layer.color;
      ctx.fill();
    });

    // Label
    const lines = layer.label.split('\n');
    ctx.fillStyle = '#9898b0';
    ctx.font = '10px Space Mono, monospace';
    ctx.textAlign = 'center';
    lines.forEach((line, i) => {
      ctx.fillText(line, layer.x, H - 20 + i * 13);
    });
  });

  // Forward arrow label
  ctx.fillStyle = '#c8f73a';
  ctx.font = '10px Space Mono, monospace';
  ctx.textAlign = 'center';
  ctx.fillText('→ Forward Pass →', W / 2, 18);
}

// ============================
// LSTM DIAGRAM
// ============================
function drawLSTM() {
  const canvas = document.getElementById('lstm-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;

  ctx.clearRect(0, 0, W, H);

  // Background
  ctx.fillStyle = '#111118';
  ctx.fillRect(0, 0, W, H);

  // Cell state line (top)
  const csY = 60;
  const csX1 = 60, csX2 = W - 60;

  // Draw cell state flow
  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 3;
  ctx.setLineDash([8, 4]);
  ctx.beginPath();
  ctx.moveTo(csX1, csY);
  ctx.lineTo(csX2, csY);
  ctx.stroke();
  ctx.setLineDash([]);

  // Labels
  ctx.fillStyle = '#fbbf24';
  ctx.font = 'bold 11px Space Mono, monospace';
  ctx.textAlign = 'left';
  ctx.fillText('C_{t-1}', csX1 - 55, csY + 4);
  ctx.textAlign = 'right';
  ctx.fillText('C_t', csX2 + 50, csY + 4);

  // Hidden state line (bottom)
  const hsY = H - 60;
  ctx.strokeStyle = '#60a5fa';
  ctx.lineWidth = 3;
  ctx.setLineDash([8, 4]);
  ctx.beginPath();
  ctx.moveTo(csX1, hsY);
  ctx.lineTo(csX2, hsY);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = '#60a5fa';
  ctx.font = 'bold 11px Space Mono, monospace';
  ctx.textAlign = 'left';
  ctx.fillText('h_{t-1}', csX1 - 60, hsY + 4);
  ctx.textAlign = 'right';
  ctx.fillText('h_t', csX2 + 40, hsY + 4);

  // Gates
  const gates = [
    { x: 160, symbol: '×', label: 'Forget\nGate', color: '#f87171', sublabel: 'f_t' },
    { x: 280, symbol: '+', label: 'Input\nGate', color: '#4ade80', sublabel: 'i_t⊙C̃_t' },
    { x: 400, symbol: '×', label: 'tanh', color: '#fbbf24', sublabel: 'tanh(C_t)' },
    { x: 520, symbol: '×', label: 'Output\nGate', color: '#60a5fa', sublabel: 'o_t' },
  ];

  const gR = 24;

  gates.forEach(gate => {
    const cx = gate.x;

    // Vertical connector from hidden state
    ctx.strokeStyle = gate.color + '60';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx, hsY);
    ctx.lineTo(cx, csY + gR + 10);
    ctx.stroke();

    // Gate circle on cell state line
    const gY = csY;
    const grad = ctx.createRadialGradient(cx, gY, 0, cx, gY, gR * 2);
    grad.addColorStop(0, gate.color + '25');
    grad.addColorStop(1, 'transparent');
    ctx.beginPath();
    ctx.arc(cx, gY, gR * 2, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(cx, gY, gR, 0, Math.PI * 2);
    ctx.fillStyle = '#18181f';
    ctx.fill();
    ctx.strokeStyle = gate.color;
    ctx.lineWidth = 2.5;
    ctx.stroke();

    ctx.fillStyle = gate.color;
    ctx.font = 'bold 18px Space Mono, monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(gate.symbol, cx, gY);
    ctx.textBaseline = 'alphabetic';

    // Label below
    const lines = gate.label.split('\n');
    ctx.fillStyle = '#9898b0';
    ctx.font = '10px Space Mono, monospace';
    lines.forEach((line, i) => {
      ctx.fillText(line, cx, csY + gR + 24 + i * 14);
    });

    ctx.fillStyle = gate.color;
    ctx.font = '10px Space Mono, monospace';
    ctx.fillText(gate.sublabel, cx, csY + gR + 24 + lines.length * 14);
  });

  // x_t input arrow (bottom center)
  const xtX = W / 2;
  ctx.strokeStyle = '#9898b0';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(xtX, H - 10);
  ctx.lineTo(xtX, hsY);
  ctx.stroke();

  // Arrowhead
  ctx.beginPath();
  ctx.moveTo(xtX - 6, hsY + 10);
  ctx.lineTo(xtX, hsY);
  ctx.lineTo(xtX + 6, hsY + 10);
  ctx.strokeStyle = '#9898b0';
  ctx.stroke();

  ctx.fillStyle = '#9898b0';
  ctx.font = 'bold 11px Space Mono, monospace';
  ctx.textAlign = 'center';
  ctx.fillText('x_t', xtX, H - 2);

  // Title
  ctx.fillStyle = '#e8e8f0';
  ctx.font = 'bold 13px Space Mono, monospace';
  ctx.textAlign = 'center';
  ctx.fillText('LSTM Cell (Unrolled View)', W / 2, 20);
}

// ============================
// TRANSFORMER DIAGRAM
// ============================
function drawTransformer() {
  const canvas = document.getElementById('transformer-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;

  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = '#111118';
  ctx.fillRect(0, 0, W, H);

  const cx = W / 2;

  function roundRect(x, y, w, h, r, fillColor, strokeColor) {
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, r);
    ctx.fillStyle = fillColor;
    ctx.fill();
    if (strokeColor) {
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
  }

  function label(text, x, y, color = '#e8e8f0', size = 11, align = 'center') {
    ctx.fillStyle = color;
    ctx.font = `${size}px Space Mono, monospace`;
    ctx.textAlign = align;
    ctx.fillText(text, x, y);
  }

  function arrow(x1, y1, x2, y2, color = '#3a3a48') {
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    // Arrowhead
    const angle = Math.atan2(y2 - y1, x2 - x1);
    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - 7 * Math.cos(angle - 0.4), y2 - 7 * Math.sin(angle - 0.4));
    ctx.lineTo(x2 - 7 * Math.cos(angle + 0.4), y2 - 7 * Math.sin(angle + 0.4));
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
  }

  // Encoder stack
  const encX = 20, encW = 120;
  let y = 570;

  // Input embedding
  roundRect(encX, y, encW, 30, 4, '#1a1a2a', '#60a5fa');
  label('Input Embedding', encX + encW/2, y + 19, '#60a5fa', 9);
  y -= 6;
  arrow(encX + encW/2, y, encX + encW/2, y - 14, '#3a3a48');
  y -= 14;

  // Positional Encoding
  roundRect(encX, y - 28, encW, 28, 4, '#1f1a2a', '#c084fc');
  label('Pos. Encoding', encX + encW/2, y - 10, '#c084fc', 9);
  y -= 28 + 6;
  arrow(encX + encW/2, y, encX + encW/2, y - 14, '#3a3a48');
  y -= 14;

  // Encoder block (N×)
  const encBlockH = 130;
  roundRect(encX - 4, y - encBlockH, encW + 8, encBlockH, 6, 'rgba(96,165,250,0.05)', '#60a5fa50');
  
  // Multi-head self-attention
  roundRect(encX + 6, y - 38, encW - 12, 32, 4, '#1a2030', '#60a5fa');
  label('Multi-Head', encX + encW/2, y - 22, '#60a5fa', 9);
  label('Self-Attention', encX + encW/2, y - 10, '#60a5fa', 9);

  // Add & Norm
  roundRect(encX + 6, y - 58, encW - 12, 16, 3, '#1a1f1a', '#4ade8060');
  label('Add & Norm', encX + encW/2, y - 47, '#4ade80', 8);

  // FFN
  roundRect(encX + 6, y - 92, encW - 12, 30, 4, '#201a20', '#c084fc');
  label('Feed Forward', encX + encW/2, y - 74, '#c084fc', 9);

  // Add & Norm 2
  roundRect(encX + 6, y - 108, encW - 12, 12, 3, '#1a1f1a', '#4ade8060');
  label('Add & Norm', encX + encW/2, y - 99, '#4ade80', 8);

  // N× label
  label('× N', encX + encW - 10, y - encBlockH + 14, '#60a5fa80', 10, 'right');

  y -= encBlockH + 6;
  arrow(encX + encW/2, y, encX + encW/2, y - 14, '#3a3a48');
  y -= 14;

  // Encoder output label
  label('Encoder Output', encX + encW/2, y - 4, '#9898b0', 8);

  // Decoder stack (right side)
  const decX = encX + encW + 30;
  const decW = 140;
  y = 570;

  roundRect(decX, y, decW, 30, 4, '#1a2a1a', '#4ade80');
  label('Target Embedding', decX + decW/2, y + 19, '#4ade80', 9);
  y -= 6;
  arrow(decX + decW/2, y, decX + decW/2, y - 14, '#3a3a48');
  y -= 14;

  roundRect(decX, y - 28, decW, 28, 4, '#1f1a2a', '#c084fc');
  label('Pos. Encoding', decX + decW/2, y - 10, '#c084fc', 9);
  y -= 28 + 6;
  arrow(decX + decW/2, y, decX + decW/2, y - 14, '#3a3a48');
  y -= 14;

  // Decoder block
  const decBlockH = 180;
  roundRect(decX - 4, y - decBlockH, decW + 8, decBlockH, 6, 'rgba(74,222,128,0.05)', '#4ade8050');

  roundRect(decX + 6, y - 38, decW - 12, 32, 4, '#1a2030', '#fb923c');
  label('Masked Multi-Head', decX + decW/2, y - 22, '#fb923c', 9);
  label('Self-Attention', decX + decW/2, y - 10, '#fb923c', 9);

  roundRect(decX + 6, y - 58, decW - 12, 16, 3, '#1a1f1a', '#4ade8060');
  label('Add & Norm', decX + decW/2, y - 47, '#4ade80', 8);

  roundRect(decX + 6, y - 96, decW - 12, 34, 4, '#202020', '#fbbf24');
  label('Cross-Attention', decX + decW/2, y - 76, '#fbbf24', 9);
  label('(Q←dec, K,V←enc)', decX + decW/2, y - 63, '#fbbf2480', 8);

  roundRect(decX + 6, y - 114, decW - 12, 14, 3, '#1a1f1a', '#4ade8060');
  label('Add & Norm', decX + decW/2, y - 104, '#4ade80', 8);

  roundRect(decX + 6, y - 148, decW - 12, 30, 4, '#201a20', '#c084fc');
  label('Feed Forward', decX + decW/2, y - 130, '#c084fc', 9);

  roundRect(decX + 6, y - 164, decW - 12, 12, 3, '#1a1f1a', '#4ade8060');
  label('Add & Norm', decX + decW/2, y - 155, '#4ade80', 8);

  label('× N', decX + decW - 10, y - decBlockH + 14, '#4ade8080', 10, 'right');

  y -= decBlockH + 6;
  arrow(decX + decW/2, y, decX + decW/2, y - 14, '#3a3a48');
  y -= 14;

  roundRect(decX, y - 28, decW, 28, 4, '#1a2020', '#2dd4bf');
  label('Linear + Softmax', decX + decW/2, y - 11, '#2dd4bf', 9);
  y -= 28 + 6;
  arrow(decX + decW/2, y, decX + decW/2, y - 14, '#3a3a48');
  y -= 14;

  label('Output Probs', decX + decW/2, y - 4, '#9898b0', 8);

  // Cross-attention connection arrow (encoder → decoder)
  const crossY = 570 - 14 - 28 - 14 - encBlockH + 60;
  arrow(encX + encW + 4, crossY, decX + 6, crossY - 80, '#fbbf2460');

  // Title
  ctx.fillStyle = '#e8e8f0';
  ctx.font = 'bold 12px Space Mono, monospace';
  ctx.textAlign = 'center';
  ctx.fillText('Transformer Architecture', W/2, 18);

  ctx.fillStyle = '#60a5fa80';
  ctx.font = '10px Space Mono, monospace';
  ctx.fillText('ENCODER', encX + encW/2, 30);
  ctx.fillStyle = '#4ade8080';
  ctx.fillText('DECODER', decX + decW/2, 30);
}

// ============================
// ATTENTION VISUALIZATION
// ============================
function drawAttention() {
  const canvas = document.getElementById('attention-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;

  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = '#18181f';
  ctx.fillRect(0, 0, W, H);

  const tokens = ['The', 'cat', 'sat', 'on', 'mat'];
  const n = tokens.length;

  // Fake attention weights (matrix)
  const attn = [
    [0.7, 0.1, 0.1, 0.05, 0.05],
    [0.2, 0.5, 0.2, 0.05, 0.05],
    [0.1, 0.3, 0.4, 0.1, 0.1],
    [0.05, 0.1, 0.3, 0.45, 0.1],
    [0.1, 0.15, 0.3, 0.2, 0.25],
  ];

  const cellSize = 36;
  const offsetX = 60, offsetY = 30;

  // Draw heatmap
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      const alpha = attn[i][j];
      const x = offsetX + j * cellSize;
      const y = offsetY + i * cellSize;

      ctx.fillStyle = `rgba(200, 247, 58, ${alpha * 0.9})`;
      ctx.fillRect(x, y, cellSize - 2, cellSize - 2);

      ctx.fillStyle = alpha > 0.3 ? '#0a0a0f' : '#9898b0';
      ctx.font = '9px Space Mono, monospace';
      ctx.textAlign = 'center';
      ctx.fillText(alpha.toFixed(2), x + cellSize/2 - 1, y + cellSize/2 + 3);
    }
  }

  // Column labels (Keys)
  tokens.forEach((t, j) => {
    ctx.fillStyle = '#60a5fa';
    ctx.font = '9px Space Mono, monospace';
    ctx.textAlign = 'center';
    ctx.fillText(t, offsetX + j * cellSize + cellSize/2 - 1, offsetY - 8);
  });

  // Row labels (Queries)
  tokens.forEach((t, i) => {
    ctx.fillStyle = '#c084fc';
    ctx.font = '9px Space Mono, monospace';
    ctx.textAlign = 'right';
    ctx.fillText(t, offsetX - 5, offsetY + i * cellSize + cellSize/2 + 3);
  });

  // Axis labels
  ctx.fillStyle = '#9898b0';
  ctx.font = '8px Space Mono, monospace';
  ctx.textAlign = 'center';
  ctx.fillText('Keys →', offsetX + (n * cellSize) / 2, H - 4);
  
  ctx.save();
  ctx.translate(12, offsetY + (n * cellSize) / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.textAlign = 'center';
  ctx.fillText('Queries →', 0, 0);
  ctx.restore();
}
