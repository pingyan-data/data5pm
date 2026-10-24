---
title: k-means clustering
summary: Splits data into k groups by repeatedly assigning each point to its nearest centre and moving each centre to the middle of its group.
category: Clustering
status: seedling
created: 2026-10-24
order: 1
problem: I have customers but no labels. Are there natural groups among them, like budget shoppers, regular families and big spenders?
why: It is simple, fast on large data, and the result is easy to describe, since each group is summed up by its centre, an “average member”. It is the default first try for segmentation.
decides: Each point belongs to the cluster whose centre is closest. Training moves the centres to minimise the total squared distance from every point to its own centre, the within-cluster sum of squares.
assumptions:
  - Clusters are roughly round and of similar size. Long, curved or very uneven clusters are split badly.
  - Features are scaled and numeric. Distance has to mean similarity.
  - You choose k. The data won’t tell you directly.
related: [machine-learning/hierarchical-clustering, machine-learning/pca, machine-learning/k-nearest-neighbours]
references:
  - title: Hastie, Tibshirani and Friedman (2009), The Elements of Statistical Learning, 2nd edition, chapter 14, Unsupervised Learning.
    url: https://hastie.su.domains/ElemStatLearn/
  - title: scikit-learn, clustering
    url: https://scikit-learn.org/stable/modules/clustering.html
tags: [unsupervised, clustering, segmentation]
---

## How it works

1. Pick $k$ starting centres (the smart k-means++ way spreads them out).
2. **Assign** every point to its nearest centre.
3. **Update** every centre to the mean of the points assigned to it.
4. Repeat 2 and 3 until nothing changes.

Each round lowers the total squared distance, so it always settles, but possibly in a local best rather than the overall best. Running it several times from different starts and keeping the best result helps.

## How it decides, step by step

With $k = 3$ customer segments, a new customer is compared to the three centres, say (low spend, few visits), (medium, weekly) and (high, frequent). They join whichever centre is nearest after scaling. There is no probability, just a hard assignment.

**Choosing k.** Plot the within-cluster sum of squares against $k$ and look for the “elbow” where adding clusters stops helping much, or pick the $k$ with the highest silhouette score. Then check that the groups make business sense.

## In code

```python
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score

model = make_pipeline(StandardScaler(), KMeans(n_clusters=3, n_init=10, random_state=0))
labels = model.fit_predict(X)
silhouette_score(model[0].transform(X), labels)
```

## Watch out for

- Treating the clusters as discovered truth. k-means always returns k groups, even in data with no real groups.
- Categorical features. k-means needs numbers; use k-prototypes or another method for mixed data.
