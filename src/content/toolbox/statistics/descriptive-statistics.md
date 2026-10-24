---
title: Descriptive statistics
summary: A handful of numbers that describe the centre, the spread and the relationships in a dataset.
category: Describing data
status: seedling
created: 2026-10-24
order: 1
problem: I have a new dataset. What does a typical value look like, how spread out are the values, and which variables move together?
why: These few numbers are the fastest way to get to know data before any modelling. They also catch problems early, like outliers, skew or a variable that is almost constant.
assumptions:
  - The numbers mean something only if the data is clean. Check for duplicates, wrong units and missing values first.
  - A single summary hides the shape of the data. Always look at a histogram or box plot too.
related: [statistics/common-distributions, statistics/sampling-methods]
references:
  - title: Newbold, Carlson and Thorne, Statistics for Business and Economics, 8th edition. Pearson. Chapters 1 and 2.
  - title: pandas, DataFrame.describe
    url: https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.describe.html
tags: [descriptive, eda]
---

## The centre: what is a typical value?

| Measure | What it is | Use it when |
| --- | --- | --- |
| Mean | The sum divided by the count, $\bar{x} = \frac{1}{n}\sum x_i$ | The data is roughly symmetric, or you care about totals |
| Weighted mean | Each value counts by its weight, $\frac{\sum w_i x_i}{\sum w_i}$ | Values stand for groups of different size, like average price across stores with different sales |
| Geometric mean | $\left(\prod (1+r_i)\right)^{1/n} - 1$ for growth rates | Averaging growth, returns or anything that compounds |
| Median | The middle value after sorting | The data is skewed or has outliers, like salaries or house prices |

Salaries in a small team of nine: 22, 25, 25, 28, 30, 31, 35, 40 and 120 thousand. The mean is 39.6, but the median is 30. One high salary pulls the mean up, while the median still describes the typical person.

Why the geometric mean matters: an investment that goes up 50% and then down 50% has an average return of 0%, but you have lost money. The geometric mean gets it right: $\sqrt{1.5 \times 0.5} - 1 = -13.4\%$ per year.

## The spread: how different are the values?

| Measure | What it is | Use it when |
| --- | --- | --- |
| Percentiles | The value below which a given share of the data falls. The 90th percentile is higher than 90% of values. | Describing tails, like “90% of deliveries arrive within 3 days” |
| Quartiles and IQR | Q1 is the 25th percentile, Q3 the 75th. The interquartile range IQR = Q3 − Q1 holds the middle half. | Skewed data. Values more than 1.5 × IQR outside the quartiles are a common outlier flag. |
| Variance | The average squared distance from the mean, $s^2 = \frac{1}{n-1}\sum (x_i - \bar{x})^2$ | Mostly as a building block for other methods |
| Standard deviation | The square root of the variance, in the same unit as the data | Describing spread of roughly symmetric data |
| Coefficient of variation | Standard deviation divided by the mean, $CV = s / \bar{x}$ | Comparing spread between things with different averages or units |
| z-score | How many standard deviations a value is from the mean, $z = (x - \bar{x}) / s$ | Comparing values on different scales, or spotting unusual values (often $\lvert z \rvert > 3$) |

In the salary example, Q1 = 25 and Q3 = 35, so the IQR is 10. Anything above 35 + 1.5 × 10 = 50 is flagged, which catches the 120.

**Which asset is riskier?** Asset A has an average yearly return of 8% with a standard deviation of 12%. Asset B averages 4% with a standard deviation of 5%. A has the larger standard deviation, but it also earns more. The coefficient of variation compares risk per unit of return: A has 12 / 8 = 1.5, B has 5 / 4 = 1.25. So A carries more risk for each percent of return.

## Relationships: do two variables move together?

| Measure | What it is | Use it when |
| --- | --- | --- |
| Covariance | Positive when two variables tend to be above their means at the same time | Rarely on its own: its size depends on the units, so it is hard to read |
| Pearson correlation | Covariance scaled to between −1 and 1. Measures how close the points are to a straight line. | The relationship looks linear and there are no big outliers |
| Spearman correlation | Pearson correlation of the ranks. Measures whether one goes up when the other goes up, in any steady way. | The relationship is curved but always rising or falling, the data has outliers, or it is ordinal (like ratings) |

A correlation of 0 only means there is no straight-line relationship. Two variables can still be strongly related in a U shape. And correlation never shows which variable causes the other.

## In code

```python
import pandas as pd

df.describe(percentiles=[0.25, 0.5, 0.75, 0.9])   # count, mean, sd, quartiles…
df["salary"].median()
df["salary"].std() / df["salary"].mean()          # coefficient of variation
(df["salary"] - df["salary"].mean()) / df["salary"].std()   # z-scores

df[["ads", "sales"]].corr(method="pearson")
df[["ads", "sales"]].corr(method="spearman")

from scipy.stats import gmean
gmean(1 + returns) - 1                            # geometric mean return
```

## Watch out for

- Reporting the mean of skewed data without the median. Income, prices and response times are almost always skewed.
- pandas and NumPy use different defaults for the standard deviation: `pandas.std()` divides by $n-1$, `numpy.std()` by $n$. For samples, $n-1$ is the usual choice.
- The coefficient of variation is meaningless when the mean is close to zero or the data can be negative, like temperatures in Celsius.
