// ===== INTERVIEW Q&A DATA =====
const questions = [
  // FUNDAMENTALS
  {
    q: "What is the bias-variance tradeoff?",
    tag: "fundamentals",
    a: `<p><strong>Bias</strong> = error from wrong assumptions in the model (underfitting). <strong>Variance</strong> = error from sensitivity to fluctuations in the training set (overfitting).</p>
    <p>Expected test error decomposes as:</p>
    <div class="math-block">$$\\text{Error} = \\text{Bias}^2 + \\text{Variance} + \\text{Irreducible Noise}$$</div>
    <p><strong>High bias:</strong> model too simple → increase capacity, add features. <strong>High variance:</strong> model too complex → add data, regularize, reduce capacity. The sweet spot (optimal model complexity) minimizes total error.</p>`
  },
  {
    q: "Explain gradient descent variants: batch, mini-batch, stochastic.",
    tag: "fundamentals",
    a: `<p><strong>Batch GD:</strong> Use entire dataset per update. Exact gradient, slow per epoch, memory-heavy. Converges smoothly.</p>
    <p><strong>SGD:</strong> One sample per update. Noisy gradient acts as regularizer, can escape local minima, fast updates. Convergence oscillates.</p>
    <p><strong>Mini-batch GD:</strong> $m$ samples (typically 32–512). Best of both: vectorization speedup on GPU, stable enough gradient. Standard practice.</p>
    <div class="math-block">$$\\theta \\leftarrow \\theta - \\eta \\nabla_\\theta \\frac{1}{m}\\sum_{i=1}^m \\mathcal{L}(x_i, y_i; \\theta)$$</div>
    <p><strong>Rule of thumb:</strong> Larger batch → sharper minima → worse generalization (Sharp Minima Conjecture). Use warmup + cosine decay to stabilize training.</p>`
  },
  {
    q: "What is the vanishing gradient problem and how is it solved?",
    tag: "fundamentals",
    a: `<p>In deep networks, gradients are products of Jacobian matrices through many layers:</p>
    <div class="math-block">$$\\frac{\\partial \\mathcal{L}}{\\partial \\mathbf{W}^{(1)}} = \\frac{\\partial \\mathcal{L}}{\\partial \\mathbf{a}^{(L)}} \\prod_{l=2}^{L} \\frac{\\partial \\mathbf{a}^{(l)}}\\partial \\mathbf{a}^{(l-1)}}$$</div>
    <p>If $|\\partial a^{(l)}/\\partial a^{(l-1)}| < 1$, gradients shrink exponentially. Sigmoid saturates to 0 gradient for large inputs.</p>
    <p><strong>Solutions:</strong> (1) Use ReLU/GELU instead of sigmoid/tanh. (2) Residual connections (ResNet) — additive shortcut. (3) Batch/Layer Normalization — keeps activations in good range. (4) LSTM/GRU for sequences — cell state avoids repeated multiplication. (5) Careful initialization (He, Xavier).</p>`
  },
  {
    q: "What's the difference between L1 and L2 regularization?",
    tag: "fundamentals",
    a: `<p><strong>L2 (Ridge):</strong> $\\mathcal{L} + \\lambda\\|w\\|_2^2$. Gradient: adds $2\\lambda w$ → shrinks weights proportionally. Equivalent to Gaussian prior on weights. Rarely produces exact zeros — good when all features matter.</p>
    <p><strong>L1 (Lasso):</strong> $\\mathcal{L} + \\lambda\\|w\\|_1$. Gradient: adds $\\lambda \\text{sign}(w)$ → constant force toward zero. Produces sparse solutions — exact zeros for irrelevant features. Good for feature selection. Equivalent to Laplace prior.</p>
    <p><strong>Elastic Net:</strong> $\\lambda_1\\|w\\|_1 + \\lambda_2\\|w\\|_2^2$ — combines both. Used in sklearn for correlated features.</p>
    <p>In neural networks: L2 is far more common (weight decay). L1 used in specialized sparse architectures.</p>`
  },
  {
    q: "What is cross-entropy loss and why is it preferred over MSE for classification?",
    tag: "fundamentals",
    a: `<p>Cross-entropy: $\\mathcal{L} = -\\sum_c y_c \\log \\hat{p}_c$. MSE: $\\mathcal{L} = \\|y - \\hat{p}\\|^2$.</p>
    <p><strong>Why CE wins for classification:</strong></p>
    <p>1. Gradient of CE + softmax w.r.t. logit $z$: $\\hat{p} - y$. Clean, non-saturating. MSE gradient: $2(\\hat{p}-y)\\hat{p}(1-\\hat{p})$ — the extra $\\hat{p}(1-\\hat{p})$ term vanishes when $\\hat{p}\\approx 0$ or $1$, killing gradients.</p>
    <p>2. CE is the proper scoring rule for probabilistic predictions — it equals the KL divergence between true and predicted distributions (plus constant). MSE penalizes wrong probabilities uniformly, not by surprise.</p>`
  },
  // ARCHITECTURE
  {
    q: "Why does the Transformer replace RNNs for NLP?",
    tag: "architecture",
    a: `<p>Three key advantages:</p>
    <p><strong>1. Parallelism:</strong> RNNs process sequentially ($O(n)$ sequential ops). Transformers compute all positions in parallel ($O(1)$ sequential). 10-100× faster training on modern GPUs.</p>
    <p><strong>2. Long-range dependencies:</strong> RNN path length between positions $i$ and $j$ is $|i-j|$ — gradient must flow through that many steps. Transformer path length is $O(1)$ via direct attention.</p>
    <p><strong>3. No vanishing gradient over sequence:</strong> LSTM partially solved this but still struggles at length 1000+. Attention directly connects any two positions.</p>
    <p><strong>Tradeoff:</strong> $O(n^2)$ attention complexity vs $O(n)$ for RNN. For very long sequences (DNA, documents), use efficient attention variants (Longformer, FlashAttention, Mamba/SSMs).</p>`
  },
  {
    q: "Explain Multi-Head Attention. Why multiple heads?",
    tag: "architecture",
    a: `<p>Each head learns a different linear projection of Q, K, V:</p>
    <div class="math-block">$$\\text{head}_i = \\text{Attention}(QW_i^Q, KW_i^K, VW_i^V)$$</div>
    <p>Outputs concatenated and projected: $\\text{MultiHead} = \\text{Concat}(\\text{head}_1,\\ldots,\\text{head}_h)W^O$</p>
    <p><strong>Why multiple heads?</strong> Different heads specialize in different relationship types simultaneously:</p>
    <p>• Head 1: Syntactic dependencies (subject-verb agreement)</p>
    <p>• Head 2: Co-reference resolution</p>
    <p>• Head 3: Positional proximity</p>
    <p>• Head 4: Semantic similarity</p>
    <p>With $h$ heads each of dim $d_k = d_\text{model}/h$, total cost is same as single-head full-dim attention but richer representations. BERT uses $h=12$, GPT-3 uses $h=96$.</p>`
  },
  {
    q: "What is the difference between LSTM and GRU? When to use which?",
    tag: "architecture",
    a: `<p><strong>LSTM:</strong> 3 gates (forget, input, output), 2 states (h, C). More expressive, better on long sequences. 33% more parameters than GRU.</p>
    <p><strong>GRU:</strong> 2 gates (reset, update), 1 state (h). Simpler, trains faster, fewer parameters. Often matches LSTM on medium-length tasks.</p>
    <p><strong>When to use LSTM:</strong> Long sequences (>500 timesteps), when model capacity is the bottleneck, tasks requiring precise long-term memory (sentiment over long text, music generation).</p>
    <p><strong>When to use GRU:</strong> Limited data or compute, shorter sequences, when training speed matters. Empirically competitive on many tasks (machine translation at moderate lengths).</p>
    <p><strong>Modern context:</strong> Both largely superseded by Transformers for NLP. Still used in time-series, speech, and low-latency embedded systems.</p>`
  },
  {
    q: "What is Batch Normalization and where should it be placed?",
    tag: "architecture",
    a: `<p>BatchNorm normalizes per-feature across the batch dimension, then applies learnable scale ($\\gamma$) and shift ($\\beta$):</p>
    <div class="math-block">$$\\hat{x}_i = \\frac{x_i - \\mu_\\mathcal{B}}{\\sqrt{\\sigma^2_\\mathcal{B}+\\epsilon}}, \\quad y_i = \\gamma\\hat{x}_i + \\beta$$</div>
    <p><strong>Benefits:</strong> Enables higher learning rates, reduces sensitivity to initialization, acts as mild regularizer (noise from batch statistics).</p>
    <p><strong>Placement debate:</strong></p>
    <p>• Original paper: After linear, before activation: Linear → BN → Activation</p>
    <p>• Pre-activation (ResNet v2): BN → Activation → Linear (better gradient flow)</p>
    <p>• <strong>Don't use BatchNorm in Transformers</strong> — use LayerNorm instead (normalizes across features, not batch — works with batch size 1, autoregressive generation).</p>
    <p><strong>BN fails when:</strong> Small batch size (<8), RNNs (varying sequence lengths), inference-only (use running stats from training).</p>`
  },
  {
    q: "How does ResNet solve the degradation problem?",
    tag: "architecture",
    a: `<p>Observation: Adding more layers to a plain network can hurt performance even on training data (not just overfitting). This is the <strong>degradation problem</strong> — optimizer struggles to learn identity mappings through many non-linear layers.</p>
    <p>ResNet introduces skip connections: $\mathbf{y} = \mathcal{F}(\mathbf{x}) + \mathbf{x}$. The network only needs to learn the <strong>residual</strong> $\mathcal{F}(\mathbf{x}) = \mathbf{y} - \mathbf{x}$, which is easier to optimize (can be pushed to ~0).</p>
    <p><strong>Gradient analysis:</strong> $\\frac{\\partial \\mathcal{L}}{\\partial \\mathbf{x}} = \\frac{\\partial \\mathcal{L}}{\\partial \\mathbf{y}}\\left(1 + \\frac{\\partial \\mathcal{F}}{\\partial \\mathbf{x}}\\right)$. The $+1$ ensures gradient always flows, regardless of what $\\mathcal{F}$ learns. Enabled training of 1000+ layer networks.</p>`
  },
  // TRAINING
  {
    q: "What is overfitting and how do you detect and prevent it?",
    tag: "training",
    a: `<p><strong>Overfitting:</strong> Model memorizes training data, fails to generalize. Signs: training loss decreasing, validation loss increasing (diverging).</p>
    <p><strong>Detection:</strong> Plot train vs. val loss curves. Large gap = overfitting. Check train vs val accuracy. Use learning curves (error vs. dataset size).</p>
    <p><strong>Prevention strategies (in rough order of impact):</strong></p>
    <p>1. <strong>More data</strong> — always best. Data augmentation if collection is hard.</p>
    <p>2. <strong>Reduce model capacity</strong> — fewer layers/neurons.</p>
    <p>3. <strong>Regularization</strong> — L2 weight decay, dropout.</p>
    <p>4. <strong>Early stopping</strong> — monitor validation loss, stop at minimum.</p>
    <p>5. <strong>Cross-validation</strong> — k-fold to get unbiased estimate.</p>
    <p>6. <strong>Ensemble methods</strong> — average predictions from multiple models.</p>`
  },
  {
    q: "Explain Adam optimizer. What are its failure modes?",
    tag: "training",
    a: `<p>Adam maintains exponential moving averages of gradients (1st moment $m_t$) and squared gradients (2nd moment $v_t$), with bias correction:</p>
    <div class="math-block">$$\\theta_{t+1} = \\theta_t - \\frac{\\eta}{\\sqrt{\\hat{v}_t}+\\epsilon}\\hat{m}_t$$</div>
    <p><strong>Strengths:</strong> Adaptive per-parameter LR, handles sparse gradients well, robust to hyperparameter choice.</p>
    <p><strong>Failure modes:</strong></p>
    <p>1. <strong>L2 ≠ weight decay:</strong> Adam + L2 regularization doesn't actually perform L2 regularization — use AdamW instead (decouples weight decay).</p>
    <p>2. <strong>Generalization gap:</strong> Adam often converges to sharper minima than SGD with momentum, which generalize worse. SGD+M sometimes preferred for final training.</p>
    <p>3. <strong>LR sensitivity at end of training:</strong> $v_t$ accumulates, effective LR decays — need LR schedule.</p>
    <p>4. <strong>Large $\\epsilon$ masking:</strong> If $\\epsilon$ too large, reduces to SGD. If too small, numerical instability.</p>`
  },
  {
    q: "What is learning rate warmup and why is it used?",
    tag: "training",
    a: `<p>Warmup linearly increases LR from 0 to $\\eta_{max}$ over $t_{warmup}$ steps, then decays (cosine, linear, or step).</p>
    <p><strong>Why warmup?</strong></p>
    <p>1. At initialization, weights are random → gradients are noisy → large LR causes divergence. Small initial LR lets model "settle in."</p>
    <p>2. Adam's 2nd moment estimate $v_t$ is very noisy early (few samples). Small LR compensates for unreliable adaptive rates.</p>
    <p>3. For very deep networks, early layers receive small gradients. Large LR amplifies these noisy signals destructively.</p>
    <p>The original Transformer paper uses: $\\eta = d_{model}^{-0.5} \\cdot \\min(t^{-0.5}, t \\cdot t_w^{-1.5})$. Typical warmup: 4% of total training steps. Larger batch size → longer warmup needed.</p>`
  },
  // PRACTICAL
  {
    q: "How do you handle class imbalance?",
    tag: "practical",
    a: `<p><strong>Data-level approaches:</strong></p>
    <p>• <strong>Oversampling (SMOTE):</strong> Synthesize minority class samples by interpolating between neighbors.</p>
    <p>• <strong>Undersampling:</strong> Reduce majority class. Risks discarding useful data.</p>
    <p><strong>Algorithm-level approaches:</strong></p>
    <p>• <strong>Class weights:</strong> Weight loss inversely proportional to class frequency: $w_c = N / (K \\cdot N_c)$.</p>
    <p>• <strong>Focal Loss:</strong> $-(1-p_t)^\\gamma \\log p_t$ down-weights easy examples. $\\gamma=2$ is standard (RetinaNet).</p>
    <p>• <strong>Threshold tuning:</strong> Adjust classification threshold on validation set to optimize F1/recall.</p>
    <p><strong>Evaluation:</strong> Don't use accuracy. Use precision-recall AUC, F1, Matthews Correlation Coefficient, or ROC-AUC (but be aware ROC-AUC can be misleading for extreme imbalance — PR-AUC is better).</p>`
  },
  {
    q: "What is the difference between precision and recall? When to optimize for which?",
    tag: "practical",
    a: `<p><strong>Precision</strong> = TP / (TP + FP). Of all positively predicted, how many are correct?<br>
    <strong>Recall</strong> = TP / (TP + FN). Of all actual positives, how many did we catch?</p>
    <p><strong>F1</strong> = harmonic mean: $2 \\cdot \\frac{P \\cdot R}{P + R}$ — balances both.</p>
    <p><strong>Optimize for Recall when:</strong> False negatives are costly. Cancer detection (missing a cancer is worse than false alarm), fraud detection (missing fraud costs more). "Don't miss the positive."</p>
    <p><strong>Optimize for Precision when:</strong> False positives are costly. Email spam filter (blocking legitimate email is bad), legal document classification. "Only flag when sure."</p>
    <p>Tradeoff controlled by classification threshold. Plot precision-recall curve — AUC-PR summarizes performance across all thresholds.</p>`
  },
  {
    q: "How would you diagnose and fix a model that isn't converging?",
    tag: "practical",
    a: `<p><strong>Systematic diagnosis:</strong></p>
    <p>1. <strong>Check loss decreasing at all?</strong> If loss = random (log(1/C) for cross-entropy), model isn't learning. Check: data pipeline, label correctness, gradient flow.</p>
    <p>2. <strong>Plot gradient norms per layer.</strong> Vanishing: early layers have tiny gradients. Exploding: NaN loss. Fix: gradient clipping ($\\|g\\|_2 > 1.0$ → normalize), check activations.</p>
    <p>3. <strong>Overfit a single batch first.</strong> Train on 1 batch until loss → 0. Proves model capacity and forward/backward pass are correct.</p>
    <p>4. <strong>LR issues:</strong> LR too high → loss oscillates/diverges. LR too low → loss barely decreases. Use LR range test (Smith, 2017).</p>
    <p>5. <strong>Check input data:</strong> Normalized? Correct dtype? Shuffled? No data leakage?</p>
    <p>6. <strong>Architecture issues:</strong> Wrong activation (sigmoid in hidden layers), no batch norm in deep nets, wrong loss for task.</p>`
  },
  {
    q: "Explain dropout. Why does it work as regularization?",
    tag: "practical",
    a: `<p>During training, each neuron is zeroed independently with probability $1-p$ (keep probability $p$). At test time, all neurons active, outputs scaled by $p$.</p>
    <p><strong>Why it works (multiple perspectives):</strong></p>
    <p>1. <strong>Ensemble view:</strong> Each forward pass samples a different subnetwork from $2^n$ possible networks. Test uses geometric ensemble. Ensemble ≈ regularization.</p>
    <p>2. <strong>Breaks co-adaptation:</strong> Neurons can't rely on specific partners being present → each must learn independently useful features → more robust representations.</p>
    <p>3. <strong>Adds noise:</strong> Acts as data augmentation in feature space. Noise injection = regularization.</p>
    <p><strong>Practical notes:</strong> $p=0.5$ for fully-connected, $p=0.1$–$0.3$ for convolutions. Don't use before BatchNorm (kills variance signal). Inverted dropout (scale during training, not test) is standard in PyTorch/TF.</p>`
  },
  // ADVANCED
  {
    q: "What is attention? How does it differ from convolution and RNNs?",
    tag: "advanced",
    a: `<p>Attention computes a weighted sum of values, where weights are similarity scores between queries and keys:</p>
    <div class="math-block">$$\\text{Attention}(Q,K,V) = \\text{softmax}\\left(\\frac{QK^T}{\\sqrt{d_k}}\\right)V$$</div>
    <p><strong>vs. RNN:</strong> RNN maintains hidden state, processes sequentially. Attention is parallel and has $O(1)$ path between any two positions (vs $O(n)$ for RNN).</p>
    <p><strong>vs. Convolution:</strong> CNN uses fixed local windows — receptive field grows with depth. Attention has <em>global, dynamic</em> receptive field — weights adapt per input. CNN: $O(knd^2)$ per layer, $O(n/k)$ sequential. Attention: $O(n^2d)$, $O(1)$ sequential.</p>
    <p>Attention is input-dependent (dynamic). Convolution kernel is fixed (static). Attention can model arbitrary pairwise interactions in one layer.</p>`
  },
  {
    q: "Explain the Encoder-Decoder architecture and cross-attention.",
    tag: "advanced",
    a: `<p>In seq2seq tasks (translation, summarization): encoder reads input sequence into contextualized representations $H = [h_1, \ldots, h_n]$. Decoder generates output token-by-token conditioned on $H$.</p>
    <p><strong>Cross-attention</strong> in decoder queries encoder outputs:</p>
    <div class="math-block">$$Q = h_t^{\\text{dec}}W^Q, \\quad K = H^{\\text{enc}}W^K, \\quad V = H^{\\text{enc}}W^V$$</div>
    <p>Decoder query "attends" to relevant encoder positions. E.g., when generating French "chat," attends to English "cat."</p>
    <p><strong>Masked self-attention:</strong> Decoder self-attention is causally masked (can only attend to previous tokens) — prevents seeing future tokens during training. Mask: set $-\\infty$ for positions $j > i$ before softmax.</p>`
  },
  {
    q: "What is knowledge distillation? How does it work?",
    tag: "advanced",
    a: `<p>Train a small "student" model to mimic a large "teacher" model's soft output probabilities, not just hard labels:</p>
    <div class="math-block">$$\\mathcal{L} = \\alpha \\mathcal{L}_{CE}(y, p_s) + (1-\\alpha)\\mathcal{L}_{KL}(p_t^T, p_s^T)$$</div>
    <p>$p^T = \\text{softmax}(z/T)$ — temperature $T$ softens distributions, revealing "dark knowledge." E.g., MNIST "3" being 40% like "8" tells student about similarity structure.</p>
    <p><strong>Why dark knowledge helps:</strong> Soft targets contain more information per sample than one-hot labels (inter-class relationships). Student learns a richer posterior over classes.</p>
    <p><strong>Applications:</strong> DistilBERT (66% size of BERT, 97% performance). Tinker with temperature $T=2$–$20$. Feature distillation: match intermediate representations. Used in production to compress LLMs.</p>`
  },
  {
    q: "What is the difference between generative and discriminative models?",
    tag: "advanced",
    a: `<p><strong>Discriminative:</strong> Model conditional $P(Y|X)$ directly. Learn decision boundary. Examples: logistic regression, SVM, neural classifier, BERT (when fine-tuned).</p>
    <p><strong>Generative:</strong> Model joint $P(X, Y) = P(X|Y)P(Y)$. Can generate new samples. Examples: Naive Bayes, LDA, GAN, VAE, GPT, diffusion models.</p>
    <p><strong>Tradeoffs:</strong></p>
    <p>• Discriminative: Better classification accuracy when only $P(Y|X)$ needed. Discriminant analysis is generally more efficient statistically.</p>
    <p>• Generative: Can handle missing data, generate new samples, density estimation, works with unlabeled data, can incorporate prior knowledge.</p>
    <p>By Bayes: $P(Y|X) = P(X|Y)P(Y)/P(X)$. Generative models can compute this but optimize a harder quantity.</p>`
  },
  {
    q: "How does the VAE reparameterization trick enable backpropagation?",
    tag: "advanced",
    a: `<p>VAE encoder outputs $\\mu_\\phi(x)$ and $\\sigma_\\phi(x)$. We need to sample $z \\sim \\mathcal{N}(\\mu, \\sigma^2)$.</p>
    <p><strong>Problem:</strong> Sampling is non-differentiable. Gradient cannot flow through the sampling node to reach $\\mu$ and $\\sigma$.</p>
    <p><strong>Reparameterization:</strong> Instead of sampling $z$ directly, sample noise: $\\epsilon \\sim \\mathcal{N}(0,I)$ (independent of $\\phi$), then set:</p>
    <div class="math-block">$$z = \\mu_\\phi(x) + \\sigma_\\phi(x) \\odot \\epsilon$$</div>
    <p>Now $z$ is a deterministic function of $\\phi$ and the <em>fixed</em> noise $\\epsilon$. Gradient flows through $\\mu$ and $\\sigma$ normally. The randomness is "externalized" — outside the computational graph of $\\phi$.</p>
    <p>This trick generalizes: any distribution with a differentiable reparameterization works. Gumbel-softmax for discrete variables is an analogous trick.</p>`
  },
  {
    q: "What is the difference between model parameters and hyperparameters?",
    tag: "fundamentals",
    a: `<p><strong>Parameters</strong> ($\\theta$): Learned from data during training via gradient descent. Examples: weight matrices $W$, bias vectors $b$, BatchNorm $\\gamma, \\beta$.</p>
    <p><strong>Hyperparameters:</strong> Set before training by the practitioner, not learned from data. Examples: learning rate $\\eta$, batch size $m$, number of layers $L$, hidden dimension $d$, dropout rate $p$, L2 coefficient $\\lambda$.</p>
    <p><strong>Hyperparameter tuning methods:</strong></p>
    <p>• <strong>Grid search:</strong> Exhaustive search over specified values. Works for $\\leq 3$ HPs.</p>
    <p>• <strong>Random search:</strong> Random sampling. Surprisingly effective — Bergstra & Bengio 2012 showed it beats grid search because irrelevant HPs waste grid search budget.</p>
    <p>• <strong>Bayesian optimization:</strong> Build probabilistic model of $f(\text{HP}) = \\text{val\_loss}$, use acquisition function (EI, UCB) to intelligently pick next HP to try. Tools: Optuna, Ray Tune, Weights & Biases Sweeps.</p>`
  },
  {
    q: "Explain principal component analysis (PCA) mathematically.",
    tag: "fundamentals",
    a: `<p>PCA finds orthogonal directions of maximum variance in data.</p>
    <p><strong>Steps:</strong></p>
    <p>1. Center data: $X_c = X - \\bar{X}$</p>
    <p>2. Compute covariance: $\\Sigma = \\frac{1}{n}X_c^TX_c \\in \\mathbb{R}^{d\\times d}$</p>
    <p>3. Eigendecompose: $\\Sigma = V\\Lambda V^T$ (or SVD: $X_c = U\\Sigma V^T$)</p>
    <p>4. Project onto top $k$ eigenvectors: $Z = X_c V_k$</p>
    <div class="math-block">$$\\text{Variance explained} = \\frac{\\sum_{i=1}^k \\lambda_i}{\\sum_{i=1}^d \\lambda_i}$$</div>
    <p><strong>Limitations:</strong> Linear only, sensitive to scale (normalize first!), loses interpretability. Alternatives: t-SNE (visualization), UMAP (topology-preserving), Autoencoders (non-linear).</p>`
  },
  {
    q: "What is the curse of dimensionality?",
    tag: "fundamentals",
    a: `<p>In high dimensions, geometric intuitions break down in ways that hurt ML:</p>
    <p>1. <strong>Data sparsity:</strong> Volume of a unit hypercube grows as $1^d = 1$ but volume of an inscribed hypersphere shrinks to 0 as $d\\to\\infty$. Points cluster at corners. Need $n = O(\\epsilon^{-d})$ samples to cover a space with $\\epsilon$-balls — exponential in $d$.</p>
    <p>2. <strong>Distance concentration:</strong> In high-$d$, all pairwise distances converge: $\\frac{\\max - \\min}{\\min} \\to 0$. Nearest neighbor becomes meaningless.</p>
    <p>3. <strong>Optimization:</strong> More saddle points, complex loss landscapes.</p>
    <p><strong>Counterintuitively,</strong> deep learning succeeds in high-dimensional spaces because real data lies on low-dimensional manifolds — the <strong>manifold hypothesis</strong>. Neural networks implicitly learn these manifolds.</p>`
  },
  {
    q: "How does RLHF (Reinforcement Learning from Human Feedback) work for LLMs?",
    tag: "advanced",
    a: `<p>RLHF aligns LLMs with human preferences in three stages:</p>
    <p><strong>Stage 1 — Supervised Fine-Tuning (SFT):</strong> Fine-tune base LLM on high-quality human-written demonstrations. Creates SFT model.</p>
    <p><strong>Stage 2 — Reward Model (RM):</strong> Collect human preference data: present two model outputs, human picks better one. Train reward model $r_\\phi(x, y)$ to predict human preference via Bradley-Terry model:</p>
    <div class="math-block">$$\\mathcal{L} = -\\mathbb{E}[\\log\\sigma(r_\\phi(x, y_w) - r_\\phi(x, y_l))]$$</div>
    <p><strong>Stage 3 — RL Fine-Tuning (PPO):</strong> Optimize LLM policy $\\pi_\\theta$ to maximize reward while staying close to SFT policy (KL penalty prevents reward hacking):</p>
    <div class="math-block">$$\\mathcal{L} = \\mathbb{E}[r_\\phi(x,y)] - \\beta D_{KL}(\\pi_\\theta \\| \\pi_{SFT})$$</div>
    <p><strong>DPO (Direct Preference Optimization):</strong> Skips RM training entirely, directly optimizes on preference pairs. Simpler, often competitive.</p>`
  },
  {
    q: "What is a transformer's context window and how does positional encoding work?",
    tag: "architecture",
    a: `<p><strong>Context window:</strong> Maximum sequence length the transformer processes. Bounded by $O(n^2)$ attention — quadratic memory and compute. GPT-4: ~128K tokens, Gemini 1.5: 1M tokens (via sparse/linear attention variants).</p>
    <p><strong>Absolute Positional Encoding (original Transformer):</strong></p>
    <div class="math-block">$$PE_{pos,2i} = \\sin(pos/10000^{2i/d}), \\quad PE_{pos,2i+1} = \\cos(pos/10000^{2i/d})$$</div>
    <p>Added to embeddings. Fixed, deterministic. Can generalize to unseen lengths.</p>
    <p><strong>Learned PE:</strong> BERT, GPT — embed position index. Simpler but can't generalize beyond training length.</p>
    <p><strong>Rotary PE (RoPE):</strong> Encodes relative positions by rotating Q/K vectors. Used in LLaMA, GPT-NeoX. Enables length extrapolation. $\\text{score}(q_m, k_n)$ depends only on $m-n$ (relative position).</p>
    <p><strong>ALiBi:</strong> Additive bias $-|i-j| \\cdot m$ to attention scores. Simple, excellent length generalization.</p>`
  }
];

// ===== RENDER Q&A =====
function renderQA(filter = 'all') {
  const container = document.getElementById('interview-container');
  if (!container) return;

  const filtered = filter === 'all' ? questions : questions.filter(q => q.tag === filter);

  container.innerHTML = `
    <div class="interview-filters">
      ${['all','fundamentals','architecture','training','practical','advanced'].map(f => `
        <button class="filter-btn ${f === filter ? 'active' : ''}" data-filter="${f}">${f.charAt(0).toUpperCase()+f.slice(1)}</button>
      `).join('')}
    </div>
    ${filtered.map((q, i) => `
      <div class="qa-item" id="qa-${i}">
        <div class="qa-question" onclick="toggleQA('qa-${i}')">
          <div class="qa-q-text">${q.q}</div>
          <span class="qa-tag qa-tag-${q.tag}">${q.tag}</span>
          <svg class="qa-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </div>
        <div class="qa-answer">
          <div class="qa-answer-inner">${q.a}</div>
        </div>
      </div>
    `).join('')}
  `;

  // Bind filters
  container.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      renderQA(btn.dataset.filter);
      if (window.MathJax) {
        setTimeout(() => MathJax.typesetPromise(), 200);
      }
    });
  });
}

function toggleQA(id) {
  const item = document.getElementById(id);
  if (!item) return;
  const answer = item.querySelector('.qa-answer');
  const isOpen = item.classList.contains('open');

  if (isOpen) {
    item.classList.remove('open');
    answer.style.maxHeight = '0';
  } else {
    item.classList.add('open');
    answer.style.maxHeight = answer.scrollHeight + 'px';
    // Re-typeset math in opened answer
    if (window.MathJax) {
      setTimeout(() => MathJax.typesetPromise([answer]), 100);
    }
  }
}

// Init
document.addEventListener('DOMContentLoaded', () => {
  renderQA();
});

window.toggleQA = toggleQA;
