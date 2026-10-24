---
title: Mann–Whitney U test
summary: A rank-based test of whether values in one independent group tend to be larger than in the other.
category: Nonparametric tests
status: seedling
created: 2026-10-22
updated: 2026-10-24
order: 2
problem: Does one group tend to score higher than another when the data is ordinal, like 1 to 5 ratings, or full of outliers?
why: It only uses the ranks, so a few extreme values can’t dominate the result, and it works for ordinal scales where a mean doesn’t make sense. Its effect size, the chance that a random value from one group beats one from the other, is easy to explain.
assumptions:
  - Observations are independent, within and between the groups.
  - Values can at least be put in order.
  - It is not a test of medians. It only becomes one when both groups have the same shape and differ by a simple shift.
related: [statistics/welch-t-test, statistics/hypothesis-testing]
references:
  - title: Divine et al. (2018), The Wilcoxon–Mann–Whitney procedure fails as a test of medians. The American Statistician.
  - title: scipy.stats.mannwhitneyu
    url: https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.mannwhitneyu.html
tags: [hypothesis-testing, nonparametric]
---

## How it works

Put both groups together, rank every value from smallest to largest, and add up the ranks for one group. If neither group tends to be larger, the ranks should be spread evenly between them.

The U statistic, divided by $n_1 n_2$, estimates

$$
P(X > Y) + \tfrac{1}{2}P(X = Y)
$$

where $X$ and $Y$ are random draws from the two groups. A value of 0.5 means neither group tends to be larger.

If you care about means, for example revenue where outliers are real money, use Welch’s t-test instead.

## In code

```python
from scipy import stats

res = stats.mannwhitneyu(group_a, group_b, alternative="two-sided")
prob_superiority = res.statistic / (len(group_a) * len(group_b))
```

## Watch out for

- Calling it a test of medians in a report. Describe it as “values in group A tend to be higher”.
- Lots of ties, which is common with 1 to 5 scales. SciPy corrects for ties, but with very few distinct values a chi-square test on the counts can be clearer.
