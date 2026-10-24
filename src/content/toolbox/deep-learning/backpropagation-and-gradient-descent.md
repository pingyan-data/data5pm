---
title: Backpropagation and gradient descent
summary: How a neural network learns. It measures its error, works out how each weight contributed, and nudges every weight in the direction that reduces the error.
category: Foundations
status: seedling
created: 2026-10-25
order: 2
problem: A network can have millions of weights. How do we find values that make good predictions, when trying them one by one is impossible?
why: Gradient descent only needs one thing, the direction in which the error falls fastest. Backpropagation computes that direction for every weight at once, in a single backward pass, at roughly the cost of one prediction. Together they make training huge networks practical.
assumptions:
  - The loss and every layer are differentiable, so a slope exists everywhere.
  - The learning rate is reasonable. Too large and training jumps around or diverges; too small and it crawls.
related: [deep-learning/neural-network, machine-learning/gradient-boosting]
references:
  - title: Michael Nielsen, Neural Networks and Deep Learning, chapters 1 to 3.
    url: http://neuralnetworksanddeeplearning.com/index.html
  - title: Rumelhart, Hinton and Williams (1986), Learning representations by back-propagating errors. Nature.
  - title: Kingma and Ba (2015), Adam, a method for stochastic optimization. ICLR.
tags: [deep-learning, training, optimisation]
---

## How it works

**1. A loss function** measures how wrong the network is. Cross-entropy for classification, mean squared error for regression.

**2. Gradient descent** improves the weights step by step. The gradient tells you which way is uphill, so you step the other way:

$$
w \leftarrow w - \eta \, \frac{\partial \text{Loss}}{\partial w}
$$

$\eta$ is the **learning rate**, the step size. Think of walking down a foggy hill by always taking a small step in the steepest downward direction.

**3. Backpropagation** computes $\partial \text{Loss} / \partial w$ for every weight. It runs the network forward to get the error, then sends that error backwards layer by layer, using the chain rule from calculus to share out the blame: how much did each weight contribute to the mistake?

In practice, each step uses a small random **mini-batch** of examples rather than the whole dataset. This is stochastic gradient descent (SGD). It is faster and the noise even helps escape poor solutions. **Adam**, which adapts the step size for each weight, is the most common optimiser today.

## Example

One weight, current value 0.8, learning rate 0.1. Backpropagation finds the slope of the loss at this weight is 2.0, meaning a larger weight increases the error. The update is $0.8 - 0.1 \times 2.0 = 0.6$. Every weight in the network gets an update like this on every mini-batch, thousands of times.

## Keeping it from overfitting

Big networks can memorise training data. The standard defences, all covered in Nielsen’s chapter 3:

| Technique | Idea |
| --- | --- |
| Early stopping | Stop when the error on validation data stops improving |
| Weight decay (L2) | Penalise large weights, as in ridge regression |
| Dropout | Randomly switch off some units during training, so no unit can rely on another |
| More data, data augmentation | Flip, crop or recolour images to create new training examples |

## In code

```python
import torch

opt = torch.optim.Adam(model.parameters(), lr=1e-3, weight_decay=1e-4)
loss_fn = torch.nn.CrossEntropyLoss()

for xb, yb in train_loader:          # mini-batches
    loss = loss_fn(model(xb), yb)    # forward pass
    opt.zero_grad()
    loss.backward()                  # backpropagation
    opt.step()                       # gradient descent step
```

## Watch out for

- The learning rate is the most important setting. If the loss explodes or turns into NaN, lower it first.
- Vanishing gradients in deep networks with sigmoid activations: the signal shrinks layer by layer and early layers stop learning. ReLU and residual connections largely fixed this.
