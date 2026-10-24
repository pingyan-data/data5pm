---
title: Sample size
summary: How many observations you need to estimate something precisely enough, or to detect a difference that matters.
category: Sampling
status: seedling
created: 2026-10-24
order: 2
problem: Before I collect data or run an A/B test, how many people do I need? Too few and the result is noise; too many wastes time and money.
why: Sample size follows from three choices you make up front, how precise you need to be, how sure you want to be, and how big a difference matters. Writing them down before collecting data also stops you from stopping the test the moment it looks good.
assumptions:
  - The sample is random. A bigger sample doesn’t fix a biased one.
  - You have a rough guess of the spread (standard deviation) or the baseline rate, from earlier data or a small pilot.
related: [statistics/sampling-methods, statistics/confidence-intervals, statistics/hypothesis-testing]
references:
  - title: Newbold, Carlson and Thorne, Statistics for Business and Economics, 8th edition. Pearson. Chapter 8.
  - title: statsmodels, power and sample size
    url: https://www.statsmodels.org/stable/stats.html#power-and-sample-size-calculations
tags: [sampling, power, ab-testing]
---

## How it works

There are two common questions, and each has its own formula.

**1. Estimating a value within a margin of error.** You want the result to land within ±E of the truth, with 95% confidence ($z = 1.96$).

For a mean, with standard deviation $\sigma$:

$$
n = \left(\frac{z\,\sigma}{E}\right)^2
$$

For a proportion, with a guessed rate $p$ (use $p = 0.5$ if you have no idea, which gives the largest, safest $n$):

$$
n = \frac{z^2\, p(1-p)}{E^2}
$$

**2. Detecting a difference between two groups (A/B test).** Now you also choose the power: the chance of detecting a real effect of the size you care about. 80% is the usual choice.

$$
n \text{ per group} \approx \frac{2\,(z_{1-\alpha/2} + z_{1-\beta})^2\, \bar{p}(1-\bar{p})}{\delta^2}
$$

Here $\delta$ is the smallest difference worth detecting, $\bar{p}$ is the average of the two rates, and for 5% significance and 80% power, $z_{1-\alpha/2} + z_{1-\beta} = 1.96 + 0.84$.

The key pattern: **halving the margin of error needs four times the sample**, because $n$ grows with $1/E^2$.

## Example

- A poll that should be within ±3 percentage points: $1.96^2 \times 0.25 / 0.03^2 \approx 1{,}068$ people. That’s why so many polls ask about a thousand people.
- Average delivery time, standard deviation about 15 minutes, needed within ±2 minutes: $(1.96 \times 15 / 2)^2 \approx 217$ deliveries.
- A checkout page converts at 10%, and a lift to 12% would matter: about 3,800 visitors per group.

## In code

```python
from statsmodels.stats.power import NormalIndPower
from statsmodels.stats.proportion import proportion_effectsize

effect = proportion_effectsize(0.12, 0.10)        # new rate vs baseline
n = NormalIndPower().solve_power(effect, alpha=0.05, power=0.8)
print(round(n))                                    # ≈ 3,835 per group
```

## Watch out for

- Choosing the effect size after seeing the data. Decide the smallest difference that would change your decision first.
- Peeking: checking an A/B test every day and stopping when $p < 0.05$ makes false positives far more common than 5%. Fix the sample size, or use a method built for sequential testing.
- Small populations: if the sample is more than about 5% of the whole population, a finite population correction lowers the needed size.
