import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Edit,
  Save,
  X,
  Camera,
  Shield,
  Bell,
  CreditCard,
  Key,
  Globe,
  Smartphone
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';

const PersonalPage: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  
  const [profileData, setProfileData] = useState({
    name: user?.name || 'John Doe',
    email: user?.email || 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    address: '123 Main Street, New York, NY 10001',
    dateOfBirth: '1990-05-15',
    occupation: 'Software Developer',
    bio: 'Passionate software developer with 5+ years of experience in web development and financial technology.',
    website: 'https://johndoe.dev',
    linkedin: 'https://linkedin.com/in/johndoe',
    twitter: '@johndoe'
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: true,
    emailNotifications: true,
    smsNotifications: false,
    loginAlerts: true,
    marketingEmails: false
  });

  const handleSave = () => {
    setIsEditing(false);
    // Here you would typically save to your backend
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data if needed
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'preferences', label: 'Preferences', icon: Globe }
  ];

  const renderProfileTab = () => (
    <div className="space-y-6">
      {/* Profile Picture */}
      <div className="flex items-center space-x-6">
        <div className="relative">
          <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center">
            <span className="text-white text-2xl font-bold">
              {profileData.name.charAt(0)}
            </span>
          </div>
          <button className="absolute bottom-0 right-0 w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors duration-200">
            <Camera className="h-4 w-4 text-white" />
          </button>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-white">{profileData.name}</h3>
          <p className="text-gray-400">{profileData.occupation}</p>
          <p className="text-emerald-400 text-sm">Premium Member</p>
        </div>
      </div>

      {/* Profile Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-gray-400 text-sm font-medium mb-2">Full Name</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              value={profileData.name}
              onChange={(e) => setProfileData({...profileData, name: e.target.value})}
              disabled={!isEditing}
              className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
            />
          </div>
        </div>

        <div>
          <label className="block text-gray-400 text-sm font-medium mb-2">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="email"
              value={profileData.email}
              onChange={(e) => setProfileData({...profileData, email: e.target.value})}
              disabled={!isEditing}
              className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
            />
          </div>
        </div>

        <div>
          <label className="block text-gray-400 text-sm font-medium mb-2">Phone Number</label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="tel"
              value={profileData.phone}
              onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
              disabled={!isEditing}
              className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
            />
          </div>
        </div>

        <div>
          <label className="block text-gray-400 text-sm font-medium mb-2">Date of Birth</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="date"
              value={profileData.dateOfBirth}
              onChange={(e) => setProfileData({...profileData, dateOfBirth: e.target.value})}
              disabled={!isEditing}
              className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
            />
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="block text-gray-400 text-sm font-medium mb-2">Address</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              value={profileData.address}
              onChange={(e) => setProfileData({...profileData, address: e.target.value})}
              disabled={!isEditing}
              className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
            />
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="block text-gray-400 text-sm font-medium mb-2">Bio</label>
          <textarea
            value={profileData.bio}
            onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
            disabled={!isEditing}
            rows={4}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50 resize-none"
          />
        </div>
      </div>
    </div>
  );

  const renderSecurityTab = () => (
    <div className="space-y-6">
      <div className="bg-gray-700/50 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-white mb-4">Password & Authentication</h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Change Password</p>
              <p className="text-gray-400 text-sm">Last changed 3 months ago</p>
            </div>
            <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors duration-200">
              Update
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Two-Factor Authentication</p>
              <p className="text-gray-400 text-sm">Add an extra layer of security</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={securitySettings.twoFactorAuth}
                onChange={(e) => setSecuritySettings({...securitySettings, twoFactorAuth: e.target.checked})}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>
        </div>
      </div>

      <div className="bg-gray-700/50 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-white mb-4">Login Activity</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center space-x-3">
              <Smartphone className="h-5 w-5 text-emerald-400" />
              <div>
                <p className="text-white text-sm">iPhone 13 Pro</p>
                <p className="text-gray-400 text-xs">New York, NY • 2 hours ago</p>
              </div>
            </div>
            <span className="text-emerald-400 text-xs">Current</span>
          </div>
          
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center space-x-3">
              <Globe className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-white text-sm">Chrome on Windows</p>
                <p className="text-gray-400 text-xs">San Francisco, CA • 1 day ago</p>
              </div>
            </div>
            <button className="text-red-400 text-xs hover:text-red-300">Revoke</button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      <div className="bg-gray-700/50 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-white mb-4">Notification Preferences</h4>
        <div className="space-y-4">
          {[
            { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive notifications via email' },
            { key: 'smsNotifications', label: 'SMS Notifications', desc: 'Receive notifications via SMS' },
            { key: 'loginAlerts', label: 'Login Alerts', desc: 'Get notified of new login attempts' },
            { key: 'marketingEmails', label: 'Marketing Emails', desc: 'Receive promotional content' }
          ].map((setting) => (
            <div key={setting.key} className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">{setting.label}</p>
                <p className="text-gray-400 text-sm">{setting.desc}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={securitySettings[setting.key as keyof typeof securitySettings]}
                  onChange={(e) => setSecuritySettings({
                    ...securitySettings, 
                    [setting.key]: e.target.checked
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

  const renderPreferencesTab = () => (
    <div className="space-y-6">
      <div className="bg-gray-700/50 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-white mb-4">App Preferences</h4>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-400 text-sm font-medium mb-2">Language</label>
            <select className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500">
              <option>English (US)</option>
              <option>Spanish</option>
              <option>French</option>
              <option>German</option>
            </select>
          </div>
          
          <div>
            <label className="block text-gray-400 text-sm font-medium mb-2">Currency</label>
            <select className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500">
              <option>USD ($)</option>
              <option>EUR (€)</option>
              <option>GBP (£)</option>
              <option>JPY (¥)</option>
            </select>
          </div>
          
          <div>
            <label className="block text-gray-400 text-sm font-medium mb-2">Time Zone</label>
            <select className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500">
              <option>Eastern Time (ET)</option>
              <option>Central Time (CT)</option>
              <option>Mountain Time (MT)</option>
              <option>Pacific Time (PT)</option>
            </select>
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
              <h1 className="text-2xl font-bold text-white">Personal Settings</h1>
              <p className="text-gray-400 mt-1">Manage your account and preferences</p>
            </div>
            
            <div className="flex items-center space-x-4">
              {isEditing ? (
                <>
                  <button
                    onClick={handleCancel}
                    className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                  >
                    <X className="h-4 w-4" />
                    <span>Cancel</span>
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                  >
                    <Save className="h-4 w-4" />
                    <span>Save Changes</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                >
                  <Edit className="h-4 w-4" />
                  <span>Edit Profile</span>
                </button>
              )}
            </div>
          </div>
        </header>

        <div className="p-8">
          <div className="max-w-4xl mx-auto">
            {/* Tabs */}
            <div className="flex space-x-1 bg-gray-800 rounded-lg p-1 mb-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-emerald-600 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
              {activeTab === 'profile' && renderProfileTab()}
              {activeTab === 'security' && renderSecurityTab()}
              {activeTab === 'notifications' && renderNotificationsTab()}
              {activeTab === 'preferences' && renderPreferencesTab()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalPage;