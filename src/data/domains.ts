// The shelves of the toolbox. Add a domain here, then create src/content/toolbox/<slug>/.
// Categories are listed in the order you want to learn them; empty ones show as "still to learn".
export type Domain = {
  slug: string;
  title: string;
  intro: string;
  categories: string[];
};

export const DOMAINS: Domain[] = [
  {
    slug: 'statistics',
    title: 'Statistics',
    intro:
      'The foundation under everything else. Most bad modelling decisions are really statistics decisions made without noticing.',
    categories: [
      'Describing data',
      'Distributions',
      'Estimation and intervals',
      'Comparing groups',
      'Regression',
      'Experiment design',
      'Resampling',
      'Bayesian methods',
    ],
  },
  {
    slug: 'machine-learning',
    title: 'Machine learning',
    intro: 'Classical models, validation and feature engineering.',
    categories: ['Linear models', 'Trees and ensembles', 'Validation', 'Feature engineering'],
  },
  {
    slug: 'deep-learning',
    title: 'Deep learning',
    intro: 'Neural network architectures and how to train them.',
    categories: ['Architectures', 'Training'],
  },
  {
    slug: 'llms-and-agents',
    title: 'LLMs and agents',
    intro: 'Prompting, retrieval, evaluation and agent design.',
    categories: ['Prompting', 'Retrieval', 'Evaluation', 'Agents'],
  },
  {
    slug: 'data-engineering',
    title: 'Data engineering',
    intro: 'Pipelines, modelling and the tools that move data around.',
    categories: ['Modelling', 'Pipelines', 'Storage'],
  },
];

export const getDomain = (slug: string) => DOMAINS.find((d) => d.slug === slug);
