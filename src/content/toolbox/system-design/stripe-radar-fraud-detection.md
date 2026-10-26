---
kind: story
title: "Fraud detection: scaling Stripe Radar"
summary: How Stripe trained its fraud model on 14 times more payments, discovered that late fraud reports were quietly teaching it the wrong lesson, and used AI agents to run the experiments that fixed it.
category: Fraud detection
company: Stripe
created: 2026-10-25
order: 1
source:
  title: Stripe Dev Blog, Scaling Radar (2026)
  url: https://stripe.dev/blog/scaling-radar-fighting-fraud-with-agent-assisted-machine-learning
related: [machine-learning/classification-metrics, statistics/sampling-methods, deep-learning/backpropagation-and-gradient-descent]
references:
  - title: Stripe Dev Blog (2026), Scaling Radar, fighting fraud with agent-assisted machine learning.
    url: https://stripe.dev/blog/scaling-radar-fighting-fraud-with-agent-assisted-machine-learning
  - title: Stripe Dev Blog, How we built it, Stripe Radar.
    url: https://stripe.dev/blog/how-we-built-it-stripe-radar
tags: [fraud, imbalanced, labels, agents, case-study]
---

## The challenge

Stripe Radar decides, in milliseconds, whether a payment looks like fraud. Its strength is the network: a card that is new to one shop may have years of clean history elsewhere on Stripe, and one IP address may link several suspicious cards. Shield, one of Radar’s models, learns representations of cards, businesses and other entities and combines them to score each payment.

Stripe wanted Shield to catch more fraud specific to certain businesses, products and countries, without blocking honest payments that just look unusual.

The catch: Shield trained on about 800 million payments, but that was only a fraction of the history. To keep training fast, it kept every known fraud and only a random sample of the rest. Stripe suspected that seeing the full history would teach Shield what is normal for each card and each business.

## Step 1: Train on everything, fast

For the first experiment, they dropped the sampling and used every eligible payment from nine months: **11 billion** instead of 800 million. After one pass the new model was close to the old one; after three passes it beat it.

But one pass took a whole day. To try ideas daily, that had to shrink. Step by step they cut it from 24 hours to **4.8 hours**:

- Streaming data from cloud storage straight into memory, instead of copying it to disk first, halved the time.
- Compiling the training step, using lower-precision arithmetic and running the model’s parallel branches at the same time brought it to about seven hours.
- Cutting peak memory from 1.3 TB to 500 GB allowed more data loaders, and compressing the data sent between GPUs did the rest.

The bigger dataset also made the model about three times larger, around 30 million parameters, with no slowdown when scoring payments.

## The twist: labels that arrive late

The new model looked better offline and in early production results. Then, as weeks passed, its measured performance **fell below the old model**, and Stripe had to roll it back.

Why? When a card is stolen, the owner may take weeks to notice and report it. Only then does Stripe learn that a payment from weeks ago was fraud.

![Fraud reports arrive slowly: about 41% within 14 days, 66% within 30 days and 86% within 60 days](/images/toolbox/stripe-fraud-reports.svg)

So the newest weeks of training data are full of fraud that is still labelled “legitimate”. The old sampling had hidden this by accident: it threw away most unlabelled payments, and with them most of the not-yet-reported fraud. Removing the sampling added the intended legitimate examples, but also about **20 times more fraud wrongly labelled as legitimate**. The model learned that patterns of late-reported fraud were safe, and got worse at exactly that kind of fraud.

It is a hard trade-off: recent data helps the model keep up with new attacks, but recent labels can’t yet be trusted.

## Step 2: Let agents run the experiments

Each fix needed many experiments, and each experiment needed engineers to prepare data, watch training and debug failed runs. So Stripe built **Agentic MLE**: tools and written instructions that let AI agents work inside Stripe’s machine learning platform and carry an experiment from idea to result. They explore data, write a new feature, compute its history, train a model and compare it with the baseline. Engineers review the hypotheses and results at set points and decide what ships.

The key was writing down the team’s working knowledge so agents could use it: which datasets and keys to use, how to reconstruct what was known at the time of each payment, and how to diagnose a failed training job before rerunning it.

**Put to work on a real attack.** During one fraud attack, Shield was scoring fraudulent payments as low risk. Agents used model explanations to see which features made the fraud look safe, producing testable ideas. Humans picked from 38 ideas; agents implemented them, trained models, fixed failed runs and evaluated the results.

Several agents pointed to the same thing: **stochastic weight averaging**, which averages snapshots of the model taken during training. Shield already used it, but only from halfway through. Training loss was still falling while validation loss rose, a sign of overfitting. The best setup started averaging from the very first epoch and shortened training to eight epochs.

**The result: recall up by more than 8%**, which Stripe estimates is worth tens of millions of dollars a year in prevented fraud for its businesses.

## Summaries 

1. **Sampling choices hide assumptions.** Dropping the sampling looked like pure gain, but the sampling had been quietly protecting the model from bad labels. See [sampling methods](/toolbox/statistics/sampling-methods/).
2. **Labels have an age.** In fraud, churn and credit risk, the outcome arrives late. Recent data needs special care, in training and in evaluation, or a model will look great at first and decline later.
3. **Speed is a feature.** Cutting a training run from a day to a few hours is what made it possible to understand the problem at all.
4. **Agents work best with written-down know-how and human checkpoints.** The agents didn’t replace the engineers; they did the repetitive parts of the loop, while people set priorities and decided what to release.
