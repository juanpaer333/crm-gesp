import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const { user, userData, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Don't render header on login page
  if (location.pathname === '/login') {
    return null;
  }

  const handleLogout = async () => {
    try {
      await logout();
      setIsDropdownOpen(false);
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Get initials for avatar
  const getInitials = () => {
    if (userData?.name) {
      const names = userData.name.split(' ');
      return names.map(name => name[0]).join('').toUpperCase();
    }
    return user?.email?.[0].toUpperCase() || '?';
  };

  return (
    <header className="bg-white shadow">
      <div className="w-full px-2">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="pl-2">
            <h1 className="text-xl font-bold text-gray-800">Grupo España SGI</h1>
          </div>

          {/* User Menu */}
          <div className="relative pr-2">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-3 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded-full"
              aria-expanded={isDropdownOpen}
              aria-haspopup="true"
            >
              <span className="text-sm text-gray-700 hidden sm:block">
                {userData?.name || user?.email}
              </span>
              <div 
                className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-medium ring-2 ring-white"
                aria-hidden="true"
              >
                {getInitials()}
              </div>
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div 
                className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="user-menu"
              >
                <div className="py-1" role="none">
                  <div className="px-4 py-2 text-xs text-gray-500">
                    Signed in as
                    <div className="font-medium text-gray-900 truncate">
                      {user?.email}
                    </div>
                  </div>
                </div>

                <div className="py-1" role="none">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900"
                    role="menuitem"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
