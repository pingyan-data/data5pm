---
title: Foundation models
summary: Large models pretrained once on huge amounts of unlabelled data, then adapted to many different tasks by prompting or fine-tuning.
category: Foundations
status: seedling
created: 2026-10-26
order: 2
problem: I need a model for a language or image task, like summarising customer calls or sorting product photos, but I don’t have millions of labelled examples or the budget to train a model from scratch. What do I build on?
why: A foundation model has already learned general patterns of language, images or code from a vast dataset. Most of the expensive learning is done, so a prompt, a few examples or a small labelled dataset is often enough to adapt it. One model can serve many tasks, which is why most modern AI products start from one instead of from zero.
decides: During pretraining, the model learns to predict a hidden part of its input from the rest, such as the next word, a masked word, or which caption belongs to which image. At use time, a language model turns the prompt into tokens and repeatedly picks a likely next token. When it is adapted with a small classifier on top, the model turns each input into an embedding, a list of numbers that captures its meaning, and the classifier draws the decision boundary in that space.
assumptions:
  - Your task is close to something the pretraining data covered. The further your data is from it, like specialised medical scans or a rare language, the more adaptation you need.
  - You can check the output. Foundation models make confident mistakes, so you need a way to measure quality on your own data.
related: [deep-learning/transformer, llms-and-agents/natural-language-processing, llms-and-agents/zero-shot-learning, llms-and-agents/few-shot-learning, llms-and-agents/retrieval-augmented-generation, computer-vision/clip, machine-learning/semi-supervised-learning]
references:
  - title: IBM, What are foundation models?
    url: https://www.ibm.com/think/topics/foundation-models
  - title: Bommasani et al. (2021), On the opportunities and risks of foundation models. Stanford CRFM.
    url: https://arxiv.org/abs/2108.07258
  - title: Devlin et al. (2019), BERT, pre-training of deep bidirectional transformers for language understanding. NAACL.
  - title: Hugging Face, Transformers documentation
    url: https://huggingface.co/docs/transformers
tags: [foundation-models, llm, pretraining, fine-tuning, transfer-learning]
---

## How it works

The term was coined by Stanford researchers in 2021. The model is a **foundation**: a shared base that many specific applications are built on. A weak base means every application on top inherits its flaws.

A foundation model is made in two stages.

**1. Pretraining.** Train a big network, usually a [transformer](/toolbox/deep-learning/transformer/), on a vast amount of unlabelled data. Nobody labels anything. The training task is made from the data itself, which is called **self-supervised learning**: hide a word and predict it, predict the next word, or match images with their captions. To do this well, the model has to learn grammar, facts, visual shapes and much more.

**2. Adaptation.** Reuse what it learned for your task. This is **transfer learning**. There are several ways, from cheapest to most expensive:

| Approach | What changes | When I’d use it |
| --- | --- | --- |
| [Zero-shot](/toolbox/llms-and-agents/zero-shot-learning/) or [few-shot](/toolbox/llms-and-agents/few-shot-learning/) prompting | Nothing, only the prompt | First try, always. Fast to test. |
| [Retrieval-augmented generation](/toolbox/llms-and-agents/retrieval-augmented-generation/) | Nothing, relevant documents are added to the prompt | The model needs facts it wasn’t trained on, like company documents |
| Embeddings with a small classifier on top | Only the small classifier | A classification or search task with a few hundred labels |
| Fine-tuning | The model’s own weights, on labelled examples | Prompting isn’t good enough and you have thousands of good examples |

Foundation models can be **unimodal**, working with one type of data like text (BERT, GPT), or **multimodal**, combining text, images, audio or code (like [CLIP](/toolbox/computer-vision/clip/) or image generators like Stable Diffusion).

Large language models are the best-known kind, but not the only one. The term also covers vision, speech, code and even robotics models.

## How it decides, step by step

BERT, one of the first foundation models, was pretrained by hiding words in sentences. Given “The capital of [MASK] is Stockholm”, it outputs a probability for every word in its vocabulary. “Sweden” gets the highest one. Repeating this over billions of sentences teaches it which words fit which contexts.

To adapt it for sentiment, you feed in a review and take the final vector for the whole sentence. Reviews with similar meaning end up close together in that space. A logistic regression trained on 500 labelled reviews then only has to draw a line between “positive” and “negative” regions, which is easy because the hard work of understanding the language is already done.

## In code

The cheapest adaptation for a classification task is to use the model’s embeddings as features:

```python
from sentence_transformers import SentenceTransformer
from sklearn.linear_model import LogisticRegression

encoder = SentenceTransformer("all-MiniLM-L6-v2")      # small pretrained text model
X_train = encoder.encode(train_texts)                  # one vector per text
X_test = encoder.encode(test_texts)

clf = LogisticRegression(max_iter=1000).fit(X_train, train_labels)
print(clf.score(X_test, test_labels))
```

## Watch out for

- Hallucinations. Generative models produce fluent, confident text that can be wrong. Check facts, or ground the model with retrieval.
- Bias and unclear training data. The model inherits the biases of its training data, and fine-tuning doesn’t remove them. You often can’t see what data it was trained on.
- Sending sensitive data to a hosted model. Customer or company data in a prompt leaves your systems unless you run the model yourself.
- Fine-tuning too early. It costs data, computing power and maintenance, and can make the model worse at other tasks. Try prompting, retrieval and embeddings first.
