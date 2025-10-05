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
  transpilePackages: ['@tyrian/shared/ui', '@tyrian/shared/api', '@tyrian/shared/types', '@tyrian/shared/feature-flags'],
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['authservice.tyriantrade.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.selstorage.ru',
      },
    ],
  },
  webpack(config, options) {
    // SVG support
    config.module.rules.push({
      test: /\.svg$/,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    });
    
    // Public alias
    config.resolve.alias['@public'] = path.join(__dirname, 'public');
    
    // Shared libraries aliases (both short and full paths)
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
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
      },
    };

    return config;
  },
};

const plugins = [
  // Add more Next.js plugins to this list if needed.
  withNx,
];

module.exports = composePlugins(...plugins)(nextConfig);
