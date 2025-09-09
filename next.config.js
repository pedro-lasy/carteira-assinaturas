/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
  transpilePackages: [
    '@supabase/auth-ui-react',
    '@supabase/auth-ui-shared'
  ],
  webpack: (config, { isServer }) => {
    // Otimizações para build
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };

    // Ignorar warnings específicos
    config.ignoreWarnings = [
      /Critical dependency: the request of a dependency is an expression/,
    ];

    return config;
  },
  // Configurações de build otimizadas
  swcMinify: true,
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
  
  // Headers de segurança
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;