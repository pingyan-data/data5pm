---
title: Chi-square test
summary: Tests whether counts in categories match what you’d expect, or whether two categorical variables are related.
category: Nonparametric tests
status: seedling
created: 2026-10-24
order: 1
problem: Does the purchase rate depend on the device people use? Or, are orders spread evenly across weekdays?
why: Many business questions are about counts in categories rather than measurements. The chi-square test works directly on a table of counts and makes no assumption about the shape of a distribution.
assumptions:
  - Each observation is counted once, in one cell, and observations are independent.
  - Expected counts are not too small, at least about 5 in each cell. Otherwise use Fisher’s exact test.
related: [statistics/hypothesis-testing, statistics/probability-basics]
references:
  - title: Newbold, Carlson and Thorne, Statistics for Business and Economics, 8th edition. Pearson. Chapters on goodness-of-fit tests and contingency tables.
  - title: scipy.stats.chi2_contingency
    url: https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.chi2_contingency.html
tags: [hypothesis-testing, categorical, nonparametric]
---

## How it works

Compare what you observed with what you would expect if there were no relationship:

$$
\chi^2 = \sum \frac{(\text{observed} - \text{expected})^2}{\text{expected}}
$$

A large value means the observed counts are far from the expected ones. The p-value comes from the chi-square distribution.

It comes in two forms:

- **Goodness of fit**, one variable: do the counts match an expected pattern? Example: are orders spread evenly across weekdays?
- **Test of independence**, two variables in a table: is one related to the other? The expected count for each cell is $\frac{\text{row total} \times \text{column total}}{\text{grand total}}$, and the degrees of freedom are $(\text{rows} - 1)(\text{columns} - 1)$.

## Example

Purchases by device:

| | Bought | Didn’t buy | Rate |
| --- | --- | --- | --- |
| Mobile | 30 | 270 | 10% |
| Desktop | 60 | 240 | 20% |
| Tablet | 10 | 90 | 10% |

If device didn’t matter, every group would buy at the overall rate of 100 / 700 ≈ 14.3%. The test gives $\chi^2 = 14.0$ with 2 degrees of freedom and $p \approx 0.001$, so purchase rate and device are related.

The test only says *that* they are related. Look at the rates, or at which cells are furthest from expected, to see *how*. Here, desktop buyers stand out. Cramér’s V, a 0 to 1 measure of strength, is 0.14: a real but modest relationship.

## In code

```python
import numpy as np
from scipy import stats

table = np.array([[30, 270], [60, 240], [10, 90]])
chi2, p, dof, expected = stats.chi2_contingency(table)

stats.contingency.association(table, method="cramer")   # effect size
stats.chisquare([120, 95, 100, 105, 130])               # goodness of fit, equal expected
stats.fisher_exact([[3, 7], [9, 1]])                     # small 2x2 tables
```

## Watch out for

- Running it on percentages instead of counts. The test needs raw counts.
- With a big sample, tiny and unimportant differences become significant. Report an effect size like Cramér’s V.
- For 2×2 tables, SciPy applies a continuity correction by default (`correction=True`), which makes the test a bit more conservative.
