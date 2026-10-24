---
title: R-CNN family
summary: Two-stage object detectors that first propose regions likely to contain objects, then classify each region and refine its box. Mask R-CNN also outlines each object.
category: Object detection
status: seedling
created: 2026-10-25
order: 1
problem: I need to find every object in an image, say what each one is and where it is, with high accuracy. Sometimes I also need the exact outline of each object.
why: Splitting detection into “where might objects be?” and “what is it, exactly where?” gives very accurate boxes, especially for small or overlapping objects. Mask R-CNN adds per-object masks with little extra cost, so it is a standard choice for instance segmentation.
decides: Stage one, a region proposal network scores many candidate boxes for “is there an object here?” and keeps the most likely. Stage two classifies each kept region and adjusts its box. Finally, non-maximum suppression removes duplicate boxes for the same object, keeping the highest-scoring one.
assumptions:
  - Speed isn’t the top priority. Two-stage detectors are usually slower than one-stage ones like YOLO.
  - Enough labelled boxes, or masks for Mask R-CNN, for fine-tuning.
related: [computer-vision/yolo, computer-vision/u-net, computer-vision/cnn-architectures]
references:
  - title: Girshick et al. (2014), Rich feature hierarchies for accurate object detection and semantic segmentation. CVPR.
  - title: Ren, He, Girshick and Sun (2015), Faster R-CNN, towards real-time object detection with region proposal networks. NeurIPS.
  - title: He, Gkioxari, Dollár and Girshick (2017), Mask R-CNN. ICCV.
  - title: GeeksforGeeks, Top computer vision models
    url: https://www.geeksforgeeks.org/computer-vision/top-computer-vision-models/
tags: [computer-vision, object-detection, segmentation]
---

## How it evolved

| Version | Year | What changed |
| --- | --- | --- |
| R-CNN | 2014 | Proposes about 2,000 regions with a classic algorithm and runs a CNN on each one separately. Accurate but very slow. |
| Fast R-CNN | 2015 | Runs the CNN once on the whole image and cuts each region’s features from the shared feature map (RoI pooling). Much faster. |
| Faster R-CNN | 2015 | Replaces the slow proposal algorithm with a small network, the region proposal network, that shares features with the detector. Close to real time. |
| Mask R-CNN | 2017 | Adds a branch that predicts a pixel mask for each detected object, and improves alignment with RoIAlign. |

## How it decides, step by step

On a photo of a busy street:

1. The backbone CNN produces a feature map of the whole image.
2. The region proposal network slides over it and, at each position, scores a set of anchor boxes of different sizes for “object or not”. The top few hundred are kept.
3. For each proposal, the second stage outputs class probabilities (car 0.96, bus 0.02, …) and small corrections to the box edges.
4. Several boxes may cover the same car. **Non-maximum suppression** keeps the highest-scoring box and drops others that overlap it heavily.
5. Mask R-CNN additionally outputs, for each kept box, which pixels inside belong to the car.

## In code

```python
from torchvision.models.detection import maskrcnn_resnet50_fpn_v2

model = maskrcnn_resnet50_fpn_v2(weights="DEFAULT").eval()
outputs = model([image_tensor])          # boxes, labels, scores, masks
```

## Watch out for

- Measuring with accuracy. Detection uses mean average precision (mAP) at given overlap thresholds.
- The score threshold for keeping detections is a business choice: lower catches more objects but adds false alarms.
