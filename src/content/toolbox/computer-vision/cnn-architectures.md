---
title: CNN architectures
summary: The landmark convolutional networks for image classification, from AlexNet to EfficientNet, and which ones to use today.
category: Image classification
status: seedling
created: 2026-10-25
order: 1
problem: I need to classify images, like product photos or defects on a production line. Which network should I start from?
why: Each landmark architecture solved a specific problem, like going deeper, being faster or running on a phone. Knowing them makes it easy to pick a pretrained backbone, and fine-tuning one of these is still the most practical way to get a good image classifier quickly.
decides: The image passes through stacks of convolution layers that detect increasingly complex patterns. A final layer turns the features into class probabilities with softmax, and the class with the highest probability wins.
assumptions:
  - Your images look roughly like the pretraining data (everyday photos, for ImageNet models). Very different images, like X-rays or satellite data, need more fine-tuning.
  - Images are resized and normalised the way the pretrained model expects.
related: [deep-learning/convolutional-neural-network, computer-vision/vision-transformer, computer-vision/r-cnn-family]
references:
  - title: GeeksforGeeks, Top computer vision models
    url: https://www.geeksforgeeks.org/computer-vision/top-computer-vision-models/
  - title: He, Zhang, Ren and Sun (2016), Deep residual learning for image recognition. CVPR.
  - title: Tan and Le (2019), EfficientNet, rethinking model scaling for convolutional neural networks. ICML.
  - title: torchvision, models and pretrained weights
    url: https://pytorch.org/vision/stable/models.html
tags: [computer-vision, cnn, classification, transfer-learning]
---

## How they evolved

| Network | Year | Key idea | Why it matters |
| --- | --- | --- | --- |
| AlexNet | 2012 | Deep CNN trained on GPUs, with ReLU and dropout | Won ImageNet by a wide margin and started the deep learning boom |
| VGG | 2014 | Only small 3 × 3 filters, stacked very deep | Simple, uniform design; still used as a feature extractor |
| GoogLeNet (Inception) | 2014 | Filters of several sizes side by side in each block | Deeper without exploding the computation |
| ResNet | 2015 | **Residual connections**: each block learns a change added to its input | Made networks with 100+ layers trainable. The default backbone for years. |
| MobileNet | 2017 | Depthwise separable convolutions, far fewer computations | Runs on phones and small devices |
| EfficientNet | 2019 | Scales depth, width and image resolution together in a fixed ratio | High accuracy per unit of compute |

The single most important idea here is the residual connection. Instead of learning a whole new output, a block learns only what to add to its input: $y = x + F(x)$. If a layer isn’t useful, it can learn to add almost nothing, so extra depth no longer hurts, and gradients flow straight back through the shortcuts.

## How to use them today

Almost never train from scratch. **Transfer learning**: take a network pretrained on ImageNet, replace the last layer with one for your classes, and fine-tune. A few hundred images per class can be enough.

Good default choices: ResNet-50 for a reliable baseline, EfficientNet or a small ConvNeXt for accuracy per compute, MobileNet for devices. Vision transformers are the main alternative.

## In code

```python
import torch.nn as nn
from torchvision import models

model = models.resnet50(weights="DEFAULT")              # pretrained on ImageNet
for p in model.parameters():
    p.requires_grad = False                             # freeze the backbone first
model.fc = nn.Linear(model.fc.in_features, num_classes) # new head for your classes
```

## Watch out for

- Using a different image preprocessing from the one the weights were trained with. Use the `transforms()` that come with the weights.
- Fine-tuning everything at once with a high learning rate. Train the new head first, then unfreeze the rest with a small learning rate.
