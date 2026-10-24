// The shelves of the toolbox. Add a domain here, then create src/content/toolbox/<slug>/.
// Categories are listed in the order you want to learn them; empty ones show as "still to learn".
export type Domain = {
  slug: string;
  title: string;
  intro: string;
  categories: string[];
  unit?: [string, string]; // singular and plural, default method/methods
};

export const DOMAINS: Domain[] = [
  {
    slug: 'statistics',
    title: 'Statistics',
    intro:
      'The foundation under everything else. Most bad modelling decisions are really statistics decisions made without noticing.',
    categories: [
      'Describing data',
      'Sampling',
      'Probability',
      'Distributions',
      'Estimation',
      'Hypothesis testing',
      'Nonparametric tests',
      'Resampling',
    ],
  },
  {
    slug: 'machine-learning',
    title: 'Machine learning',
    intro:
      'Models that learn from data. For each one, the key question is how it makes its decision.',
    categories: [
      'Regression',
      'Classification',
      'Trees and ensembles',
      'Support vector machines',
      'Clustering',
      'Dimensionality reduction',
      'Reinforcement learning',
      'Model evaluation',
    ],
  },
  {
    slug: 'deep-learning',
    title: 'Deep learning',
    intro: 'Neural networks with many layers, how they learn, and the architectures behind modern AI.',
    categories: ['Foundations', 'Architectures'],
  },
  {
    slug: 'computer-vision',
    title: 'Computer vision',
    intro: 'Models that understand images: what is in them, where it is, and which pixels belong to it.',
    categories: ['Image classification', 'Object detection', 'Segmentation', 'Vision and language'],
  },
  {
    slug: 'llms-and-agents',
    title: 'LLMs and agents',
    intro: 'Working with large language models: prompting, retrieval, evaluation and agents.',
    categories: ['Foundations', 'Prompting', 'Retrieval', 'Evaluation', 'Agents'],
  },
  {
    slug: 'system-design',
    title: 'System design',
    intro:
      'How real companies build data and AI systems, retold as short stories, with what I take away from each.',
    categories: ['Recommendation systems', 'LLM evaluation', 'Fraud detection'],
    unit: ['story', 'stories'],
  },
  {
    slug: 'data-engineering',
    title: 'Data engineering',
    intro: 'Pipelines, modelling and the tools that move data around.',
    categories: ['Modelling', 'Pipelines', 'Storage'],
  },
];

export const getDomain = (slug: string) => DOMAINS.find((d) => d.slug === slug);
