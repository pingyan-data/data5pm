---
title: Natural language processing
summary: The field of getting computers to work with human language, from counting words to large language models.
category: Foundations
status: seedling
created: 2026-10-25
order: 1
problem: Much of the information I care about is text, like job ads, reviews, emails and reports. How do I turn it into something a computer can search, sort and analyse?
why: Knowing the main approaches, and how they evolved, helps pick the simplest tool that works. Many text problems don’t need an LLM at all, while others are only practical with one.
assumptions:
  - Text is cleaned and in a consistent language, or the method handles several languages.
related: [deep-learning/transformer, llms-and-agents/zero-shot-learning, llms-and-agents/retrieval-augmented-generation]
references:
  - title: Stanford HAI, What is natural language processing?
    url: https://hai.stanford.edu/ai-definitions/what-is-nlp
  - title: Jurafsky and Martin, Speech and Language Processing, 3rd edition draft. Free online.
    url: https://web.stanford.edu/~jurafsky/slp3/
tags: [nlp, text, llm]
---

## How it works

NLP has moved through four broad stages. Each is still useful somewhere.

| Approach | Idea | Still good for |
| --- | --- | --- |
| Rules and patterns | Hand-written rules and regular expressions | Extracting dates, IDs, salaries in a fixed format |
| Bag of words, TF-IDF | Count words; weight rare, telling words higher | Fast, cheap baselines for classification and search |
| Word embeddings | Each word becomes a vector, and similar words get similar vectors | Similarity and clustering of words |
| Transformers and LLMs | Context-aware representations, pretrained on huge amounts of text | Almost everything: classification, extraction, summarising, translation, question answering |

**Common tasks:** classification (spam, sentiment, topic), named entity recognition (finding names, companies, places), information extraction, search and retrieval, summarisation, translation and question answering.

**Tokenisation** is the first step in every modern method: splitting text into units, usually word pieces, that the model has a vector for.

## Example

Classifying Swedish job ads by role:

1. Quick baseline: TF-IDF features and [logistic regression](/toolbox/machine-learning/logistic-regression/). Trains in seconds and is easy to explain.
2. Better: sentence embeddings from a multilingual transformer, then the same logistic regression on top.
3. No labels yet: ask an LLM to classify with a clear instruction, a [zero-shot](/toolbox/llms-and-agents/zero-shot-learning/) approach, then check a sample by hand.

## In code

```python
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import make_pipeline

baseline = make_pipeline(TfidfVectorizer(ngram_range=(1, 2), min_df=2), LogisticRegression(max_iter=1000))
baseline.fit(texts, labels)

from sentence_transformers import SentenceTransformer
emb = SentenceTransformer("paraphrase-multilingual-MiniLM-L12-v2").encode(texts)
```

## Watch out for

- Jumping straight to an LLM. Try the TF-IDF baseline first; it is often close, and far cheaper.
- English-only models on Swedish or mixed-language text. Use multilingual models.
