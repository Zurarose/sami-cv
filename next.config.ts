import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  serverExternalPackages: [
    'pdf-parse',
    '@sparticuz/chromium',
    'puppeteer-core',
    'sharp',
  ],
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
};

export default nextConfig;
