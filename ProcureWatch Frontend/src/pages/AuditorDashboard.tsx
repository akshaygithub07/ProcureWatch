import React, { useState } from 'react'
import {
  Bell,
  ChevronDown,
  Home,
  FileSearch,
  AlertTriangle,
  BarChart2,
  FileText,
  HelpCircle,
  Shield,
  Menu,
  X,
  CheckCircle,
  Activity,
} from 'lucide-react'

export interface AuditorDashboardProps {
  userName?: string
  userAvatar?: string
  'data-id'?: string
}

export function AuditorDashboard({
  userName = 'Jane Auditor',
  userAvatar,
  'data-id': dataId,
}: AuditorDashboardProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState('home')
  const [notifications] = useState([
    { id: 1, message: 'Audit Trail updated by System', time: '1h ago' },
    { id: 2, message: 'New Flagged Issue detected in Tender #203', time: '3h ago' },
    { id: 3, message: 'Compliance report ready for review', time: '1 day ago' },
  ])

  const menuItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'audit-trail', icon: FileSearch, label: 'Audit Trail' },
    { id: 'flagged-issues', icon: AlertTriangle, label: 'Flagged Issues' },
    { id: 'compliance-stats', icon: BarChart2, label: 'Compliance Stats' },
    { id: 'reports', icon: FileText, label: 'Reports' },
    { id: 'support', icon: HelpCircle, label: 'Support' },
  ]

  // Auditor stats
  const stats = [
    {
      title: 'Total Audits',
      value: '152',
      change: '+12%',
      icon: Activity,
      trend: 'up' as const,
    },
    {
      title: 'Flagged Issues',
      value: '37',
      change: '+5',
      icon: AlertTriangle,
      trend: 'up' as const,
    },
    {
      title: 'Resolved Issues',
      value: '28',
      change: '+3',
      icon: CheckCircle,
      trend: 'up' as const,
    },
    {
      title: 'Compliance Rate',
      value: '92%',
      change: '+4%',
      icon: BarChart2,
      trend: 'up' as const,
    },
  ]

  const StatCard = ({ stat }: { stat: any }) => (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
          <p className="text-2xl font-bold text-black">{stat.value}</p>
          {stat.change && (
            <p
              className={`text-sm mt-1 ${
                stat.trend === 'up'
                  ? 'text-green-600'
                  : stat.trend === 'down'
                  ? 'text-red-600'
                  : 'text-gray-600'
              }`}
            >
              {stat.change}
            </p>
          )}
        </div>
        <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center">
          <stat.icon className="h-6 w-6 text-gray-700" />
        </div>
      </div>
    </div>
  )

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'audit-trail':
        return (
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Audit Trail</h2>
            <p className="text-gray-600">Here auditors can review system logs and activities.</p>
          </div>
        )
      case 'flagged-issues':
        return (
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Flagged Issues</h2>
            <p className="text-gray-600">View anomalies or issues flagged during procurement.</p>
          </div>
        )
      case 'compliance-stats':
        return (
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Compliance Statistics</h2>
            <p className="text-gray-600">Visual analytics about compliance checks.</p>
          </div>
        )
      case 'reports':
        return (
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Reports</h2>
            <p className="text-gray-600">Generate and download audit reports.</p>
          </div>
        )
      case 'support':
        return (
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Support</h2>
            <p className="text-gray-600">Contact support team for help.</p>
          </div>
        )
      default:
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold text-black mb-2">Auditor Dashboard</h1>
            <p className="text-gray-600">Monitor audit trails, flagged issues, and compliance.</p>

            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 my-8">
              {stats.map((stat, idx) => (
                <StatCard key={idx} stat={stat} />
              ))}
            </div>

            {/* Notifications */}
            <div className="mt-6 bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-3 flex items-center">
                <Bell className="h-5 w-5 mr-2" /> Recent Notifications
              </h3>
              <div className="space-y-3">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className="p-3 border-gray-800 rounded-md hover:bg-gray-50"
                  >
                    <p className="text-sm text-gray-900">{n.message}</p>
                    <p className="text-xs text-gray-500">{n.time}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
    }
  }

  return (
    <div
      data-id={dataId}
      className="min-h-screen bg-gray-50"
      style={{ fontFamily: 'Poppins, sans-serif' }}
    >
      {/* Top Navbar */}
      <nav className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-md hover:bg-gray-100"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-black rounded-lg flex items-center justify-center">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-black">Procurewatch</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-md hover:bg-gray-100 relative">
              <Bell className="h-5 w-5 text-gray-700" />
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-xs text-white rounded-full flex items-center justify-center">
                {notifications.length}
              </span>
            </button>
            <div className="flex items-center space-x-2 px-2 py-1 rounded-md hover:bg-gray-100 cursor-pointer">
              <div className="h-8 w-8 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-gray-700">
                  {userName
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </span>
              </div>
              <span className="text-sm font-medium text-gray-700 hidden sm:block">
                {userName}
              </span>
              <ChevronDown className="h-4 w-4 text-gray-500" />
            </div>
          </div>
        </div>
      </nav>

      {/* Layout */}
      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`bg-white border-r border-gray-200 w-64 min-h-screen transition-transform duration-300 
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
          lg:translate-x-0 fixed lg:static z-30`}
        >
          <div className="p-4">
            <div className="flex items-center justify-between mb-6 lg:hidden">
              <span className="text-lg font-semibold">Menu</span>
              <button onClick={() => setSidebarOpen(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="space-y-2">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentPage(item.id)
                    setSidebarOpen(false)
                  }}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium text-left transition-colors 
                  ${currentPage === item.id ? 'bg-black text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">{renderCurrentPage()}</main>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}
