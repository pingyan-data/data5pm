---
title: Transformer
summary: A neural network built on attention, which lets every part of the input look at every other part to decide what matters. The basis of modern LLMs.
category: Architectures
status: seedling
created: 2026-10-25
order: 2
problem: In language, the meaning of a word depends on other words, sometimes far away (“The trophy didn’t fit in the suitcase because it was too big”). How can a model connect any two positions directly?
why: Attention links every token to every other token in one step, so long-range relationships are easy to learn. It also processes all positions in parallel, which makes training on huge datasets fast. The same design now powers language models, vision transformers and multimodal models.
decides: For each token, attention compares its query with every other token’s key to get relevance weights, then takes a weighted mix of their values. After many such layers, a language model turns the final representation into a probability for every possible next token, and picks or samples one.
assumptions:
  - Lots of training data and computing power. Transformers shine at scale and are usually used pretrained.
  - The input fits in the context window. Attention cost grows with the square of the input length.
related: [deep-learning/neural-network, computer-vision/vision-transformer, llms-and-agents/in-context-learning, llms-and-agents/natural-language-processing]
references:
  - title: Vaswani et al. (2017), Attention is all you need. NeurIPS.
  - title: Jay Alammar, The illustrated transformer
    url: https://jalammar.github.io/illustrated-transformer/
tags: [deep-learning, attention, llm]
---

## How it works

**1. Tokens and embeddings.** Text is split into tokens, word pieces, and each token becomes a vector. A positional encoding is added, since attention by itself ignores order.

**2. Self-attention.** Each token produces three vectors: a **query** (what am I looking for?), a **key** (what do I contain?) and a **value** (what do I pass on?). Relevance is the match between queries and keys:

$$
\text{Attention}(Q, K, V) = \text{softmax}\!\left(\frac{QK^\top}{\sqrt{d}}\right) V
$$

The softmax turns the scores into weights that add up to 1, and each token’s new vector is a weighted mix of the values. Dividing by $\sqrt{d}$ keeps the scores in a range where softmax works well.

**3. Multi-head attention.** Several attention operations run side by side, each free to focus on a different relationship, like grammar in one head and topic in another.

**4. Stacking.** Each layer is attention followed by a small feed-forward network, with residual connections and normalisation. Large models stack dozens of layers.

Encoder models (like BERT) read the whole input at once and suit classification and search. Decoder models (like GPT-style LLMs) only look backwards and generate text one token at a time.

## How it decides, step by step

In “The trophy didn’t fit in the suitcase because it was too big”, when the model processes “it”, its query matches the key of “trophy” more strongly than “suitcase”, so most of the attention weight goes to “trophy”. The representation of “it” now carries the meaning “the trophy”.

For generation, after the last layer the model outputs a probability for every token in its vocabulary. With the prompt “The capital of Sweden is”, “ Stockholm” gets a very high probability and is chosen. Then the whole process repeats for the next token.

## In code

```python
from transformers import pipeline

classify = pipeline("sentiment-analysis")
classify("The new release is much faster.")

generate = pipeline("text-generation", model="gpt2")
generate("The capital of Sweden is", max_new_tokens=5)
```

## Watch out for

- Long inputs are expensive, because attention compares every pair of tokens.
- Attention weights are tempting to read as explanations, but they are only a rough guide to what drives a prediction.
