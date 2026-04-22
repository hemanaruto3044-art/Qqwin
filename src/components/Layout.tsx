import React from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../lib/firebase';
import { LogOut } from 'lucide-react';

export function Layout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <header className="bg-white border-b border-gray-100 px-4 py-3 flex justify-between items-center sticky top-0 z-50 shadow-sm" id="main-header">
        <div className="flex items-center gap-2" id="logo-container" onClick={() => navigate('/')}>
          <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg italic">W</span>
          </div>
          <h1 className="text-xl font-black tracking-tighter text-gray-900">
            IPL<span className="text-red-600">WIN</span>
          </h1>
        </div>
        
        {auth.currentUser && (
          <button 
            onClick={handleLogout}
            className="p-2 text-gray-500 hover:text-red-600 transition-colors"
            id="logout-button"
          >
            <LogOut size={20} />
          </button>
        )}
      </header>
      
      <main className="flex-1 flex flex-col">
        {children}
      </main>

      <footer className="py-4 text-center text-xs text-gray-400">
        © 2026 IPLWin. All rights reserved.
      </footer>
    </div>
  );
}
