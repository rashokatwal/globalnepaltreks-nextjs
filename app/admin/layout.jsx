// app/admin/layout.jsx
'use client';
import { usePathname } from 'next/navigation';
import AdminAuthGuard from '../components/admin/AdminAuthGuard';
import Sidebar from '../components/admin/Sidebar';

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';

  // No guard on login page – we show the raw login form
  if (isLoginPage) {
    return <>{children}</>;
  }

  // For all other /admin routes, protect with AuthGuard
  return (
    <AdminAuthGuard>
      <div className="flex relative min-h-screen bg-gray-100">
        <Sidebar />
        <main className="flex-1 h-screen p-6 overflow-y-scroll">
          {children}
        </main>
      </div>
    </AdminAuthGuard>
  );
}