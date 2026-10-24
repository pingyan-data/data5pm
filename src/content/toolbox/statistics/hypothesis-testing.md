---
title: Hypothesis testing
summary: A way to check whether a pattern in a sample is likely to be real or could easily be random noise.
category: Hypothesis testing
status: seedling
created: 2026-10-24
order: 1
problem: The new page converted 12% and the old one 10%. Is the new page actually better, or could a gap like this happen by chance?
why: It gives a standard, agreed way to separate signal from noise before making a decision, and it forces you to state the question and the risk of being wrong up front.
assumptions:
  - The question, the test and the significance level are chosen before looking at the results.
  - Each specific test has its own assumptions, like independent observations or roughly normal means.
related: [statistics/confidence-intervals, statistics/sample-size, statistics/welch-t-test, statistics/chi-square-test]
references:
  - title: Newbold, Carlson and Thorne, Statistics for Business and Economics, 8th edition. Pearson. Chapters 9 and 10.
  - title: Wasserstein and Lazar (2016), The ASA statement on p-values. The American Statistician.
tags: [hypothesis-testing, p-value, ab-testing]
---

## How it works

1. **State two hypotheses.** The null hypothesis $H_0$ says there is no effect (both pages convert the same). The alternative $H_1$ says there is one.
2. **Choose a significance level** $\alpha$, usually 0.05. It is the false alarm rate you accept.
3. **Compute a test statistic** from the data: how far the result is from what $H_0$ predicts, measured in standard errors.
4. **Get the p-value**: the probability of a result at least this extreme **if $H_0$ were true**.
5. **Decide.** If $p < \alpha$, reject $H_0$. Otherwise, you don’t have enough evidence. That is not the same as proving there is no effect.

## Two ways to be wrong

| | $H_0$ is actually true | $H_0$ is actually false |
| --- | --- | --- |
| You reject $H_0$ | Type I error, a false alarm (chance $\alpha$) | Correct |
| You keep $H_0$ | Correct | Type II error, a missed effect (chance $\beta$) |

**Power** $= 1 - \beta$ is the chance of catching a real effect. It grows with sample size and effect size. Aim for 80% or more, and plan for it with a [sample size](/toolbox/statistics/sample-size/) calculation.

## Which test?

| Question | Test |
| --- | --- |
| Do two groups have different means? | [Welch’s t-test](/toolbox/statistics/welch-t-test/) |
| Did the same people change, before vs after? | Paired t-test |
| Do two groups have different rates (A/B test)? | Two-proportion z-test, or a chi-square test |
| Are two categorical variables related? | [Chi-square test](/toolbox/statistics/chi-square-test/) |
| Does one group tend to have larger values, with skewed or ordinal data? | [Mann–Whitney U test](/toolbox/statistics/mann-whitney-u/) |
| Do three or more groups have different means? | One-way ANOVA (or Welch’s ANOVA) |

## Example

The old page converted 400 of 4,000 visitors (10%), the new page 480 of 4,000 (12%). A two-proportion z-test gives $p \approx 0.004$. A difference this large would be very unusual if the pages really performed the same, so the new page is likely better. The 95% confidence interval for the lift is about 0.6 to 3.4 percentage points, which says how much better.

## In code

```python
from statsmodels.stats.proportion import proportions_ztest, confint_proportions_2indep

proportions_ztest(count=[480, 400], nobs=[4000, 4000])            # (z, p-value)
confint_proportions_2indep(480, 4000, 400, 4000)                  # interval for the difference

from scipy import stats
stats.ttest_rel(before, after)                                    # paired t-test
stats.f_oneway(group_a, group_b, group_c)                         # one-way ANOVA
```

## Watch out for

- Statistical significance is not practical importance. With a million users, a 0.01% lift can be “significant” and still worthless. Always report the size of the effect with a confidence interval.
- Running many tests. With 20 tests at $\alpha = 0.05$, you expect one false alarm even when nothing is going on. Correct for it (for example Bonferroni or Benjamini–Hochberg) or decide on one main metric up front.
- A large p-value doesn’t show that there is no effect. The test may simply have too little power.
