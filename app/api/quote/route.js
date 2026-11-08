import { ImageResponse } from '@vercel/og';
import { clean, color, renderQuote } from '../../../lib/renderers';

export const runtime = 'edge';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const quote = clean(searchParams.get('quote'), 'Your quote goes here.', 280);
  const author = clean(searchParams.get('author'), 'Anonymous', 60);
  const brand = clean(searchParams.get('brand'), 'Ogly', 40);
  const bg = color(searchParams.get('bg'), '#0f172a');
  const accent = color(searchParams.get('accent'), '#f59e0b');

  return new ImageResponse(renderQuote({ quote, author, brand, bg, accent }), {
    width: 1080,
    height: 1080,
  });
}
