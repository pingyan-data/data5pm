---
title: Probability basics
summary: The rules for combining chances, including joint, marginal and conditional probability for two variables.
category: Probability
status: seedling
created: 2026-10-24
order: 1
problem: How do I reason about uncertain events that depend on each other, like the chance a customer churns given that they complained?
why: A few rules cover almost everything you need in practice, and most mistakes come from mixing up “A given B” with “B given A”. Conditional probability is also the base for Bayes’ theorem, Naive Bayes and logistic regression.
assumptions:
  - Probabilities estimated from data are only as good as the data. Small counts give unstable estimates.
related: [statistics/bayes-theorem, statistics/common-distributions]
references:
  - title: Newbold, Carlson and Thorne, Statistics for Business and Economics, 8th edition. Pearson. Chapter 3.
  - title: Blitzstein and Hwang (2019), Introduction to Probability, 2nd edition. CRC Press.
tags: [probability]
---

## How it works

A probability is a number between 0 and 1 for how likely something is. The rules:

| Rule | Formula | In words |
| --- | --- | --- |
| Complement | $P(\text{not } A) = 1 - P(A)$ | The chance it doesn’t happen |
| Or | $P(A \text{ or } B) = P(A) + P(B) - P(A \text{ and } B)$ | Subtract the overlap so it isn’t counted twice |
| Conditional | $P(A \mid B) = \dfrac{P(A \text{ and } B)}{P(B)}$ | The chance of A when you already know B happened |
| And | $P(A \text{ and } B) = P(A \mid B)\,P(B)$ | The chance both happen |
| Independence | $P(A \mid B) = P(A)$ | Knowing B tells you nothing about A |

## Two variables at once (bivariate probabilities)

With two variables, put the counts in a table. Here are 1,000 customers:

| | Churned | Stayed | Total |
| --- | --- | --- | --- |
| Complained | 60 | 40 | 100 |
| Didn’t complain | 90 | 810 | 900 |
| Total | 150 | 850 | 1,000 |

- **Joint probability**, a single cell: P(complained and churned) = 60 / 1,000 = 0.06.
- **Marginal probability**, a row or column total: P(churned) = 150 / 1,000 = 0.15.
- **Conditional probability**, one row only: P(churned | complained) = 60 / 100 = 0.60, while P(churned | didn’t complain) = 90 / 900 = 0.10.

Complaining and churning are clearly not independent: churn is six times higher among people who complained. Note that P(complained | churned) = 60 / 150 = 0.40 is a different number. Mixing these two up is the most common probability mistake.

## In code

```python
import pandas as pd

table = pd.crosstab(df["complained"], df["churned"], margins=True)
joint = pd.crosstab(df["complained"], df["churned"], normalize="all")
cond = pd.crosstab(df["complained"], df["churned"], normalize="index")   # P(churn | complained)
```

## Watch out for

- Confusing $P(A \mid B)$ with $P(B \mid A)$. Use Bayes’ theorem to go from one to the other.
- Assuming independence because it makes the maths easy. Events in real data, like several purchases by the same person, are often linked.
- A strong conditional probability is not causation. Complaining doesn’t necessarily cause churn; unhappy customers do both.
