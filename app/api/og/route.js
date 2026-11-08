import { ImageResponse } from '@vercel/og';
import { clean, color, renderOg } from '../../../lib/renderers';

export const runtime = 'edge';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const title = clean(searchParams.get('title'), 'Ogly');
  const subtitle = clean(searchParams.get('subtitle'), 'On-brand images from text, in seconds.', 160);
  const bg = color(searchParams.get('bg'), '#0f172a');
  const accent = color(searchParams.get('accent'), '#f59e0b');
  const brand = clean(searchParams.get('brand'), 'Ogly', 40);

  return new ImageResponse(renderOg({ title, subtitle, brand, bg, accent }), {
    width: 1200,
    height: 630,
  });
}
