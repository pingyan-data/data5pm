---
title: Ridge and lasso
summary: Linear regression with a penalty on large weights, which makes the model more stable and, for lasso, picks features automatically.
category: Regression
status: seedling
created: 2026-10-24
order: 2
problem: I have many features, some correlated or useless, and plain linear regression overfits. It does great on training data and poorly on new data.
why: A penalty trades a little bias for much less variance, so predictions on new data usually improve. Lasso also sets some weights exactly to zero, giving a simpler model that shows which features matter.
decides: Exactly like linear regression, a weighted sum of the features. The difference is only in training, which now minimises squared errors plus a penalty on the size of the weights, so it settles on smaller, more cautious weights.
assumptions:
  - Features are on comparable scales. Always standardise first, or the penalty hits some features harder than others.
  - The penalty strength is chosen on data the model wasn’t trained on, usually with cross-validation.
related: [machine-learning/linear-regression, machine-learning/cross-validation]
references:
  - title: Hastie, Tibshirani and Friedman (2009), The Elements of Statistical Learning, 2nd edition, chapter 3, sections on shrinkage methods.
    url: https://hastie.su.domains/ElemStatLearn/
  - title: Tibshirani (1996), Regression shrinkage and selection via the lasso. Journal of the Royal Statistical Society B.
  - title: scikit-learn, linear models
    url: https://scikit-learn.org/stable/modules/linear_model.html
tags: [regression, regularisation, feature-selection]
---

## How it works

Both add a penalty to the usual squared error, controlled by a strength $\lambda$ (called `alpha` in scikit-learn):

| | Training minimises | Effect |
| --- | --- | --- |
| Ridge | $\sum (y_i - \hat{y}_i)^2 + \lambda \sum b_j^2$ | Shrinks all weights towards zero, never exactly to zero. Handles correlated features well by sharing weight between them. |
| Lasso | $\sum (y_i - \hat{y}_i)^2 + \lambda \sum \lvert b_j \rvert$ | Pushes some weights to exactly zero, removing those features. |
| Elastic net | A mix of both | Selects features like lasso but stays stable with correlated groups, like ridge. |

With $\lambda = 0$ you get plain linear regression. As $\lambda$ grows, weights shrink and the model gets simpler. The best $\lambda$ is the one with the lowest error in cross-validation.

## How it decides, step by step

Prediction is the same weighted sum as linear regression. Imagine a model for flat prices with 50 features. Plain regression gives tiny, noisy weights to things like “floor number is even”. Lasso sets that weight to 0, so the feature simply drops out of the sum, and the prediction is built from the 10 or so features that really carry signal.

## In code

```python
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import RidgeCV, LassoCV

ridge = make_pipeline(StandardScaler(), RidgeCV(alphas=[0.1, 1, 10, 100])).fit(X, y)
lasso = make_pipeline(StandardScaler(), LassoCV(cv=5)).fit(X, y)
lasso[-1].coef_          # zeros = dropped features
```

## Watch out for

- Forgetting to scale. It is the most common mistake with penalised models.
- Treating lasso’s choice as the truth. With correlated features, it picks one fairly arbitrarily, and a different sample may pick another.
