# data5pm

My toolbox of methods, each written as a decision.

> For every method I choose, I should be able to explain why.
> 對自己的每個方法選擇，都要能解釋為什麼。

Live at https://pingyan-data.github.io/data5pm/

## Run it locally

```bash
npm install
npm run dev        # http://localhost:4321/data5pm/
```

## Add a method

1. Copy `src/content/toolbox/_template.md` into a domain folder, e.g. `src/content/toolbox/statistics/chi-square-test.md`. The file name becomes the URL.
2. Fill in the frontmatter first: `problem`, `why`, `alternatives`, `assumptions`. The build fails if a required field is missing, which is the point.
3. Write notes below the frontmatter in Markdown. Math works with `$...$` and `$$...$$`.
4. Keep `draft: true` while writing. Drafts show in `npm run dev` but not on the live site.
5. Commit and push to `main`. GitHub Actions rebuilds the site in about a minute.

Link two entries by adding `entry: statistics/other-method` to an alternative. The other entry then shows a "Compared against this in" backlink.

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
| `src/data/domains.ts` | Fields and their categories |
| `src/content.config.ts` | The entry schema (the decision record) |
| `src/content/toolbox/` | All entries, one Markdown file each |
| `src/styles/global.css` | Colours and type |
| `src/pages/` | Page templates |

## Custom domain later

In `astro.config.mjs`, set `site` to the domain and `base` to `'/'`. Add the domain under repo Settings > Pages.
