import React, { useState } from 'react';
import { 
  Settings, 
  Shield, 
  Bell, 
  Palette, 
  CreditCard,
  Database,
  Download,
  Upload,
  Trash2,
  AlertTriangle,
  Save
} from 'lucide-react';
import Sidebar from '../components/Sidebar';

const SettingsPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState('general');
  const [settings, setSettings] = useState({
    theme: 'dark',
    language: 'en',
    currency: 'USD',
    timezone: 'EST',
    notifications: {
      email: true,
      push: true,
      sms: false,
      marketing: false
    },
    privacy: {
      profileVisibility: 'private',
      dataSharing: false,
      analytics: true
    },
    security: {
      twoFactor: true,
      sessionTimeout: 30,
      loginAlerts: true
    }
  });

  const sections = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'data', label: 'Data Management', icon: Database }
  ];

  const handleSave = () => {
    // Save settings logic here
    console.log('Settings saved:', settings);
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">General Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-400 text-sm font-medium mb-2">Language</label>
            <select
              title="Select language"
              value={settings.language}
              onChange={(e) => setSettings({...settings, language: e.target.value})}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-400 text-sm font-medium mb-2">Currency</label>
            <select
              title="Select currency"
              value={settings.currency}
              onChange={(e) => setSettings({...settings, currency: e.target.value})}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="JPY">JPY (¥)</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-400 text-sm font-medium mb-2">Time Zone</label>
            <select
              title="Select timezone"
              value={settings.timezone}
              onChange={(e) => setSettings({...settings, timezone: e.target.value})}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="EST">Eastern Time (EST)</option>
              <option value="CST">Central Time (CST)</option>
              <option value="MST">Mountain Time (MST)</option>
              <option value="PST">Pacific Time (PST)</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-400 text-sm font-medium mb-2">Date Format</label>
            <select
              title="Select date format"
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option>MM/DD/YYYY</option>
              <option>DD/MM/YYYY</option>
              <option>YYYY-MM-DD</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAppearanceSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Appearance</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-400 text-sm font-medium mb-3">Theme</label>
            <div className="grid grid-cols-3 gap-4">
              {['dark', 'light', 'auto'].map((theme) => (
                <button
                  key={theme}
                  onClick={() => setSettings({...settings, theme})}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                    settings.theme === theme
                      ? 'border-emerald-500 bg-emerald-500/10'
                      : 'border-gray-600 bg-gray-700/50 hover:border-gray-500'
                  }`}
                >
                  <div className={`w-full h-16 rounded mb-2 ${
                    theme === 'dark' ? 'bg-gray-900' :
                    theme === 'light' ? 'bg-white' :
                    'bg-gradient-to-r from-gray-900 to-white'
                  }`}></div>
                  <p className="text-white text-sm capitalize">{theme}</p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-gray-400 text-sm font-medium mb-2">Accent Color</label>
            <div className="flex space-x-3">
              {['emerald', 'blue', 'purple', 'pink', 'orange'].map((color) => (
                <button
                  key={color}
                  type="button"
                  title={`Select ${color} color`}
                  className={`w-8 h-8 rounded-full bg-${color}-500 hover:scale-110 transition-transform duration-200`}
                ></button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-gray-400 text-sm font-medium mb-2">Font Size</label>
            <select
              title="Select font size"
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option>Small</option>
              <option>Medium</option>
              <option>Large</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Notification Preferences</h3>
        <div className="space-y-4">
          {[
            { key: 'email', label: 'Email Notifications', desc: 'Receive notifications via email' },
            { key: 'push', label: 'Push Notifications', desc: 'Receive push notifications in browser' },
            { key: 'sms', label: 'SMS Notifications', desc: 'Receive notifications via SMS' },
            { key: 'marketing', label: 'Marketing Communications', desc: 'Receive promotional content' }
          ].map((notification) => (
            <div key={notification.key} className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
              <div>
                <p className="text-white font-medium">{notification.label}</p>
                <p className="text-gray-400 text-sm">{notification.desc}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  aria-label={`Toggle ${notification.label}`}
                  checked={settings.notifications[notification.key as keyof typeof settings.notifications]}
                  onChange={(e) => setSettings({
                    ...settings,
                    notifications: {
                      ...settings.notifications,
                      [notification.key]: e.target.checked
                    }
                  })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPrivacySettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Privacy & Security</h3>
        <div className="space-y-4">
          <div className="p-4 bg-gray-700/50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <p className="text-white font-medium">Profile Visibility</p>
            </div>
            <select
              title="Select profile visibility"
              value={settings.privacy.profileVisibility}
              onChange={(e) => setSettings({
                ...settings,
                privacy: {...settings.privacy, profileVisibility: e.target.value}
              })}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
              <option value="friends">Friends Only</option>
            </select>
          </div>

          <div className="p-4 bg-gray-700/50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Data Sharing</p>
                <p className="text-gray-400 text-sm">Allow sharing of anonymized data for analytics</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  aria-label="Toggle data sharing"
                  checked={settings.privacy.dataSharing}
                  onChange={(e) => setSettings({
                    ...settings,
                    privacy: {...settings.privacy, dataSharing: e.target.checked}
                  })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderBillingSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Billing & Subscription</h3>
        <div className="bg-gray-700/50 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-white font-medium">Premium Plan</h4>
              <p className="text-gray-400 text-sm">$29.99/month • Next billing: Jan 15, 2024</p>
            </div>
            <span className="bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-sm">Active</span>
          </div>
          
          <div className="space-y-3">
            <button className="w-full bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 text-left">
              Update Payment Method
            </button>
            <button className="w-full bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 text-left">
              Download Invoices
            </button>
            <button className="w-full bg-red-600/10 hover:bg-red-600/20 text-red-400 px-4 py-2 rounded-lg transition-colors duration-200 text-left">
              Cancel Subscription
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDataSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Data Management</h3>
        <div className="space-y-4">
          <div className="bg-gray-700/50 rounded-lg p-6">
            <h4 className="text-white font-medium mb-4">Export Data</h4>
            <p className="text-gray-400 text-sm mb-4">Download a copy of your data including transactions, messages, and settings.</p>
            <button className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors duration-200">
              <Download className="h-4 w-4" />
              <span>Export Data</span>
            </button>
          </div>

          <div className="bg-gray-700/50 rounded-lg p-6">
            <h4 className="text-white font-medium mb-4">Import Data</h4>
            <p className="text-gray-400 text-sm mb-4">Import data from other financial applications.</p>
            <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200">
              <Upload className="h-4 w-4" />
              <span>Import Data</span>
            </button>
          </div>

          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-red-400 font-medium mb-2">Danger Zone</h4>
                <p className="text-gray-400 text-sm mb-4">
                  Permanently delete your account and all associated data. This action cannot be undone.
                </p>
                <button className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-200">
                  <Trash2 className="h-4 w-4" />
                  <span>Delete Account</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-900">
      <Sidebar />
      
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-gray-900 border-b border-gray-800 px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Settings</h1>
              <p className="text-gray-400 mt-1">Manage your application preferences and account settings</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={handleSave}
                className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                <Save className="h-4 w-4" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </header>

        <div className="flex">
          {/* Settings Navigation */}
          <div className="w-64 bg-gray-800 border-r border-gray-700 min-h-screen">
            <nav className="p-6 space-y-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    activeSection === section.id
                      ? 'bg-emerald-500/10 text-emerald-400 border-r-2 border-emerald-500'
                      : 'text-gray-400 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  <section.icon className="h-5 w-5" />
                  <span className="font-medium">{section.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Settings Content */}
          <div className="flex-1 p-8">
            <div className="max-w-4xl">
              {activeSection === 'general' && renderGeneralSettings()}
              {activeSection === 'appearance' && renderAppearanceSettings()}
              {activeSection === 'notifications' && renderNotificationSettings()}
              {activeSection === 'privacy' && renderPrivacySettings()}
              {activeSection === 'billing' && renderBillingSettings()}
              {activeSection === 'data' && renderDataSettings()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;