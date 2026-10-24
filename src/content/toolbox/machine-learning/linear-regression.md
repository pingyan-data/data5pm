---
title: Linear regression
summary: Predicts a number as a weighted sum of input features, choosing the weights that make the squared errors as small as possible.
category: Regression
status: seedling
created: 2026-10-24
order: 1
problem: How does a number I care about, like a flat’s price, change with things I can measure, like size and distance to the city centre? And what would I predict for a new case?
why: It is fast, transparent and often surprisingly hard to beat. Every weight has a plain meaning (“each extra square metre adds about 45,000 kr, holding the rest fixed”), so it is the natural first model and the baseline every fancier model has to beat.
decides: It multiplies each feature by its weight, adds them up and adds a constant. That sum is the prediction. Training picks the weights that minimise the sum of squared differences between predictions and real values (ordinary least squares).
assumptions:
  - The relationship is roughly linear in the features. Curves can be handled by adding transformed features, like log(price) or size².
  - Errors are independent and have roughly constant spread. Needed for trustworthy standard errors and p-values.
  - Features are not near-copies of each other (multicollinearity). Otherwise the individual weights become unstable, even if predictions are fine.
related: [machine-learning/ridge-and-lasso, machine-learning/logistic-regression, machine-learning/cross-validation]
references:
  - title: Hastie, Tibshirani and Friedman (2009), The Elements of Statistical Learning, 2nd edition, chapter 3, Linear Methods for Regression.
    url: https://hastie.su.domains/ElemStatLearn/
  - title: James, Witten, Hastie and Tibshirani, An Introduction to Statistical Learning, chapter 3.
    url: https://www.statlearning.com/
  - title: Francis X. Diebold, course book (PDF)
    url: https://www.sas.upenn.edu/~fdiebold/NoHesitations/BookAdvanced.pdf
tags: [regression, supervised]
---

## How it works

The model is

$$
\hat{y} = b_0 + b_1 x_1 + b_2 x_2 + \dots + b_p x_p
$$

Training finds the weights $b$ that make the **residuals**, the gaps between real and predicted values, as small as possible in total:

$$
\min_b \sum_i (y_i - \hat{y}_i)^2
$$

Squaring makes big misses count a lot and gives a single exact solution, $b = (X^\top X)^{-1} X^\top y$, so no iterative search is needed.

## How it decides, step by step

Say the fitted model for flat prices in Stockholm is

$$
\text{price} = 1{,}200{,}000 + 45{,}000 \times \text{m}^2 - 80{,}000 \times \text{km to centre}
$$

For a 60 m² flat 5 km out: $1{,}200{,}000 + 45{,}000 \times 60 - 80{,}000 \times 5 = 3{,}500{,}000$ kr. There is no threshold or vote: the weighted sum *is* the answer.

## In code

```python
from sklearn.linear_model import LinearRegression

model = LinearRegression().fit(X_train, y_train)
model.coef_, model.intercept_
model.predict(X_test)

# for p-values and confidence intervals on the weights
import statsmodels.formula.api as smf
smf.ols("price ~ sqm + km_to_centre", data=df).fit().summary()
```

## Watch out for

- Reading weights as causes. A weight shows association while holding the other features fixed, nothing more.
- Outliers. Squared errors let a few extreme points pull the whole line. Plot the residuals.
- Comparing weights of features on different scales. Standardise the features first if you want to compare importance.
