---
title: Bootstrap confidence interval
summary: Estimates the uncertainty of almost any statistic by resampling the data with replacement.
category: Resampling
status: seedling
created: 2026-10-22
updated: 2026-10-24
order: 1
problem: How uncertain is a number like a median, a ratio or a model’s accuracy, when there is no simple formula for its standard error?
why: It works for statistics where no formula exists and makes no assumption about the shape of the data. One recipe covers medians, percentiles, ratios and differences between models.
assumptions:
  - The sample represents the population, and observations are independent. Time series or grouped data need a block or cluster bootstrap.
  - The sample is big enough to show the shape of the data. With very few points, resampling just recycles the same few values.
  - The statistic is smooth. Extremes like the maximum are a known failure case.
related: [statistics/confidence-intervals, machine-learning/random-forest]
references:
  - title: Efron (1979), Bootstrap methods, another look at the jackknife. The Annals of Statistics.
  - title: Efron and Tibshirani (1993), An Introduction to the Bootstrap. Chapman and Hall.
  - title: scipy.stats.bootstrap
    url: https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.bootstrap.html
tags: [uncertainty, resampling]
---

## How it works

1. Draw a new sample of the same size from your data, **with replacement**, so some rows appear twice and some not at all.
2. Compute the statistic on it.
3. Repeat thousands of times. The spread of those results approximates how much the statistic would vary between real samples. The middle 95% gives the interval.

That simplest version is called the percentile bootstrap. The BCa version, SciPy’s default, corrects for bias and skew and is usually more accurate.

## In code

```python
import numpy as np
from scipy import stats

res = stats.bootstrap((data,), np.median, n_resamples=10_000, method="BCa", random_state=0)
print(res.confidence_interval)
```

## Watch out for

- Using it on dependent data, like daily metrics, without a block bootstrap. The interval comes out too narrow.
- Expecting it to rescue a tiny sample. It can’t create information that isn’t in the data.
