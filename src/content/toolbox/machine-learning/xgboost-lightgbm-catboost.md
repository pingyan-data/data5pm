---
title: XGBoost, LightGBM and CatBoost
summary: Three fast, battle-tested libraries for gradient boosting, each with its own tricks for speed, missing values and categories.
category: Trees and ensembles
status: seedling
created: 2026-10-25
order: 4
problem: I’ve decided gradient boosting is the right model for my tabular data. Which library should I use, and what does each one do differently?
why: All three implement the same core idea, but they make different engineering choices. Knowing those choices tells you which one to try first. LightGBM for big data and speed, CatBoost for many categorical features with little tuning, XGBoost as the well-documented all-rounder.
decides: Like all gradient boosting, the prediction is a starting value plus the sum of every tree’s small correction. Inside each tree, XGBoost and LightGBM choose a split by how much it lowers the loss, using both the slope (gradient) and the curvature (hessian) of the loss, minus a penalty for complexity.
assumptions:
  - Hyperparameters are tuned with a validation set and early stopping.
  - The data is tabular. For images, text or audio, neural networks do better.
related: [machine-learning/gradient-boosting, machine-learning/decision-tree, machine-learning/random-forest]
references:
  - title: Chen and Guestrin (2016), XGBoost, a scalable tree boosting system. KDD.
  - title: Ke et al. (2017), LightGBM, a highly efficient gradient boosting decision tree. NeurIPS.
  - title: Prokhorenkova et al. (2018), CatBoost, unbiased boosting with categorical features. NeurIPS.
  - title: GeeksforGeeks, XGBoost
    url: https://www.geeksforgeeks.org/machine-learning/xgboost/
  - title: GeeksforGeeks, LightGBM
    url: https://www.geeksforgeeks.org/machine-learning/lightgbm-light-gradient-boosting-machine/
  - title: GeeksforGeeks, CatBoost
    url: https://www.geeksforgeeks.org/machine-learning/catboost-ml/
tags: [boosting, trees, tabular]
---

## How they differ

| | XGBoost | LightGBM | CatBoost |
| --- | --- | --- | --- |
| Tree growth | Level by level (balanced trees) | Leaf by leaf: always splits the leaf that helps most | Symmetric trees: the same question across a whole level |
| Speed trick | Histogram binning of features | Histograms, plus sampling rows with small gradients less (GOSS) and bundling sparse features (EFB) | Symmetric trees make prediction very fast |
| Categorical features | Supported natively in newer versions | Supported natively | Its main strength: ordered target statistics, built to avoid leaking the target |
| Missing values | Learns the best direction to send them at each split | Same idea | Handled by default |
| Good first choice when | You want the most widely used, well-documented option | Data is large and speed matters | Many categorical columns, little time to tune |

In practice, the accuracy differences are usually small once each is tuned. Pick one, tune it well, and spend the rest of your time on features.

## How it decides, step by step

XGBoost scores a candidate split by how much it improves the regularised loss. For each side of the split, it adds up the gradients $G$ (how wrong the current predictions are) and the hessians $H$ (how confident that direction is):

$$
\text{Gain} = \frac{1}{2}\left[\frac{G_L^2}{H_L + \lambda} + \frac{G_R^2}{H_R + \lambda} - \frac{(G_L + G_R)^2}{H_L + H_R + \lambda}\right] - \gamma
$$

In words: a split is good when it separates rows that need to be pushed up from rows that need to be pushed down. $\lambda$ shrinks leaf values to avoid overfitting, and $\gamma$ is the minimum gain needed to make a split at all. If the best gain is below zero, the tree stops growing there.

This is the boosting version of the [decision tree](/toolbox/machine-learning/decision-tree/)’s information gain: instead of purity, it measures how much the loss drops.

## In code

```python
import xgboost as xgb
import lightgbm as lgb
from catboost import CatBoostClassifier

xgb.XGBClassifier(n_estimators=2000, learning_rate=0.05, early_stopping_rounds=100)
lgb.LGBMClassifier(n_estimators=2000, learning_rate=0.05, num_leaves=31)
CatBoostClassifier(iterations=2000, learning_rate=0.05, cat_features=["city", "plan"])
# fit with eval_set=[(X_valid, y_valid)] so early stopping can work
```

## Watch out for

- LightGBM’s leaf-wise growth can overfit small datasets. Limit `num_leaves` and set `min_child_samples`.
- Target leakage through categorical encodings you build yourself. CatBoost’s built-in handling avoids this.
- Comparing libraries on default settings. Defaults differ a lot, so the comparison says little.
