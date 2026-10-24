---
title: Affinity propagation
summary: A clustering method where points pass messages to each other until a few real data points emerge as representatives, called exemplars.
category: Clustering
status: seedling
created: 2026-10-25
order: 3
problem: I want to group items and have each group represented by an actual, typical member, like one real product per group, without choosing the number of groups in advance.
why: Each cluster centre is a real data point, which is easy to show and explain. It finds the number of clusters itself and can work from any similarity score, not just distances between number vectors.
decides: Every point keeps sending two kinds of messages. Responsibility says how well suited another point would be as my exemplar, compared with the alternatives. Availability says how appropriate it would be for me to choose that point, given support from others. When the messages settle, each point joins the exemplar with the highest sum of the two.
assumptions:
  - The dataset is small to medium. It stores similarities for every pair of points, so memory grows with the square of the number of points.
  - The preference setting is tuned. It controls how many exemplars appear.
related: [machine-learning/k-means, machine-learning/hierarchical-clustering]
references:
  - title: Frey and Dueck (2007), Clustering by passing messages between data points. Science.
  - title: GeeksforGeeks, Affinity propagation
    url: https://www.geeksforgeeks.org/machine-learning/affinity-propagation/
  - title: scikit-learn, affinity propagation
    url: https://scikit-learn.org/stable/modules/clustering.html#affinity-propagation
tags: [unsupervised, clustering]
---

## How it works

It starts from a similarity between every pair of points, by default the negative squared distance, so closer means more similar.

Each point’s similarity to itself is the **preference**: how willing it is to be an exemplar. Higher preferences give more clusters. scikit-learn uses the median similarity by default, which usually gives a moderate number.

The algorithm then repeats two updates until they stop changing:

- **Responsibility** $r(i, k)$, sent from point $i$ to candidate $k$: how much better $k$ fits $i$ than $i$’s best other option.
- **Availability** $a(i, k)$, sent from $k$ back to $i$: how much support $k$ has from other points to be an exemplar.

A damping factor between 0.5 and 1 slows the updates to stop them from oscillating.

## How it decides, step by step

Grouping 200 products by how often they are bought together: early on, every product is a possible exemplar. Popular products that many others are similar to gather high availability. After the messages settle, maybe 12 products are exemplars, and every other product joins the exemplar where responsibility plus availability is highest. You can now describe each group by naming one real product.

## In code

```python
from sklearn.cluster import AffinityPropagation

ap = AffinityPropagation(damping=0.7, random_state=0).fit(X_scaled)
labels = ap.labels_
exemplars = ap.cluster_centers_indices_     # row numbers of the representative points
```

## Watch out for

- If it doesn’t converge, raise `damping` or `max_iter`.
- The number of clusters depends heavily on the preference, so “it finds k automatically” only holds once that setting is sensible.
