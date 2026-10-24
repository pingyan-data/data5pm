---
title: Logistic regression
summary: Predicts the probability of a yes-or-no outcome by passing a weighted sum of features through an S-shaped curve.
category: Classification
status: seedling
created: 2026-10-24
order: 1
problem: Will this customer churn, will this loan default, will this email be clicked? I want a probability, not just a label, and I want to know which factors push it up or down.
why: It gives well-calibrated probabilities, trains fast, and each weight has a clear meaning in odds. It is the standard baseline for any classification problem and often good enough to ship.
decides: It computes a score, a weighted sum of the features, and turns it into a probability with the sigmoid function. Then it compares the probability to a threshold, 0.5 by default, to choose the class. The threshold is a business choice, not part of the model.
assumptions:
  - The log-odds of the outcome change linearly with the features. Add transformed or interaction features if they don’t.
  - Observations are independent.
  - There is enough data for the rare class; a rule of thumb is at least 10 events per feature.
related: [machine-learning/linear-regression, machine-learning/classification-metrics, machine-learning/naive-bayes]
references:
  - title: Hastie, Tibshirani and Friedman (2009), The Elements of Statistical Learning, 2nd edition, chapter 4, Linear Methods for Classification.
    url: https://hastie.su.domains/ElemStatLearn/
  - title: scikit-learn, LogisticRegression
    url: https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.LogisticRegression.html
tags: [classification, supervised, probability]
---

## How it works

First a linear score, exactly as in linear regression:

$$
z = b_0 + b_1 x_1 + \dots + b_p x_p
$$

Then the sigmoid squeezes any score into a probability between 0 and 1:

$$
p = \frac{1}{1 + e^{-z}}
$$

![The sigmoid curve: a score of 0 gives a probability of 0.5](/images/toolbox/logistic-sigmoid.svg)

Training chooses weights that make the observed outcomes as likely as possible, which is the same as minimising the **log loss**. Confident wrong answers are punished hard.

Each weight is a change in **log-odds**. $e^{b}$ is the odds ratio: a weight of 1.5 means each extra unit of that feature multiplies the odds by $e^{1.5} \approx 4.5$.

## How it decides, step by step

Suppose a churn model learned $z = -2 + 1.5 \times \text{complaints}$.

- A customer with 1 complaint: $z = -0.5$, so $p = 0.38$. Below 0.5, predicted to stay.
- A customer with 2 complaints: $z = 1.0$, so $p = 0.73$. Above 0.5, predicted to churn.

If calling a customer who would have stayed is cheap but losing one is expensive, lower the threshold to, say, 0.3. The model is the same; only the decision rule changes.

## In code

```python
from sklearn.linear_model import LogisticRegression

clf = LogisticRegression(max_iter=1000).fit(X_train, y_train)
proba = clf.predict_proba(X_test)[:, 1]
pred = (proba >= 0.3).astype(int)         # your own threshold
```

## Watch out for

- scikit-learn adds a ridge-style penalty by default (`C=1.0`). Scale the features, and turn it off (`penalty=None`) if you want classic statistical estimates.
- Judging it by accuracy on imbalanced data. Look at precision, recall and the ROC or PR curve.
- Perfect separation: if one feature splits the classes completely, weights blow up. A penalty fixes it.
