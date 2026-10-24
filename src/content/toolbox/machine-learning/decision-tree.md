---
title: Decision tree
summary: Makes predictions by asking a sequence of yes-or-no questions about the features, chosen to make each group as pure as possible.
category: Trees and ensembles
status: seedling
created: 2026-10-24
order: 1
problem: I want a model whose decisions I can read and explain as simple rules, like “if the contract is shorter than a year and the customer complained, expect churn”.
why: A tree is the most readable model there is, handles numbers and categories without scaling, and finds interactions on its own. Even when a single tree isn’t accurate enough, understanding how it splits is the key to random forests and gradient boosting.
decides: At every step it tries every feature and every possible cut point, and picks the question that makes the resulting groups purest, measured by information gain (drop in entropy) or by drop in Gini impurity. It repeats inside each group until a stopping rule. A new point follows the questions down to a leaf and gets that leaf’s majority class, or its average for regression.
assumptions:
  - The tree is limited (maximum depth, minimum samples per leaf) or pruned. An unlimited tree memorises the training data.
  - Small changes in the data can produce a very different tree. Don’t read too much into one tree’s exact structure.
related: [machine-learning/random-forest, machine-learning/gradient-boosting]
references:
  - title: Hastie, Tibshirani and Friedman (2009), The Elements of Statistical Learning, 2nd edition, section 9.2, Tree-based methods.
    url: https://hastie.su.domains/ElemStatLearn/
  - title: Breiman, Friedman, Olshen and Stone (1984), Classification and Regression Trees. Wadsworth.
  - title: scikit-learn, decision trees
    url: https://scikit-learn.org/stable/modules/tree.html
tags: [classification, regression, supervised, trees, entropy]
---

## How it works

A tree splits the data again and again into smaller groups. The whole method rests on one question: **which split is best?** The answer is the split that leaves the groups as *pure* as possible, meaning each group is mostly one class.

Purity is measured in one of two ways.

**Entropy** measures how mixed a group is, in bits. With class shares $p_k$:

$$
H = -\sum_k p_k \log_2 p_k
$$

A group with only one class has entropy 0. A 50/50 group has entropy 1, the maximum for two classes.

**Information gain** is how much a split lowers entropy. It compares the parent group with the children, weighted by their sizes:

$$
\text{IG} = H(\text{parent}) - \sum_{\text{child}} \frac{n_{\text{child}}}{n_{\text{parent}}} H(\text{child})
$$

**Gini impurity** is a simpler alternative: the chance of mislabelling a random item if you labelled it randomly by the group’s class shares.

$$
G = 1 - \sum_k p_k^2
$$

It is 0 for a pure group and 0.5 for a 50/50 split of two classes. Gini and entropy almost always choose the same splits; Gini is a little faster and is scikit-learn’s default.

![Entropy and Gini both peak when the classes are mixed 50/50 and drop to zero for a pure group](/images/toolbox/tree-impurity.svg)

For regression trees, the idea is the same, but impurity is the variance of the target, and the best split is the one that lowers the squared error most.

## How it decides, step by step

10 customers: 5 churned, 5 stayed. The parent entropy is 1.0. The tree compares two possible first questions.

**Split A, “contract shorter than 12 months?”** Yes: 4 churned, 1 stayed. No: 1 churned, 4 stayed.
Each child has entropy $H(0.8, 0.2) = 0.72$. Weighted: $0.5 \times 0.72 + 0.5 \times 0.72 = 0.72$. **Information gain = 1.0 − 0.72 = 0.28.**

**Split B, “complained in the last 3 months?”** Yes: 5 churned, 1 stayed. No: 0 churned, 4 stayed.
The yes group has entropy $H(5/6, 1/6) = 0.65$; the no group is pure, entropy 0. Weighted: $0.6 \times 0.65 + 0.4 \times 0 = 0.39$. **Information gain = 1.0 − 0.39 = 0.61.**

Split B wins, so “complained?” becomes the first question. With Gini, the answer is the same: impurity drops by 0.33 for B and 0.18 for A.

The tree then repeats this search inside the “yes” group. The “no” group is already pure and becomes a leaf: everyone landing there is predicted to stay.

This is a **greedy** search: it takes the best split right now and never looks ahead. That keeps it fast, but means the tree as a whole isn’t guaranteed to be the best possible.

## In code

```python
from sklearn.tree import DecisionTreeClassifier, export_text

tree = DecisionTreeClassifier(criterion="entropy", max_depth=4, min_samples_leaf=20)
tree.fit(X_train, y_train)
print(export_text(tree, feature_names=list(X_train.columns)))   # the rules as text
```

## Watch out for

- Overfitting. Always limit depth or leaf size, or prune with `ccp_alpha`.
- Instability. Retrain on a slightly different sample and the top split may change. Random forests fix this by averaging many trees.
- Built-in feature importance favours features with many possible cut points, like IDs or continuous numbers. Permutation importance is more reliable.
