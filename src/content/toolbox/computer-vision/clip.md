---
title: CLIP
summary: A model that learns to match images with their text descriptions, so it can classify or search images using plain words, without task-specific training.
category: Vision and language
status: seedling
created: 2026-10-25
order: 1
problem: I want to sort or search images by concepts described in words, like “a photo of a damaged parcel”, without collecting and labelling a training set for every new category.
why: Because it learned from hundreds of millions of image–caption pairs, CLIP connects visual content to language. New categories are just new text prompts. It is also the image encoder behind many multimodal and image generation systems.
decides: An image encoder and a text encoder turn the image and each candidate label into vectors in the same space. It computes the cosine similarity between the image and each label’s text, turns the similarities into probabilities with softmax, and the most similar label wins.
assumptions:
  - Your concepts are describable in words and appear in ordinary internet images. Specialised domains, like medical scans, need adapted models.
  - Prompts are phrased like captions (“a photo of a …”), which usually works better than a bare label.
related: [llms-and-agents/zero-shot-learning, computer-vision/vision-transformer]
references:
  - title: Radford et al. (2021), Learning transferable visual models from natural language supervision. ICML.
  - title: GeeksforGeeks, Top computer vision models
    url: https://www.geeksforgeeks.org/computer-vision/top-computer-vision-models/
  - title: OpenCLIP
    url: https://github.com/mlfoundations/open_clip
tags: [computer-vision, multimodal, zero-shot, embeddings]
---

## How it works

**Training, contrastive learning.** Take a batch of images and their captions. Encode all of them. The training goal is simple: each image’s vector should be most similar to its own caption’s vector, and dissimilar to every other caption in the batch. Repeated over hundreds of millions of pairs, images and texts that mean the same thing end up close together.

**Using it.** Because images and text share one space, you can:

- **Classify zero-shot:** compare an image with prompts for each label.
- **Search:** find the images closest to a text query, or the images most similar to another image.
- **Embed:** use the image vectors as features for your own classifier, which often needs very few labels.

## How it decides, step by step

Sorting returned parcels by condition:

1. Prompts: “a photo of an undamaged parcel”, “a photo of a crushed parcel”, “a photo of a wet parcel”.
2. The image and each prompt are encoded.
3. Cosine similarities might be 0.21, 0.29 and 0.23. After scaling and softmax, “crushed” gets the highest probability.
4. Prediction: crushed. No training images of parcels were needed.

## In code

```python
from transformers import pipeline

clf = pipeline("zero-shot-image-classification", model="openai/clip-vit-base-patch32")
clf("parcel.jpg", candidate_labels=["an undamaged parcel", "a crushed parcel", "a wet parcel"])
```

## Watch out for

- Bias from internet data. CLIP picks up stereotypes and is unreliable for sensitive attributes. Don’t use it to classify people.
- Fine detail and counting. It is good at overall concepts, weaker at counting objects or reading small text.
