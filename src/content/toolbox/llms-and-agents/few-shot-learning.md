---
title: Few-shot learning
summary: Teaching a model a task from just a handful of examples, usually by putting them directly in the prompt.
category: Prompting
status: seedling
created: 2026-10-25
order: 2
problem: Zero-shot answers are close but inconsistent. The model doesn’t quite get my labels, tone or output format, and I only have a few good examples, not thousands.
why: A few well-chosen examples show the model exactly what you mean, including edge cases and format, which is often clearer than any description. It needs no training, so you can improve results in minutes.
decides: The model reads the examples and the new input, infers the pattern that links inputs to outputs, and continues that pattern for the new input, generating the most probable answer.
assumptions:
  - The examples are correct, consistent and cover the main cases, including tricky ones.
  - Everything fits in the context window.
related: [llms-and-agents/zero-shot-learning, llms-and-agents/in-context-learning]
references:
  - title: Stanford HAI, What is few-shot learning?
    url: https://hai.stanford.edu/ai-definitions/what-is-few-shot-learning
  - title: Brown et al. (2020), Language models are few-shot learners. NeurIPS.
tags: [llm, prompting]
---

## How it works

Put a few input–output pairs before the real input. Typically 2 to 10. One example is called one-shot.

Like zero-shot, the name also has an older meaning: in classic machine learning, few-shot learning means training a model to recognise new classes from very few labelled images, using techniques like meta-learning. With LLMs, it usually means examples in the prompt.

What makes examples work well:

- **Variety.** Cover different kinds of input, not five versions of the same case.
- **Edge cases.** Include the ambiguous ones you care about most.
- **Balance.** If all examples have the same label, the model leans towards it.
- **Exact format.** The model copies the format of the examples very closely.

## Example

> Extract the salary range as JSON.
>
> Ad: “Lön 45 000–55 000 kr/mån” → {"min": 45000, "max": 55000, "period": "month"}
> Ad: “Competitive salary” → {"min": null, "max": null, "period": null}
> Ad: “Timlön 180 kr” → {"min": 180, "max": 180, "period": "hour"}
>
> Ad: “Månadslön från 38 000 kr” →

The examples teach the format, the Swedish terms and how to handle a missing salary, all things that are tedious to describe in words.

## In code

```python
examples = [
    ("Lön 45 000–55 000 kr/mån", '{"min": 45000, "max": 55000, "period": "month"}'),
    ("Competitive salary", '{"min": null, "max": null, "period": null}'),
]
prompt = "Extract the salary range as JSON.\n\n"
prompt += "\n".join(f"Ad: {a}\nJSON: {j}" for a, j in examples)
prompt += f"\n\nAd: {new_ad}\nJSON:"
```

## Watch out for

- The order and choice of examples can change results noticeably. Test a few variations on a labelled sample.
- Long examples use up the context window and cost more on every call. When you have hundreds of good examples, fine-tuning may be cheaper.
