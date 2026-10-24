---
title: Convolutional neural network
summary: A neural network for images that slides small learned filters across the picture, so it finds the same pattern wherever it appears.
category: Architectures
status: seedling
created: 2026-10-25
order: 1
problem: I want a model that understands images. A plain neural network treats every pixel separately, needs a huge number of weights, and doesn’t know that a cat in the corner is still a cat.
why: Filters are shared across the whole image, so the network needs far fewer weights and recognises a pattern in any position. Stacking layers builds up from edges to textures to parts to whole objects, which matches how images are structured.
decides: Each layer slides its filters over the image and records where each pattern appears, in feature maps. Pooling shrinks the maps and keeps the strongest signals. After several rounds, a final layer turns the features into class probabilities with softmax, and the highest wins.
assumptions:
  - The data has a grid structure where nearby values are related, like pixels in an image or points in time.
  - There is enough labelled data, or a pretrained network to fine-tune.
related: [deep-learning/neural-network, computer-vision/cnn-architectures, computer-vision/vision-transformer]
references:
  - title: Michael Nielsen, Neural Networks and Deep Learning, chapter 6.
    url: http://neuralnetworksanddeeplearning.com/chap6.html
  - title: LeCun, Bottou, Bengio and Haffner (1998), Gradient-based learning applied to document recognition. Proceedings of the IEEE.
  - title: Stanford CS231n, convolutional networks
    url: https://cs231n.github.io/convolutional-networks/
tags: [deep-learning, computer-vision, cnn]
---

## How it works

Three ideas make a CNN:

**Convolution.** A filter is a small grid of weights, often 3 × 3. It slides across the image, and at each position computes a weighted sum of the pixels underneath. Where the pattern matches, say a vertical edge, the output is high. The result is a **feature map**. A layer has many filters, each learning its own pattern.

**Weight sharing.** The same filter is used at every position. A 3 × 3 filter has just 9 weights, however big the image is.

**Pooling.** Max pooling takes the largest value in each small window, often 2 × 2, halving the size. The network becomes less sensitive to exact positions and cheaper to run.

A typical CNN repeats convolution, ReLU and pooling several times, then ends with one or more fully connected layers.

## How it decides, step by step

Classifying a photo of a dog:

1. Early filters respond to edges and colour changes.
2. Middle layers combine edges into textures and shapes, like fur or an eye.
3. Deep layers respond to object parts, like a snout or ears.
4. The final layer weighs these features and softmax gives, say, 0.88 for “dog”, 0.09 for “cat”.

## In code

```python
import torch.nn as nn

model = nn.Sequential(
    nn.Conv2d(3, 32, kernel_size=3, padding=1), nn.ReLU(), nn.MaxPool2d(2),
    nn.Conv2d(32, 64, kernel_size=3, padding=1), nn.ReLU(), nn.MaxPool2d(2),
    nn.Flatten(),
    nn.Linear(64 * 56 * 56, 10),     # for 224 × 224 input images
)
```

In practice, start from a pretrained network instead of training from scratch. See [CNN architectures](/toolbox/computer-vision/cnn-architectures/).

## Watch out for

- Training from scratch on a few thousand images. Fine-tuning a pretrained model is almost always better.
- Forgetting data augmentation (flips, crops, colour changes). It is the cheapest way to reduce overfitting on images.
