import React from 'react';
import { 
  LayoutDashboard, 
  CreditCard, 
  Wallet, 
  BarChart3, 
  User, 
  MessageSquare, 
  Settings,
  LogOut
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';

const Sidebar: React.FC = () => {
  const { logout, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: CreditCard, label: 'Transactions', path: '/transactions' },
    { icon: Wallet, label: 'Wallet', path: '/wallet' },
    { icon: BarChart3, label: 'Analytics', path: '/analytics' },
    { icon: User, label: 'Personal', path: '/personal' },
    { icon: MessageSquare, label: 'Message', path: '/messages' },
    { icon: Settings, label: 'Setting', path: '/settings' },
  ];

  const handleLogout = () => {
    logout();
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <div className="bg-gray-900 w-64 min-h-screen flex flex-col border-r border-gray-800">
      {/* Logo */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center space-x-3">
          <img src="/logo1.png" alt="Monetra Logo" className="w-8 h-8 rounded-lg object-cover" />
          <span className="text-white text-xl font-bold">Monetra</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item, index) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={index}
              onClick={() => handleNavigation(item.path)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive 
                  ? 'bg-emerald-500/10 text-emerald-400 border-r-2 border-emerald-500' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* User Profile & Logout */}
      <div className="p-4 border-t border-gray-800 space-y-2">
        <div className="flex items-center space-x-3 px-4 py-3 rounded-lg bg-gray-800">
          <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">
              {user?.name.charAt(0) || 'U'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium truncate">
              {user?.name || 'User'}
            </p>
            <p className="text-gray-400 text-xs truncate">
              {user?.email || 'user@example.com'}
            </p>
          </div>
        </div>
        
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
        >
          <LogOut className="h-5 w-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;