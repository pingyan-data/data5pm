---
title: Retrieval-augmented generation (RAG)
summary: Answering questions with an LLM by first searching your own documents for relevant passages, then giving them to the model as context.
category: Retrieval
status: seedling
created: 2026-10-25
order: 1
problem: I want an LLM to answer questions about my own documents, like company policies or my job-ads dataset, which it never saw in training, without making things up.
why: The model answers from passages you hand it, so answers can be current, specific to your data and traceable to a source. Updating knowledge is as easy as updating the documents, with no retraining.
decides: Two decisions. First, retrieval ranks document chunks by how similar their embeddings are to the question’s embedding, often combined with keyword search, and keeps the top few. Then the LLM reads those chunks plus the question and generates the most likely answer grounded in them.
assumptions:
  - The answer actually exists in the documents. RAG can’t fix missing information.
  - Retrieval finds the right passages. Most RAG failures are retrieval failures, not generation failures.
related: [llms-and-agents/in-context-learning, llms-and-agents/natural-language-processing]
references:
  - title: Stanford HAI, What is retrieval-augmented generation?
    url: https://hai.stanford.edu/ai-definitions/what-is-rag
  - title: Lewis et al. (2020), Retrieval-augmented generation for knowledge-intensive NLP tasks. NeurIPS.
tags: [llm, retrieval, search, embeddings]
---

## How it works

**Prepare once:**

1. **Chunk** documents into passages, often a few hundred words, ideally along natural breaks like sections.
2. **Embed** each chunk: turn it into a vector, so similar meanings get similar vectors.
3. **Index** the vectors in a vector database or a simple array.

**For every question:**

4. Embed the question the same way.
5. **Retrieve** the most similar chunks, usually by cosine similarity. Adding keyword search (BM25) helps with names, codes and exact terms; this is called hybrid search.
6. Optionally **rerank** the candidates with a more precise model.
7. **Generate**: give the LLM the question and the chunks, with an instruction to answer only from them and cite which chunk each claim comes from.

## How it decides, step by step

Question: “Which data jobs in Gothenburg mention dbt?”

1. The question’s embedding is compared with every chunk of every job ad.
2. The top 5 chunks by similarity are ads that mention dbt, most of them in Gothenburg.
3. The prompt becomes: instructions, those 5 chunks with their ad IDs, then the question.
4. The LLM writes the answer and lists the ad IDs it used. If none of the chunks answers the question, a good prompt makes it say so instead of guessing.

## In code

```python
import numpy as np
from sentence_transformers import SentenceTransformer

model = SentenceTransformer("paraphrase-multilingual-MiniLM-L12-v2")
chunk_vecs = model.encode(chunks, normalize_embeddings=True)

def retrieve(question, k=5):
    q = model.encode([question], normalize_embeddings=True)[0]
    top = np.argsort(chunk_vecs @ q)[::-1][:k]          # cosine similarity
    return [chunks[i] for i in top]

context = "\n\n".join(retrieve(question))
prompt = f"Answer only from the context. Say if it isn't there.\n\nContext:\n{context}\n\nQuestion: {question}"
# answer = llm(prompt)
```

## Watch out for

- Evaluating only the final answers. Measure retrieval separately: for a set of test questions, is the right chunk in the top k?
- Bad chunking. Splitting in the middle of a table or a sentence loses meaning. Keep titles or section names with each chunk.
- Stale indexes. When documents change, re-embed them.
