import React, { useState } from 'react'
import {
  BellIcon,
  GlobeIcon,
  MenuIcon,
  UserIcon,
  XIcon,
  LogOutIcon,
  SettingsIcon,
} from 'lucide-react'
import Sidebar from './Sidebar'
const TopNavbar: React.FC = () => {
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [showLanguageMenu, setShowLanguageMenu] = useState(false)
  // This would normally come from authentication context
  const userRole = 'auditor'
  const notifications = [
    {
      id: 1,
      message: 'High-risk vendor activity detected in Tender #4872',
      time: '10 minutes ago',
      priority: 'high',
    },
    {
      id: 2,
      message: 'Contract #3945 has compliance issues',
      time: '1 hour ago',
      priority: 'medium',
    },
    {
      id: 3,
      message: 'New procurement policy update requires review',
      time: '3 hours ago',
      priority: 'low',
    },
  ]
  const languages = [
    {
      code: 'en',
      name: 'English',
    },
    {
      code: 'es',
      name: 'Spanish',
    },
    {
      code: 'fr',
      name: 'French',
    },
  ]
  const dashboardTitle = {
    citizen: 'Citizen Dashboard',
    auditor: 'Auditor Dashboard',
  }
  const title =
    dashboardTitle[userRole as keyof typeof dashboardTitle] || 'Dashboard'
  return (
    <>
      <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white shadow">
        <button
          type="button"
          className="md:hidden px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-black"
          onClick={() => setShowMobileMenu(true)}
        >
          <span className="sr-only">Open sidebar</span>
          <MenuIcon className="h-6 w-6" aria-hidden="true" />
        </button>
        <div className="flex-1 px-4 flex justify-between">
          <div className="flex-1 flex items-center">
            <h1 className="text-xl font-semibold">{title}</h1>
          </div>
          <div className="ml-4 flex items-center md:ml-6 space-x-4">
            {/* Language Selector */}
            <div className="relative">
              <button
                type="button"
                className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                onClick={() => setShowLanguageMenu(!showLanguageMenu)}
              >
                <span className="sr-only">View languages</span>
                <GlobeIcon className="h-6 w-6" aria-hidden="true" />
              </button>
              {showLanguageMenu && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                  {languages.map((lang) => (
                    <a
                      key={lang.code}
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowLanguageMenu(false)}
                    >
                      {lang.name}
                    </a>
                  ))}
                </div>
              )}
            </div>
            {/* Notification Bell */}
            <div className="relative">
              <button
                type="button"
                className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <span className="sr-only">View notifications</span>
                <div className="relative">
                  <BellIcon className="h-6 w-6" aria-hidden="true" />
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 flex items-center justify-center text-xs text-white">
                    3
                  </span>
                </div>
              </button>
              {showNotifications && (
                <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                  <div className="px-4 py-2 border-b border-gray-200">
                    <h3 className="text-sm font-semibold">Notifications</h3>
                  </div>
                  {notifications.map((notification) => (
                    <a
                      key={notification.id}
                      href="#"
                      className="block px-4 py-3 hover:bg-gray-50"
                    >
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mt-0.5">
                          <span
                            className={`h-2 w-2 rounded-full block ${notification.priority === 'high' ? 'bg-red-500' : notification.priority === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'}`}
                          ></span>
                        </div>
                        <div className="ml-3 w-0 flex-1">
                          <div className="text-sm text-gray-900">
                            {notification.message}
                          </div>
                          <div className="text-xs text-gray-500">
                            {notification.time}
                          </div>
                        </div>
                      </div>
                    </a>
                  ))}
                  <div className="border-t border-gray-200 px-4 py-2">
                    <a
                      href="#"
                      className="text-sm font-medium text-black hover:underline"
                    >
                      View all notifications
                    </a>
                  </div>
                </div>
              )}
            </div>
            {/* Profile dropdown */}
            <div className="relative">
              <button
                type="button"
                className="max-w-xs rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
              >
                <span className="sr-only">Open user menu</span>
                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <UserIcon className="h-5 w-5 text-gray-500" />
                </div>
              </button>
              {showProfileMenu && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-700">
                      John Auditor
                    </p>
                    <p className="text-xs text-gray-500">
                      john.auditor@gov.org
                    </p>
                  </div>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowProfileMenu(false)}
                  >
                    <div className="flex items-center">
                      <UserIcon className="h-4 w-4 mr-2" />
                      Your Profile
                    </div>
                  </a>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowProfileMenu(false)}
                  >
                    <div className="flex items-center">
                      <SettingsIcon className="h-4 w-4 mr-2" />
                      Settings
                    </div>
                  </a>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowProfileMenu(false)}
                  >
                    <div className="flex items-center">
                      <LogOutIcon className="h-4 w-4 mr-2" />
                      Sign out
                    </div>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Mobile menu */}
      {showMobileMenu && (
        <div className="fixed inset-0 flex z-40 md:hidden">
          <div
            className="fixed inset-0 bg-gray-600 bg-opacity-75"
            onClick={() => setShowMobileMenu(false)}
          ></div>
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                type="button"
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={() => setShowMobileMenu(false)}
              >
                <span className="sr-only">Close sidebar</span>
                <XIcon className="h-6 w-6 text-white" aria-hidden="true" />
              </button>
            </div>
            <Sidebar />
          </div>
        </div>
      )}
    </>
  )
}
export default TopNavbar
