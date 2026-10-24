---
title: Neural network
summary: Layers of simple units, each taking a weighted sum of its inputs and passing it through a small nonlinear function, stacked to learn complex patterns.
category: Foundations
status: seedling
created: 2026-10-25
order: 1
problem: The pattern I need to learn is too complex to describe with hand-made features, like recognising handwriting, understanding speech or reading text.
why: Stacking many layers lets the network build its own features, from simple ones (edges, word pieces) to complex ones (faces, meanings), straight from raw data. With enough data and computing power, this beats hand-crafted features on images, sound and language.
decides: Data flows forward through the layers. Each unit computes a weighted sum of its inputs, adds a bias and applies an activation function. The last layer turns its outputs into probabilities with softmax, and the class with the highest probability is the prediction.
assumptions:
  - There is a lot of data, or a pretrained network to start from. Small datasets favour simpler models.
  - The inputs are scaled to similar ranges.
related: [deep-learning/backpropagation-and-gradient-descent, deep-learning/convolutional-neural-network, machine-learning/logistic-regression]
references:
  - title: Michael Nielsen, Neural Networks and Deep Learning, chapter 1. Free online book.
    url: http://neuralnetworksanddeeplearning.com/index.html
  - title: IBM, What is deep learning?
    url: https://www.ibm.com/think/topics/deep-learning
  - title: Goodfellow, Bengio and Courville (2016), Deep Learning. MIT Press. Free online.
    url: https://www.deeplearningbook.org/
tags: [deep-learning, neural-networks]
---

## How it works

A single unit, or neuron, does three things: multiply each input by a weight, add them up with a bias, and pass the result through an **activation function**:

$$
a = f(w_1 x_1 + w_2 x_2 + \dots + w_n x_n + b)
$$

With the sigmoid as $f$, one neuron is exactly [logistic regression](/toolbox/machine-learning/logistic-regression/). The power comes from connecting many of them in layers:

- **Input layer**: the raw data, like the 784 pixel values of a 28 × 28 image.
- **Hidden layers**: each learns features built from the layer before.
- **Output layer**: one unit per class, turned into probabilities by **softmax**.

“Deep” learning just means many hidden layers.

The activation function must be nonlinear. Without it, any stack of layers collapses into one big linear model. Today, ReLU is the usual choice for hidden layers: simple, fast, and it trains well.

![ReLU passes positive values and zeroes out negatives; sigmoid squeezes values between 0 and 1](/images/toolbox/nn-activations.svg)

## How it decides, step by step

Recognising a handwritten digit, the classic example in Nielsen’s book:

1. The 784 pixel values enter the network.
2. The first hidden layer might respond to small strokes in particular places.
3. The next layer combines strokes into shapes, like a loop at the top or a vertical line.
4. The output layer has 10 units, one per digit. Softmax turns them into probabilities, say 0.91 for “9”, 0.06 for “4” and small values for the rest.
5. The prediction is “9”.

Nobody tells the network to look for loops. It discovers whatever features help, during training with [backpropagation](/toolbox/deep-learning/backpropagation-and-gradient-descent/).

## In code

```python
import torch.nn as nn

model = nn.Sequential(
    nn.Flatten(),
    nn.Linear(28 * 28, 128), nn.ReLU(),
    nn.Linear(128, 64), nn.ReLU(),
    nn.Linear(64, 10),          # softmax is applied inside the loss function
)
```

For small tabular problems, `sklearn.neural_network.MLPClassifier` is a quick way to try one.

## Watch out for

- Using a neural network on small tabular data. Gradient boosting usually wins there with far less effort.
- Treating it as a black box in high-stakes decisions. Explaining what a deep network learned is hard.
