// ===== GLOSSARY DATA =====
const glossaryTerms = [
  { term: 'Epoch', def: 'One complete pass through the <strong>entire training dataset</strong>. Multiple epochs are needed for convergence; too many cause overfitting.' },
  { term: 'Batch Size', def: 'Number of samples processed before a weight update. Larger batches → more stable gradients but sharper minima; smaller → noisier but often better generalization.' },
  { term: 'Learning Rate (η)', def: 'Step size for gradient descent. Too large → divergence; too small → slow convergence. Most important hyperparameter. Typically 1e-4 to 1e-1.' },
  { term: 'Gradient', def: 'Vector of partial derivatives ∂L/∂θ indicating direction of steepest ascent in loss surface. Negative gradient is direction of steepest descent.' },
  { term: 'Overfitting', def: 'Model memorizes training data including noise, leading to poor generalization. Gap between train and validation loss is the key signal.' },
  { term: 'Underfitting', def: 'Model too simple to capture underlying patterns. High bias, high train loss. Fix: increase model capacity, add features, train longer.' },
  { term: 'Inductive Bias', def: 'Assumptions baked into a model architecture. CNNs assume <strong>translation invariance</strong>; RNNs assume <strong>sequential structure</strong>; Transformers make fewer assumptions but need more data.' },
  { term: 'Logit', def: 'Raw, unnormalized output of the final linear layer before activation. Logit = log-odds in binary classification: log(p/(1-p)).' },
  { term: 'Softmax Temperature', def: 'Scaling factor T applied to logits before softmax: p_i = exp(z_i/T)/Σexp(z_j/T). T→0 = argmax, T→∞ = uniform distribution. Used in distillation and sampling.' },
  { term: 'Perplexity', def: 'Exponentiated cross-entropy loss for language models: PPL = exp(L). Measures how "surprised" the model is. Lower is better. Random baseline = |vocab|.' },
  { term: 'BLEU Score', def: 'Bilingual Evaluation Understudy. Measures n-gram overlap between generated and reference text. Range 0–100. Imperfect but widely used for translation.' },
  { term: 'F1 Score', def: 'Harmonic mean of precision and recall: F1 = 2PR/(P+R). Balances both metrics. Macro F1 averages per-class; Micro F1 uses global counts.' },
  { term: 'AUC-ROC', def: 'Area Under the ROC curve. Probability that a randomly chosen positive ranks higher than a random negative. 0.5 = random, 1.0 = perfect. Threshold-independent.' },
  { term: 'Embedding', def: 'Dense, low-dimensional representation of a discrete object (word, user, item). Learned end-to-end. Captures semantic similarity in geometric distance.' },
  { term: 'Tokenization', def: 'Splitting text into subword units. BPE/WordPiece balance vocabulary size vs. sequence length. OOV words handled by splitting into known subwords.' },
  { term: 'Attention Mask', def: 'Binary mask applied before softmax in attention. Causal mask (lower-triangular) prevents attending to future tokens in autoregressive decoding.' },
  { term: 'KV Cache', def: 'Cache of key/value tensors computed during Transformer inference. Avoids recomputing past tokens on each new token generation. O(n) memory, O(1) amortized compute per step.' },
  { term: 'Fine-tuning', def: 'Continue training a pretrained model on a task-specific dataset with a small learning rate. Top layers adapt quickly; earlier layers change slowly.' },
  { term: 'LoRA', def: 'Low-Rank Adaptation. Freeze pretrained weights W, learn ΔW = BA where rank r ≪ min(d,k). Reduces trainable parameters by 1000x. Default PEFT method.' },
  { term: 'In-context Learning', def: 'LLMs perform new tasks given only examples in the prompt — no gradient updates. Emergent ability of large models. Quality depends heavily on prompt design.' },
  { term: 'Prompt Engineering', def: 'Crafting input prompts to elicit desired model behavior. Techniques: zero-shot, few-shot, chain-of-thought, self-consistency, role prompting.' },
  { term: 'Hallucination', def: 'LLM generating plausible-sounding but factually incorrect output. Arises from training on noisy data and maximum-likelihood objective. Mitigated by RLHF, RAG, and grounding.' },
  { term: 'RAG', def: 'Retrieval-Augmented Generation. Retrieve relevant documents at inference time and condition the LLM on them. Reduces hallucination and knowledge cutoff issues.' },
  { term: 'Feature Engineering', def: 'Transforming raw data into informative representations for ML models. Less important with deep learning but critical for tabular data and tree models.' },
  { term: 'Data Leakage', def: 'When information from test/validation set contaminates training. Causes over-optimistic evaluation. Always split BEFORE any preprocessing that uses statistics.' },
  { term: 'Early Stopping', def: 'Stop training when validation loss stops improving for k epochs (patience). Equivalent to L2 regularization for linear models. Free regularization.' },
  { term: 'Gradient Clipping', def: 'Cap gradient norm to threshold c: g ← g·(c/||g||) if ||g|| > c. Prevents exploding gradients. Essential for RNNs; used with transformers (c=1.0 common).' },
  { term: 'Mixed Precision', def: 'Train with FP16 for speed/memory, maintain FP32 master weights for numerical stability. ~2x speedup, ~2x memory reduction. Requires loss scaling to prevent underflow.' },
  { term: 'Gradient Accumulation', def: 'Sum gradients over k mini-batches before updating weights. Simulates a k× larger batch size when GPU memory is limited.' },
  { term: 'Dead Neurons', def: 'ReLU neurons permanently outputting 0 — gradient is 0, they never recover. Caused by large negative bias or high learning rate. Fixed by Leaky ReLU, lower LR, or careful init.' },
  { term: 'Mode Collapse', def: 'GAN failure: generator produces limited variety, mapping all inputs to few outputs. Discriminator cannot distinguish. Fixed by Wasserstein loss, minibatch discrimination, or unrolled GANs.' },
  { term: 'Information Bottleneck', def: 'Principle: good representations compress X while preserving info about Y: min I(X;Z) − β·I(Z;Y). Explains why hidden layers become progressively more abstract.' },
  { term: 'Manifold Hypothesis', def: 'Real-world high-dimensional data lies near a low-dimensional manifold. Explains why deep learning works despite the curse of dimensionality.' },
  { term: 'Attention Head', def: 'One parallel attention function in multi-head attention. Each head has its own W^Q, W^K, W^V projections. Heads specialize in different relationship types.' },
  { term: 'Residual Connection', def: 'Skip connection: y = F(x) + x. Enables gradient bypass. Lets network learn residuals instead of full transformations. Core to ResNet, Transformer blocks.' },
  { term: 'Layer Normalization', def: 'Normalize across the feature dimension (not batch). LN(x) = γ(x−μ)/σ + β. Stable for any batch size, essential for autoregressive Transformers.' },
];

// ===== CHEAT SHEET DATA =====
const cheatsheetCards = [
  {
    title: 'OPTIMIZER DEFAULTS',
    rows: [
      { key: 'Adam LR', val: '1e-3' },
      { key: 'Adam β₁', val: '0.9' },
      { key: 'Adam β₂', val: '0.999' },
      { key: 'Adam ε', val: '1e-8' },
      { key: 'AdamW weight decay', val: '0.01' },
      { key: 'SGD+Momentum β', val: '0.9' },
      { key: 'LR warmup steps', val: '~4% of total' },
      { key: 'Gradient clip norm', val: '1.0' },
    ]
  },
  {
    title: 'ARCHITECTURE DEFAULTS',
    rows: [
      { key: 'Transformer d_model', val: '512 / 768 / 1024' },
      { key: 'Attention heads', val: 'd_model / 64' },
      { key: 'FFN hidden dim', val: '4 × d_model' },
      { key: 'Dropout rate', val: '0.1' },
      { key: 'BERT layers', val: '12 (base) / 24 (large)' },
      { key: 'GPT-2 context window', val: '1024 tokens' },
      { key: 'Batch size (LLM pre-train)', val: '256–4096' },
      { key: 'ResNet skip projection', val: 'When dims differ' },
    ]
  },
  {
    title: 'LOSS FUNCTION GUIDE',
    rows: [
      { key: 'Binary classification', val: 'BCE + sigmoid' },
      { key: 'Multi-class', val: 'CrossEntropy + softmax' },
      { key: 'Regression', val: 'MSE or Huber' },
      { key: 'Object detection', val: 'Focal Loss (γ=2)' },
      { key: 'Metric learning', val: 'Triplet / NT-Xent' },
      { key: 'Generative (VAE)', val: 'ELBO = recon − KL' },
      { key: 'Language modeling', val: 'Cross-entropy (token-level)' },
      { key: 'Imbalanced data', val: 'Focal / weighted CE' },
    ]
  },
  {
    title: 'REGULARIZATION GUIDE',
    rows: [
      { key: 'Dropout (FC layers)', val: 'p = 0.5' },
      { key: 'Dropout (CNN)', val: 'p = 0.1–0.2' },
      { key: 'Dropout (Transformer)', val: 'p = 0.1 (after attn/FFN)' },
      { key: 'L2 weight decay', val: '1e-4 to 1e-2' },
      { key: 'Label smoothing', val: 'ε = 0.1' },
      { key: 'Mixup α', val: '0.2–0.4' },
      { key: 'BatchNorm momentum', val: '0.1' },
      { key: 'Early stopping patience', val: '5–20 epochs' },
    ]
  },
  {
    title: 'ACTIVATION SELECTION',
    rows: [
      { key: 'Hidden layers (default)', val: 'ReLU' },
      { key: 'Transformers (FFN)', val: 'GELU / SiLU' },
      { key: 'Output: binary', val: 'Sigmoid' },
      { key: 'Output: multi-class', val: 'Softmax' },
      { key: 'Output: regression', val: 'Linear (none)' },
      { key: 'Avoiding dying ReLU', val: 'Leaky ReLU (α=0.01)' },
      { key: 'Normalizing flow', val: 'ELU / Softplus' },
      { key: 'Self-normalizing nets', val: 'SELU' },
    ]
  },
  {
    title: 'EVALUATION METRICS',
    rows: [
      { key: 'Classification (balanced)', val: 'Accuracy, F1' },
      { key: 'Classification (imbalanced)', val: 'AUC-PR, F1-macro' },
      { key: 'Regression', val: 'MAE, RMSE, R²' },
      { key: 'Ranking / retrieval', val: 'NDCG, MAP, MRR' },
      { key: 'Generation', val: 'BLEU, ROUGE, BERTScore' },
      { key: 'Language models', val: 'Perplexity (lower=better)' },
      { key: 'Clustering', val: 'Silhouette, Adjusted Rand' },
      { key: 'Object detection', val: 'mAP@IoU' },
    ]
  },
  {
    title: 'WEIGHT INITIALIZATION',
    rows: [
      { key: 'ReLU networks', val: 'He / Kaiming Normal' },
      { key: 'Tanh / Sigmoid', val: 'Xavier / Glorot' },
      { key: 'Transformers (weights)', val: 'Normal(0, 0.02)' },
      { key: 'Embeddings', val: 'Normal(0, d^{-0.5})' },
      { key: 'Final classifier bias', val: 'log(pos_ratio)' },
      { key: 'All biases', val: '0' },
      { key: 'BatchNorm γ, β', val: '1, 0' },
      { key: 'RNN recurrent weights', val: 'Orthogonal' },
    ]
  },
  {
    title: 'QUICK COMPLEXITY',
    rows: [
      { key: 'Attention per layer', val: 'O(n²d)' },
      { key: 'FFN per layer', val: 'O(nd²)' },
      { key: 'Transformer total', val: 'O(L(n²d + nd²))' },
      { key: 'Conv (k×k)', val: 'O(k²CHW)' },
      { key: 'LSTM per step', val: 'O(4d²)' },
      { key: 'Softmax', val: 'O(n) — numerically stable' },
      { key: 'Matrix multiply', val: 'O(n²d) naive; O(n^{2.37}) best' },
      { key: 'KV cache memory', val: 'O(2·L·n·d·bytes)' },
    ]
  },
];

// ===== RENDER GLOSSARY =====
function renderGlossary(filter = '') {
  const container = document.getElementById('glossary-container');
  if (!container) return;

  const filtered = filter
    ? glossaryTerms.filter(t =>
        t.term.toLowerCase().includes(filter) ||
        t.def.toLowerCase().includes(filter)
      )
    : glossaryTerms;

  container.innerHTML = `
    <div class="glossary-search-wrap">
      <input
        class="glossary-search"
        id="glossary-search"
        type="text"
        placeholder="Filter terms… (${glossaryTerms.length} total)"
        value="${filter}"
        autocomplete="off"
      />
    </div>
    <div class="glossary-grid">
      ${filtered.map(t => `
        <div class="glossary-item">
          <div class="glossary-term">${t.term}</div>
          <div class="glossary-def">${t.def}</div>
        </div>
      `).join('')}
    </div>
    ${filtered.length === 0 ? '<p style="color:var(--text2);padding:20px 0">No terms match your search.</p>' : ''}
  `;

  document.getElementById('glossary-search').addEventListener('input', (e) => {
    renderGlossary(e.target.value.toLowerCase().trim());
  });
}

// ===== RENDER CHEAT SHEET =====
function renderCheatSheet() {
  const container = document.getElementById('cheatsheet-container');
  if (!container) return;

  container.innerHTML = `
    <div class="cheatsheet-grid">
      ${cheatsheetCards.map(card => `
        <div class="cs-card">
          <div class="cs-card-header">${card.title}</div>
          <div class="cs-card-body">
            ${card.rows.map(row => `
              <div class="cs-row">
                <span class="cs-key">${row.key}</span>
                <span class="cs-val">${row.val}</span>
              </div>
            `).join('')}
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  renderGlossary();
  renderCheatSheet();
});
