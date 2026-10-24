---
title: YOLO
summary: A one-stage object detector that predicts all boxes and classes in a single pass over the image, fast enough for live video.
category: Object detection
status: seedling
created: 2026-10-25
order: 2
problem: I need to detect objects in real time, like counting people at an entrance, spotting vehicles in traffic video or running on a small device.
why: Doing everything in one pass makes YOLO very fast while staying accurate enough for most practical uses. The Ultralytics releases also make it easy to train on your own data and deploy.
decides: The network looks at the whole image once and, at many positions and scales, predicts boxes with an objectness score and class probabilities. Boxes below a confidence threshold are dropped, and non-maximum suppression removes duplicates of the same object.
assumptions:
  - Labelled boxes for your own classes, typically a few hundred images per class to start.
  - Objects are not extremely small compared with the image. Very small objects remain harder for one-stage detectors.
related: [computer-vision/r-cnn-family, computer-vision/cnn-architectures]
references:
  - title: Redmon, Divvala, Girshick and Farhadi (2016), You only look once, unified, real-time object detection. CVPR.
  - title: GeeksforGeeks, Top computer vision models
    url: https://www.geeksforgeeks.org/computer-vision/top-computer-vision-models/
  - title: Ultralytics documentation
    url: https://docs.ultralytics.com/
tags: [computer-vision, object-detection, real-time]
---

## How it works

The original YOLO divided the image into a grid. Each grid cell predicted a few boxes, how confident it was that an object sat there, and the class. Everything came out of one network, in one forward pass.

Later versions kept the one-pass idea and improved accuracy: predictions at several scales (so small and large objects are both caught), better backbones, and, in recent versions, no fixed anchor boxes. Versions are numbered (v3, v5, v8 and onwards) and come from different teams, so newer numbers aren’t always strictly better for your data.

**One-stage vs two-stage.** [R-CNN-style](/toolbox/computer-vision/r-cnn-family/) detectors first propose regions, then classify them. YOLO skips the proposal step. That is the main reason it is faster.

## How it decides, step by step

On one frame of traffic video:

1. The network outputs thousands of candidate boxes, each with a confidence and class probabilities.
2. Boxes with confidence below, say, 0.25 are dropped.
3. Overlapping boxes for the same object are reduced to one by non-maximum suppression.
4. What remains, like “car 0.91 at (x, y, w, h)”, is drawn on the frame, about 30 or more times per second.

## In code

```python
from ultralytics import YOLO

model = YOLO("yolo11n.pt")                         # small pretrained model
results = model("street.jpg", conf=0.25)
model.train(data="my_dataset.yaml", epochs=50)     # fine-tune on your own classes
```

## Watch out for

- Licensing. The Ultralytics code is AGPL-licensed, which affects commercial use. Check before building a product on it.
- Small objects and crowded scenes. Increase the input image size, or consider a two-stage detector.
