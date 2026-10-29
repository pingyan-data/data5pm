---
kind: note
title: Evaluating LLMs and agents
summary: What I learned from two videos about measuring LLM apps and AI agents, from unit tests and aligned LLM judges to the four dimensions of agent reliability.
category: Evaluation
status: seedling
created: 2026-10-29
order: 1
draft: false
related: [system-design/netflix-llm-as-a-judge]
references:
  - title: Dave (Data Lumina), crash course on LLM evaluations (YouTube video)
  - title: Hugging Face, the first Agentic Evals Workshop (YouTube video)
tags: [llm, evaluation, agents, llm-as-a-judge]
---

These are my notes from two YouTube videos about evaluating LLMs and AI agents.

## Why it matters

There is a lot of hype around AI agents, but the numbers are more careful. Gartner has predicted that by 2027 around 40% of agentic AI projects will be cancelled. MIT has reported that roughly 95% of generative AI pilots are failing. Maybe these numbers aren’t exactly right, but I think there is truth in them and lessons to learn.

The main lesson: getting something to work once, on the “happy path”, is very different from getting it to work in the real world. The real skill is measuring how well your system actually performs, and then improving it again and again in a systematic way. That measuring is called evaluation.

I start with the basics of LLM evaluation from a practical crash course. Then I move on to evaluating agents, which is harder and more interesting, and where I really want to focus.

## The basics

The first video is a crash course on LLM evaluations by Dave, from a team called Data Lumina. It’s for people building real apps on top of LLMs who want to ship them reliably. His main argument is that an LLM app is never really finished, because you can always improve it. So you need a disciplined way to tell whether each change makes things better or worse.

### Why LLMs are hard to test

LLMs are non-deterministic, so the same input can give different outputs. They are sensitive to context. An answer can be factually correct and still feel wrong. One question can have many good answers. And the ways they fail are often subtle and hard to predict.

You can catch problems afterwards by watching your logs and traces. Dave uses a tool called Langfuse for this. But then you only react to problems as they show up. You don’t find out whether fixing one thing, like editing a system prompt, quietly broke three other things somewhere else. That is the gap evaluation fills.

### Three challenges

Dave describes LLM development as three challenges. I found this a useful way to think about it.

- **Understanding your data.** When you build a workflow, you test it on a few simple examples, the happy path. Once real users arrive, things look completely different. Users are unpredictable, and you often don’t really know what is flowing through your system at scale.
- **The specification gap.** You know a good answer when you see one, but writing that instinct down as clear instructions in a prompt is surprisingly hard. And when an answer is bad, you need to be able to tell whether it was the prompt, the retrieval or a bug in your logic.
- **Inconsistent behaviour.** The system does well on your test cases, then acts strangely on real inputs. Small changes in wording can give completely different outputs, so the whole thing feels unreliable.

He says success depends on how fast you can iterate. Fast iteration needs three things working together: good evaluation, good debugging, and the ability to change your system based on what you learn. Most teams only do the third, which is why they never get past the demo.

### What an eval is

The definition is simple. An evaluation is a systematic measurement of quality in an AI system, usually shortened to “eval”. One eval measures one thing, like factual accuracy, tone, following instructions or sticking to a format. A system usually has several evals.

You can use evals in three ways:

- run them quietly in the background to monitor performance over time
- use them as guardrails that block bad outputs in real time
- use them to help you label data for test sets

Dave calls the whole practice a loop: analyze, measure, improve. You look at everything flowing through your system and group the ways it fails. You turn what you find into numbers; a simple pass or fail is fine to start. Then you improve by changing prompts, models or architecture, and go round again.

### Three levels

This was the most useful part of the video for me. There are three levels of evaluation. Cost and effort go up at each level, which tells you how often to run each one.

**Level 1: unit tests.** These are the same fast, cheap checks you know from software engineering, like Python `assert` statements. For LLMs, the most practical use is testing structured output. Say your workflow classifies support tickets. You can assert that the category is one of your known categories, that the confidence score is a float between 0 and 1, and that a particular ticket is classified as “billing”. You keep raw events in an `evals` folder and run these tests on every code or prompt change. What you test comes from the failures you have actually seen.

**Level 2: human and model evaluation.** This is the heart of it, and the part almost everyone wants to skip. Most people jump straight to letting an LLM judge their system automatically, because it sounds easy. Dave’s strong warning is that you can’t skip the human step. If you don’t know yet what good looks like or how to score it, you can’t tell a model how to do it for you.

So the order matters. First, people (you, and ideally domain experts) look at a lot of data and judge the outputs. Make looking at data as easy as possible; an Excel sheet is enough to start. Only when you have a feel for how a human judges your system do you bring in an LLM-as-a-judge. Use the most capable model you can afford, and ask it for detailed critiques, not bare scores.

Then you align the judge with the humans:

1. Take about 100 examples, real ones if you can, synthetic ones to start.
2. Run them through your workflow to get input and output pairs.
3. Let an LLM write a critique and a pass or fail for each pair.
4. At the same time, have a human judge the same pairs. The human judgment is your gold standard.
5. Score 1 where the model and the human agree and 0 where they don’t. That gives you an agreement score.
6. Keep the human critiques fixed and improve the judge’s prompt. Dave suggests meta-prompting: give the disagreements to a strong model and ask it to rewrite the judge prompt, until agreement gets close to 100%.

Your data and your system will drift over time, so this is never done. You keep tracking agreement.

**Level 3: A/B testing.** This is the hardest and most expensive level. You use real users to measure business impact, comparing prompts, models or whole workflows on things like user satisfaction, task completion or retention. Dave is honest that even his own team hasn’t fully automated this. It only really pays off once an app is mature and has many users.

### Two kinds of metrics

Dave splits metrics into two groups, and the difference matters.

Reference-based metrics are for when you know the right answer. You can use exact string matching, semantic similarity, the result of running code, SQL correctness or checks on structured data. These are fairly easy, and many of them fit into level 1 unit tests.

Reference-free metrics are for when there is no single right answer, which is most of the real world. A customer service reply can be written in countless good ways. Here you score things like tone, length, no hallucination, format and safety, usually on a scale. These are much harder, and this is where an LLM judge earns its place. His advice is to start binary, good or bad, before trying anything fancier.

### Common mistakes

Dave ends with four mistakes he sees all the time:

- **Tool-first thinking.** Reaching for a new vector database or a shiny eval platform instead of understanding the actual problem. Start simple and build what you need.
- **Chasing generic metrics.** Drowning in meaningless scores like “helpfulness 4.2”. Use specific metrics you can act on, and start with true or false.
- **Avoiding your data.** Assuming a tool or the LLM will catch problems, or going on gut feeling. He mentions a principal engineer at Zapier who spends three hours a day looking at traces. You never stop looking at data.
- **Unaligned judges.** Assuming your LLM judge works without checking it against humans first.

His principles are the opposite of these: start simple and specific, look at lots of real data, reuse tools you already have before buying new ones, build evals for your own domain, and use LLMs only to scale the work, like generating test cases and labelling lots of data, while always checking with humans.

## Evaluating agents

The second video is quite different. It’s the first Agentic Evals Workshop run by Hugging Face, hosted by Ben from their community education team, with speakers from research, industry, policy and open source. It’s more scattered than Dave’s tidy crash course, but it takes the same ideas much further, to agents that plan, act and run for a long time. Two things stood out for me: why evaluating agents is so hard, and the four dimensions of reliability.

### Why it’s hard

The first speaker, Avijit Ghosh from Hugging Face, said that evaluating an agent is harder than evaluating a single LLM because an agent is a more complex system. His example: two agents can both pass the same task and still tell very different stories. One takes fewer steps, costs less, finishes faster and makes no errors. The other doesn’t. One pass or fail score hides all of that. So agent metrics need to hold up better and cover more dimensions.

He also pointed out some problems with how agents are measured today:

- Agent benchmarks don’t fit together. A benchmark on user messaging tells you nothing about web tasks.
- Results are rarely reported per session, even though two sessions with the same score can behave very differently.
- Agent identity is a “black hole”. Results are tagged with a model name, but the model isn’t the agent. The sub-agents, the memory setup and the connected tools matter too.
- Robustness isn’t measured in a standard way, and cost reporting is inconsistent.

Two other speakers added to this. Mahesh, co-founder of Bespoke Labs, said that agents are stochastic, so two runs can differ a lot. They take many steps to reach an outcome. And most importantly, they interact with the real world and change it. That makes results hard to reproduce, and real actions can be expensive or even dangerous. You don’t want an agent deleting all your data or sending the wrong messages while you test it.

Pierre-André from Meta, who works on the Gaia 2 benchmark, described the deepest problem of all: agents have to work in a world that keeps changing. Older LLM evaluation took an input and checked the output. Real agents get new emails, see prices move and deal with an internet that shifts under them. His team handles this with simulation, a sandbox of connected apps whose state changes when the agent, the user or the environment acts. One striking result: on tasks where the agent has to react to time, like waiting for a flight price to drop, almost every model, even the top ones, scored close to 0%.

### Four dimensions of reliability

The talk I remember most was by Arvind Narayanan from Princeton. It changed how I see the whole problem.

He started with a puzzle. AI agents keep beating capability benchmarks, yet companies aren’t actually replacing workers with them, and there is no visible effect on GDP. One explanation is that it just takes time. But Arvind gives another: capability benchmarks only measure one part of what makes an agent useful. There is a gap between capability and reliability. An agent can be very capable and still too unreliable to trust.

He made the stakes concrete. If Alexa plays the wrong song 10% of the time, that’s just annoying. If an agent uses your credit card and places the wrong order 10% of the time, the product is dead on arrival. He compared it with flying. Showing that planes could fly happened quickly, but reaching one error per trillion miles took most of a century.

His team splits reliability into four dimensions:

- **Consistency.** Does the agent handle the same task the same way every time? A 70% success rate could mean it always does 70% of tasks and always fails the rest. Or it could mean it works 70% of the time on any task, unpredictably. This splits further into outcome consistency, trajectory consistency (does it take the same path?) and cost stability.
- **Robustness.** What happens if you reword the prompt slightly, or the environment throws faults like API timeouts? A reliable agent shouldn’t fall apart because of a change in tone or a flaky tool.
- **Predictability, or calibration.** Can the agent look back and tell whether it did the task right? If it says it’s 60% confident, is it right 60% of the time? Overconfident agents are a real danger.
- **Failure severity.** When it fails, is it a harmless formatting error, or something catastrophic like deleting a database?

Then the main finding. Across 14 frontier models over 18 months, a period when benchmark accuracy shot up, a combined reliability score rose only very slowly. Plotting accuracy against reliability gave an almost straight line. Reliability does improve as capability improves, but much more slowly. If you believe agent capability is growing exponentially, that’s a sobering result.

His practical advice is to separate augmentation from automation. For a coding agent whose output a person reviews, the odd mistake is fine. For a customer service agent dealing with people on its own, it isn’t. So a release decision shouldn’t rest on capability alone. It should also pass a reliability threshold. He also said you can measure these reliability dimensions on any benchmark, and that doing so should simply become the norm.

## Putting it together

The two videos fit together well.

Dave’s crash course gives the basics for any LLM app: understand your data, start with cheap unit tests, and above all build an LLM judge that agrees with human judgment before you trust it to run on its own. I don’t see these habits as optional. They make the difference between an app that only survives the happy path and one you can keep improving in a systematic way.

The Hugging Face workshop shows what happens when you take those basics to agents. One score is no longer enough. You have to care about how many steps an agent took, what it cost, whether it behaves the same way twice, how it copes with a changing world, and how badly it fails when it fails. Capability and reliability are different things, and reliability is improving much more slowly than the demos suggest.

Avijit gave an honest summary at the end of the workshop: when it comes to evaluating agents, we still don’t fully know what we don’t know. But I think the direction is clear. Stop chasing a single benchmark number, look hard at your real data and traces, keep humans in the loop, and treat evaluation as the real work, more than the demo.
