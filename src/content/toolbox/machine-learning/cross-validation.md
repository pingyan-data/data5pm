---
title: Cross-validation
summary: Estimates how well a model will do on new data by training and testing it several times on different slices of the data.
category: Model evaluation
status: seedling
created: 2026-10-24
order: 1
problem: My model scores well on the data it was trained on. How will it actually do on data it has never seen, and which settings should I pick?
why: A single train/test split gives a noisy score that depends on which rows landed where. Rotating the test slice uses all the data for testing once, gives a more stable estimate, and shows how much the score varies.
assumptions:
  - Rows are independent. Repeated rows from the same customer, or time-ordered data, need group-aware or time-aware splits.
  - Everything learned from data, like scaling, imputation and feature selection, happens inside each fold. Otherwise information leaks from the test fold.
related: [machine-learning/classification-metrics, machine-learning/ridge-and-lasso, machine-learning/gradient-boosting]
references:
  - title: Hastie, Tibshirani and Friedman (2009), The Elements of Statistical Learning, 2nd edition, chapter 7, Model Assessment and Selection.
    url: https://hastie.su.domains/ElemStatLearn/
  - title: scikit-learn, cross-validation
    url: https://scikit-learn.org/stable/modules/cross_validation.html
tags: [evaluation, validation, overfitting]
---

## How it works

**k-fold cross-validation**, usually with $k = 5$ or 10:

1. Split the data into $k$ equal parts, called folds.
2. Train on $k-1$ folds and test on the one left out.
3. Repeat so every fold is the test fold once.
4. Report the average score and its spread.

Use it to compare models or to choose settings like the penalty in ridge regression. Keep a final **test set** aside that you touch only once at the very end; after choosing settings with cross-validation, the CV score is slightly optimistic.

| Data | Split to use |
| --- | --- |
| Classification, especially imbalanced | `StratifiedKFold`, keeps class shares the same in every fold |
| Several rows per customer, patient or store | `GroupKFold`, keeps each group in one fold |
| Time series | `TimeSeriesSplit`, always trains on the past and tests on the future |

## Example

Five folds give accuracies of 0.81, 0.84, 0.79, 0.83 and 0.82. The estimate is 0.82, give or take about 0.02. If a second model scores 0.825, the two are effectively tied.

## In code

```python
from sklearn.model_selection import cross_val_score, StratifiedKFold
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression

model = make_pipeline(StandardScaler(), LogisticRegression(max_iter=1000))   # scaling inside each fold
scores = cross_val_score(model, X, y, cv=StratifiedKFold(5, shuffle=True, random_state=0), scoring="roc_auc")
scores.mean(), scores.std()
```

## Watch out for

- Leakage, the classic mistake: scaling or selecting features on the full dataset before splitting. Put every step in a pipeline.
- Random folds on time series. The model gets to peek at the future and looks much better than it will be in production.
