---
title: Common distributions
summary: Five shapes that describe how random values are spread, and the everyday situations each one fits.
category: Distributions
status: seedling
created: 2026-10-24
order: 1
problem: I want to model something uncertain, like how many orders arrive in an hour or how many emails get clicked. Which shape should I assume?
why: Most real processes match one of a few standard shapes. Knowing which one fits lets you compute probabilities directly, pick the right test or model, and notice when your data behaves strangely.
assumptions:
  - Each distribution comes with conditions (independent events, a constant rate, a fixed number of tries). Check them before using it.
related: [statistics/descriptive-statistics, statistics/confidence-intervals]
references:
  - title: Newbold, Carlson and Thorne, Statistics for Business and Economics, 8th edition. Pearson. Chapters 4 and 5.
  - title: SciPy, statistical functions
    url: https://docs.scipy.org/doc/scipy/reference/stats.html
tags: [distributions, probability]
---

## At a glance

| Distribution | Counts or measures | Example | Mean | Variance |
| --- | --- | --- | --- | --- |
| Normal | A measurement that clusters around an average | Heights, measurement errors, averages of many values | $\mu$ | $\sigma^2$ |
| Binomial | Successes in $n$ independent tries, each with chance $p$ | Clicks out of 20 emails sent | $np$ | $np(1-p)$ |
| Poisson | Events in a fixed time or space, at an average rate $\lambda$ | Support calls per hour | $\lambda$ | $\lambda$ |
| Exponential | Waiting time until the next event, at rate $\lambda$ | Minutes until the next call | $1/\lambda$ | $1/\lambda^2$ |
| Hypergeometric | Successes when drawing without putting back | Faulty items in a sample from one batch | $n K / N$ | |

## Normal

The bell curve. About 68% of values fall within one standard deviation of the mean, and 95% within two. It matters even when the data itself isn’t normal: by the **central limit theorem**, the average of many independent values is close to normal. That is why confidence intervals and t-tests work for so many kinds of data.

![Normal distribution with the middle 68% and 95% shaded](/images/toolbox/dist-normal.svg)

## Binomial

A fixed number of independent yes-or-no tries with the same chance each time. If 30% of people open an email and you send 20, the most likely result is 6 opens, which happens about 19% of the time.

![Binomial distribution with n = 20 and p = 0.3](/images/toolbox/dist-binomial.svg)

## Poisson

Counts of events that happen independently at a steady average rate, with no upper limit. A helpdesk gets 4 calls an hour on average. The chance of more than 7 calls in an hour is about 5%, which is useful for planning staff.

![Poisson distribution with an average of 4](/images/toolbox/dist-poisson.svg)

## Exponential

The time between events in a Poisson process. If calls arrive at 4 per hour, the average wait between calls is 15 minutes, and there is a 63% chance the next one comes within 15 minutes. It is **memoryless**: having waited 10 minutes doesn’t make a call any more likely in the next minute.

![Exponential distribution with a rate of 4 per hour](/images/toolbox/dist-exponential.svg)

## Hypergeometric

Like the binomial, but drawing **without putting items back** from a small, finite group, so the chances change after each draw. A batch of 50 items has 12 faulty ones, and you inspect 10. You expect 2.4 faulty, and the chance of finding none at all is under 5%. When the population is much larger than the sample, it becomes almost the same as the binomial.

![Hypergeometric distribution, 10 drawn from 50 with 12 faulty](/images/toolbox/dist-hypergeometric.svg)

## In code

```python
from scipy import stats

stats.norm.cdf(1.96)                     # 0.975
stats.binom.pmf(6, n=20, p=0.3)          # 0.19
stats.poisson.sf(7, mu=4)                # P(more than 7) ≈ 0.05
stats.expon.cdf(0.25, scale=1/4)         # P(wait < 15 min) ≈ 0.63
stats.hypergeom.pmf(0, M=50, n=12, N=10) # P(no faulty) ≈ 0.046
```

SciPy’s names are confusing for the hypergeometric: `M` is the population size, `n` the number of successes in it, and `N` the number drawn.

## Watch out for

- Assuming normality for skewed data like incomes or waiting times. Plot the histogram first.
- Count data where the variance is much bigger than the mean. That breaks the Poisson assumption (called overdispersion); a negative binomial usually fits better.
- Events that aren’t independent, like orders that come in bursts after a marketing email. Poisson and exponential both assume independence.
