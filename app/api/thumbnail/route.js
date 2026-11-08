import { ImageResponse } from '@vercel/og';
import { clean, color, renderThumbnail } from '../../../lib/renderers';

export const runtime = 'edge';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const title = clean(searchParams.get('title'), 'Your video title here', 100);
  const subtitle = clean(searchParams.get('subtitle'), 'One line that makes people click.', 120);
  const brand = clean(searchParams.get('brand'), 'Ogly', 40);
  const bg = color(searchParams.get('bg'), '#0f172a');
  const accent = color(searchParams.get('accent'), '#f59e0b');

  return new ImageResponse(renderThumbnail({ title, subtitle, brand, bg, accent }), {
    width: 1280,
    height: 720,
  });
}
