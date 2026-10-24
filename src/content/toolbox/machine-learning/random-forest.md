---
title: Random forest
summary: Many decision trees, each trained on a random sample of rows and features, combined by voting or averaging.
category: Trees and ensembles
status: seedling
created: 2026-10-24
order: 2
problem: A single decision tree is readable but unstable and not very accurate. I want something much more reliable that still needs little tuning.
why: Averaging many different, noisy trees cancels out much of their individual error. It works well out of the box on tabular data, handles mixed feature types without scaling, and is hard to badly overfit.
decides: Every tree makes its own prediction for the new point by following its questions to a leaf. The forest averages those predictions, the average of predicted class probabilities for classification, the average value for regression. The class with the highest average probability wins.
assumptions:
  - The trees are different enough from each other. That is what the random rows and random features are for.
  - Enough trees are used, usually a few hundred. More trees never hurt accuracy, only speed.
related: [machine-learning/decision-tree, machine-learning/gradient-boosting, statistics/bootstrap-confidence-interval]
references:
  - title: Breiman (2001), Random forests. Machine Learning.
  - title: Hastie, Tibshirani and Friedman (2009), The Elements of Statistical Learning, 2nd edition, chapter 15, Random Forests.
    url: https://hastie.su.domains/ElemStatLearn/
  - title: scikit-learn, ensembles
    url: https://scikit-learn.org/stable/modules/ensemble.html
tags: [classification, regression, supervised, trees, ensemble]
---

## How it works

Two kinds of randomness make each tree different:

1. **Random rows.** Each tree is trained on a bootstrap sample: rows drawn with replacement, so about a third of the data is left out of each tree.
2. **Random features.** At every split, a tree may only choose among a random subset of features, often the square root of the total for classification. This stops every tree from starting with the same strong feature.

Each tree is grown deep and is individually overfitted. Averaging them reduces the variance without adding much bias.

## How it decides, step by step

A forest of 300 trees looks at a new customer. Each tree follows its own questions to a leaf and returns a churn probability. The forest averages the 300 probabilities, say 0.71, and predicts churn because it is above 0.5.

Inside each tree, splits are chosen exactly as in a single [decision tree](/toolbox/machine-learning/decision-tree/), by Gini or entropy, just among the random subset of features.

## In code

```python
from sklearn.ensemble import RandomForestClassifier
from sklearn.inspection import permutation_importance

rf = RandomForestClassifier(n_estimators=300, min_samples_leaf=5, oob_score=True, n_jobs=-1)
rf.fit(X_train, y_train)
rf.oob_score_                                    # accuracy on rows each tree didn’t see
permutation_importance(rf, X_test, y_test, n_repeats=10)
```

## Watch out for

- Losing interpretability. You can no longer read the rules; use permutation importance or SHAP values to explain it.
- Extrapolation. A forest can’t predict values outside the range it saw in training, which matters for trends over time.
