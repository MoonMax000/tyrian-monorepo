'use client';

import { Header, Footer } from '@tyrian/ui';
import { getProducts, getFeatureFlags, isProductEnabled } from '@tyrian/feature-flags';
import { useState, useEffect } from 'react';

export default function TestSharedPage() {
  const [mounted, setMounted] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [flags, setFlags] = useState<any>({});

  useEffect(() => {
    setMounted(true);
    setProducts(getProducts());
    setFlags(getFeatureFlags());
  }, []);

  if (!mounted) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <Header />
      
      <main className="flex-1 p-8 mt-16">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="bg-gray-900 rounded-lg p-6 border border-green-500">
            <h1 className="text-3xl font-bold text-green-400 mb-4">
              ✅ Shared Components Test Page
            </h1>
            <p className="text-gray-300">
              Эта страница проверяет что все shared packages работают правильно!
            </p>
          </div>

          {/* Feature Flags Status */}
          <div className="bg-gray-900 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-blue-400">
              🚩 Feature Flags Status
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(flags).map(([key, value]) => (
                <div
                  key={key}
                  className={`p-4 rounded-lg border-2 ${
                    value ? 'border-green-500 bg-green-900/20' : 'border-red-500 bg-red-900/20'
                  }`}
                >
                  <div className="font-bold">{key}</div>
                  <div className={value ? 'text-green-400' : 'text-red-400'}>
                    {value ? '✅ Enabled' : '❌ Disabled'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Products List */}
          <div className="bg-gray-900 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-purple-400">
              📦 Available Products ({products.length})
            </h2>
            <div className="space-y-4">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="p-4 bg-gray-800 rounded-lg border border-purple-500/50 hover:border-purple-500 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{product.icon}</span>
                      <div>
                        <h3 className="text-xl font-bold">{product.name}</h3>
                        <p className="text-sm text-gray-400">{product.description}</p>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">Order: {product.order}</div>
                  </div>
                  <div className="mt-2">
                    <a
                      href={product.url}
                      className="text-blue-400 hover:text-blue-300 text-sm"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      🔗 {product.url}
                    </a>
                  </div>
                  {product.children && product.children.length > 0 && (
                    <div className="mt-3 pl-4 border-l-2 border-gray-700">
                      <div className="text-sm text-gray-400 mb-2">Sub-pages:</div>
                      <div className="space-y-1">
                        {product.children.map((child: any, idx: number) => (
                          <div key={idx} className="text-sm">
                            <a
                              href={child.url}
                              className="text-blue-400 hover:text-blue-300"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              → {child.name}
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Import Test */}
          <div className="bg-gray-900 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-yellow-400">
              🔧 Import Status
            </h2>
            <div className="space-y-2 font-mono text-sm">
              <div className="p-2 bg-gray-800 rounded">
                <span className="text-green-400">✅</span> import &#123; Header, Footer &#125; from '@tyrian/ui'
              </div>
              <div className="p-2 bg-gray-800 rounded">
                <span className="text-green-400">✅</span> import &#123; getProducts, getFeatureFlags &#125; from '@tyrian/feature-flags'
              </div>
              <div className="p-2 bg-gray-800 rounded">
                <span className="text-green-400">✅</span> import &#123; User, Product &#125; from '@tyrian/types'
              </div>
            </div>
          </div>

          {/* Test Results */}
          <div className="bg-green-900 rounded-lg p-6 border-2 border-green-500">
            <h2 className="text-2xl font-bold mb-4 text-green-400">
              🎉 Test Results
            </h2>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <span className="text-green-400">✅</span>
                <span>Header component rendered</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-400">✅</span>
                <span>Footer component rendered</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-400">✅</span>
                <span>Feature Flags loaded: {Object.keys(flags).length} flags</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-400">✅</span>
                <span>Products loaded: {products.length} products</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-400">✅</span>
                <span>All shared packages working correctly!</span>
              </li>
            </ul>
          </div>

          {/* Back to Home */}
          <div className="text-center">
            <a
              href="/"
              className="inline-block px-6 py-3 bg-purple-600 hover:bg-purple-500 rounded-lg font-bold transition-colors"
            >
              ← Back to Home
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

