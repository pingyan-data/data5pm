---
title: Welch’s t-test
summary: Compares the means of two independent groups without assuming they have the same spread.
category: Hypothesis testing
status: growing
created: 2026-10-22
updated: 2026-10-24
order: 2
problem: Do two independent groups have different average values, for example the average order size in two markets?
why: It answers the question about means directly and stays accurate when the two groups have different spreads or sizes. When the spreads happen to be equal it loses almost nothing, so it is a safer default than the classic Student’s t-test.
assumptions:
  - Observations are independent, within and between the groups. Repeated measures on the same people need a paired test instead.
  - The sample means are roughly normal. With moderate samples this usually holds by the central limit theorem, but very skewed data in small samples can break it.
related: [statistics/hypothesis-testing, statistics/mann-whitney-u, statistics/bootstrap-confidence-interval]
references:
  - title: Welch (1947), The generalization of “Student’s” problem when several different population variances are involved. Biometrika.
  - title: Delacre, Lakens and Leys (2017), Why psychologists should by default use Welch’s t-test instead of Student’s t-test. International Review of Social Psychology.
  - title: scipy.stats.ttest_ind
    url: https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.ttest_ind.html
tags: [hypothesis-testing, means]
---

## How it works

The test statistic is the difference in means divided by its standard error, where each group keeps its own variance:

$$
t = \frac{\bar{x}_1 - \bar{x}_2}{\sqrt{\dfrac{s_1^2}{n_1} + \dfrac{s_2^2}{n_2}}}
$$

The degrees of freedom come from the Welch–Satterthwaite formula, which is usually not a whole number. Software handles it.

The older Student’s t-test pools the two variances into one. That is only correct when both groups truly have the same spread, which you rarely know.

## In code

```python
from scipy import stats

result = stats.ttest_ind(group_a, group_b, equal_var=False)  # equal_var=False makes it Welch
print(result.statistic, result.pvalue)
print(result.confidence_interval(confidence_level=0.95))
```

In R, `t.test()` uses Welch by default. In SciPy, the default is Student’s, so the flag matters.

## Watch out for

- Reporting only the p-value. The confidence interval for the difference shows how big the effect is, which is what people actually want to know.
- Testing for equal variances first and then picking the test. That two-step approach performs worse than simply always using Welch.
