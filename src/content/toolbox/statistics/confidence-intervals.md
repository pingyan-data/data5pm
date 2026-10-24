---
title: Confidence intervals
summary: A range of plausible values for something you estimate from a sample, like an average or a conversion rate.
category: Estimation
status: seedling
created: 2026-10-24
order: 1
problem: My sample says the average order is 412 kr. How far could the true average for all customers be from that number?
why: A single number hides how uncertain it is. An interval shows the precision directly, in the units people care about, and it is more useful for decisions than a yes-or-no test result.
assumptions:
  - The sample is random and the observations are independent.
  - The sampling distribution of the estimate is roughly normal. For means this holds for moderate samples by the central limit theorem; for proportions, you need at least about 10 successes and 10 failures.
related: [statistics/sample-size, statistics/hypothesis-testing, statistics/bootstrap-confidence-interval]
references:
  - title: Newbold, Carlson and Thorne, Statistics for Business and Economics, 8th edition. Pearson. Chapters 7 and 8.
  - title: statsmodels, proportion_confint
    url: https://www.statsmodels.org/stable/generated/statsmodels.stats.proportion.proportion_confint.html
tags: [estimation, uncertainty]
---

## How it works

Almost every confidence interval has the same shape:

$$
\text{estimate} \pm \text{critical value} \times \text{standard error}
$$

The **standard error** is how much the estimate would move if you drew a new sample. The **critical value** sets the confidence level: about 1.96 for 95%.

| Estimating | Interval | Notes |
| --- | --- | --- |
| A mean | $\bar{x} \pm t \cdot \dfrac{s}{\sqrt{n}}$ | Use the t-distribution, since $\sigma$ is estimated from the sample. With large $n$, $t \approx 1.96$. |
| A proportion | $\hat{p} \pm 1.96 \sqrt{\dfrac{\hat{p}(1-\hat{p})}{n}}$ | For small samples or rates near 0 or 1, use the Wilson interval instead. |
| Difference of two means | $(\bar{x}_1 - \bar{x}_2) \pm t \sqrt{\dfrac{s_1^2}{n_1} + \dfrac{s_2^2}{n_2}}$ | The Welch interval. If it doesn’t include 0, the groups differ. |
| Difference of two proportions | $(\hat{p}_1 - \hat{p}_2) \pm 1.96 \sqrt{\dfrac{\hat{p}_1(1-\hat{p}_1)}{n_1} + \dfrac{\hat{p}_2(1-\hat{p}_2)}{n_2}}$ | The basis of A/B test reporting |
| Paired differences | Interval for the mean of the differences | Before and after on the same people |

## What “95% confident” means

If you repeated the sampling many times and built an interval each time, about 95% of those intervals would contain the true value. It does **not** mean there is a 95% probability that this particular interval contains it. In practice: treat the interval as the range of values the data is consistent with.

## Example

A sample of 100 orders has a mean of 412 kr and a standard deviation of 150 kr. The standard error is $150 / \sqrt{100} = 15$. The 95% interval is about $412 \pm 1.98 \times 15$, so roughly 382 to 442 kr.

To make it half as wide, you need four times as many orders.

## In code

```python
import numpy as np
from scipy import stats
from statsmodels.stats.proportion import proportion_confint

# mean
stats.t.interval(0.95, df=len(x) - 1, loc=np.mean(x), scale=stats.sem(x))

# proportion: 48 conversions out of 400 visitors
proportion_confint(48, 400, alpha=0.05, method="wilson")

# difference in means (Welch)
stats.ttest_ind(a, b, equal_var=False).confidence_interval(0.95)
```

## Watch out for

- Reading overlap wrongly. Two intervals can overlap a little while the difference between the groups is still significant. Compute the interval for the difference itself.
- Forgetting that the interval only covers random sampling error. It says nothing about bias from a bad sample or a broken measurement.
