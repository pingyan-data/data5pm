---
title: Sampling methods
summary: Ways to pick a subset of a population so that it tells you something true about the whole.
category: Sampling
status: seedling
created: 2026-10-24
order: 1
problem: I can’t measure everyone. How do I choose who to measure so the result still represents the whole population?
why: How you choose the sample matters more than how big it is. A large sample picked the wrong way gives a precise answer to the wrong question. Random selection is what makes the usual formulas for error and confidence intervals valid.
assumptions:
  - You have a list or a way to reach the whole population, called the sampling frame. People missing from the frame can never be sampled.
  - The people you pick actually respond. Low response rates bring back bias, even with perfect random selection.
related: [statistics/sample-size, statistics/confidence-intervals]
references:
  - title: Newbold, Carlson and Thorne, Statistics for Business and Economics, 8th edition. Pearson. Chapters 1 and 6.
  - title: Lohr (2021), Sampling, Design and Analysis, 3rd edition. CRC Press.
tags: [sampling, survey]
---

## How it works

The goal is a sample that looks like the population. Four designs cover most real work.

| Method | How | Good for | Watch out |
| --- | --- | --- | --- |
| Simple random | Every member has the same chance of being picked | A clean, well-mixed population with a full list | Small groups can be missed by chance |
| Stratified | Split the population into groups (strata), like regions or age bands, then sample randomly inside each | Making sure every important group is represented; usually gives more precise results for the same size | You need to know each person’s group in advance |
| Cluster | Randomly pick whole groups, like schools or stores, and measure everyone inside them | Populations spread over many places, where travel or access is expensive | People in the same cluster are similar, so you need a bigger sample |
| Systematic | Pick every k-th item from a list, after a random start | Production lines, long lists of transactions | Breaks if the list has a repeating pattern that lines up with k |

**Convenience samples**, like whoever answers a LinkedIn poll, are cheap but not random. They can be useful for ideas, never for estimating how common something is.

## Example

A company has 10,000 customers: 70% in Stockholm, 20% in Gothenburg and 10% in Malmö. A simple random sample of 500 might, by chance, include only 35 people from Malmö. A proportional stratified sample takes exactly 350, 100 and 50. If Malmö is important for the decision, you can even oversample it, say 150, and weight the results back to the true shares when you analyse.

## In code

```python
# simple random sample of 500 rows
sample = df.sample(n=500, random_state=42)

# proportional stratified sample: 5% from each region
strat = df.groupby("region", group_keys=False).sample(frac=0.05, random_state=42)

# train/test split that keeps class shares the same (stratified)
from sklearn.model_selection import train_test_split
X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.2, stratify=y, random_state=42)
```

## Watch out for

- Survivorship bias: sampling only from what is still around, like only active customers when studying churn.
- Self-selection: people who choose to answer often differ from those who don’t.
- Stratifying when you split data for machine learning, especially with rare classes. Without it, the test set can end up with almost none of the rare class.
