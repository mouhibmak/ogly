export default function sitemap() {
  const base = 'https://ogly-mouhib2.vercel.app';
  const now = new Date();
  return [
    { url: `${base}/`, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${base}/certificate`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/quote-card`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/event-badge`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/thumbnail`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/usage`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/api-docs`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/pricing`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
  ];
}
