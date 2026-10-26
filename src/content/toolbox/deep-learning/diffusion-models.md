---
title: Diffusion models
summary: Generative models that learn to remove noise, so they can start from pure static and clean it up, step by step, into a new image, sound or video.
category: Architectures
status: seedling
created: 2026-10-26
order: 6
problem: I want a model that creates new, high-quality images (or audio or video), ideally from a text description, with lots of variety and without the unstable training of GANs.
why: Removing a little noise is a much easier task than drawing a whole image in one go. A diffusion model learns only that small task, and repeating it many times builds a full, detailed sample. Training is a simple prediction problem with a stable loss, and the results beat GANs on quality and variety. This is the method behind Stable Diffusion, DALL-E and Imagen.
decides: At each step, the network looks at the current noisy image and the step number, and predicts the noise in it. A small part of that predicted noise is subtracted, giving a slightly cleaner image. Starting from pure random noise and repeating this for, say, 50 steps produces the final sample. With a text prompt, the prediction is also guided by an embedding of the text, which pushes the image towards the description.
assumptions:
  - A large training set. Image models are trained on millions of images, so in practice you start from a pretrained model.
  - Time and hardware to generate. Each sample needs many network passes, so generation is slower than with a GAN, though modern samplers need far fewer steps.
related: [computer-vision/u-net, deep-learning/autoencoder, deep-learning/generative-adversarial-network, computer-vision/clip, llms-and-agents/foundation-models]
references:
  - title: IBM, What is deep learning?
    url: https://www.ibm.com/think/topics/deep-learning
  - title: Ho, Jain and Abbeel (2020), Denoising diffusion probabilistic models. NeurIPS.
  - title: Rombach et al. (2022), High-resolution image synthesis with latent diffusion models. CVPR.
  - title: Hugging Face, Diffusers documentation
    url: https://huggingface.co/docs/diffusers
tags: [deep-learning, generative, diffusion, computer-vision]
---

## How it works

There are two processes, one fixed and one learned.

**1. Forward process, adding noise (fixed).** Take a real image and add a little random noise, again and again, over about 1,000 steps, until nothing is left but static. There is a shortcut to jump straight to any step $t$:

$$
x_t = \sqrt{\bar{\alpha}_t}\, x_0 + \sqrt{1 - \bar{\alpha}_t}\, \varepsilon
$$

$x_0$ is the clean image, $\varepsilon$ is random noise, and $\bar{\alpha}_t$ is how much of the original signal is left, close to 1 at the start and close to 0 at the end.

**2. Reverse process, removing noise (learned).** Train a network to look at a noisy image $x_t$ and the step $t$ and predict the noise $\varepsilon$ that was added. The loss is simply the squared difference between the true and the predicted noise. The network is usually a [U-Net](/toolbox/computer-vision/u-net/), and in newer models a transformer.

To **generate**, start from pure noise and run the reverse process: predict the noise, remove a bit of it, and repeat until the image is clean.

Two additions make it practical:

- **Latent diffusion.** Instead of working on millions of pixels, first compress images with an [autoencoder](/toolbox/deep-learning/autoencoder/), run diffusion on the small code, then decode. This is the “stable” in Stable Diffusion, and it makes the whole process far cheaper.
- **Text guidance.** A text encoder, often from [CLIP](/toolbox/computer-vision/clip/), turns the prompt into an embedding that the network sees at every step. A setting called the guidance scale controls how strictly the image follows the prompt.

## How it decides, step by step

Training, for a single value:

1. Take a clean value $x_0 = 2$ and random noise $\varepsilon = -1$.
2. Pick a step where a quarter of the signal’s variance is left, $\bar{\alpha}_t = 0.25$. Then $x_t = 0.5 \cdot 2 + 0.866 \cdot (-1) = 0.13$.
3. The network sees 0.13 and the step number, and must predict the noise. If it guesses $-0.6$, the loss is $(-1 - (-0.6))^2 = 0.16$, and the weights are adjusted to guess closer to $-1$ next time.

Generating an image from the prompt “a red bicycle in the snow”:

1. Start with an image of pure random noise.
2. The network, guided by the text embedding, predicts the noise. Removing part of it reveals a faint, blurry shape.
3. Repeat. Early steps decide the layout (a bicycle, a white background), later steps add detail (spokes, snowflakes).
4. After about 50 steps the image is clean. A different starting noise gives a different bicycle.

## In code

The heart of training is a few lines. This toy version learns to denoise 2-D points:

```python
import torch, torch.nn as nn

T = 1000
alpha_bar = torch.cumprod(1 - torch.linspace(1e-4, 0.02, T), dim=0)   # signal left at each step

model = nn.Sequential(nn.Linear(2 + 1, 128), nn.ReLU(), nn.Linear(128, 2))  # stand-in for a U-Net
opt = torch.optim.Adam(model.parameters(), lr=1e-3)
x0 = torch.randn(5000, 2) * 0.3 + torch.tensor([1.0, -1.0])           # toy 2-D "images"

for step in range(2000):
    t = torch.randint(0, T, (256,))
    a = alpha_bar[t].unsqueeze(1)
    noise = torch.randn(256, 2)
    x = x0[torch.randint(0, len(x0), (256,))]
    noisy = a.sqrt() * x + (1 - a).sqrt() * noise                    # forward process: add noise
    pred = model(torch.cat([noisy, t.unsqueeze(1) / T], dim=1))       # guess the noise
    loss = ((pred - noise) ** 2).mean()
    opt.zero_grad(); loss.backward(); opt.step()
```

For real images, use a pretrained model through Hugging Face’s `diffusers` library rather than training your own.

## Watch out for

- Copying training data. Diffusion models can reproduce images from their training set almost exactly, which matters for copyright and privacy.
- Too many or too few steps. More steps cost time with little gain beyond a point, and very few steps give blurry or broken images unless the sampler is designed for it.
- A guidance scale that is too high. The image follows the prompt more literally but looks oversaturated and less natural.
- Bias in the training data. Prompts like “a doctor” or “a CEO” return the stereotypes in the data unless you check for them.
