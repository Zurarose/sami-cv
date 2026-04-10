import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  serverExternalPackages: [
    'pdf-parse',
    '@sparticuz/chromium',
    'puppeteer-core',
    'sharp',
  ],
};

export default nextConfig;
