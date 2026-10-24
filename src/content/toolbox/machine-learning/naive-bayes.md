---
title: Naive Bayes
summary: A fast classifier that applies Bayes’ theorem and assumes the features are independent within each class.
category: Classification
status: seedling
created: 2026-10-24
order: 2
problem: I need to sort many items, like emails or support tickets, into categories quickly, often with many features such as words, and not that much training data.
why: It trains in one pass by counting, works well with thousands of features and little data, and is easy to explain. For text it is a strong baseline that is hard to beat for the effort.
decides: For each class, it multiplies the prior probability of the class by the probability of each observed feature given that class. The class with the largest product wins. This is Bayes’ theorem, with the “naive” shortcut that features are treated as independent.
assumptions:
  - Features are independent within each class. This is almost never true, yet the ranking of classes is often still right even when the probabilities are off.
  - The right variant is used for the feature type, Gaussian for numbers, multinomial for counts like word frequencies, Bernoulli for yes/no features.
related: [statistics/bayes-theorem, machine-learning/logistic-regression]
references:
  - title: GeeksforGeeks, Naive Bayes classifiers
    url: https://www.geeksforgeeks.org/machine-learning/naive-bayes-classifiers/
  - title: scikit-learn, Naive Bayes
    url: https://scikit-learn.org/stable/modules/naive_bayes.html
tags: [classification, supervised, text, probability]
---

## How it works

Bayes’ theorem says $P(\text{class} \mid \text{features}) \propto P(\text{class}) \times P(\text{features} \mid \text{class})$. Estimating the joint probability of all features together needs huge amounts of data, so Naive Bayes assumes independence and multiplies one feature at a time:

$$
\hat{y} = \arg\max_{c} \; P(c) \prod_{i} P(x_i \mid c)
$$

Each $P(x_i \mid c)$ is just a count from the training data, like the share of spam emails that contain “free”.

## How it decides, step by step

40% of training emails are spam. A new email contains “free” and “winner”.

| | Spam | Not spam |
| --- | --- | --- |
| Prior | 0.40 | 0.60 |
| P(“free” \| class) | 0.30 | 0.02 |
| P(“winner” \| class) | 0.20 | 0.01 |
| Product | 0.024 | 0.00012 |

Spam wins by a wide margin. Normalising, $0.024 / (0.024 + 0.00012) \approx 99.5\%$ spam.

## In code

```python
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import make_pipeline

model = make_pipeline(CountVectorizer(), MultinomialNB(alpha=1.0)).fit(texts, labels)
model.predict(["You are a winner, claim your free prize"])
```

## Watch out for

- Zero counts. A word never seen with a class makes the whole product zero. Laplace smoothing (`alpha=1`) adds a small count to everything to prevent this.
- Trusting the probabilities. Because of the independence shortcut, they are often too extreme. Use the ranking, or calibrate them.
