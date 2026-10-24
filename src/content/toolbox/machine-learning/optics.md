---
title: OPTICS
summary: A density-based clustering method like DBSCAN that also finds clusters of different densities, by ordering points by how reachable they are.
category: Clustering
status: seedling
created: 2026-10-25
order: 5
problem: My data has both tight and loose clusters, like dense city centres and sparse suburbs. DBSCAN with one radius either merges the dense ones or loses the sparse ones.
why: It doesn’t commit to a single radius. It orders the points so that dense regions show up as valleys in a reachability plot, at whatever density they have. You can then read clusters at several density levels from one run.
decides: It visits points in order, always moving next to the closest unvisited point, and records each point’s reachability distance, roughly how far it is from a dense area. Clusters are the valleys in that sequence, where reachability stays low, and a steep rise marks the start of a new cluster or noise.
assumptions:
  - Distance means similarity, and features are scaled.
  - The dataset is not huge. OPTICS is slower than DBSCAN.
related: [machine-learning/dbscan, machine-learning/hierarchical-clustering]
references:
  - title: Ankerst, Breunig, Kriegel and Sander (1999), OPTICS, ordering points to identify the clustering structure. SIGMOD.
  - title: GeeksforGeeks, OPTICS clustering
    url: https://www.geeksforgeeks.org/machine-learning/ml-optics-clustering/
  - title: scikit-learn, OPTICS
    url: https://scikit-learn.org/stable/modules/clustering.html#optics
tags: [unsupervised, clustering, density]
---

## How it works

OPTICS uses two distances for each point:

- **Core distance**: the smallest radius that would make the point a core point, the distance to its `min_samples`-th nearest neighbour.
- **Reachability distance** of a point from a core point: the larger of that core distance and the actual distance between the two points.

It walks through the data, always expanding from the most reachable next point, and records the reachability of each point in the order visited. Plotting that sequence gives the **reachability plot**: dense clusters appear as deep valleys, sparse ones as shallow valleys, and noise as high peaks.

## How it decides, step by step

Picture the reachability plot for customer locations in Stockholm. A deep, narrow valley is the dense inner city; a wider, shallower valley is a suburb; tall spikes between them are isolated customers. The `xi` setting tells OPTICS how steep a rise must be to end a cluster. Alternatively, cutting the plot at one height gives exactly what DBSCAN would with that `eps`.

## In code

```python
from sklearn.cluster import OPTICS

model = OPTICS(min_samples=10, xi=0.05).fit(X_scaled)
labels = model.labels_
reachability = model.reachability_[model.ordering_]     # plot this
```

## Watch out for

- The reachability plot is the real output. Look at it before trusting the automatic labels.
- HDBSCAN (`sklearn.cluster.HDBSCAN`) solves the same varying-density problem, is usually faster, and is often the easier choice today.
