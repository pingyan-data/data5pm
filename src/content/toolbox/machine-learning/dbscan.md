---
title: DBSCAN
summary: A density-based clustering method that finds clusters of any shape and marks points in sparse areas as noise.
category: Clustering
status: seedling
created: 2026-10-25
order: 4
problem: My data has clusters that aren’t round, like routes on a map or curved patterns, plus scattered outliers. k-means forces every point into a group and cuts the shapes wrongly.
why: It defines a cluster as a dense region, so it follows any shape, finds the number of clusters by itself, and leaves outliers out instead of forcing them in. That makes it useful for both clustering and anomaly detection.
decides: A point is a core point if at least min_samples points lie within distance eps of it. Core points that are within eps of each other join the same cluster, and points near a core point join as border points. Everything else is labelled noise.
assumptions:
  - Clusters have roughly the same density. One eps can’t fit both a tight cluster and a loose one; OPTICS or HDBSCAN handle that.
  - Features are scaled, and distance means similarity.
related: [machine-learning/optics, machine-learning/k-means, machine-learning/hierarchical-clustering]
references:
  - title: Ester, Kriegel, Sander and Xu (1996), A density-based algorithm for discovering clusters in large spatial databases with noise. KDD.
  - title: GeeksforGeeks, DBSCAN clustering
    url: https://www.geeksforgeeks.org/machine-learning/dbscan-clustering-in-ml-density-based-clustering/
  - title: scikit-learn, DBSCAN
    url: https://scikit-learn.org/stable/modules/clustering.html#dbscan
tags: [unsupervised, clustering, density, anomaly-detection]
---

## How it works

Two settings define what “dense” means:

- `eps`: the radius of a point’s neighbourhood.
- `min_samples`: how many points must be inside that radius for the area to count as dense.

Every point then gets one of three roles:

| Role | Rule |
| --- | --- |
| Core point | Has at least `min_samples` points within `eps` (counting itself) |
| Border point | Not a core point, but within `eps` of one |
| Noise | Neither. Labelled −1. |

Clusters grow by chaining core points together, like spreading through connected crowds.

![On two curved groups with some scattered points, k-means cuts across the shapes, while DBSCAN follows each curve and marks the scattered points as noise](/images/toolbox/clustering-moons.svg)

## How it decides, step by step

With `eps = 0.5` km and `min_samples = 5`, a taxi pickup point with 8 other pickups within 500 m is a core point. A neighbouring pickup with only 3 nearby, but within 500 m of that core point, joins the same cluster as a border point. A lone pickup in the countryside, far from any core point, is noise.

**Choosing eps.** For each point, compute the distance to its k-th nearest neighbour (k = `min_samples`), sort these distances and plot them. Pick `eps` near the “knee”, where the curve suddenly rises.

## In code

```python
from sklearn.cluster import DBSCAN
from sklearn.preprocessing import StandardScaler

X_scaled = StandardScaler().fit_transform(X)
labels = DBSCAN(eps=0.3, min_samples=10).fit_predict(X_scaled)
n_noise = (labels == -1).sum()
```

## Watch out for

- Results are sensitive to `eps`. Small changes can merge two clusters or turn a cluster into noise.
- Very high-dimensional data, where all distances look alike. Reduce dimensions first, for example with PCA.
- For latitude and longitude, use the haversine distance (`metric="haversine"` with coordinates in radians), not plain Euclidean distance.
