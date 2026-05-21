'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { logos } from '@/app/assets/assets';

const Login = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/admin';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true); // new

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/me', {
          credentials: 'include', // send cookies
        });
        if (res.ok) {
          // Already logged in → redirect to admin panel
          router.replace(callbackUrl);
          return;
        }
      } catch (err) {
        // Not authenticated, stay on login page
      } finally {
        setIsCheckingAuth(false);
      }
    };
    checkAuth();
  }, [router, callbackUrl]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        router.push(callbackUrl);
      } else {
        setError(data.error || 'Invalid email or password');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-section">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-accent-color border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-400">Checking session...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, render login form (same as before)
  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-section px-4">
      <div className="w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-lg p-8 border border-white/20">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center">
              <Image
                src={logos.globalnepaltreks_logo}
                alt="Global Nepal Treks Logo"
                className="w-50 h-20 object-contain"
              />
            </div>
            <h2 className="text-2xl font-bold text-secondary-color mt-3">Admin Login</h2>
            <p className="text-primary-color-dark text-sm font-medium mt-1">Global Nepal Treks</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-sm text-center text-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm text-secondary-color font-medium mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-color focus:border-transparent transition"
                placeholder="admin@globalnepaltreks.com"
              />
            </div>

            <div>
              <label className="block text-sm text-secondary-color font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-color focus:border-transparent transition"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full cursor-pointer px-6 py-3 font-medium text-center text-white duration-200 rounded bg-accent-color hover:bg-secondary-color disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;