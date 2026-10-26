---
title: Semi-supervised learning
summary: Training a model on a few labelled examples plus many unlabelled ones, using the shape of the unlabelled data to fill in the gaps.
category: Classification
status: seedling
created: 2026-10-26
order: 4
problem: I have 100,000 support tickets but only 200 of them are tagged with a category, and tagging more is slow and expensive. Can the untagged ones help my classifier?
why: Labels are often the bottleneck, while unlabelled data is cheap and plentiful. If similar examples tend to share a label, the unlabelled data shows where the natural groups and gaps are. The model can then draw its boundary through the gaps instead of guessing from a handful of points.
decides: In self-training, a classifier trained on the labelled data predicts a probability for each unlabelled example. Predictions above a confidence threshold, say 90%, become pseudo-labels, the model is retrained on the larger set, and the loop repeats. In label spreading, each point takes the label most common among its close neighbours in a similarity graph, so labels flow outwards from the labelled points until every point has one.
assumptions:
  - Points that are close together, or in the same cluster, usually share a label. If the classes overlap heavily, the unlabelled data has nothing useful to say.
  - The unlabelled data comes from the same population and the same set of classes as the labelled data. Unrelated or out-of-scope examples can make the model worse.
  - The few labels you have are correct and cover every class. Errors and missing classes spread to everything the model labels itself.
related: [machine-learning/k-nearest-neighbours, machine-learning/support-vector-machine, machine-learning/dbscan]
references:
  - title: IBM, What is semi-supervised learning?
    url: https://www.ibm.com/think/topics/semi-supervised-learning
  - title: van Engelen and Hoos (2020), A survey on semi-supervised learning. Machine Learning.
  - title: scikit-learn, Semi-supervised learning
    url: https://scikit-learn.org/stable/modules/semi_supervised.html
tags: [semi-supervised, classification, labels]
---

## How it works

Semi-supervised learning sits between supervised learning, where every example has a label, and unsupervised learning, where none do.

It rests on one idea, the **cluster assumption**: points in the same group usually belong to the same class. A few related versions are useful to know:

| Assumption | Meaning |
| --- | --- |
| Smoothness | Points that are close together have the same label |
| Low density | The boundary between classes runs through empty space, not through a crowd of points |
| Manifold | High-dimensional data, like images, really lies on a simpler, lower-dimensional surface, and points on the same surface share a label |

The methods use the unlabelled data in three main ways:

| Approach | How | Examples |
| --- | --- | --- |
| Pseudo-labelling | The model labels data for itself and retrains | Self-training, co-training (two models label for each other, each using a different view of the data, like the audio and the image of a video) |
| Graph-based | Labels spread through a graph of similar points | Label propagation, label spreading |
| Learn features first | Learn a good representation from all the data, then train a simple classifier on the few labels | Autoencoders, cluster-then-label, pretrained models |

The last approach is how most modern systems work. A model pretrained with **self-supervised learning**, which invents its own training task from unlabelled data like predicting a hidden word, supplies the features. A small labelled set then trains the classifier on top. See [foundation models](/toolbox/llms-and-agents/foundation-models/).

**Active learning** is a close cousin. Instead of labelling data automatically, it picks the unlabelled examples a human should label next, the ones the model is least sure about.

## How it decides, step by step

Self-training on the support tickets:

1. Train a classifier on the 200 tagged tickets.
2. Predict the 99,800 untagged ones. Suppose 6,000 get a probability above 0.9 for some category.
3. Add those 6,000 as pseudo-labelled examples and retrain on 6,200 tickets.
4. Predict the remaining tickets again. With more training data, more of them now pass the threshold.
5. Stop when no new ticket passes, or after a fixed number of rounds.

The threshold is the key setting. Set it too low and early mistakes become training data, so the model learns from its own errors.

## Example

The half-moons dataset has two interleaving crescents, 1,000 points in total. Keep the labels of only 10 points, 5 from each crescent.

An SVM trained on those 10 points draws a smooth curve between them and gets 89% of all points right. It can’t see that the crescents bend.

Label spreading uses all 1,000 points. Labels flow along each crescent, from neighbour to neighbour, and the result is 98% correct with the same 10 labels.

## In code

```python
import numpy as np
from sklearn.datasets import make_moons
from sklearn.svm import SVC
from sklearn.semi_supervised import LabelSpreading

X, y = make_moons(n_samples=1000, noise=0.1, random_state=0)
rng = np.random.default_rng(0)
labelled = np.concatenate([rng.choice(np.where(y == c)[0], 5, replace=False) for c in (0, 1)])
y_train = np.full_like(y, -1)                 # -1 means "no label"
y_train[labelled] = y[labelled]               # keep only 10 labels out of 1,000

supervised = SVC().fit(X[labelled], y[labelled])
spreading = LabelSpreading(kernel="rbf", gamma=20).fit(X, y_train)

print((supervised.predict(X) == y).mean())    # 0.89
print((spreading.predict(X) == y).mean())     # 0.98
```

For self-training, scikit-learn’s `SelfTrainingClassifier` wraps any classifier that outputs probabilities.

## Watch out for

- Evaluating on pseudo-labels. Keep a separate, human-labelled test set, or you only measure how well the model agrees with itself.
- Assuming it always helps. When the classes overlap, or the unlabelled data is from somewhere else, semi-supervised learning can do worse than supervised learning on the labels alone. Always compare with that baseline.
- Rare classes. With only a few labels, a small class can be swamped during pseudo-labelling as the big classes take over its neighbourhood.
- Skipping the cheapest option. Often, labelling a few hundred more examples, chosen with active learning, beats a clever method.
