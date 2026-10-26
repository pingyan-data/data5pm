---
title: Markov chain Monte Carlo (MCMC)
summary: A way to draw samples from a probability distribution you can’t sample directly, by taking a guided random walk that spends time in each region in proportion to its probability.
category: Estimation
status: seedling
created: 2026-10-26
order: 2
problem: I have a Bayesian model and want the posterior, my updated belief about the parameters. But the formula has an integral nobody can solve, especially with many parameters. How do I get usable answers out of it?
why: You often can’t compute the posterior exactly, but you can compute how likely one parameter value is compared with another. MCMC needs nothing more than that. It turns the comparison into a stream of samples, and from samples you can read off means, intervals and any other summary.
assumptions:
  - You can write down the prior and the likelihood, at least up to a constant.
  - The chain has run long enough to forget its starting point and explore the whole distribution. You can never prove this, only check for signs that it failed.
related: [statistics/bayes-theorem, statistics/probability-basics]
references:
  - title: Brownlee (2019), A gentle introduction to Markov chain Monte Carlo for probability. Machine Learning Mastery.
    url: https://machinelearningmastery.com/markov-chain-monte-carlo-for-probability/
  - title: McElreath (2020), Statistical Rethinking, 2nd edition. CRC Press. Chapter 9.
  - title: Gelman et al. (2013), Bayesian Data Analysis, 3rd edition. CRC Press. Chapters 11 and 12.
  - title: PyMC documentation
    url: https://www.pymc.io/
tags: [bayesian, sampling, simulation]
---

## How it works

The name joins two ideas.

**Monte Carlo** means answering a question with random samples. To find the average of a distribution, draw many values from it and average them. This works well when you can draw independent samples directly.

A **Markov chain** is a sequence where each step depends only on the current position, like a board game where your next square depends only on where you stand and the dice.

MCMC builds a Markov chain whose long-run behaviour matches the distribution you want. Once it has settled, the places it visits are samples from that distribution. Each sample depends on the previous one, which feels odd at first. But it lets the chain stay in the regions that matter, instead of wasting draws on the huge empty parts of a high-dimensional space.

The simplest version is **Metropolis–Hastings**:

1. Start somewhere.
2. Propose a small random step to a new value.
3. Compare how probable the new value is with the current one. If it is more probable, move. If it is less probable, move only with probability equal to the ratio.
4. Repeat thousands of times.

$$
\text{accept with probability } \min\!\left(1,\ \frac{p(\theta_{\text{new}} \mid \text{data})}{p(\theta_{\text{current}} \mid \text{data})}\right)
$$

The hard part of the posterior, the constant in the denominator of Bayes’ theorem, cancels in this ratio. That is why MCMC works when the exact formula doesn’t.

Other versions differ in how they propose the next step. **Gibbs sampling** updates one parameter at a time from its conditional distribution. **Hamiltonian Monte Carlo** (and its tuned version, NUTS) uses the slope of the distribution to make long, well-aimed moves. It is the default in modern tools like PyMC and Stan.

The first part of the chain still reflects the starting point, so it is thrown away. This is called the **burn-in** or warm-up.

## Example

A landing page had 12 conversions out of 100 visitors. With a flat prior, the posterior for the conversion rate $p$ is proportional to $p^{12}(1-p)^{88}$.

Say the chain is at $p = 0.10$ and proposes $0.13$. The ratio is

$$
\left(\tfrac{0.13}{0.10}\right)^{12}\left(\tfrac{0.87}{0.90}\right)^{88} \approx 1.18
$$

which is above 1, so the chain moves. From $0.13$, a proposal of $0.20$ gives a ratio of about $0.11$, so it is accepted only 11% of the time. Values far from the data are visited rarely, which is exactly what a posterior should look like.

After 20,000 steps, dropping the first 2,000, the samples have a mean of 0.128 and a 95% interval of about 0.07 to 0.20. This simple case has an exact answer, a Beta(13, 89) distribution with mean 0.127 and interval 0.070 to 0.198, so you can see that the chain got it right.

## In code

```python
import numpy as np

conversions, visitors = 12, 100

def log_post(p):                       # flat prior, binomial likelihood
    if not 0 < p < 1:
        return -np.inf
    return conversions * np.log(p) + (visitors - conversions) * np.log(1 - p)

rng = np.random.default_rng(42)
p, chain = 0.5, []
for _ in range(20_000):
    proposal = p + rng.normal(0, 0.05)                 # small random step
    if np.log(rng.random()) < log_post(proposal) - log_post(p):
        p = proposal                                   # accept, otherwise stay
    chain.append(p)

samples = np.array(chain[2_000:])                      # drop burn-in
print(samples.mean(), np.percentile(samples, [2.5, 97.5]))
```

In real work I would use PyMC or Stan, which run Hamiltonian Monte Carlo and the convergence checks for you.

## Watch out for

- Trusting a chain that hasn’t converged. Run several chains from different starting points and check that they agree. R-hat, a standard diagnostic, should be close to 1.00.
- Treating the number of samples as the amount of information. Neighbouring samples are correlated, so 10,000 draws may be worth far fewer independent ones. Look at the effective sample size.
- A step size that is too small (the chain crawls) or too big (almost every proposal is rejected). Modern samplers tune this during warm-up.
- Using MCMC when a simpler method gives the answer. If the posterior has a known form, as in the example, or the dataset is huge, exact formulas or faster approximations may be better.
