---
title: In-context learning
summary: A large language model picking up a new task from the instructions and examples in its prompt, without any change to its weights.
category: Prompting
status: seedling
created: 2026-10-25
order: 3
problem: Why can an LLM do a task it was never specifically trained for, just because I described it or showed examples? And how do I use that well?
why: It is the ability behind zero-shot and few-shot prompting, and behind putting documents in the prompt in RAG. Understanding it explains why prompt content matters so much, and why the model “forgets” everything once the conversation ends.
decides: Nothing is trained. The model treats the whole prompt, instructions, examples and documents, as context, and predicts the most likely next tokens given all of it. The examples steer that prediction in the same way the start of a sentence steers how it ends.
assumptions:
  - The model is large enough. In-context learning gets much stronger with model size.
  - All the needed information fits in the context window, and the important parts aren’t lost in the middle of a very long prompt.
related: [llms-and-agents/zero-shot-learning, llms-and-agents/few-shot-learning, llms-and-agents/retrieval-augmented-generation, deep-learning/transformer]
references:
  - title: IBM, What is in-context learning?
    url: https://www.ibm.com/think/topics/in-context-learning
  - title: Brown et al. (2020), Language models are few-shot learners. NeurIPS.
  - title: Liu et al. (2024), Lost in the middle, how language models use long contexts. Transactions of the ACL.
tags: [llm, prompting, deep-learning]
---

## How it works

Two very different ways to teach a model a task:

| | Fine-tuning | In-context learning |
| --- | --- | --- |
| What changes | The model’s weights | Only the prompt |
| Needs | Hundreds to thousands of examples, training time | A few examples or a good instruction |
| Lasts | Permanently | Only for this request |
| Cost | Up front | On every call, since the prompt is longer |

Zero-shot (instructions only) and few-shot (instructions plus examples) are both forms of in-context learning. So is [RAG](/toolbox/llms-and-agents/retrieval-augmented-generation/), where retrieved documents are added to the prompt.

Why it works is still an active research question. One useful view: during pretraining, the model saw countless texts where a pattern is shown and then continued, so it learned to spot and continue patterns in whatever it is given. Inside the [transformer](/toolbox/deep-learning/transformer/), attention lets every new token draw on the examples directly.

## Example

The same model, two prompts:

- “Translate to Swedish: cheese” gives “ost”.
- “Rhyme with: cheese” gives “please”.

The input word is identical; only the context changed the task.

## Watch out for

- Assuming the model remembers. Each new request starts fresh, except for what you put in the prompt again.
- Very long prompts. Information in the middle of a long context is used less reliably than at the start or end. Put the key instruction near the end, close to the question.
- Mixing up the two meanings of “learning”. Nothing is learned permanently; the model just conditions on the prompt.
