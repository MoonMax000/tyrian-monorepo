'use client';

import { useState, useEffect } from 'react';
import { 
  login, 
  register, 
  getProfile, 
  logout, 
  loginWithGoogle,
  isAuthenticated,
  type User,
  type LoginCredentials,
  type RegisterData 
} from '@tyrian/api';

export default function TestAuthPage() {
  const [mounted, setMounted] = useState(false);
  const [authStatus, setAuthStatus] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Login form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPassword2, setRegPassword2] = useState('');

  useEffect(() => {
    setMounted(true);
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const isAuth = isAuthenticated();
    setAuthStatus(isAuth);
    
    if (isAuth) {
      const profile = await getProfile();
      setUser(profile);
    }
  };

  const handleLogin = async () => {
    setLoading(true);
    setMessage('');
    
    const result = await login({ email: loginEmail, password: loginPassword });
    
    if (result.error) {
      setMessage(`❌ Error: ${result.error}`);
    } else {
      setMessage(`✅ Success: ${result.message}`);
      await checkAuth();
    }
    
    setLoading(false);
  };

  const handleRegister = async () => {
    setLoading(true);
    setMessage('');
    
    const result = await register({ 
      email: regEmail, 
      password: regPassword, 
      password2: regPassword2 
    });
    
    if (result.error) {
      setMessage(`❌ Error: ${result.error}`);
    } else {
      setMessage(`✅ Success: ${result.message}`);
      await checkAuth();
    }
    
    setLoading(false);
  };

  const handleLogout = async () => {
    setLoading(true);
    setMessage('');
    
    const result = await logout();
    
    if (result.success) {
      setMessage(`✅ ${result.message}`);
      setUser(null);
      setAuthStatus(false);
    } else {
      setMessage(`❌ Error: ${result.message}`);
    }
    
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setMessage('Redirecting to Google...');
    await loginWithGoogle();
  };

  if (!mounted) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded-lg p-6 border border-purple-500">
          <h1 className="text-3xl font-bold mb-4">🔐 Auth API Test Page</h1>
          <p className="text-gray-300">
            Тестирование @tyrian/api и единого Auth Server
          </p>
        </div>

        {/* Auth Status */}
        <div className={`rounded-lg p-6 border-2 ${authStatus ? 'bg-green-900/20 border-green-500' : 'bg-red-900/20 border-red-500'}`}>
          <h2 className="text-2xl font-bold mb-4">
            {authStatus ? '✅ Authenticated' : '❌ Not Authenticated'}
          </h2>
          {user && (
            <div className="space-y-2">
              <p><strong>User ID:</strong> {user.id}</p>
              <p><strong>Email:</strong> {user.email}</p>
              {user.username && <p><strong>Username:</strong> {user.username}</p>}
            </div>
          )}
        </div>

        {/* Message */}
        {message && (
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-600">
            <p>{message}</p>
          </div>
        )}

        {/* Login Form */}
        {!authStatus && (
          <div className="bg-gray-900 rounded-lg p-6 border border-blue-500">
            <h2 className="text-2xl font-bold mb-4">Login</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-2">Email</label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
                  placeholder="user@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Password</label>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
                  placeholder="••••••••"
                />
              </div>
              <button
                onClick={handleLogin}
                disabled={loading || !loginEmail || !loginPassword}
                className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Loading...' : 'Login'}
              </button>
            </div>
          </div>
        )}

        {/* Register Form */}
        {!authStatus && (
          <div className="bg-gray-900 rounded-lg p-6 border border-green-500">
            <h2 className="text-2xl font-bold mb-4">Register</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-2">Email</label>
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
                  placeholder="user@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Password</label>
                <input
                  type="password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Confirm Password</label>
                <input
                  type="password"
                  value={regPassword2}
                  onChange={(e) => setRegPassword2(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
                  placeholder="••••••••"
                />
              </div>
              <button
                onClick={handleRegister}
                disabled={loading || !regEmail || !regPassword || !regPassword2}
                className="w-full px-6 py-3 bg-green-600 hover:bg-green-500 rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Loading...' : 'Register'}
              </button>
            </div>
          </div>
        )}

        {/* Google Login */}
        <div className="bg-gray-900 rounded-lg p-6 border border-red-500">
          <h2 className="text-2xl font-bold mb-4">Google OAuth</h2>
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full px-6 py-3 bg-red-600 hover:bg-red-500 rounded-lg font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {loading ? 'Redirecting...' : 'Login with Google'}
          </button>
        </div>

        {/* Logout */}
        {authStatus && (
          <div className="bg-gray-900 rounded-lg p-6 border border-yellow-500">
            <h2 className="text-2xl font-bold mb-4">Logout</h2>
            <button
              onClick={handleLogout}
              disabled={loading}
              className="w-full px-6 py-3 bg-yellow-600 hover:bg-yellow-500 rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Loading...' : 'Logout'}
            </button>
          </div>
        )}

        {/* Back to Test Shared */}
        <div className="text-center">
          <a
            href="/test-shared"
            className="inline-block px-6 py-3 bg-purple-600 hover:bg-purple-500 rounded-lg font-bold transition-colors"
          >
            ← Back to Test Shared
          </a>
        </div>
      </div>
    </div>
  );
}

