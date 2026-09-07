import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(__dirname, '../assets/hero');

const profile = {
  name: 'Abdelrahman Ashraf',
  role: 'Flutter Developer',
  subtitle: 'Building practical mobile apps with clean architecture',
  tags: ['Flutter', 'Dart', 'Firebase', 'Clean Architecture', 'MVVM'],
};

const esc = (value) => value
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#39;');

function buildSvg({
  width,
  height,
  background,
  accent,
  text,
  subtle,
  isMobile,
}) {
  const gap = isMobile ? 72 : 94;
  const titleY = isMobile ? 140 : 170;
  const roleY = titleY + 44;
  const subtitleY = roleY + 38;

  const tags = profile.tags.slice(0, isMobile ? 3 : profile.tags.length)
    .map((tag, index) => {
      const x = isMobile ? 48 : 64 + index * 170;
      const y = isMobile ? height - 156 + index * 42 : height - 72;
      return `<rect x="${x}" y="${y}" rx="16" ry="16" width="${isMobile ? 240 : 156}" height="34" fill="${subtle}" opacity="0.45" />\n      <text x="${x + 18}" y="${y + 23}" fill="${text}" font-size="16" font-family="Inter, Segoe UI, Arial, sans-serif" font-weight="600">${esc(tag)}</text>`;
    })
    .join('\n      ');

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="title desc">
  <title id="title">${esc(profile.name)} profile hero</title>
  <desc id="desc">Open profile style hero banner introducing ${esc(profile.name)} as ${esc(profile.role)}.</desc>
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${background[0]}"/>
      <stop offset="100%" stop-color="${background[1]}"/>
    </linearGradient>
    <linearGradient id="orb" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${accent[0]}"/>
      <stop offset="100%" stop-color="${accent[1]}"/>
    </linearGradient>
  </defs>

  <rect x="0" y="0" width="${width}" height="${height}" rx="28" fill="url(#bg)"/>
  <circle cx="${width - gap}" cy="${isMobile ? 72 : 86}" r="${isMobile ? 42 : 58}" fill="url(#orb)" opacity="0.9"/>
  <circle cx="${isMobile ? width - 80 : width - 150}" cy="${isMobile ? 148 : 170}" r="${isMobile ? 26 : 36}" fill="${accent[0]}" opacity="0.45"/>

  <text x="48" y="${titleY}" fill="${text}" font-size="${isMobile ? 34 : 44}" font-family="Inter, Segoe UI, Arial, sans-serif" font-weight="800">${esc(profile.name)}</text>
  <text x="48" y="${roleY}" fill="${accent[0]}" font-size="${isMobile ? 24 : 30}" font-family="Inter, Segoe UI, Arial, sans-serif" font-weight="700">${esc(profile.role)}</text>
  <text x="48" y="${subtitleY}" fill="${text}" opacity="0.9" font-size="${isMobile ? 18 : 22}" font-family="Inter, Segoe UI, Arial, sans-serif">${esc(profile.subtitle)}</text>

  ${tags}
</svg>`;
}

const variants = [
  {
    filename: 'abdelrahman-profile-light.svg',
    width: 1280,
    height: 360,
    background: ['#f8fbff', '#e7f0ff'],
    accent: ['#2463eb', '#16a3ff'],
    text: '#111827',
    subtle: '#bfd3ff',
    isMobile: false,
  },
  {
    filename: 'abdelrahman-profile-dark.svg',
    width: 1280,
    height: 360,
    background: ['#0f172a', '#111827'],
    accent: ['#60a5fa', '#22d3ee'],
    text: '#f3f4f6',
    subtle: '#1f2937',
    isMobile: false,
  },
  {
    filename: 'abdelrahman-profile-mobile-light.svg',
    width: 760,
    height: 420,
    background: ['#f8fbff', '#e7f0ff'],
    accent: ['#2463eb', '#16a3ff'],
    text: '#111827',
    subtle: '#bfd3ff',
    isMobile: true,
  },
  {
    filename: 'abdelrahman-profile-mobile-dark.svg',
    width: 760,
    height: 420,
    background: ['#0f172a', '#111827'],
    accent: ['#60a5fa', '#22d3ee'],
    text: '#f3f4f6',
    subtle: '#1f2937',
    isMobile: true,
  },
];

await mkdir(outDir, { recursive: true });

await Promise.all(
  variants.map((variant) => writeFile(resolve(outDir, variant.filename), buildSvg(variant), 'utf8')),
);

console.log(`Generated ${variants.length} profile hero SVG files in ${outDir}`);
