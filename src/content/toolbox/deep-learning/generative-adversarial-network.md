---
title: Generative adversarial networks (GANs)
summary: Two networks trained against each other, a generator that makes fake data and a discriminator that tries to spot the fakes, until the fakes are hard to tell from the real thing.
category: Architectures
status: seedling
created: 2026-10-26
order: 5
problem: I want to create new, realistic data that looks like my real data, like synthetic images, extra examples of a rare class, or privacy-safe copies of a dataset. How does a model learn what “realistic” means?
why: Writing down a loss for “looks real” is almost impossible. A GAN learns that loss instead, as a second network whose only job is to judge. As the judge gets better, the generator has to improve to fool it. GANs were the first models to produce sharp, photo-like images, and they are still fast at generating, one pass instead of many steps.
decides: The generator takes a vector of random numbers and turns it into a sample, like an image. The discriminator takes a sample and outputs a probability that it is real. During training, the discriminator is rewarded for scoring real data near 1 and fakes near 0, and the generator is rewarded when its fakes are scored near 1. After training, only the generator is kept, and every new random vector gives a new sample.
assumptions:
  - Enough real examples for the discriminator to learn what real looks like, usually thousands.
  - Time to tune. GAN training is a balancing act between two networks and often fails without careful settings.
related: [deep-learning/autoencoder, deep-learning/diffusion-models, deep-learning/convolutional-neural-network]
references:
  - title: IBM, What is deep learning?
    url: https://www.ibm.com/think/topics/deep-learning
  - title: Goodfellow et al. (2014), Generative adversarial nets. NeurIPS.
  - title: Karras, Laine and Aila (2019), A style-based generator architecture for generative adversarial networks (StyleGAN). CVPR.
tags: [deep-learning, generative, gan]
---

## How it works

Think of a forger and a detective.

- The **generator** $G$ is the forger. It starts from random noise $z$ and produces a fake sample $G(z)$.
- The **discriminator** $D$ is the detective. It looks at a sample and outputs $D(x)$, its probability that the sample is real.

They train in turns:

1. Show the discriminator a batch of real data and a batch of fakes. Update it to say 1 for real and 0 for fake.
2. Generate a new batch of fakes. Update the generator so the discriminator is more likely to say 1.
3. Repeat.

Both use the same scorecard, binary cross-entropy, with opposite goals:

$$
\min_G \max_D \; \mathbb{E}\big[\log D(x)\big] + \mathbb{E}\big[\log\big(1 - D(G(z))\big)\big]
$$

In the ideal end state, the fakes are as good as real data and the discriminator can only guess, giving 0.5 to everything.

Well-known variants include **DCGAN** (convolutional layers for images), **conditional GANs** (generate a chosen class, like “a 7”), **CycleGAN** (turn photos into paintings without paired examples) and **StyleGAN** (very realistic faces).

## How it decides, step by step

One training round, early on:

1. The discriminator scores a real image at 0.9 and a fake at 0.2. Its loss is $-\big[\log 0.9 + \log(1 - 0.2)\big] = 0.105 + 0.223 = 0.33$. It is doing well.
2. The generator’s loss is $-\log 0.2 = 1.61$. It is being caught, so its weights are pushed hard towards fakes the discriminator would score higher.
3. Over thousands of rounds, the fakes improve and the discriminator has to look at finer details to tell them apart.
4. If the two stay balanced, the scores drift towards 0.5, where the discriminator’s loss is $-2\log 0.5 = 1.39$.

## In code

A tiny GAN that learns to produce numbers like the real data, which are centred on 3 with a spread of 0.5:

```python
import torch, torch.nn as nn

real_data = torch.randn(10_000, 1) * 0.5 + 3

G = nn.Sequential(nn.Linear(8, 32), nn.ReLU(), nn.Linear(32, 1))                 # noise -> sample
D = nn.Sequential(nn.Linear(1, 32), nn.ReLU(), nn.Linear(32, 1), nn.Sigmoid())   # sample -> P(real)
opt_g, opt_d = torch.optim.Adam(G.parameters(), 1e-3), torch.optim.Adam(D.parameters(), 1e-3)
bce = nn.BCELoss()
ones, zeros = torch.ones(64, 1), torch.zeros(64, 1)

for step in range(3000):
    real = real_data[torch.randint(0, len(real_data), (64,))]
    fake = G(torch.randn(64, 8))

    d_loss = bce(D(real), ones) + bce(D(fake.detach()), zeros)   # detective: real -> 1, fake -> 0
    opt_d.zero_grad(); d_loss.backward(); opt_d.step()

    g_loss = bce(D(fake), ones)                                  # forger: make D say 1
    opt_g.zero_grad(); g_loss.backward(); opt_g.step()

samples = G(torch.randn(1000, 8)).detach()
print(samples.mean(), samples.std())       # should be near 3 and 0.5
```

Results change from run to run. In three runs, the mean landed between 3.0 and 3.5, and in two of them the spread was only about 0.35 instead of 0.5. The generator had found a safe, narrow range that fools the discriminator, a mild case of the mode collapse described below.

## Watch out for

- Mode collapse. The generator finds a few outputs that fool the discriminator and keeps producing only those, so samples lack variety. Always check the diversity of the output, not just its quality.
- Unstable training. If one network gets far ahead of the other, learning stalls. The losses don’t show progress the way normal losses do, so look at samples as you train.
- Judging synthetic data by eye. For tabular or training data, check that models trained on the synthetic data work on real data, and that no real rows were copied.
- Using a GAN by default for images. Diffusion models now give better quality and variety and are easier to train. GANs still win when generation must be very fast.
