# data5pm

My toolbox of methods, each written as a decision.

> For every method I choose, I should be able to explain why.
> 對自己的每個方法選擇，都要能解釋為什麼。

Live at https://data5pm.com. Every push to `main` rebuilds and publishes the site through GitHub Actions (`.github/workflows/deploy.yml`) in about a minute.

## Run it locally

```bash
npm install
npm run dev        # http://localhost:4321/
npm run build      # the same build GitHub Actions runs; output goes to dist/
```

## Add a method

1. Copy `src/content/toolbox/_template.md` into a domain folder, e.g. `src/content/toolbox/statistics/chi-square-test.md`. The file name becomes the URL: `/toolbox/statistics/chi-square-test/`.
2. Fill in the frontmatter first: `problem`, `why`, `assumptions`, and for models `decides`. The build fails if `problem` or `why` is missing, which is the point.
3. Write notes below the frontmatter in Markdown. Math works with `$...$` and `$$...$$`.
4. Keep `draft: true` while writing. Drafts show in `npm run dev` but not on the live site.
5. Commit and push to `main`.

Link two entries by listing the other one under `related`, e.g. `related: [statistics/bayes-theorem]`. The link shows on both pages.

The full writing guide (frontmatter rules, body headings, style) is in `.claude/skills/data5pm-toolbox-entry/SKILL.md`.

## Add a system-design story

Stories are case studies of how a company built something, not decision records. Put them in `src/content/toolbox/system-design/` with `kind: story`, and use `company` and `source` instead of `problem`, `why`, `decides` and `assumptions`. They show the company and source instead of a status.

## Add a note

Notes are essays and study notes, not decision records. Set `kind: note` and fill in only `title`, `summary`, `category`, `status` and `created` (plus `related`, `references` and `tags` if you need them). They show a status like methods but skip the decision box. Everything in `src/content/toolbox/human-side/` is a note.

## Status

| Status | Meaning |
| --- | --- |
| `seedling` | Collected, roughly understood |
| `growing` | Used it, still testing my reasoning |
| `evergreen` | I can defend the choice to a sceptical colleague |

## Add a new field

Add it to `DOMAINS` in `src/data/domains.ts` with its categories, then create `src/content/toolbox/<slug>/`. Fields with no entries show as "Not started".

## Where things live

| Path | What |
| --- | --- |
| `src/config.ts` | Name, mission, links |
| `src/data/domains.ts` | Fields (domains) and their categories, in learning order |
| `src/content.config.ts` | The entry schema: methods (decision records) and stories |
| `src/content/toolbox/<domain>/` | All entries, one Markdown file each |
| `src/content/toolbox/system-design/` | System-design stories (`kind: story`) |
| `src/content/toolbox/_template.md` | Starting point for a new entry (ignored by the build) |
| `src/pages/` | Page templates: home, about, data, 404, and the toolbox pages |
| `src/layouts/Base.astro` | Shared page frame: header, nav, footer, fonts |
| `src/components/` | `EntryList` (lists of entries) and `Status` (the maturity dot) |
| `src/lib/` | Helpers: loading entries, building links, formatting dates |
| `src/styles/global.css` | Colours and type |
| `public/images/toolbox/` | Chart images used in entries |
| `scripts/charts.py` | Draws those charts (`python3 scripts/charts.py`) |
| `.claude/skills/data5pm-toolbox-entry/` | Instructions Claude follows when writing entries |
| `astro.config.mjs` | Site address, Markdown and math setup |
