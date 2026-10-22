---
title: Mann–Whitney U test
summary: A rank-based test of whether values in one independent group tend to be larger than in the other.
category: Comparing groups
status: seedling
created: 2026-10-22
problem: Does one group tend to score higher than another when the data are ordinal, like survey ratings, or full of outliers?
why: It only uses the ranks, so a few extreme values can’t dominate the result and it works for ordinal scales where a mean isn’t meaningful. Its natural effect size, the probability that a random value from one group beats a random value from the other, is easy to explain to non-statisticians.
alternatives:
  - method: Welch’s t-test
    entry: statistics/welch-t-test
    whyNot: Better when the question really is about means, for example revenue, where totals matter and outliers are real money rather than noise.
  - method: Brunner–Munzel test
    whyNot: Tests the same probability but stays valid when the two groups have different spreads or shapes. Worth switching to when the distributions clearly differ in more than location.
assumptions:
  - Observations are independent, within and between groups.
  - Values can at least be ordered.
  - It is not a test of medians. It only becomes one if both groups have the same shape and differ purely by a shift.
references:
  - title: Divine et al. (2018), The Wilcoxon–Mann–Whitney procedure fails as a test of medians. The American Statistician.
  - title: scipy.stats.mannwhitneyu
    url: https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.mannwhitneyu.html
tags: [hypothesis-testing, nonparametric]
---

## How it works

Pool both groups, rank every value, and add up the ranks of one group. If neither group tends to be larger, those ranks should be spread evenly. The U statistic, divided by $n_1 n_2$, estimates

$$
P(X > Y) + \tfrac{1}{2}P(X = Y)
$$

where $X$ and $Y$ are random draws from the two groups. A value of 0.5 means neither group tends to be larger.

## In code

```python
from scipy import stats

res = stats.mannwhitneyu(group_a, group_b, alternative="two-sided")
prob_superiority = res.statistic / (len(group_a) * len(group_b))
```

## Open questions

- How should ties be handled for 1 to 5 survey scales with many repeated values?
