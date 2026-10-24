---
kind: story
title: "Recommendation system: a walkthrough of Spotify"
summary: How Spotify’s recommender is built in four layers, from understanding each listener to choosing the right mix of music, podcasts and audiobooks, and how LLMs are starting to reshape it.
category: Recommendation systems
company: Spotify
created: 2026-10-25
order: 1
source:
  title: Spotify Research, search and recommendations
  url: https://research.atspotify.com/search-recommendations
related: [machine-learning/reinforcement-learning, deep-learning/transformer, llms-and-agents/natural-language-processing]
references:
  - title: Fazelnia et al. (2025), Generalized user representations for large-scale recommendations and downstream tasks. RecSys 2025.
    url: https://research.atspotify.com/publications/generalized-user-representations-for-large-scale-recommendations-and-downstream-tasks
  - title: Penha et al. (2025), Semantic IDs for joint generative search and recommendation. RecSys 2025.
    url: https://research.atspotify.com/publications/semantic-IDs-for-joint-generative-search-and-recommendation
  - title: Feijer et al. (2025), Calibrated recommendations with contextual bandits. RecSys 2025 CONSEQUENCES workshop.
    url: https://research.atspotify.com/publications/calibrated-recommendations-with-contextual-bandits
  - title: Palumbo et al. (2025), You say search, I say recs, a scalable agentic approach to query understanding and exploratory search at Spotify. RecSys 2025.
    url: https://research.atspotify.com/publications/you-say-search--i-say-recs-a-scalable-agentic-approach-to-query-understanding-and-exploratory-search-at-spotify
  - title: My original notes (in Chinese), on Notion
    url: https://ping-yan-data.notion.site/Spotify-A-walkthrough-of-Spotify-s-recommendation-system-35a39133a1e880e4a6e3fcfed25dd00d
tags: [recommendation, personalisation, bandits, llm, case-study]
---

## Where it starts: what is the real goal?

“Recommend the most popular songs” is the wrong answer. Spotify’s goal is **long-term satisfaction**, because a click today doesn’t mean a listener who stays for years.

That sounds like a slogan, but Spotify treats it as an engineering rule. It decides which signals they collect (not just clicks), what the ranking optimises (not just click-through rate), how they evaluate (not just offline metrics), and how they balance the familiar with the new.

Reading Spotify’s recent research papers, I found the system falls into four clear layers, each with its own question.

| Layer | Question | Key idea |
| --- | --- | --- |
| 1. User representation | Who is this listener? | One shared user embedding for every team |
| 2. Candidate generation | Which few hundred tracks, out of hundreds of millions, are worth considering? | Semantic IDs |
| 3. Ranking | In what order? | Several goals at once, plus exploration |
| 4. Calibration | What mix of music, podcasts and audiobooks? | Contextual bandits |

## Layer 1: Who is this listener?

The first step is to compress each user into a compact vector, an **embedding**. Otherwise every team would have to work out “who is this user” on its own.

**The problem.** Spotify has hundreds of millions of users, and many teams (Home, Search, Discover Weekly, Radio). If each team builds its own user features, work is duplicated, the same person looks different in different places, every feature change ripples through all teams, and infrastructure costs explode.

**What they built.** A two-stage framework:

1. An **autoencoder** takes all of a user’s raw signals, like listening history, devices, context and interactions, and compresses them into one general-purpose embedding. It isn’t trained for any single task.
2. Each team starts from that shared embedding and adds its own small, task-specific layers on top, a form of **transfer learning**. No more hand-built features per team.

**The result.** Embeddings can be refreshed almost in real time, teams no longer wait on each other, infrastructure costs drop, and A/B tests showed gains in listening share, discovery and search success.

**What I take away.** This layer is the foundation. Get it right and every product above benefits; get it wrong and everything above has to be rebuilt.

## Layer 2: Finding candidates among hundreds of millions of tracks

The second step is to pull out a few hundred to a few thousand candidates, fast. This layer must be quick and must not miss good content; precise ordering comes later.

**The old way.** Each track is a unique, meaningless ID, like a postcode. The model has to learn what each ID means purely from listening behaviour. That makes new tracks hard to recommend (the **cold-start** problem), and an LLM can’t make sense of a random ID string.

**The new way: Semantic IDs.** Each track is encoded as a short sequence of meaningful codes, more like a list of tags: indie, 80s, melancholic, mid-tempo. Similar tracks get similar codes, so the model understands similarity from the start, a new track can be encoded from its metadata alone, and the codes can be fed to a generative model.

**The twist.** Spotify wanted one generative model to serve both search and recommendation. But search and recommendation had always used separate item embeddings, and simply merging them hurt performance. Their solution was to fine-tune one **bi-encoder** model on both tasks, then build a single shared Semantic ID space from it that works for both.

**What I take away.** Semantic IDs are to recommender systems what tokens are to language models. They are the bridge that lets LLMs into recommendation.

## Layer 3: Putting candidates in order

Now the few hundred candidates are ranked, precisely. A classic ranker optimises one number, like click-through rate. Spotify has to balance several at once:

- Will the user press play?
- How long will they listen, or will they skip?
- Will this make them like Spotify more over time?
- Is their taste being narrowed into a bubble?
- Are only the biggest artists benefiting?

This is **multi-objective ranking**. On top of it sits the classic tension between **exploitation**, playing what we know the user likes, and **exploration**, trying something new that might delight them. Too much of the first is boring; too much of the second is irrelevant. Either way, the user leaves.

## Layer 4: Getting the mix right

The most overlooked step: not whether each item is good, but whether the ten items together make a sensible set.

**The problem.** The Spotify home page now has podcasts and audiobooks, not just music. But years of history are mostly music. A model trained on that history fills the home page with music, and podcasts and audiobooks never get a chance.

**The simple fix, and why it fails.** Match each user’s historical average: 90% music and 10% podcasts in the past means 9 songs and 1 podcast now. But preferences change with context. Someone might want podcasts on the morning commute, music at the gym and an audiobook on Sunday. An average flattens all of that.

**What they built.** A **contextual bandit**, a light form of [reinforcement learning](/toolbox/machine-learning/reinforcement-learning/):

- **Context**: time of day, day of the week, device, recent activity.
- **Action**: the mix of content types to show this user right now.
- **Reward**: how the user engages.

Every recommendation is a small experiment, and the bandit keeps learning the best mix for each user in each situation.

**The result.** Online A/B tests showed better precision and engagement, and especially more discovery of under-represented content like podcasts and audiobooks. Not by pushing podcasts harder, but by showing the right type at the right moment.

## The 2025 shift: from pipelines to agents

When a user types something vague, like “new releases for me”, a classic search engine matches the words “new” and “releases”. But the user is really asking for a recommendation in disguise.

Spotify’s answer is to let an **LLM act as a router**. It reads the query and decides which system should handle it: plain keyword search, semantic search, or, for exploratory queries like this one, the recommendation system. Some queries go to specialised sub-agents, such as one for finding similar artists or one for broad podcast searches.

The paper reports large gains for exploratory queries, including roughly doubling success for finding similar artists and for new music releases.

## Putting it together

Three trends run through all of this:

1. **From scattered to unified.** One user representation for every team, one Semantic ID space for every item, and eventually one model for both search and recommendation.
2. **From static to contextual.** Historical averages are replaced by bandits that learn in real time.
3. **From fixed pipelines to agents.** An LLM decides which path each request should take.

Spotify’s recommender isn’t one model. It is a layered system, built on a shared understanding of each user, balancing many goals, sensitive to context, and now being reshaped by LLM agents.

**The lesson I keep:** when asked “how would you improve this recommender?”, first ask *which layer* the problem is in.
