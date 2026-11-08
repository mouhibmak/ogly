import { ImageResponse } from '@vercel/og';
import { clean, color, renderBadge } from '../../../lib/renderers';

export const runtime = 'edge';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const name = clean(searchParams.get('name'), 'Your Name', 60);
  const role = clean(searchParams.get('role'), 'Speaker', 80);
  const event = clean(searchParams.get('event'), 'Event', 80);
  const date = clean(searchParams.get('date'), '', 40);
  const bg = color(searchParams.get('bg'), '#0f172a');
  const accent = color(searchParams.get('accent'), '#f59e0b');

  return new ImageResponse(renderBadge({ name, role, event, date, bg, accent }), {
    width: 1200,
    height: 630,
  });
}
