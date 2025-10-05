'use client';

import React, { useState, useEffect } from 'react';

interface User {
  id: number;
  email: string;
  username: string;
  first_name?: string;
  last_name?: string;
  avatar?: string;
  is_active: boolean;
  is_staff: boolean;
  is_superuser: boolean;
  date_joined: string;
  last_login: string;
}

interface UserProfileProps {
  authServiceUrl?: string;
}

const InfoItem = ({ label, value }: { label: string; value: string | number }) => {
  return (
    <div className="bg-gray-700 p-3 rounded-lg">
      <p className="text-sm font-medium text-gray-400">{label}</p>
      <p className="text-white font-semibold">{value}</p>
    </div>
  );
};

export function UserProfile({ authServiceUrl = 'http://localhost:8001' }: UserProfileProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${authServiceUrl}/api/accounts/me/`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data);
        setError(null);
      } else if (response.status === 401) {
        setError('Not authenticated');
        setUser(null);
      } else {
        setError('Failed to load profile');
      }
    } catch (err) {
      setError('Connection error');
      console.error('Profile fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch(`${authServiceUrl}/api/accounts/logout/`, {
        method: 'POST',
        credentials: 'include',
      });
      setUser(null);
      window.location.reload();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8 bg-gray-900 min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
        <div className="max-w-md mx-auto p-8 bg-gray-800 rounded-lg shadow-xl border border-gray-700">
          <div className="text-center">
            <div className="text-6xl mb-4">🔒</div>
            <h2 className="text-2xl font-bold text-white mb-2">Not Authenticated</h2>
            <p className="text-gray-300 mb-6">{error || 'Please log in to view your profile'}</p>
            <button
              onClick={() => window.location.href = `${authServiceUrl}/api/accounts/google/`}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-900 text-white rounded-lg hover:scale-105 transition-transform shadow-lg"
            >
              Login with Google
            </button>
          </div>
        </div>
      </div>
    );
  }

  const getUserInitial = () => {
    if (user.first_name && user.first_name.length > 0) {
      return user.first_name[0];
    }
    return user.username[0].toUpperCase();
  };

  const getUserFullName = () => {
    if (user.first_name && user.last_name) {
      return `${user.first_name} ${user.last_name}`;
    }
    return user.username;
  };

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden border border-gray-700">
          <div className="bg-gradient-to-r from-purple-600 to-purple-900 p-6 text-white">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 rounded-full bg-purple-700 flex items-center justify-center text-4xl border-2 border-purple-400">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.username} className="w-full h-full rounded-full object-cover" />
                ) : (
                  <span className="text-white">{getUserInitial()}</span>
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">{getUserFullName()}</h1>
                <p className="text-purple-200">{user.email}</p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-4">
            <h2 className="text-xl font-bold text-white mb-4">Profile Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoItem label="User ID" value={user.id ? user.id.toString() : 'N/A'} />
              <InfoItem label="Username" value={user.username} />
              <InfoItem label="Email" value={user.email} />
              {user.first_name && <InfoItem label="First Name" value={user.first_name} />}
              {user.last_name && <InfoItem label="Last Name" value={user.last_name} />}
              <InfoItem label="Account Status" value={user.is_active ? 'Active' : 'Inactive'} />
              {user.date_joined && (
                <InfoItem 
                  label="Joined On" 
                  value={new Date(user.date_joined).toLocaleDateString()} 
                />
              )}
            </div>

            <div className="mt-6 p-4 bg-green-900/30 border border-green-600/50 rounded-lg">
              <h3 className="font-semibold text-green-400 mb-2">✅ Authentication Status</h3>
              <p className="text-sm text-green-300">
                You are logged in across all Tyrian Trade products. Your session is active and synchronized.
              </p>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={fetchUserProfile}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition shadow-lg"
              >
                🔄 Refresh Profile
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition shadow-lg"
              >
                🚪 Logout
              </button>
            </div>
          </div>

          <details className="p-6 border-t border-gray-700">
            <summary className="cursor-pointer text-sm text-gray-400 hover:text-gray-200 font-medium">
              🔧 Debug Information
            </summary>
            <pre className="mt-4 p-4 bg-gray-900 border border-gray-700 rounded text-xs overflow-auto text-gray-300">
              {JSON.stringify(user, null, 2)}
            </pre>
          </details>
        </div>
      </div>
    </div>
  );
}
