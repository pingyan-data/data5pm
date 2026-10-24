---
title: Support vector machine
summary: Separates two classes with the boundary that leaves the widest possible gap, and can bend that boundary with kernels.
category: Support vector machines
status: seedling
created: 2026-10-24
order: 1
problem: I want to separate two classes as cleanly as possible, sometimes with a curved boundary, using a medium-sized dataset with many features.
why: Maximising the gap gives a boundary that generalises well, because it depends only on the hardest cases near the border. Kernels let the same method draw curved boundaries without building new features by hand. It works well in high dimensions, like text.
decides: It computes a score, w · x + b, which says which side of the boundary the point falls on and how far. A positive score means one class, negative the other. With a kernel, the score is a weighted sum of similarities between the new point and the support vectors.
assumptions:
  - Features are scaled. Distances drive everything.
  - The dataset is not huge. Training time grows quickly, roughly with the square of the number of rows or worse, for kernel SVMs.
related: [machine-learning/logistic-regression, machine-learning/k-nearest-neighbours]
references:
  - title: Hastie, Tibshirani and Friedman (2009), The Elements of Statistical Learning, 2nd edition, chapter 12, Support Vector Machines and Flexible Discriminants.
    url: https://hastie.su.domains/ElemStatLearn/
  - title: Cortes and Vapnik (1995), Support-vector networks. Machine Learning.
  - title: scikit-learn, support vector machines
    url: https://scikit-learn.org/stable/modules/svm.html
tags: [classification, supervised, kernels]
---

## How it works

Many lines can separate two groups. The SVM picks the one in the middle of the **widest street** between them. The points sitting on the edges of the street are the **support vectors**. Only they define the boundary; the other points could move and nothing would change.

![A straight boundary with the widest possible margin; the circled points are the support vectors](/images/toolbox/svm-margin.svg)

**Soft margin (the support vector classifier).** Real data overlaps, so some points are allowed inside the street or on the wrong side, at a cost. The parameter `C` sets that cost. A large `C` tries hard to classify every training point correctly, giving a narrow street and risking overfitting; a small `C` accepts more mistakes for a wider, smoother boundary.

**Kernels.** When no straight line works, a kernel measures similarity in a way that corresponds to a curved boundary. The RBF kernel, $K(x, x') = e^{-\gamma \lVert x - x' \rVert^2}$, is the usual choice. `gamma` sets how far each support vector’s influence reaches: large values give wiggly boundaries.

## How it decides, step by step

With a linear SVM trained on two features, say the boundary is $0.8 x_1 + 1.2 x_2 - 2 = 0$. For a new point (2, 1), the score is $0.8 \times 2 + 1.2 \times 1 - 2 = 0.8$. It is positive, so the point goes to the positive class. Scores between −1 and 1 fall inside the street, so 0.8 also says the point is on the right side but closer to the border than the support vectors are.

The score is not a probability. If you need one, calibrate it (`probability=True` or `CalibratedClassifierCV`).

## In code

```python
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.svm import SVC

svm = make_pipeline(StandardScaler(), SVC(kernel="rbf", C=1.0, gamma="scale")).fit(X_train, y_train)
svm.decision_function(X_test)      # signed distance to the boundary
```

## Watch out for

- Tuning `C` and `gamma` together, with a grid search and cross-validation. Defaults are rarely best.
- Very large datasets. Use `LinearSVC` or logistic regression instead, or a tree ensemble on tabular data.
