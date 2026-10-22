---
title: Bootstrap confidence interval
summary: Estimates the uncertainty of almost any statistic by resampling the data with replacement.
category: Resampling
status: seedling
created: 2026-10-22
problem: How uncertain is a statistic, like a median, a ratio or a model metric, when there’s no simple formula for its standard error?
why: It works for statistics where no formula exists, and it makes no assumption about the shape of the data’s distribution. One recipe covers medians, percentiles, ratios and differences between models.
alternatives:
  - method: A formula-based interval, like the t interval for a mean
    whyNot: Use it when a formula exists and its assumptions hold. It’s faster, exact under its assumptions, and easier for others to reproduce.
  - method: Percentile bootstrap
    whyNot: The simplest bootstrap variant, but it can be off when the statistic is biased or skewed. BCa corrects for both and is SciPy’s default.
  - method: Bayesian credible interval
    whyNot: Better when I have prior knowledge worth using or want a direct probability statement about the parameter, at the cost of choosing a model and a prior.
assumptions:
  - The sample is representative of the population and observations are independent. Time series or grouped data need a block or cluster bootstrap.
  - The sample is big enough to show the distribution’s shape. With very few points, resampling only recycles the same few values.
  - The statistic is smooth. Extremes like the maximum are a known failure case.
references:
  - title: Efron (1979), Bootstrap methods, another look at the jackknife. The Annals of Statistics.
  - title: Efron and Tibshirani (1993), An Introduction to the Bootstrap.
  - title: scipy.stats.bootstrap
    url: https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.bootstrap.html
tags: [uncertainty, resampling]
---

## How it works

1. Draw a sample of the same size from the data, with replacement.
2. Compute the statistic on it.
3. Repeat thousands of times. The spread of those values approximates the sampling distribution, and its middle 95% gives the interval (in the percentile method).

## In code

```python
import numpy as np
from scipy import stats

res = stats.bootstrap((data,), np.median, n_resamples=10_000, method="BCa", random_state=0)
print(res.confidence_interval)
```

## Open questions

- Which block length to use for a block bootstrap on daily metrics?
