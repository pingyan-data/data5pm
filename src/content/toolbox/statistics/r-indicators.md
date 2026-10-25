---
title: R-indicators
summary: A single number between 0 and 1 that says how well a dataset represents the population, plus partial scores that show which groups are missing.
category: Sampling
status: seedling
created: 2026-10-25
order: 3
problem: I have a big administrative dataset, or a survey with many non-responses. Does it still look like the population, and if not, which groups are missing?
why: A response rate or a record count only tells you how much data you have, not who is in it. R-indicators compare who is in the data with who is in the population, so they measure representativeness directly. The partial versions point to the exact variables and categories causing the gap, which tells you what to fix or weight.
assumptions:
  - You have trusted population information for the same variables, such as census counts or a good probability sample.
  - The variables are defined the same way in your data and in the population source. Mismatched age bands or ethnicity codes make groups look under- or overrepresented when they are not.
  - The chosen variables are the ones that matter. The indicator can only see gaps in the variables you give it.
related: [statistics/sampling-methods]
references:
  - title: Schouten, Cobben and Bethlehem (2009), Indicators for the representativeness of survey response. Survey Methodology.
  - title: Schouten, Shlomo and Skinner (2011), Indicators for monitoring and improving representativeness of response. Journal of Official Statistics.
  - title: Sommerland and Warne (2024), Quality of administrative data, a new application of representativity indicators. ONS Methodological Research Hub, presentation.
  - title: ONS working paper, Quality indicators for representativeness in administrative data, R-indicators and distance metrics
    url: https://www.ons.gov.uk/methodology/methodologicalpublications/generalmethodology/onsworkingpaperseries/qualityindicatorsforrepresentativenessinadministrativedatarindicatorsanddistancemetrics
  - title: Shlomo and Kim, qualadmin (R code)
    url: https://github.com/sook-tusk/qualadmin
tags: [sampling, survey, data-quality, administrative-data]
---

## How it works

Think of every person in the population as having a chance of ending up in your dataset. This chance is called their **propensity**. In a survey it is the chance they answer. In administrative data, like tax or health records, it is the chance they appear in the records at all.

If everyone has the same propensity, the data is a fair miniature of the population, even if it is incomplete. Trouble starts when propensities differ between groups: if young men are less likely to be in the records, any average you compute leans towards everyone else.

So the R-indicator measures how much propensities vary. You estimate each person’s propensity with a logistic regression on variables you also know for the population (age, sex, ethnicity, …), then take the standard deviation $S(\rho)$ of those propensities:

$$
R = 1 - 2\,S(\rho)
$$

$R = 1$ means everyone has the same chance, so the data is fully representative on those variables. Lower values mean more uneven coverage. The factor 2 keeps $R$ between 0 and 1.

**Partial R-indicators** break this down. The variable-level score is the variation in propensities between the categories of one variable. A large value means that variable drives most of the gap. The category-level score adds a sign:

$$
P_u(X, k) = \sqrt{\frac{N_k}{N}}\,\left(\bar{\rho}_k - \bar{\rho}\right)
$$

where $N_k$ is the size of category $k$ in the population and $\bar{\rho}_k$ its average propensity. Negative means the group is underrepresented, positive means overrepresented.

The method was built for survey non-response. The UK Office for National Statistics (ONS) has tested it on administrative data, because the UK has no population register and needs to know whether admin sources can stand in for one.

## Example

A local authority has 10,000 residents according to the census: 8,000 in ethnic group A, 1,500 in group B and 500 in “Other”. An admin dataset finds 7,600, 1,350 and 350 of them.

With only one variable, each group’s propensity is just its coverage: 0.95, 0.90 and 0.70. Overall coverage is 9,300 / 10,000 = 0.93.

The variance of the propensities, weighted by group size, is

$$
\frac{8000(0.02)^2 + 1500(-0.03)^2 + 500(-0.23)^2}{10\,000} = 0.0031
$$

so $S(\rho) = 0.056$ and $R = 1 - 2(0.056) = 0.89$.

The category scores show where the problem is: A gets $+0.018$, B gets $-0.012$, and Other gets $-0.051$. The “Other” group is the clear gap, which is the same pattern the ONS found in their trial on a real local authority.

## In code

You usually have counts per cell rather than one row per person, so a binomial GLM on the counts is enough.

```python
import numpy as np, pandas as pd, statsmodels.api as sm

df = pd.DataFrame({
    "ethnicity": ["A", "A", "B", "B", "Other", "Other"],
    "sex":       ["F", "M", "F", "M", "F", "M"],
    "census":    [4100, 3900, 760, 740, 240, 260],   # people in the population
    "admin":     [3920, 3680, 690, 660, 180, 170],   # of them, found in the admin data
})

X = sm.add_constant(pd.get_dummies(df[["ethnicity", "sex"]], drop_first=True, dtype=float))
y = np.column_stack([df.admin, df.census - df.admin])
df["rho"] = sm.GLM(y, X, family=sm.families.Binomial()).fit().predict(X)

w = df.census
rho_bar = np.average(df.rho, weights=w)
R = 1 - 2 * np.sqrt(np.average((df.rho - rho_bar) ** 2, weights=w))
print(f"R = {R:.3f}")  # 0.887

# category-level partial indicators: negative = underrepresented
for var in ["ethnicity", "sex"]:
    g = df.groupby(var).apply(lambda d: np.average(d.rho, weights=d.census), include_groups=False)
    share = df.groupby(var).census.sum() / w.sum()
    print((np.sqrt(share) * (g - rho_bar)).round(3))
```

The ONS work builds on the `qualadmin` R code by Shlomo and Kim, linked below.

## Watch out for

- Reading $R$ as a pass mark. There is no agreed threshold for “good enough” yet; the ONS lists this as open research. Compare across datasets, or over time, rather than against a fixed cut-off.
- Admin data that counts more people than the census, for example people who moved away but are still registered. Coverage above 100% breaks the propensity idea, so check and clean for it first.
- Small categories. Their estimated propensities are noisy, and their partial scores are shrunk by $\sqrt{N_k/N}$, so a badly covered tiny group can look harmless. Look at the raw coverage too.
- A high $R$ only covers the variables in the model. The data can still be unrepresentative on income, health or anything else you did not include.
