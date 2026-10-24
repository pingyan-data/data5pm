---
title: k-nearest neighbours
summary: Classifies a new point by looking at the k most similar points in the training data and taking a vote.
category: Classification
status: seedling
created: 2026-10-24
order: 3
problem: I want to predict something for a new case by finding cases that look like it, for example recommending based on similar customers.
why: It needs no training and makes no assumption about the shape of the boundary between classes, so it can follow complicated patterns. It is also easy to explain, “these five customers were most similar, and three of them churned”.
decides: It measures the distance from the new point to every training point, takes the k closest, and lets them vote. The majority class wins, and the share of votes is the probability. For regression, it averages their values.
assumptions:
  - Distance means similarity. Features must be scaled, or the one with the largest numbers dominates.
  - There are not too many features. In high dimensions, all points end up roughly equally far apart and “nearest” loses its meaning.
related: [machine-learning/k-means, machine-learning/cross-validation]
references:
  - title: Hastie, Tibshirani and Friedman (2009), The Elements of Statistical Learning, 2nd edition, chapters 2 and 13.
    url: https://hastie.su.domains/ElemStatLearn/
  - title: scikit-learn, nearest neighbours
    url: https://scikit-learn.org/stable/modules/neighbors.html
tags: [classification, supervised, distance]
---

## How it works

1. Scale the features.
2. For a new point, compute its distance to all training points, usually the straight-line (Euclidean) distance.
3. Take the $k$ closest.
4. Vote, or average for a regression.

The only real choice is $k$. A small $k$ follows every wiggle in the data and overfits; a large $k$ smooths too much. Choose it with cross-validation.

## How it decides, step by step

A new customer has 2 years of tenure and spends 300 kr a month. With $k = 5$, the five most similar customers in the training data are: 3 churned, 2 stayed. Prediction: churn, with probability 3 / 5 = 0.6.

## In code

```python
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.neighbors import KNeighborsClassifier

knn = make_pipeline(StandardScaler(), KNeighborsClassifier(n_neighbors=5)).fit(X_train, y_train)
knn.predict_proba(X_test)
```

## Watch out for

- Prediction is slow on big data, since every prediction compares against all stored points.
- Unscaled features. Income in kronor will swamp age in years.
