---
kind: story
title: "LLM-as-a-judge at Netflix"
summary: How Netflix uses a second LLM to check thousands of AI-written recommendation explanations, and keeps that judge honest with people in the loop at every step.
category: LLM evaluation
company: Netflix
created: 2026-10-25
order: 1
source:
  title: Netflix TechBlog, The lifecycle of LLM-as-a-judge (2026)
  url: https://netflixtechblog.com/the-lifecycle-of-llm-as-a-judge-building-aligning-and-monitoring-at-scale-c95bd8283508
related: [llms-and-agents/few-shot-learning, llms-and-agents/in-context-learning, machine-learning/classification-metrics]
references:
  - title: Netflix TechBlog (2026), The lifecycle of LLM-as-a-judge, building, aligning and monitoring at scale.
    url: https://netflixtechblog.com/the-lifecycle-of-llm-as-a-judge-building-aligning-and-monitoring-at-scale-c95bd8283508
tags: [llm, evaluation, human-in-the-loop, recommendation, case-study]
---

## The challenge

Netflix tested short, AI-written explanations next to recommended titles: a sentence saying why a show was picked, by linking it to something you watched before, through shared genre or tone. A misleading explanation would damage the very trust it was meant to build.

An LLM wrote hundreds of thousands of these explanations a week. Nobody can read that many. So, like many teams, Netflix used a second LLM to grade them, an **LLM-as-a-judge**.

That raises an awkward question: who checks the judge? If it quietly starts approving bad output, nothing downstream will notice.

Netflix’s answer fits in one sentence: **a judge never works alone. It is anchored to human judgment at every stage of its life.**

## The four stages of a judge’s life

| Stage | What happens | Who is in charge |
| --- | --- | --- |
| 1. Birth | Build a benchmark of good and bad examples | Writing experts and trained raters |
| 2. Training | Tune the judge until it agrees with humans | Engineers, checked against human labels |
| 3. Work | The judge filters and critiques explanations live | Rules set by people |
| 4. Check-ups | Weekly human review to catch drift | Raters, with sign-off on every change |

## Stage 1: Defining what “good” means

Everything depends on this step, so it is the most human-heavy. Writing experts defined the must-have qualities of an explanation, wrote labelling guidelines, and hand-crafted tricky examples designed to fool a judge. The same guidelines became both the raters’ rulebook and the judge’s first rubric.

They built their own benchmark instead of using a public one, because their task is unusual: very short texts, each tied to specific titles, and judged against Netflix’s own editorial standard. It mixed three sources: expert-made tricky cases, borderline examples generated on purpose and then rated by humans, and real explanations sampled from the generator.

Two small details turned out to matter a lot. The benchmark keeps growing every week, so it never goes stale. And every “fail” label comes with a written reason from the human rater.

## Stage 2: Right answer, wrong reason

Here is the most interesting idea in the story. A judge can agree with humans on the **label** while reaching it for the **wrong reason**. On a dashboard it looks perfect. But the judge’s reasons are also used to tell the generator how to fix its text, so a wrong reason means wrong advice.

So Netflix tunes the judge on both labels and reasons. The judge itself is never retrained; only its **rubric text** in the prompt is improved, in a loop:

1. Score the training examples with the current rubric.
2. Check agreement with humans on held-out data. If good enough on every criterion, stop.
3. Otherwise collect the mistakes and hand them to a third LLM, the **Reflector**, which rewrites the rubric.

The trick is what counts as a mistake. Besides label disagreements, a fourth model, the **Meta-Judge**, compares the judge’s reason with the human’s reason whenever both said “fail”. If the reasons differ, it is also treated as a mistake. (The Meta-Judge was itself checked against humans first, and agreed with them almost every time.)

They track three numbers per criterion: how often the judge correctly rejects bad explanations (the most important, since a bad one slipping through is the real risk), how often it correctly passes good ones, and how often its reasons match the humans’.

**Did the reasons help?** Compared with tuning on labels alone, results were similar on two criteria, where there was little room to improve. On the third, the label-only loop slowly rewrote the rubric into something worse with every round, while the reason-aware loop stayed stable and improved. Reasoning that is unsound doesn’t carry over to new data.

## Stage 3: Gatekeeper and coach

Once aligned, one judge does two jobs:

- **Gate.** It blocks any explanation that fails a must-have criterion.
- **Critic.** It explains why, and that reason is added to the generator’s prompt for another try.

Retries are capped at three. Most of the improvement comes in the first few rounds, and more retries can’t rescue a weak generator, they mainly help a strong one. An explanation that still fails is **dropped rather than shown**. A bad explanation costs trust; a missing one only costs an opportunity.

**But do approved explanations actually help?** Passing the judge proves an explanation meets Netflix’s bar, not that members find it useful. So they ran a month-long A/B test on the mobile app. Members who saw explanations explored more titles they hadn’t watched before, and more browsing sessions ended in a real play. Agreement with raters was necessary, but only the online test could show the explanations were useful.

## Stage 4: Regular check-ups

A judge that is well aligned at launch drifts, as the catalogue and the standards change.

Every week, about 300 explanations are sampled, spread across served, revised and dropped ones and weighted towards new titles. At least three raters label each one, and the majority vote is the truth.

The bar for the judge is clever: it isn’t a fixed number. The judge must score within the range of the human raters themselves, no more than two standard deviations below the average rater. In a hard week, when humans disagree more, the bar relaxes with them. Falling below it triggers retuning, and a person must approve any new rubric before it goes live, with the old one kept for instant rollback.

The weekly review also catches things no metric can: explanations that exaggerate how similar two titles are, vague words like “fun” that technically pass but say nothing, odd reference titles, and text that meets every rule yet reads like word soup. Those findings update the guidelines themselves, which feed both raters and judge.

## What I take away

1. **Build the benchmark before the judge**, and make humans write down *why*. A small set with reasons beats a large set with only labels.
2. **Check the reasoning, not just the verdict.** Right answers for wrong reasons don’t hold up on new data.
3. **One well-aligned judge can do several jobs.** Alignment is the expensive part, so reuse it.
4. **Plan monitoring from day one.** A judge is a model, and models drift.
5. **Keep people in the loop by design.** Automating evaluation isn’t the same as handing over responsibility for it.
