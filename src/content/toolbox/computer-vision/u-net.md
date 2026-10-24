---
title: U-Net
summary: A segmentation network that labels every pixel, using a contracting path to understand the image and an expanding path, with shortcuts, to restore fine detail.
category: Segmentation
status: seedling
created: 2026-10-25
order: 1
problem: I don’t just need to know that something is in the image. I need its exact outline, pixel by pixel, like a tumour in a scan, buildings in a satellite image or a crack in a surface.
why: It combines “what” (deep, coarse features) with “where” (fine detail from early layers) through skip connections, which gives sharp boundaries. It works well even with a few hundred labelled images, which is why it became the standard in medical imaging and beyond.
decides: For every pixel, the network outputs a probability for each class. Each pixel is assigned the class with the highest probability, which together form the segmentation mask.
assumptions:
  - Pixel-level labels (masks) for training. These are slow to create, so expect to invest in labelling.
  - Strong data augmentation when data is limited, like flips, rotations and elastic deformations.
related: [computer-vision/r-cnn-family, deep-learning/convolutional-neural-network]
references:
  - title: Ronneberger, Fischer and Brox (2015), U-Net, convolutional networks for biomedical image segmentation. MICCAI.
  - title: segmentation_models_pytorch documentation
    url: https://smp.readthedocs.io/
tags: [computer-vision, segmentation]
---

## How it works

The shape of the network looks like a U:

1. **Encoder (down).** Convolutions and pooling shrink the image step by step while learning richer features. The network understands *what* is in the image but loses exact positions.
2. **Decoder (up).** Upsampling steps grow the feature maps back to the original size.
3. **Skip connections.** At each level, the decoder receives a copy of the encoder’s feature map from the same level. This brings back the fine spatial detail lost on the way down.
4. **Output.** A 1 × 1 convolution gives class scores for every pixel.

**Semantic vs instance segmentation.** U-Net labels pixels by class (“road”, “building”) but doesn’t separate two touching buildings. To get each object separately, use instance segmentation, like [Mask R-CNN](/toolbox/computer-vision/r-cnn-family/).

## How it decides, step by step

Segmenting roofs in an aerial photo for solar panel planning: the encoder recognises roof textures and shapes, the decoder rebuilds the full-size map, and the skip connections keep roof edges sharp. Each pixel gets a roof probability; pixels above 0.5 form the roof mask, and you can measure the area directly.

## In code

```python
import segmentation_models_pytorch as smp

model = smp.Unet(encoder_name="resnet34", encoder_weights="imagenet", in_channels=3, classes=1)
loss = smp.losses.DiceLoss(mode="binary")
```

## Watch out for

- Judging by pixel accuracy. If the object covers 2% of the image, predicting “background” everywhere is 98% accurate. Use Dice or IoU (intersection over union).
- Class imbalance. Dice loss, or combining it with cross-entropy, helps when the object of interest is small.
