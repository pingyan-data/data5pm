---
title: Classification metrics
summary: Ways to score a classifier beyond accuracy, based on the four kinds of right and wrong answers in a confusion matrix.
category: Model evaluation
status: seedling
created: 2026-10-24
order: 2
problem: My fraud model is 99% accurate, but fraud is only 1% of transactions, so a model that never flags anything is also 99% accurate. How do I know if it is any good?
why: Different mistakes have different costs. A missed fraud is not the same as a false alarm. These metrics separate the two kinds of mistakes, so the score matches what the business actually cares about.
assumptions:
  - The test data has the same class balance as real use, or you correct for the difference.
  - You know roughly which mistake is more expensive. That decides which metric and threshold to optimise.
related: [machine-learning/logistic-regression, machine-learning/cross-validation, statistics/bayes-theorem]
references:
  - title: scikit-learn, model evaluation
    url: https://scikit-learn.org/stable/modules/model_evaluation.html
  - title: Saito and Rehmsmeier (2015), The precision-recall plot is more informative than the ROC plot when evaluating binary classifiers on imbalanced datasets. PLOS ONE.
tags: [evaluation, classification, imbalanced]
---

## How it works

Every prediction lands in one cell of the **confusion matrix**:

| | Predicted positive | Predicted negative |
| --- | --- | --- |
| Actually positive | True positive (TP) | False negative (FN), a miss |
| Actually negative | False positive (FP), a false alarm | True negative (TN) |

| Metric | Formula | Answers | Care most when |
| --- | --- | --- | --- |
| Accuracy | (TP + TN) / all | How often is it right? | Classes are balanced |
| Precision | TP / (TP + FP) | When it flags something, how often is it right? | False alarms are costly (spam filter hiding real email) |
| Recall | TP / (TP + FN) | Of all real positives, how many does it catch? | Misses are costly (fraud, disease) |
| F1 | Harmonic mean of precision and recall | A single balance of the two | You need one number and both matter |
| ROC AUC | Area under the true-positive vs false-positive curve | How well does it rank positives above negatives, across all thresholds? | Comparing models, balanced-ish data |
| PR AUC | Area under the precision–recall curve | Same idea, focused on the positive class | Rare positives |

Precision and recall trade off through the threshold: lowering it catches more positives (higher recall) but raises more false alarms (lower precision).

## Example

10,000 transactions, 100 frauds. The model flags 150; 80 are real fraud.

- Recall: 80 / 100 = 80% of frauds caught.
- Precision: 80 / 150 = 53% of flags are real.
- Accuracy: (80 + 9,830) / 10,000 = 99.1%, barely better than flagging nothing at all (99.0%).

## In code

```python
from sklearn.metrics import classification_report, confusion_matrix, roc_auc_score, average_precision_score

print(confusion_matrix(y_test, y_pred))
print(classification_report(y_test, y_pred))
roc_auc_score(y_test, proba)
average_precision_score(y_test, proba)      # PR AUC
```

## Watch out for

- Accuracy on imbalanced data. It almost always looks great and means little.
- ROC AUC on very rare positives can look high while precision is poor. Check the precision–recall curve too.
- Picking the threshold on the test set. Choose it on validation data, based on the cost of each mistake.
