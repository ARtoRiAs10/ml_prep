# ML Encyclopedia — Deep Learning & AI Reference

A comprehensive, interactive reference website covering all major ML/DL concepts with:
- Mathematical equations (rendered via MathJax)
- Interactive canvas diagrams (FFNN, LSTM, Transformer, Attention Heatmap)
- Activation function visualizations
- 60+ interview Q&A with expandable answers
- ML System Design frameworks
- Optimizer comparisons

## Project Structure

```
ml-encyclopedia/
├── index.html          ← Main page (all sections)
├── css/
│   └── main.css        ← Design system + all styles
└── js/
    ├── main.js         ← Nav, sidebar, activation charts
    ├── diagrams.js     ← Canvas diagrams (FFNN, LSTM, Transformer, Attention)
    └── interview.js    ← Q&A data + interactive accordion
```

## How to Run

### Option 1 — Python (simplest, zero install)
```bash
cd ml-encyclopedia
python3 -m http.server 8080
# Open: http://localhost:8080
```

### Option 2 — Node.js
```bash
cd ml-encyclopedia
npx serve .
# Open: http://localhost:3000
```

### Option 3 — VS Code Live Server
Install "Live Server" extension → Right-click index.html → "Open with Live Server"

### Option 4 — Direct file
Open `index.html` directly in browser.
⚠️ MathJax needs internet connection (loads from CDN).

## Topics Covered

| Section | Content |
|---------|---------|
| ML Types | Supervised, Unsupervised, RL, Semi-supervised, Self-supervised, Transfer |
| Linear Models | Linear Regression, Logistic Regression, SVM, Kernel trick |
| Activations | Sigmoid, Tanh, ReLU, GELU, Leaky ReLU, Softmax with plots |
| Feed-Forward NN | Forward pass, Universal approximation, Parameter count |
| RNN | BPTT, Vanishing gradient analysis |
| LSTM | All 4 gates with equations, why it works |
| GRU | All equations, LSTM vs GRU comparison table |
| Attention | Scaled dot-product, Multi-head, interactive heatmap |
| Transformer | Full architecture diagram, positional encoding, complexity |
| Embeddings | Word2Vec, GloVe, BPE tokenization |
| Loss Functions | 10 loss functions with equations and use cases |
| Optimizers | SGD → Adam → AdamW → Lion with full equations |
| Regularization | L1, L2, Dropout, BatchNorm, Data Augmentation |
| Backpropagation | Chain rule, BPTT, computational graph |
| CNN | Convolution math, ResNet skip connections |
| GAN | Minimax game, WGAN, variants |
| VAE | ELBO, reparameterization trick |
| RL | Bellman equation, Policy Gradient, PPO, DQN |
| Interview Q&A | 25+ questions with detailed answers (filterable by category) |
| ML System Design | ORCAS framework, recommendation systems, fraud detection, model compression |

## Tech Stack

- **Vanilla HTML/CSS/JS** — zero build step, zero dependencies
- **MathJax 3** — LaTeX math rendering (CDN)
- **Google Fonts** — Fraunces (display), Space Mono (code), DM Sans (body)
- **Canvas API** — all diagrams drawn programmatically

## Customization

Add more interview questions in `js/interview.js` — the `questions` array.
Each question: `{ q: "Question text", tag: "category", a: "HTML answer with math" }`

Tags: `fundamentals`, `architecture`, `training`, `practical`, `advanced`
