---
title: Hierarchical clustering
summary: Builds a tree of clusters by merging small groups upwards or splitting big ones downwards, so you can cut it at any number of clusters.
category: Clustering
status: seedling
created: 2026-10-24
updated: 2026-10-25
order: 2
problem: I want to see how items group together at every level of detail, without fixing the number of clusters in advance.
why: The result, a dendrogram, shows the whole structure at once, including which items are close, which groups merge late, and how many clusters seem natural. It works with any distance measure, including for non-numeric data.
decides: The common bottom-up version starts with every point as its own cluster and repeatedly merges the two closest clusters. “Closest” is set by the linkage rule. Cutting the tree at a chosen height gives the final clusters.
assumptions:
  - The dataset is small to medium, up to some tens of thousands of points. It needs all pairwise distances.
  - The distance and linkage chosen match what “similar” means for your problem.
related: [machine-learning/k-means, machine-learning/affinity-propagation, machine-learning/dbscan]
references:
  - title: Hastie, Tibshirani and Friedman (2009), The Elements of Statistical Learning, 2nd edition, section 14.3.12, Hierarchical clustering.
    url: https://hastie.su.domains/ElemStatLearn/
  - title: SciPy, hierarchical clustering
    url: https://docs.scipy.org/doc/scipy/reference/cluster.hierarchy.html
  - title: GeeksforGeeks, Hierarchical clustering
    url: https://www.geeksforgeeks.org/machine-learning/hierarchical-clustering/
  - title: GeeksforGeeks, Agglomerative clustering with scikit-learn
    url: https://www.geeksforgeeks.org/machine-learning/implementing-agglomerative-clustering-using-sklearn/
  - title: GeeksforGeeks, Agglomerative vs divisive clustering
    url: https://www.geeksforgeeks.org/machine-learning/difference-between-agglomerative-clustering-and-divisive-clustering/
tags: [unsupervised, clustering]
---

## How it works

Hierarchical clustering is a **connectivity-based** method: clusters are built from how close points are to each other. It comes in two directions.

| | Agglomerative (bottom-up) | Divisive (top-down) |
| --- | --- | --- |
| Starts with | Every point as its own cluster | All points in one cluster |
| Each step | Merges the two closest clusters | Splits one cluster in two |
| In practice | The common choice, in SciPy and scikit-learn | Rarer; bisecting k-means is a practical version |

The rest of this page describes the agglomerative version.

Start with $n$ clusters of one point each. At every step, merge the two closest clusters, until only one is left. The order and height of the merges form the dendrogram.

The **linkage** decides how far apart two clusters are:

| Linkage | Distance between clusters | Tends to give |
| --- | --- | --- |
| Single | The closest pair of points | Long chains; sensitive to noise |
| Complete | The farthest pair of points | Compact clusters of similar size |
| Average | The average over all pairs | A compromise |
| Ward | The increase in within-cluster variance if merged | Round, even clusters, like k-means. A good default for numeric data. |

## How it decides, step by step

Five stores with sales profiles. Stores A and B are most similar and merge first, then D and E, then C joins D and E. At the top, the two groups merge. Cutting the dendrogram just below that last merge gives two clusters, {A, B} and {C, D, E}. A long vertical gap before a merge suggests a natural place to cut.

## In code

```python
from scipy.cluster.hierarchy import linkage, fcluster, dendrogram

Z = linkage(X_scaled, method="ward")
dendrogram(Z)                                   # draw the tree
labels = fcluster(Z, t=3, criterion="maxclust")   # cut into 3 clusters

from sklearn.cluster import AgglomerativeClustering, BisectingKMeans
AgglomerativeClustering(n_clusters=3, linkage="ward").fit_predict(X_scaled)
BisectingKMeans(n_clusters=3, random_state=0).fit_predict(X_scaled)   # divisive
```

## Watch out for

- Merges can’t be undone. An early bad merge stays in the final result.
- Like k-means, scale numeric features first.
