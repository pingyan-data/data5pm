---
name: data5pm-toolbox-entry
description: Write or edit method entries for Ping's data5pm toolbox website (Astro, src/content/toolbox/). Use this whenever Ping asks to add, explain, rewrite, review or reorganise a statistics, machine learning, data or AI method on data5pm, turn course notes, book chapters or links into toolbox pages, or add a new category or domain to the toolbox, even if she doesn't say "entry" or "skill".
---

# data5pm toolbox entries

data5pm is Ping's personal toolbox. Its one rule:

> For every method I choose, I should be able to explain why.

Every entry is a short **decision record** plus plain-language notes. Readers are curious
people who know some maths but not this method. Ping is the author, so write in her voice:
first person where it is natural, simple, honest, no hype.

## Where things live

| Path | What |
| --- | --- |
| `src/content/toolbox/<domain>/<slug>.md` | One entry. The file name is the URL slug. |
| `src/content/toolbox/_template.md` | Starting point for a new entry |
| `src/content.config.ts` | The frontmatter schema. The build fails if a required field is missing. |
| `src/data/domains.ts` | Domains (statistics, machine-learning, …) and their categories, in learning order |
| `scripts/charts.py` | Draws the charts in `public/images/toolbox/` |

## Frontmatter

```yaml
title: Welch’s t-test
summary: One sentence, what it is.            # shown in lists
category: Hypothesis testing                   # must exist in domains.ts
status: seedling                               # seedling | growing | evergreen
created: 2026-10-24
order: 2                                       # optional, position inside the category
problem: The question I’m trying to answer.    # one or two sentences
why: Why this method fits that question.       # two or three sentences
decides: How the model makes its decision.     # any model (ML, deep learning, CV, LLM)
assumptions:                                   # what has to be true; 2 to 4 items
  - …
related: [statistics/bayes-theorem]            # links both ways automatically
references:
  - title: Author (year), Title. Publisher.
    url: https://…                             # optional
```

Rules:
- Never put “: ” (colon followed by a space) inside a one-line YAML value; it breaks the build. Rephrase with a comma.
- No `$math$` in frontmatter; it is shown as plain text. Math goes in the body.
- Do **not** write `alternatives` ("why not something else"). That section was removed.
- New entries Claude writes start as `status: seedling`. Only Ping promotes them.
- `problem` is a real question someone has, not a definition. Good: “Is the new checkout page
  converting better, or is it noise?” Bad: “Testing a hypothesis.”
- For every model (machine learning, deep learning, computer vision, LLMs), `decides` must say concretely what the model computes to reach a
  prediction (a weighted sum and a threshold, a vote of neighbours, the split with the largest
  information gain, …). This is the most important field for Ping.

## Body sections

Use these headings, in this order, and skip any that would be empty:

1. `## How it works` – the idea in a few short paragraphs, then the key formula.
2. `## How it decides, step by step` – models only. Walk through the decision
   rule with numbers. For trees, always explain entropy, information gain and Gini.
3. `## Example` – one small worked example with real-looking numbers. Check the arithmetic.
4. `## In code` – the shortest working Python, using scipy, statsmodels, pandas or scikit-learn.
5. `## Watch out for` – 2 to 4 practical mistakes.

Overview pages (like Descriptive statistics or Common distributions) may use a table instead
of the sections above.

## Stories (system design)

`src/content/toolbox/system-design/` holds case studies of how real companies built
something. They are **not** decision records. Set `kind: story`, and use `company` and
`source` instead of `problem`, `why`, `decides` and `assumptions`:

```yaml
kind: story
title: "Fraud detection: scaling Stripe Radar"   # "Topic: company angle". Quote titles with a colon.
summary: One or two sentences, the whole story in brief.
category: Fraud detection
company: Stripe
created: 2026-10-25
source:
  title: Stripe Dev Blog, Scaling Radar (2026)
  url: https://…
```

Tell it as a short story with simple headings: `## The challenge`, then what they built
(one heading per step), `## The twist` if something surprising happened, and always end with
`## What I take away`, 3 to 5 numbered lessons. Keep the company’s key numbers, but retell
everything in your own words: no copied sentences, no long quotes. Link to toolbox methods
where a story uses one.

## Writing style

- Plain English. Short sentences. One idea per paragraph.
- Explain every term the first time it appears (“the standard error, which is how much the
  mean would move between samples”).
- Prefer an everyday example over abstract notation. Formulas come after the words.
- No filler, no “In today’s world”, no hype words (powerful, robust, seamless).
- Bold sparingly. Bullets only for lists of separate things.
- Math: `$inline$` and `$$block$$` (KaTeX). Code: fenced blocks with a language.
- Typographic apostrophes and quotes in prose (’ “ ”); straight quotes in code and YAML keys.

## What to leave out

Ping wants what is useful in real work. Skip:
- Hand-calculation tricks and lookup tables (computers do this now).
- Methods that are mainly of historical interest, unless they explain a modern one.
- Long derivations. Link to the reference instead.

## Charts

Add a chart only when it makes the idea clearer. Draw it in `scripts/charts.py` (same style:
one blue line `#0f62fe`, grey `#8d8d8d` axes, transparent background), run
`python3 scripts/charts.py`, and embed it as `![Short description](/images/toolbox/<name>.svg)`.

## Sources

Use the sources Ping gives plus your own knowledge. Never paste text from books or websites;
explain in your own words and list the source under `references`. Don’t link to unofficial
PDF copies of commercial textbooks; cite the book itself.

## Checks before finishing

1. Every `category` exists in `src/data/domains.ts`.
2. Every `related` id matches an existing file path without `.md`.
3. Worked examples are numerically correct (compute them; don’t guess).
4. `npm run build` passes.
