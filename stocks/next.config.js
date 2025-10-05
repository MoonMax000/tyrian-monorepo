//@ts-check

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { composePlugins, withNx } = require('@nx/next');
const path = require('path');

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  nx: {
    svgr: false,
  },
  staticPageGenerationTimeout: 180,
  transpilePackages: ['@tyrian/shared/ui', '@tyrian/shared/api', '@tyrian/shared/types', '@tyrian/shared/feature-flags'],
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['authservice.tyriantrade.com', 'stocks-api.tyriantrade.com', 'axa-stocks-api.taskcomplete.ru'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.selstorage.ru',
      },
      {
        protocol: 'https',
        hostname: 'stocks-api.tyriantrade.com',
        port: '',
        pathname: '/api/media/company_icons/**',
      },
    ],
  },
  webpack(config) {
    // SVG as React components
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    
    // Public alias
    config.resolve.alias['@public'] = path.join(__dirname, 'public');
    
    // Shared libraries aliases
    config.resolve.alias['@tyrian/ui'] = path.join(__dirname, '../libs/shared/ui/src/index.ts');
    config.resolve.alias['@tyrian/api'] = path.join(__dirname, '../libs/shared/api/src/index.ts');
    config.resolve.alias['@tyrian/types'] = path.join(__dirname, '../libs/shared/types/src/index.ts');
    config.resolve.alias['@tyrian/feature-flags'] = path.join(__dirname, '../libs/shared/feature-flags/src/index.ts');
    config.resolve.alias['@tyrian/shared/ui'] = path.join(__dirname, '../libs/shared/ui/src/index.ts');
    config.resolve.alias['@tyrian/shared/api'] = path.join(__dirname, '../libs/shared/api/src/index.ts');
    config.resolve.alias['@tyrian/shared/types'] = path.join(__dirname, '../libs/shared/types/src/index.ts');
    config.resolve.alias['@tyrian/shared/feature-flags'] = path.join(__dirname, '../libs/shared/feature-flags/src/index.ts');
    
    // Fallback for node modules
    config.resolve = {
      ...config.resolve,
      fallback: {
        fs: false,
        path: false,
        os: false,
      },
    };

    return config;
  },
};

const plugins = [
  withNx,
];

module.exports = composePlugins(...plugins)(nextConfig);
