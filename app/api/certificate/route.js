import { ImageResponse } from '@vercel/og';
import { clean, color, renderCertificate } from '../../../lib/renderers';

export const runtime = 'edge';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const name = clean(searchParams.get('name'), 'Your Name', 80);
  const course = clean(searchParams.get('course'), 'Course or achievement', 120);
  const date = clean(searchParams.get('date'), 'November 2026', 40);
  const issuer = clean(searchParams.get('issuer'), 'Ogly', 40);
  const bg = color(searchParams.get('bg'), '#fdfbf7');
  const accent = color(searchParams.get('accent'), '#1e3a5f');

  return new ImageResponse(renderCertificate({ name, course, date, issuer, bg, accent }), {
    width: 1600,
    height: 1200,
  });
}
