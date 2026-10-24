---
title: Zero-shot learning
summary: Getting a model to do a task it was never trained on, with no examples, just from a description of what to do.
category: Prompting
status: seedling
created: 2026-10-25
order: 1
problem: I need to classify or extract something new, like tagging job ads by seniority, but I have no labelled data and no time to train a model.
why: Large pretrained models already know a lot about language and the world. A clear instruction is often enough to put that knowledge to work immediately, which makes zero-shot the fastest way to test whether a task is feasible.
decides: An LLM reads the instruction and the input, then generates the most probable continuation, which is the answer in the requested format. In classic zero-shot classification, like CLIP, the model compares the input with a text description of each label and picks the closest.
assumptions:
  - The task is something the model has seen enough similar examples of during pretraining.
  - The instruction is clear and specific, including the output format and the list of allowed labels.
related: [llms-and-agents/few-shot-learning, llms-and-agents/in-context-learning, computer-vision/clip]
references:
  - title: IBM, What is zero-shot learning?
    url: https://www.ibm.com/think/topics/zero-shot-learning
  - title: Brown et al. (2020), Language models are few-shot learners. NeurIPS.
tags: [llm, prompting]
---

## How it works

The term comes from classic machine learning: recognising classes that had **zero** training examples, by relating them to something the model does know, like a text description of each class. CLIP does this for images.

With LLMs, zero-shot simply means asking for the task with instructions only, and no examples in the prompt.

A good zero-shot prompt says:

1. What the task is, in one or two sentences.
2. The allowed outputs, an exact list of labels or a schema.
3. How to handle unclear cases (“If the seniority isn’t stated, answer unknown”).

## Example

> Classify the seniority of this job ad. Answer with exactly one of: junior, mid, senior, unknown.
>
> Job ad: “We are looking for a data engineer with 6+ years of experience who will mentor the team…”

The model answers “senior” without ever having seen a labelled job ad from your dataset.

## In code

```python
from transformers import pipeline

clf = pipeline("zero-shot-classification", model="facebook/bart-large-mnli")
clf("We need a data engineer with 6+ years of experience to mentor the team.",
    candidate_labels=["junior", "mid", "senior"])
```

## Watch out for

- Not measuring it. Label 50 to 100 examples by hand and check the accuracy before trusting the output at scale.
- Vague labels. If people would disagree on the label, the model will be inconsistent too. If zero-shot isn’t good enough, add examples and move to [few-shot](/toolbox/llms-and-agents/few-shot-learning/).
