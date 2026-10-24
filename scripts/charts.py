"""Draws the small charts used in toolbox entries.

Run:  python3 scripts/charts.py
Output: public/images/toolbox/*.svg  (reference them in Markdown as /images/toolbox/<name>.svg)

Style: one blue line, grey axes, no grid, transparent background, so the
charts read well in both light and dark mode.
"""
from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np
from scipy import stats

OUT = Path(__file__).resolve().parent.parent / "public" / "images" / "toolbox"
OUT.mkdir(parents=True, exist_ok=True)

BLUE = "#0f62fe"
GREY = "#8d8d8d"
LIGHT = "#a8a8a8"

plt.rcParams.update({
    "svg.fonttype": "none",
    "font.family": "sans-serif",
    "font.sans-serif": ["IBM Plex Sans", "Helvetica Neue", "Arial", "DejaVu Sans"],
    "font.size": 11,
    "axes.edgecolor": GREY,
    "axes.labelcolor": GREY,
    "axes.titlecolor": GREY,
    "axes.titlesize": 11,
    "axes.titleweight": "normal",
    "xtick.color": GREY,
    "ytick.color": GREY,
    "axes.spines.top": False,
    "axes.spines.right": False,
    "figure.facecolor": "none",
    "axes.facecolor": "none",
    "savefig.transparent": True,
})


def new(title=None, w=6.4, h=2.8):
    fig, ax = plt.subplots(figsize=(w, h))
    if title:
        ax.set_title(title, loc="left", pad=10)
    return fig, ax


def save(fig, name):
    fig.tight_layout()
    fig.savefig(OUT / f"{name}.svg", format="svg", metadata={"Date": None})
    plt.close(fig)
    print("wrote", name)


def bars(ax, x, y):
    ax.vlines(x, 0, y, color=BLUE, linewidth=3)
    ax.set_ylim(bottom=0)


# Distributions -------------------------------------------------------------
fig, ax = new("Normal, mean 0, sd 1")
x = np.linspace(-4, 4, 400)
ax.plot(x, stats.norm.pdf(x), color=BLUE, linewidth=2)
for k, a in [(1, 0.25), (2, 0.12)]:
    xs = np.linspace(-k, k, 200)
    ax.fill_between(xs, stats.norm.pdf(xs), color=BLUE, alpha=a, linewidth=0)
ax.text(0, 0.17, "68%", ha="center", color=GREY)
ax.text(1.55, 0.03, "95% within ±2", ha="left", color=GREY)
ax.set_yticks([])
save(fig, "dist-normal")

fig, ax = new("Binomial, n = 20 tries, p = 0.3")
k = np.arange(0, 21)
bars(ax, k, stats.binom.pmf(k, 20, 0.3))
ax.set_xlabel("number of successes")
ax.set_yticks([])
save(fig, "dist-binomial")

fig, ax = new("Poisson, on average 4 events per hour")
k = np.arange(0, 15)
bars(ax, k, stats.poisson.pmf(k, 4))
ax.set_xlabel("events in one hour")
ax.set_yticks([])
save(fig, "dist-poisson")

fig, ax = new("Exponential, on average 4 events per hour")
x = np.linspace(0, 1.5, 300)
ax.plot(x, stats.expon.pdf(x, scale=1 / 4), color=BLUE, linewidth=2)
ax.set_xlabel("hours until the next event")
ax.set_yticks([])
ax.set_ylim(bottom=0)
save(fig, "dist-exponential")

fig, ax = new("Hypergeometric, draw 10 from 50 items, 12 faulty")
k = np.arange(0, 11)
bars(ax, k, stats.hypergeom.pmf(k, 50, 12, 10))
ax.set_xlabel("faulty items in the sample")
ax.set_yticks([])
save(fig, "dist-hypergeometric")

# Decision trees: entropy vs Gini ------------------------------------------
fig, ax = new("Impurity of a group with two classes", h=3)
p = np.linspace(0.001, 0.999, 400)
entropy = -(p * np.log2(p) + (1 - p) * np.log2(1 - p))
gini = 1 - p**2 - (1 - p) ** 2
ax.plot(p, entropy, color=BLUE, linewidth=2)
ax.plot(p, gini, color=LIGHT, linewidth=2)
ax.text(0.5, 1.03, "entropy", ha="center", color=BLUE)
ax.text(0.5, 0.53, "Gini", ha="center", color=GREY)
ax.set_xlabel("share of class A in the group")
ax.set_ylim(0, 1.15)
ax.set_xticks([0, 0.5, 1], ["0 (pure)", "0.5 (mixed)", "1 (pure)"])
save(fig, "tree-impurity")

# Logistic regression: sigmoid ---------------------------------------------
fig, ax = new("Sigmoid: turns any score into a probability")
z = np.linspace(-6, 6, 300)
ax.plot(z, 1 / (1 + np.exp(-z)), color=BLUE, linewidth=2)
ax.axhline(0.5, color=LIGHT, linewidth=1, linestyle=(0, (3, 3)))
ax.set_xlabel("score  z = b0 + b1·x1 + …")
ax.set_ylabel("probability")
ax.set_yticks([0, 0.5, 1])
save(fig, "logistic-sigmoid")

# SVM: maximum margin ------------------------------------------------------
rng = np.random.default_rng(3)
a = rng.normal([-1.6, -1.2], 0.55, size=(18, 2))
b = rng.normal([1.6, 1.2], 0.55, size=(18, 2))
from sklearn.svm import SVC  # noqa: E402

X = np.vstack([a, b]); y = np.array([0] * 18 + [1] * 18)
clf = SVC(kernel="linear", C=10).fit(X, y)
fig, ax = new("The widest street between two classes", w=5, h=4)
ax.scatter(a[:, 0], a[:, 1], s=28, facecolors="none", edgecolors=GREY)
ax.scatter(b[:, 0], b[:, 1], s=28, color=BLUE)
xx = np.linspace(-3.5, 3.5, 50)
w, c = clf.coef_[0], clf.intercept_[0]
for off, style in [(0, "-"), (1, (0, (3, 3))), (-1, (0, (3, 3)))]:
    ax.plot(xx, -(w[0] * xx + c - off) / w[1], color=GREY if off else BLUE, linestyle=style, linewidth=1.5)
sv = clf.support_vectors_
ax.scatter(sv[:, 0], sv[:, 1], s=120, facecolors="none", edgecolors=BLUE, linewidths=1)
ax.set_xlim(-3.5, 3.5); ax.set_ylim(-3.5, 3.5)
ax.set_xticks([]); ax.set_yticks([])
ax.text(-3.3, 3.1, "circled points = support vectors", color=GREY, fontsize=10)
save(fig, "svm-margin")

# Clustering: k-means vs DBSCAN on two moons -------------------------------
from sklearn.cluster import DBSCAN, KMeans  # noqa: E402
from sklearn.datasets import make_moons  # noqa: E402

Xm, _ = make_moons(n_samples=240, noise=0.07, random_state=1)
rng = np.random.default_rng(0)
Xm = np.vstack([Xm, rng.uniform([-1.2, -0.7], [2.2, 1.2], size=(12, 2))])
km = KMeans(n_clusters=2, n_init=10, random_state=0).fit_predict(Xm)
db = DBSCAN(eps=0.18, min_samples=6).fit_predict(Xm)
fig, axes = plt.subplots(1, 2, figsize=(7.2, 3))
for ax, labels, title in [(axes[0], km, "k-means, k = 2"), (axes[1], db, "DBSCAN")]:
    ax.set_title(title, loc="left", pad=8)
    for lab, style in [(0, dict(color=BLUE, s=12)), (1, dict(facecolors="none", edgecolors=GREY, s=12))]:
        m = labels == lab
        ax.scatter(Xm[m, 0], Xm[m, 1], linewidths=0.8, **style)
    noise = labels == -1
    ax.scatter(Xm[noise, 0], Xm[noise, 1], marker="x", color=GREY, s=18, linewidths=1)
    ax.set_xticks([]); ax.set_yticks([])
axes[1].text(-1.15, 1.15, "× = noise", color=GREY, fontsize=10)
save(fig, "clustering-moons")

# Neural networks: activation functions ------------------------------------
fig, axes = plt.subplots(1, 2, figsize=(7.2, 2.6))
z = np.linspace(-4, 4, 300)
axes[0].plot(z, np.maximum(0, z), color=BLUE, linewidth=2)
axes[0].set_title("ReLU: max(0, z)", loc="left", pad=8)
axes[1].plot(z, 1 / (1 + np.exp(-z)), color=BLUE, linewidth=2)
axes[1].set_title("Sigmoid: 1 / (1 + e^(-z))", loc="left", pad=8)
axes[1].set_yticks([0, 0.5, 1])
for ax in axes:
    ax.set_xlabel("input z")
save(fig, "nn-activations")

# Stripe story: how fraud reports arrive over time ------------------------
fig, ax = new("Share of fraud reports received, by days after the payment", h=2.8)
days = [0, 14, 30, 60]
share = [0, 41, 66, 86]
ax.plot(days, share, color=BLUE, linewidth=2, marker="o", markersize=5)
for d_, s_ in zip(days[1:], share[1:]):
    ax.text(d_, s_ + 5, f"{s_}%", ha="center", color=GREY)
ax.set_xlabel("days after the payment")
ax.set_ylim(0, 100)
ax.set_yticks([0, 50, 100], ["0%", "50%", "100%"])
ax.set_xticks(days)
save(fig, "stripe-fraud-reports")
