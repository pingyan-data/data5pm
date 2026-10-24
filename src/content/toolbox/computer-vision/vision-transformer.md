---
title: Vision transformer (ViT)
summary: Applies the transformer from language models to images, by cutting an image into small patches and treating them like words.
category: Image classification
status: seedling
created: 2026-10-25
order: 2
problem: I want an image model that can relate distant parts of a picture directly, and that benefits from the same scaling and pretraining that made language models so strong.
why: Attention lets every patch look at every other patch from the first layer, so global context is easy to use. With large-scale pretraining, ViTs match or beat CNNs, and the same design connects naturally to text models in multimodal systems.
decides: The image becomes a sequence of patch embeddings plus a special classification token. Transformer layers let all patches exchange information through attention. The final state of the classification token goes through a small layer and softmax, and the highest-probability class wins.
assumptions:
  - Large-scale pretraining. ViTs have fewer built-in assumptions about images than CNNs, so trained from scratch on small datasets they do worse.
  - Enough compute. Attention cost grows quickly with the number of patches, so high-resolution images are expensive.
related: [deep-learning/transformer, computer-vision/cnn-architectures, computer-vision/clip]
references:
  - title: Stanford HAI, What is a vision transformer?
    url: https://hai.stanford.edu/ai-definitions/what-is-a-vit
  - title: Dosovitskiy et al. (2021), An image is worth 16x16 words, transformers for image recognition at scale. ICLR.
  - title: GeeksforGeeks, Top computer vision models
    url: https://www.geeksforgeeks.org/computer-vision/top-computer-vision-models/
tags: [computer-vision, transformer, classification]
---

## How it works

1. **Patches.** Cut a 224 × 224 image into 16 × 16 patches, giving 14 × 14 = 196 patches.
2. **Embeddings.** Flatten each patch and map it to a vector, like a word embedding.
3. **Position.** Add a position embedding so the model knows where each patch was.
4. **Classification token.** Add one extra learned token at the start, whose job is to collect information about the whole image.
5. **Transformer encoder.** The same layers as in a [transformer](/toolbox/deep-learning/transformer/): self-attention plus a feed-forward network, repeated.
6. **Head.** A small layer on the classification token outputs the class probabilities.

Popular variants: **DeiT** trains well with less data, using distillation from a CNN teacher. **Swin Transformer** computes attention inside local windows that shift between layers, which makes it efficient for high-resolution images and good for detection and segmentation.

## How it decides, step by step

For a photo of a tram on a Stockholm street, the patches containing the tram’s front attend strongly to patches with rails and overhead wires, building a shared representation of “tram”. The classification token gathers this across layers, and the head outputs, say, 0.93 for “streetcar”.

## In code

```python
from transformers import pipeline

classify = pipeline("image-classification", model="google/vit-base-patch16-224")
classify("tram.jpg")
```

## Watch out for

- Small datasets without a pretrained model. A fine-tuned CNN is often better and cheaper here.
- Resolution changes. Fine-tuning at a different image size needs the position embeddings to be resized (interpolated); most libraries do this, but check.
