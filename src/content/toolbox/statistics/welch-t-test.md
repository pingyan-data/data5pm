---
title: Welch’s t-test
summary: Compares the means of two independent groups without assuming they have the same variance.
category: Comparing groups
status: growing
created: 2026-10-22
problem: Do two independent groups have different average values, for example average order size in two markets?
why: It answers the question about means directly, stays accurate when the groups have different spreads or sizes, and loses almost nothing when the spreads happen to be equal. That makes it a safer default than Student’s t-test, because I rarely know the variances are equal.
alternatives:
  - method: Student’s t-test
    whyNot: Only correct when both groups share one variance. With unequal variances and unequal group sizes its error rate drifts away from the level I set, and testing for equal variance first doesn’t fix that.
  - method: Mann–Whitney U test
    entry: statistics/mann-whitney-u
    whyNot: Answers a different question, whether one group tends to have larger values, not whether the means differ. Better for ordinal data or when I care about typical values rather than totals.
  - method: Bootstrap interval for the difference in means
    entry: statistics/bootstrap-confidence-interval
    whyNot: Worth it when samples are small and very skewed, where the t approximation gets shaky. Otherwise Welch is simpler and gives nearly the same answer.
assumptions:
  - Observations are independent, within and between groups. Repeated measures on the same users need a paired test instead.
  - The sample means are roughly normal. With moderate samples this usually holds by the central limit theorem, but heavy tails or strong skew in small samples break it.
references:
  - title: Welch (1947), The generalization of “Student’s” problem when several different population variances are involved. Biometrika.
  - title: Delacre, Lakens and Leys (2017), Why psychologists should by default use Welch’s t-test instead of Student’s t-test. International Review of Social Psychology.
  - title: scipy.stats.ttest_ind
    url: https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.ttest_ind.html
tags: [hypothesis-testing, means]
---

## How it works

The test statistic divides the difference in means by a standard error that uses each group’s own variance:

$$
t = \frac{\bar{x}_1 - \bar{x}_2}{\sqrt{\dfrac{s_1^2}{n_1} + \dfrac{s_2^2}{n_2}}}
$$

The degrees of freedom come from the Welch–Satterthwaite approximation, which is usually not a whole number:

$$
\nu \approx \frac{\left(\dfrac{s_1^2}{n_1} + \dfrac{s_2^2}{n_2}\right)^2}{\dfrac{(s_1^2/n_1)^2}{n_1 - 1} + \dfrac{(s_2^2/n_2)^2}{n_2 - 1}}
$$

## In code

```python
from scipy import stats

result = stats.ttest_ind(group_a, group_b, equal_var=False)  # equal_var=False is what makes it Welch
print(result.statistic, result.pvalue)
print(result.confidence_interval(confidence_level=0.95))
```

In R, `t.test()` already uses Welch by default. In SciPy the default is Student’s, so the flag matters.

## Mistakes I’ve made

- Reporting only the p-value. The confidence interval for the difference says how big the effect is, which is what people actually ask about.

## Open questions

- At what sample size and skew does the bootstrap start to clearly beat Welch on real order data?
