---
title: Autoencoders and VAEs
summary: Networks that squeeze data into a short code and rebuild it, learning what matters along the way. A variational autoencoder (VAE) makes that code smooth enough to generate new data.
category: Architectures
status: seedling
created: 2026-10-26
order: 4
problem: I have lots of unlabelled data, like card transactions or sensor readings, and I want to find the unusual ones, or compress the data into a few meaningful numbers, without anyone labelling it first.
why: To rebuild its input from a short code, the network has to learn the main patterns in the data and drop the noise. Normal data is rebuilt well, so anything rebuilt badly is unusual, which gives an anomaly score for free. A VAE goes one step further and learns a smooth code space you can sample from, which makes it a generative model and a building block of image generators like Stable Diffusion.
decides: The encoder turns an input into a short code, and the decoder turns the code back into a full-size reconstruction. For anomaly detection, the score is the reconstruction error, the difference between input and output, and anything above a threshold is flagged. A VAE’s encoder outputs a mean and a spread instead of one code, a code is sampled from that range, and the decoder rebuilds from it. To generate new data, you sample a random code and decode it.
assumptions:
  - Normal data has structure that a short code can capture. If every feature is independent noise, there is nothing to compress.
  - For anomaly detection, the training data is mostly normal. If many anomalies are in it, the network learns to rebuild them too.
related: [machine-learning/pca, deep-learning/neural-network, deep-learning/generative-adversarial-network, deep-learning/diffusion-models]
references:
  - title: IBM, What is deep learning?
    url: https://www.ibm.com/think/topics/deep-learning
  - title: Kingma and Welling (2014), Auto-encoding variational Bayes. ICLR.
  - title: Goodfellow, Bengio and Courville (2016), Deep Learning. MIT Press. Chapter 14.
    url: https://www.deeplearningbook.org/
tags: [deep-learning, unsupervised, anomaly-detection, generative, autoencoder, vae]
---

## How it works

An autoencoder has two halves:

- The **encoder** compresses the input, say 20 numbers describing a transaction, into a short **code** of maybe 3 numbers. This narrow middle layer is called the bottleneck or latent space.
- The **decoder** tries to rebuild the original 20 numbers from those 3.

Training needs no labels. The target is the input itself, and the loss is the reconstruction error:

$$
\text{loss} = \lVert x - \hat{x} \rVert^2
$$

where $x$ is the input and $\hat{x}$ the rebuilt version. With only linear layers, an autoencoder learns the same thing as [PCA](/toolbox/machine-learning/pca/). With nonlinear layers, it can capture curved patterns that PCA misses.

Common uses:

| Use | How |
| --- | --- |
| Anomaly detection | Rows with a high reconstruction error are unusual |
| Compression and features | Use the code as a compact input for another model |
| Denoising | Train it to rebuild clean data from a noisy copy |

**Variational autoencoders.** A plain autoencoder’s code space has gaps: decode a random point and you usually get nonsense. A VAE fixes this. The encoder outputs a **mean and a spread** for each code number, and the code is sampled from that range. A second loss term, the KL divergence, pulls every range towards a standard normal distribution:

$$
\text{loss} = \underbrace{\lVert x - \hat{x} \rVert^2}_{\text{rebuild well}} + \underbrace{\mathrm{KL}\big(q(z \mid x) \,\Vert\, \mathcal{N}(0, 1)\big)}_{\text{keep the code space smooth}}
$$

Now nearby codes decode to similar outputs, and you can sample a random code from the normal distribution to generate something new.

## How it decides, step by step

Fraud detection on card transactions:

1. Train the autoencoder on a month of transactions, which are almost all normal.
2. For a new transaction, encode it to 3 numbers, decode it back to 20, and compute the average squared difference.
3. Normal purchases, like groceries on a weekday evening near home, are rebuilt closely, with an error of perhaps 0.02.
4. A large purchase at 3 am in another country doesn’t fit the patterns the network learned. It is rebuilt badly, with an error of perhaps 0.9.
5. Set the threshold from the errors on normal data, for example the 99th percentile, so about 1% of transactions are sent for review.

## In code

```python
import torch, torch.nn as nn

X = torch.tensor(normal_transactions, dtype=torch.float32)   # scaled, 20 features

model = nn.Sequential(
    nn.Linear(20, 8), nn.ReLU(), nn.Linear(8, 3),       # encoder, 20 numbers -> 3
    nn.Linear(3, 8), nn.ReLU(), nn.Linear(8, 20),       # decoder, 3 -> 20
)
opt = torch.optim.Adam(model.parameters(), lr=1e-3)
for epoch in range(200):
    loss = ((model(X) - X) ** 2).mean()                 # reconstruction error
    opt.zero_grad(); loss.backward(); opt.step()

with torch.no_grad():
    error = ((model(X) - X) ** 2).mean(dim=1)           # one score per row
threshold = error.quantile(0.99)                        # flag the worst 1%
```

## Watch out for

- A bottleneck that is too wide. If the code is almost as large as the input, the network learns to copy everything, anomalies included.
- Forgetting to scale the features. A feature measured in thousands dominates the reconstruction error.
- Assuming a high error means fraud. It means unusual. Some unusual things are fine, like a first purchase abroad on holiday, so the flags still need review.
- Expecting sharp images from a VAE. On its own it tends to produce blurry samples. Modern image generators use a VAE only to compress images, and a [diffusion model](/toolbox/deep-learning/diffusion-models/) to generate.
