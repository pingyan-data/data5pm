---
title: Bayes’ theorem
summary: A rule for updating a belief when new evidence arrives, by turning P(evidence | cause) into P(cause | evidence).
category: Probability
status: seedling
created: 2026-10-24
order: 2
problem: I know how often a test is positive when something is true. But what I actually want is the reverse, how likely it is to be true given a positive test.
why: It is the correct way to combine what you knew before (the base rate) with new evidence. Without it, people overreact to evidence and ignore how rare the thing is in the first place. It is also the idea behind Naive Bayes and Bayesian statistics.
assumptions:
  - You have a reasonable estimate of the base rate, called the prior.
  - The probabilities of the evidence are estimated for the population you apply them to.
related: [statistics/probability-basics, machine-learning/naive-bayes]
references:
  - title: Newbold, Carlson and Thorne, Statistics for Business and Economics, 8th edition. Pearson. Chapter 3.
  - title: GeeksforGeeks, Naive Bayes classifiers
    url: https://www.geeksforgeeks.org/machine-learning/naive-bayes-classifiers/
tags: [probability, bayesian]
---

## How it works

$$
P(A \mid B) = \frac{P(B \mid A)\, P(A)}{P(B)}
$$

- $P(A)$, the **prior**: what you believed before seeing the evidence.
- $P(B \mid A)$, the **likelihood**: how likely the evidence is if A is true.
- $P(B)$, the **evidence**: how likely the evidence is overall, true or not.
- $P(A \mid B)$, the **posterior**: your updated belief.

The bottom part is usually found by adding up both ways the evidence can happen:
$P(B) = P(B \mid A)P(A) + P(B \mid \text{not } A)P(\text{not } A)$.

## Example

A disease affects 1% of people. A test catches 99% of real cases, but also comes back positive for 5% of healthy people. You test positive. How likely is it that you have the disease?

Think of 10,000 people:
- 100 have the disease, and 99 of them test positive.
- 9,900 are healthy, and 5% of them, 495, also test positive.

So of 594 positive tests, only 99 are real cases: $99 / 594 \approx 17\%$.

Most people guess around 95%. The test is good, but the disease is rare, so false alarms outnumber real cases. The same logic applies to fraud alerts, spam filters and anomaly detection.

## In code

```python
def posterior(prior, p_evidence_if_true, p_evidence_if_false):
    p_evidence = p_evidence_if_true * prior + p_evidence_if_false * (1 - prior)
    return p_evidence_if_true * prior / p_evidence

posterior(0.01, 0.99, 0.05)   # 0.1667
```

## Watch out for

- Ignoring the base rate. With rare events, even an accurate test produces mostly false positives.
- Using a prior from a different population, like the disease rate among hospital patients applied to the general public.
