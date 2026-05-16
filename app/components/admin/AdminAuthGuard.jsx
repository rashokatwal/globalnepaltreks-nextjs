'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function AdminAuthGuard({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const res = await fetch('/api/auth/me', {
          method: 'GET',
          credentials: 'include', // important to send cookies
        });

        if (res.ok) {
          setIsAuthenticated(true);
        } else {
          // Not authenticated – redirect to login
          router.push(`/admin/login?callbackUrl=${encodeURIComponent(pathname)}`);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        router.push('/admin/login');
      } finally {
        setIsLoading(false);
      }
    };

    verifyAuth();
  }, [router, pathname]);

  if (isLoading) {
    // Show a loading spinner while checking auth
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking credentials...</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : null;
}