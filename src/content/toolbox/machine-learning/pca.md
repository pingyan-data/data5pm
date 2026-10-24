---
title: Principal component analysis
summary: Finds a few new directions in the data that capture most of its variation, to compress, visualise or clean up many correlated features.
category: Dimensionality reduction
status: seedling
created: 2026-10-24
order: 1
problem: I have dozens of correlated features. I want to see the data in 2D, remove redundancy, or feed a model fewer, cleaner inputs.
why: Correlated features often move together because of a few underlying factors. PCA finds those directions, ordered by how much variation they explain, so a handful of components can keep most of the information.
decides: It chooses directions one at a time. The first component is the direction along which the data varies most. Each next one varies most among directions at right angles to the previous ones. Each point’s new coordinates are its projections onto these directions.
assumptions:
  - Features are standardised, unless they share the same unit and scale. Otherwise the feature with the biggest numbers dominates.
  - The important structure is linear. PCA can’t unroll curved patterns.
  - High variance means important. That isn’t always true, and a small-variance direction can still matter for prediction.
related: [machine-learning/k-means, machine-learning/ridge-and-lasso]
references:
  - title: Hastie, Tibshirani and Friedman (2009), The Elements of Statistical Learning, 2nd edition, section 14.5, Principal components.
    url: https://hastie.su.domains/ElemStatLearn/
  - title: scikit-learn, PCA
    url: https://scikit-learn.org/stable/modules/decomposition.html#pca
tags: [unsupervised, dimensionality-reduction]
---

## How it works

1. Standardise the features.
2. Compute the covariance matrix: how every pair of features moves together.
3. Its eigenvectors are the principal components (the directions), and its eigenvalues say how much variance each direction carries.
4. Keep the top few components and project the data onto them.

The **explained variance ratio** shows how much of the total variation each component keeps. A common rule is to keep enough components to reach 80 to 95%.

## How it decides, step by step

Ten economic indicators per Swedish municipality, like income, education level and house prices, are strongly correlated. PCA might find that the first component, a mix of all three that you could call “affluence”, explains 55% of the variation, and the second, mostly population growth, explains 20%. Plotting municipalities on these two components shows 75% of the picture in one chart.

## In code

```python
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA

pca = make_pipeline(StandardScaler(), PCA(n_components=0.9))   # keep 90% of variance
Z = pca.fit_transform(X)
pca[-1].explained_variance_ratio_
pca[-1].components_            # how much each feature contributes to each component
```

## Watch out for

- Components are blends of features, so they are hard to name and explain to others.
- Fitting PCA on all the data before a train/test split leaks information. Put it in a pipeline.
