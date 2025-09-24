import React, { useState } from 'react'
import {
  Bell,
  ChevronDown,
  Home,
  BarChart2,
  FileText,
  DollarSign,
  HelpCircle,
  Shield,
  Menu,
  X,
  Award,
  PieChart,
} from 'lucide-react'

export interface CitizenDashboardProps {
  userName?: string
  userAvatar?: string
  'data-id'?: string
}

export function CitizenDashboard({
  userName = 'Alex Citizen',
  userAvatar,
  'data-id': dataId,
}: CitizenDashboardProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState('home')

  const [notifications] = useState([
    { id: 1, message: 'New spending report published for Q2', time: '2h ago' },
    { id: 2, message: 'Contract awarded: Road Infrastructure', time: '5h ago' },
    { id: 3, message: 'Transparency stats updated', time: '1 day ago' },
  ])

  const menuItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'transparency', icon: BarChart2, label: 'Transparency Stats' },
    { id: 'contracts', icon: Award, label: 'Awarded Contracts' },
    { id: 'spending', icon: DollarSign, label: 'Spending Reports' },
    { id: 'support', icon: HelpCircle, label: 'Support' },
  ]

  const stats = [
    { title: 'Total Contracts Awarded', value: '152', icon: Award },
    { title: 'Government Spending', value: '$1.2B', icon: DollarSign },
    { title: 'Active Projects', value: '47', icon: PieChart },
    { title: 'Transparency Score', value: '92%', icon: BarChart2 },
  ]

  const StatCard = ({ stat }: { stat: any }) => (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
          <p className="text-2xl font-bold text-black">{stat.value}</p>
        </div>
        <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center">
          <stat.icon className="h-6 w-6 text-gray-700" />
        </div>
      </div>
    </div>
  )

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'transparency':
        return (
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Transparency Statistics</h2>
            <p className="text-gray-600">
              View metrics on transparency, accountability, and procurement performance.
            </p>
          </div>
        )
      case 'contracts':
        return (
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Awarded Contracts</h2>
            <p className="text-gray-600">
              Explore all government contracts awarded to vendors with full details.
            </p>
          </div>
        )
      case 'spending':
        return (
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Spending Reports</h2>
            <p className="text-gray-600">
              Track government expenditure by sector, project, and timeline.
            </p>
          </div>
        )
      case 'support':
        return (
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Support</h2>
            <p className="text-gray-600">
              Need help? Contact our support team for queries about transparency and procurement data.
            </p>
          </div>
        )
      default:
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold text-black mb-2">Citizen Dashboard</h1>
            <p className="text-gray-600">
              Access transparency stats, contracts, and government spending insights.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 my-6">
              {stats.map((stat, index) => (
                <StatCard key={index} stat={stat} />
              ))}
            </div>

            {/* Notifications */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-black mb-4 flex items-center">
                <Bell className="h-5 w-5 mr-2" /> Recent Updates
              </h3>
              <div className="space-y-4">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className="flex items-start space-x-3 p-3 rounded-md border border-gray-100 hover:bg-gray-50"
                  >
                    <div className="h-2 w-2 bg-black rounded-full mt-2 flex-shrink-0"></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{n.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{n.time}</p>
                    </div>
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
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Left */}
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

          {/* Right */}
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

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}
