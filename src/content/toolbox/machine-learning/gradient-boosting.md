---
title: Gradient boosting
summary: Builds small decision trees one after another, each one correcting the errors the previous trees still make.
category: Trees and ensembles
status: seedling
created: 2026-10-24
order: 3
problem: I need the most accurate model I can get on tabular data, like predicting demand, prices or default risk.
why: On structured, tabular data, gradient-boosted trees (XGBoost, LightGBM, CatBoost) are usually the most accurate method available. They handle missing values and mixed features, and they win most tabular competitions.
decides: The prediction is a sum. It starts from a simple guess, like the average, and every tree adds a small correction, scaled down by the learning rate. For classification, the final sum is a score that goes through a sigmoid to become a probability, as in logistic regression.
assumptions:
  - It is tuned and stopped early on validation data. Unlike a random forest, adding more trees eventually overfits.
  - There is enough data. On small datasets, simpler models are often just as good and easier to trust.
related: [machine-learning/decision-tree, machine-learning/random-forest, machine-learning/cross-validation]
references:
  - title: Friedman (2001), Greedy function approximation, a gradient boosting machine. The Annals of Statistics.
  - title: Hastie, Tibshirani and Friedman (2009), The Elements of Statistical Learning, 2nd edition, chapter 10, Boosting and Additive Trees.
    url: https://hastie.su.domains/ElemStatLearn/
  - title: scikit-learn, HistGradientBoosting
    url: https://scikit-learn.org/stable/modules/ensemble.html#histogram-based-gradient-boosting
tags: [classification, regression, supervised, trees, ensemble, boosting]
---

## How it works

1. Start with a simple prediction for everyone, like the average price.
2. Compute the errors (residuals) of the current model.
3. Fit a small tree, often only a few levels deep, to predict those errors.
4. Add that tree to the model, multiplied by a small **learning rate** like 0.1.
5. Repeat hundreds of times, stopping when the error on validation data stops improving.

“Gradient” refers to the general version: instead of plain residuals, each tree fits the direction that lowers the loss fastest, which works for any loss, like log loss for classification.

A random forest builds independent trees and averages them. Boosting builds dependent trees and adds them up. Forests mainly reduce variance; boosting mainly reduces bias.

## How it decides, step by step

Predicting a flat’s price:

- Start: the average price, 3,000,000 kr.
- Tree 1 sees this flat is bigger than average and predicts a residual of +500,000. With learning rate 0.1, the prediction becomes 3,050,000.
- Tree 2 sees it is far from the centre and predicts −200,000. The prediction becomes 3,030,000.
- … after 400 trees, the sum of all these small steps is the final prediction.

## In code

```python
from sklearn.ensemble import HistGradientBoostingClassifier

gb = HistGradientBoostingClassifier(learning_rate=0.05, max_iter=1000, early_stopping=True)
gb.fit(X_train, y_train)

# the popular libraries work the same way
# import lightgbm as lgb; lgb.LGBMClassifier(n_estimators=1000, learning_rate=0.05)
```

## Watch out for

- Tuning on the test set. Use a separate validation set or cross-validation for early stopping and learning rate.
- Small learning rate, many trees is usually better than the opposite, at the cost of training time.
- Like all tree models, it can’t extrapolate beyond the range of the training data.
