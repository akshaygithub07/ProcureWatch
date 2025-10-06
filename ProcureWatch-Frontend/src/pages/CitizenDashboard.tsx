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
          <div className='p-6'>
            <TransparencyStats/>
          </div>
        )
      case 'contracts':
        return (
          <div className="p-6">
            <AwardedContracts/>
          </div>
        )
      case 'spending':
        return (
          <div className="p-6">
            <SpendingReports/>
          </div>
        )
      case 'support':
        return (
          <div className="p-6">
            <Support/>
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


import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
} from 'recharts'
import {
  BarChart3Icon,
  TrendingUpIcon,
  ShieldIcon,
  SearchIcon,
  EyeIcon,
} from 'lucide-react'
import StatisticsCard from '../../src/components/dashboard/StatisticsCard'
import ChartWidget from '../../src/components/dashboard/ChartWidget'
export const TransparencyStats: React.FC = () => {
  // Sample data for transparency metrics
  const transparencyIndex = [
    {
      name: 'Jan',
      score: 78,
    },
    {
      name: 'Feb',
      score: 80,
    },
    {
      name: 'Mar',
      score: 82,
    },
    {
      name: 'Apr',
      score: 85,
    },
    {
      name: 'May',
      score: 88,
    },
    {
      name: 'Jun',
      score: 91,
    },
    {
      name: 'Jul',
      score: 90,
    },
    {
      name: 'Aug',
      score: 92,
    },
  ]
  const procurementCategories = [
    {
      name: 'Open Tendering',
      value: 65,
    },
    {
      name: 'Limited Bidding',
      value: 15,
    },
    {
      name: 'Direct Award',
      value: 10,
    },
    {
      name: 'Framework Agreements',
      value: 10,
    },
  ]
  const radarData = [
    {
      subject: 'Transparency',
      A: 85,
      fullMark: 100,
    },
    {
      subject: 'Compliance',
      A: 92,
      fullMark: 100,
    },
    {
      subject: 'Competition',
      A: 78,
      fullMark: 100,
    },
    {
      subject: 'Efficiency',
      A: 82,
      fullMark: 100,
    },
    {
      subject: 'Accountability',
      A: 88,
      fullMark: 100,
    },
    {
      subject: 'Integrity',
      A: 90,
      fullMark: 100,
    },
  ]
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-semibold text-gray-900">
          Transparency Statistics
        </h1>
        <div className="flex items-center space-x-2">
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </div>
            <input
              type="text"
              className="focus:ring-black focus:border-black block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 px-3 border"
              placeholder="Search statistics..."
            />
          </div>
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black">
            <EyeIcon className="h-4 w-4 mr-2" />
            View Reports
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatisticsCard
          title="Transparency Index"
          value="92%"
          icon={<BarChart3Icon className="h-6 w-6 text-gray-500" />}
          change={{
            value: '4%',
            positive: true,
          }}
        />
        <StatisticsCard
          title="Open Contracts"
          value="156"
          icon={<EyeIcon className="h-6 w-6 text-gray-500" />}
          change={{
            value: '12',
            positive: true,
          }}
        />
        <StatisticsCard
          title="Compliance Rate"
          value="96%"
          icon={<ShieldIcon className="h-6 w-6 text-gray-500" />}
          change={{
            value: '2%',
            positive: true,
          }}
        />
        <StatisticsCard
          title="Public Engagement"
          value="1,245"
          icon={<TrendingUpIcon className="h-6 w-6 text-gray-500" />}
          change={{
            value: '18%',
            positive: true,
          }}
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartWidget title="Transparency Index Trend" className="">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={transparencyIndex}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Bar dataKey="score" fill="#000000" />
            </BarChart>
          </ResponsiveContainer>
        </ChartWidget>
        <ChartWidget title="Procurement Method Distribution" className="">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={procurementCategories}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => {
                  const total = procurementCategories.reduce((sum, entry) => sum + (typeof entry.value === 'number' ? entry.value : 0), 0)
                  const safeValue = typeof value === 'number' ? value : 0
                  const percent = total ? (safeValue / total) * 100 : 0
                  return `${name}: ${percent.toFixed(0)}%`
                }}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {procurementCategories.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartWidget>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-5 border border-gray-100 h-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Transparency Metrics
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-700">
                    Contract Publication Rate
                  </span>
                  <span className="text-sm font-medium text-gray-900">98%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-black h-2 rounded-full"
                    style={{
                      width: '98%',
                    }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-700">
                    Data Completeness
                  </span>
                  <span className="text-sm font-medium text-gray-900">94%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-black h-2 rounded-full"
                    style={{
                      width: '94%',
                    }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-700">
                    Timeliness of Updates
                  </span>
                  <span className="text-sm font-medium text-gray-900">89%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-black h-2 rounded-full"
                    style={{
                      width: '89%',
                    }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-700">
                    Bid Information Disclosure
                  </span>
                  <span className="text-sm font-medium text-gray-900">96%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-black h-2 rounded-full"
                    style={{
                      width: '96%',
                    }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-700">
                    Contract Amendment Disclosure
                  </span>
                  <span className="text-sm font-medium text-gray-900">92%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-black h-2 rounded-full"
                    style={{
                      width: '92%',
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="lg:col-span-2">
          <ChartWidget
            title="Procurement System Performance"
            className="h-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                <Radar
                  name="Current Performance"
                  dataKey="A"
                  stroke="#000000"
                  fill="#000000"
                  fillOpacity={0.6}
                />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </ChartWidget>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow border border-gray-100 p-5">
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <ShieldIcon className="h-5 w-5 mr-2" /> Transparency Initiatives
        </h3>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="font-medium text-gray-900">
                Open Contracting Data Standard
              </h4>
              <p className="text-sm text-gray-600 mt-2">
                All procurement data is published following the Open Contracting
                Data Standard (OCDS) to ensure maximum transparency and
                interoperability.
              </p>
              <div className="mt-3">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Implemented
                </span>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="font-medium text-gray-900">
                Blockchain Verification
              </h4>
              <p className="text-sm text-gray-600 mt-2">
                All procurement transactions are recorded on blockchain,
                creating an immutable audit trail that prevents tampering with
                procurement records.
              </p>
              <div className="mt-3">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Implemented
                </span>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="font-medium text-gray-900">
                Public Feedback Mechanism
              </h4>
              <p className="text-sm text-gray-600 mt-2">
                Citizens can provide feedback on procurement processes and
                outcomes, creating a feedback loop for continuous improvement.
              </p>
              <div className="mt-3">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  In Progress
                </span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <button className="text-sm font-medium text-black hover:underline">
              View all transparency initiatives →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

import {
  FilterIcon,
  ArrowDownIcon,
  FileTextIcon,
  SlidersIcon,
  CheckCircleIcon,
  CalendarIcon,
} from 'lucide-react'
const AwardedContracts: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState('all')
  // Sample data for awarded contracts
  const contracts = [
    {
      id: 'CTR-2023-001',
      project: 'Highway Infrastructure Development',
      vendor: 'Construction Co. Ltd.',
      value: '$11.8M',
      awardDate: 'Nov 15, 2023',
      completionDate: 'May 15, 2025',
      department: 'Transportation',
      status: 'In Progress',
      completion: 25,
    },
    {
      id: 'CTR-2023-002',
      project: 'Public Hospital Renovation',
      vendor: 'Healthcare Builders',
      value: '$7.9M',
      awardDate: 'Oct 10, 2023',
      completionDate: 'Apr 10, 2024',
      department: 'Healthcare',
      status: 'In Progress',
      completion: 40,
    },
    {
      id: 'CTR-2023-003',
      project: 'City Park Redevelopment',
      vendor: 'Green Spaces Inc.',
      value: '$3.2M',
      awardDate: 'Sep 5, 2023',
      completionDate: 'Mar 5, 2024',
      department: 'Parks & Recreation',
      status: 'In Progress',
      completion: 65,
    },
    {
      id: 'CTR-2023-004',
      project: 'Municipal Building Maintenance',
      vendor: 'Facility Services LLC',
      value: '$1.5M',
      awardDate: 'Aug 20, 2023',
      completionDate: 'Aug 20, 2024',
      department: 'Public Works',
      status: 'In Progress',
      completion: 50,
    },
    {
      id: 'CTR-2022-042',
      project: 'Traffic Light Installation',
      vendor: 'Urban Systems Corp.',
      value: '$0.8M',
      awardDate: 'Dec 10, 2022',
      completionDate: 'Jun 10, 2023',
      department: 'Transportation',
      status: 'Completed',
      completion: 100,
    },
  ]
  const filteredContracts =
    selectedFilter === 'all'
      ? contracts
      : contracts.filter(
          (contract) =>
            contract.status.toLowerCase() === selectedFilter.toLowerCase(),
        )
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-semibold text-gray-900">
          Awarded Contracts
        </h1>
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </div>
            <input
              type="text"
              className="focus:ring-black focus:border-black block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 px-3 border"
              placeholder="Search contracts..."
            />
          </div>
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black">
            <SlidersIcon className="h-4 w-4 mr-2" />
            Advanced Filters
          </button>
        </div>
      </div>
      <div className="bg-white shadow rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <div className="flex flex-wrap items-center justify-between">
            <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
              <CheckCircleIcon className="h-5 w-5 mr-2 text-green-600" />{' '}
              Contract Awards
            </h3>
            <div className="flex items-center space-x-2 mt-2 sm:mt-0">
              <span className="text-sm text-gray-500">Filter:</span>
              <div className="relative">
                <select
                  className="block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-black focus:border-black sm:text-sm rounded-md"
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                >
                  <option value="all">All Contracts</option>
                  <option value="in progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Contract Details
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Vendor
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Department
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Value
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredContracts.map((contract) => (
                <tr key={contract.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <div className="text-sm font-medium text-gray-900">
                        {contract.project}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {contract.id}
                      </div>
                      <div className="text-xs text-gray-500 mt-1 flex items-center">
                        <CalendarIcon className="h-3 w-3 mr-1" />
                        Awarded: {contract.awardDate}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {contract.vendor}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {contract.department}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {contract.value}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${contract.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}
                      >
                        {contract.status}
                      </span>
                      {contract.status !== 'Completed' && (
                        <div className="mt-2">
                          <div className="flex items-center">
                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                              <div
                                className="bg-black h-1.5 rounded-full"
                                style={{
                                  width: `${contract.completion}%`,
                                }}
                              ></div>
                            </div>
                            <span className="ml-2 text-xs text-gray-500">
                              {contract.completion}%
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-3">
                      <button className="text-black hover:text-gray-700 inline-flex items-center">
                        <FileTextIcon className="h-4 w-4 mr-1" />
                        View
                      </button>
                      <button className="text-black hover:text-gray-700 inline-flex items-center">
                        <ArrowDownIcon className="h-4 w-4 mr-1" />
                        Download
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="bg-white shadow rounded-lg border border-gray-200 p-5">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Contract Award Statistics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 p-4 rounded-md">
            <div className="text-2xl font-bold text-black">$24.2M</div>
            <div className="text-sm text-gray-500">
              Total Value of Awarded Contracts
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-md">
            <div className="text-2xl font-bold text-black">28</div>
            <div className="text-sm text-gray-500">
              Number of Awarded Contracts
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-md">
            <div className="text-2xl font-bold text-black">12</div>
            <div className="text-sm text-gray-500">
              Number of Unique Vendors
            </div>
          </div>
        </div>
        <div className="mt-6">
          <h4 className="font-medium text-gray-900 mb-3">
            Top Departments by Contract Value
          </h4>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">
                  Transportation
                </span>
                <span className="text-sm font-medium text-gray-900">
                  $12.6M
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-black h-2 rounded-full"
                  style={{
                    width: '52%',
                  }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">
                  Healthcare
                </span>
                <span className="text-sm font-medium text-gray-900">$7.9M</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-black h-2 rounded-full"
                  style={{
                    width: '33%',
                  }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">
                  Parks & Recreation
                </span>
                <span className="text-sm font-medium text-gray-900">$3.2M</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-black h-2 rounded-full"
                  style={{
                    width: '13%',
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-700">
          Showing <span className="font-medium">1</span> to{' '}
          <span className="font-medium">{filteredContracts.length}</span> of{' '}
          <span className="font-medium">28</span> contracts
        </p>
        <nav
          className="isolate inline-flex -space-x-px rounded-md shadow-sm"
          aria-label="Pagination"
        >
          <button className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
            Previous
          </button>
          <button className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-white bg-black focus:z-20">
            1
          </button>
          <button className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
            2
          </button>
          <button className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
            3
          </button>
          <button className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
            Next
          </button>
        </nav>
      </div>
    </div>
  )
}

import {
  LineChart,
  Line,
} from 'recharts'
import {
  LineChartIcon,
  DownloadIcon,
  DollarSignIcon,
} from 'lucide-react'
const SpendingReports: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState('2023')
  const [selectedQuarter, setSelectedQuarter] = useState('Q3')
  // Sample data for spending by department
  const departmentSpending = [
    {
      name: 'Transportation',
      value: 4200000,
    },
    {
      name: 'Healthcare',
      value: 3800000,
    },
    {
      name: 'Education',
      value: 2900000,
    },
    {
      name: 'Public Safety',
      value: 2400000,
    },
    {
      name: 'Housing',
      value: 1800000,
    },
    {
      name: 'Other',
      value: 1200000,
    },
  ]
  // Sample data for spending over time
  const spendingOverTime = [
    {
      month: 'Jan',
      planned: 1200000,
      actual: 1150000,
    },
    {
      month: 'Feb',
      planned: 1300000,
      actual: 1280000,
    },
    {
      month: 'Mar',
      planned: 1400000,
      actual: 1450000,
    },
    {
      month: 'Apr',
      planned: 1200000,
      actual: 1300000,
    },
    {
      month: 'May',
      planned: 1100000,
      actual: 1050000,
    },
    {
      month: 'Jun',
      planned: 1300000,
      actual: 1320000,
    },
    {
      month: 'Jul',
      planned: 1400000,
      actual: 1380000,
    },
    {
      month: 'Aug',
      planned: 1500000,
      actual: 1520000,
    },
    {
      month: 'Sep',
      planned: 1600000,
      actual: 1550000,
    },
  ]
  // Sample data for spending by category
  const spendingByCategory = [
    {
      name: 'Infrastructure',
      value: 5200000,
    },
    {
      name: 'Services',
      value: 3800000,
    },
    {
      name: 'Supplies',
      value: 2400000,
    },
    {
      name: 'Consulting',
      value: 1800000,
    },
    {
      name: 'Technology',
      value: 2100000,
    },
  ]
  // Sample data for monthly spending by project type
  const monthlySpendingByType = [
    {
      month: 'Jan',
      construction: 800000,
      maintenance: 350000,
      consulting: 150000,
    },
    {
      month: 'Feb',
      construction: 900000,
      maintenance: 320000,
      consulting: 180000,
    },
    {
      month: 'Mar',
      construction: 950000,
      maintenance: 380000,
      consulting: 220000,
    },
    {
      month: 'Apr',
      construction: 870000,
      maintenance: 400000,
      consulting: 190000,
    },
    {
      month: 'May',
      construction: 760000,
      maintenance: 390000,
      consulting: 170000,
    },
    {
      month: 'Jun',
      construction: 880000,
      maintenance: 410000,
      consulting: 210000,
    },
    {
      month: 'Jul',
      construction: 920000,
      maintenance: 430000,
      consulting: 230000,
    },
    {
      month: 'Aug',
      construction: 990000,
      maintenance: 450000,
      consulting: 260000,
    },
    {
      month: 'Sep',
      construction: 1050000,
      maintenance: 470000,
      consulting: 280000,
    },
  ]
  const COLORS = [
    '#0088FE',
    '#00C49F',
    '#FFBB28',
    '#FF8042',
    '#8884D8',
    '#82ca9d',
  ]
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-semibold text-gray-900">
          Spending Reports
        </h1>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2">
            <select
              className="block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-black focus:border-black sm:text-sm rounded-md"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              <option value="2023">2023</option>
              <option value="2022">2022</option>
              <option value="2021">2021</option>
            </select>
            <select
              className="block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-black focus:border-black sm:text-sm rounded-md"
              value={selectedQuarter}
              onChange={(e) => setSelectedQuarter(e.target.value)}
            >
              <option value="Q1">Q1</option>
              <option value="Q2">Q2</option>
              <option value="Q3">Q3</option>
              <option value="Q4">Q4</option>
            </select>
          </div>
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black">
            <DownloadIcon className="h-4 w-4 mr-2" />
            Export
          </button>
        </div>
      </div>
      <div className="bg-white shadow rounded-lg border border-gray-200 p-5">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <LineChartIcon className="h-5 w-5 mr-2" /> Spending Overview
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {selectedYear} {selectedQuarter} Financial Summary
            </p>
          </div>
          <div className="mt-3 md:mt-0 flex items-center">
            <CalendarIcon className="h-4 w-4 mr-1 text-gray-500" />
            <span className="text-sm text-gray-500">
              Last updated: Oct 15, 2023
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-50 p-4 rounded-md flex flex-col">
            <span className="text-sm font-medium text-gray-500">
              Total Spent
            </span>
            <span className="text-2xl font-bold text-black mt-1">$16.3M</span>
            <span className="text-xs text-green-600 mt-1 flex items-center">
              <ArrowDownIcon className="h-3 w-3 mr-1 transform rotate-180" />{' '}
              7.2% vs plan
            </span>
          </div>
          <div className="bg-gray-50 p-4 rounded-md flex flex-col">
            <span className="text-sm font-medium text-gray-500">
              Budget Utilization
            </span>
            <span className="text-2xl font-bold text-black mt-1">84.6%</span>
            <span className="text-xs text-gray-500 mt-1">$16.3M of $19.2M</span>
          </div>
          <div className="bg-gray-50 p-4 rounded-md flex flex-col">
            <span className="text-sm font-medium text-gray-500">
              Contracts Count
            </span>
            <span className="text-2xl font-bold text-black mt-1">28</span>
            <span className="text-xs text-green-600 mt-1 flex items-center">
              <ArrowDownIcon className="h-3 w-3 mr-1 transform rotate-180" />{' '}
              12.5% vs previous period
            </span>
          </div>
          <div className="bg-gray-50 p-4 rounded-md flex flex-col">
            <span className="text-sm font-medium text-gray-500">
              Cost Efficiency
            </span>
            <span className="text-2xl font-bold text-black mt-1">92.8%</span>
            <span className="text-xs text-green-600 mt-1 flex items-center">
              <ArrowDownIcon className="h-3 w-3 mr-1 transform rotate-180" />{' '}
              3.4% improvement
            </span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartWidget title="Spending by Department" className="">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={departmentSpending}
              layout="vertical"
              margin={{
                top: 5,
                right: 30,
                left: 80,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" tickFormatter={formatCurrency} />
              <YAxis dataKey="name" type="category" width={80} />
              {/* <Tooltip
                formatter={(value) => [
                  formatCurrency(value as number),
                  'Amount',
                ]}
              /> */}
              <Bar dataKey="value" fill="#000000" />
            </BarChart>
          </ResponsiveContainer>
        </ChartWidget>
        <ChartWidget title="Spending by Category" className="">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={spendingByCategory}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => {
                  const total = spendingByCategory.reduce((sum, entry) => sum + (typeof entry.value === 'number' ? entry.value : 0), 0)
                  const safeValue = typeof value === 'number' ? value : 0
                  const percent = total ? (safeValue / total) * 100 : 0
                  return `${name}: ${percent.toFixed(0)}%`
                }}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {spendingByCategory.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              {/* <Tooltip
                formatter={(value) => [
                  formatCurrency(value as number),
                  'Amount',
                ]}
              /> */}
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartWidget>
      </div>
      <div className="grid grid-cols-1 gap-6">
        <ChartWidget title="Planned vs Actual Spending" className="">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={spendingOverTime}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={formatCurrency} />
              {/* <Tooltip
                formatter={(value) => [
                  formatCurrency(value as number),
                  'Amount',
                ]}
              /> */}
              <Legend />
              <Line
                type="monotone"
                dataKey="planned"
                stroke="#8884d8"
                strokeWidth={2}
                activeDot={{
                  r: 8,
                }}
                name="Planned"
              />
              <Line
                type="monotone"
                dataKey="actual"
                stroke="#000000"
                strokeWidth={2}
                activeDot={{
                  r: 8,
                }}
                name="Actual"
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartWidget>
      </div>
      <div className="grid grid-cols-1 gap-6">
        <ChartWidget title="Monthly Spending by Project Type" className="">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={monthlySpendingByType}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={formatCurrency} />
              {/* <Tooltip
                formatter={(value) => [
                  formatCurrency(value as number),
                  'Amount',
                ]}
              /> */}
              <Legend />
              <Bar
                dataKey="construction"
                stackId="a"
                fill="#8884d8"
                name="Construction"
              />
              <Bar
                dataKey="maintenance"
                stackId="a"
                fill="#82ca9d"
                name="Maintenance"
              />
              <Bar
                dataKey="consulting"
                stackId="a"
                fill="#ffc658"
                name="Consulting"
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartWidget>
      </div>
      <div className="bg-white shadow rounded-lg border border-gray-200 p-5">
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <DollarSignIcon className="h-5 w-5 mr-2" /> Financial Reports
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Report Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Period
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Published Date
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Download</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Quarterly Financial Report
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Q3 2023
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Oct 15, 2023
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-black hover:text-gray-700">
                    <DownloadIcon className="h-5 w-5" />
                  </button>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Budget Variance Analysis
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Q3 2023
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Oct 12, 2023
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-black hover:text-gray-700">
                    <DownloadIcon className="h-5 w-5" />
                  </button>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Department Spending Summary
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Q3 2023
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Oct 10, 2023
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-black hover:text-gray-700">
                    <DownloadIcon className="h-5 w-5" />
                  </button>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Project Cost Analysis
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Q3 2023
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Oct 8, 2023
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-black hover:text-gray-700">
                    <DownloadIcon className="h-5 w-5" />
                  </button>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Annual Budget Review
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  2023
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Sep 30, 2023
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-black hover:text-gray-700">
                    <DownloadIcon className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

import {
  HelpCircleIcon,
  MessageSquareIcon,
  PhoneIcon,
  MailIcon,
} from 'lucide-react'
const Support: React.FC = () => {
  const [activeTab, setActiveTab] = useState('faq')
  // Sample FAQ data
  const faqs = [
    {
      question: 'What is blockchain-based procurement?',
      answer:
        'Blockchain-based procurement uses distributed ledger technology to create transparent, immutable records of all procurement activities. This ensures that all transactions are traceable, auditable, and tamper-proof, enhancing trust and accountability in public spending.',
    },
    {
      question: 'How can I access information about public contracts?',
      answer:
        "As a citizen, you can access information about public contracts through this portal. Navigate to the 'Contracts' section to view details about awarded contracts, including values, durations, and completion status. All contract information is recorded on the blockchain for transparency.",
    },
    {
      question: 'How is data verified on the blockchain?',
      answer:
        'Data on the blockchain is verified through a consensus mechanism where multiple nodes (computers) in the network must agree on the validity of transactions before they are added to the ledger. This ensures that information cannot be altered without detection.',
    },
    {
      question:
        'Can I report suspected irregularities in procurement processes?',
      answer:
        "Yes, citizens can report suspected irregularities through the 'Contact Support' form on this portal. All reports are investigated by the appropriate authorities while maintaining the confidentiality of the reporter.",
    },
    {
      question: 'How often is procurement data updated?',
      answer:
        'Procurement data is updated in real-time as transactions occur on the blockchain. This ensures that citizens always have access to the most current information about public spending and procurement activities.',
    },
  ]
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Support Center</h1>
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('faq')}
            className={`${activeTab === 'faq' ? 'border-black text-black' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
          >
            <HelpCircleIcon className="h-5 w-5 mr-2" />
            Frequently Asked Questions
          </button>
          <button
            onClick={() => setActiveTab('documentation')}
            className={`${activeTab === 'documentation' ? 'border-black text-black' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
          >
            <FileTextIcon className="h-5 w-5 mr-2" />
            Documentation
          </button>
          <button
            onClick={() => setActiveTab('contact')}
            className={`${activeTab === 'contact' ? 'border-black text-black' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
          >
            <MessageSquareIcon className="h-5 w-5 mr-2" />
            Contact Support
          </button>
        </nav>
      </div>
      {activeTab === 'faq' && (
        <div className="bg-white shadow sm:rounded-lg border border-gray-200">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Frequently Asked Questions
            </h3>
            <div className="mt-5">
              <dl className="space-y-8">
                {faqs.map((faq, index) => (
                  <div
                    key={index}
                    className="border-t border-gray-200 pt-6 first:border-0 first:pt-0"
                  >
                    <dt className="text-lg font-medium text-gray-900">
                      {faq.question}
                    </dt>
                    <dd className="mt-2 text-base text-gray-500">
                      {faq.answer}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      )}
      {activeTab === 'documentation' && (
        <div className="bg-white shadow sm:rounded-lg border border-gray-200">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Documentation
            </h3>
            <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <div className="bg-gray-50 overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-black rounded-md p-3">
                      <FileTextIcon
                        className="h-6 w-6 text-white"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="ml-5">
                      <h4 className="text-lg font-medium text-gray-900">
                        User Guide
                      </h4>
                      <p className="text-sm text-gray-500">
                        Complete guide to using the citizen portal
                      </p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <a
                      href="#"
                      className="text-sm font-medium text-black hover:underline"
                    >
                      Download PDF
                    </a>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-black rounded-md p-3">
                      <FileTextIcon
                        className="h-6 w-6 text-white"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="ml-5">
                      <h4 className="text-lg font-medium text-gray-900">
                        Blockchain Guide
                      </h4>
                      <p className="text-sm text-gray-500">
                        Understanding blockchain in procurement
                      </p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <a
                      href="#"
                      className="text-sm font-medium text-black hover:underline"
                    >
                      Download PDF
                    </a>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-black rounded-md p-3">
                      <FileTextIcon
                        className="h-6 w-6 text-white"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="ml-5">
                      <h4 className="text-lg font-medium text-gray-900">
                        Data Dictionary
                      </h4>
                      <p className="text-sm text-gray-500">
                        Definitions of terms used in the portal
                      </p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <a
                      href="#"
                      className="text-sm font-medium text-black hover:underline"
                    >
                      View Online
                    </a>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-black rounded-md p-3">
                      <FileTextIcon
                        className="h-6 w-6 text-white"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="ml-5">
                      <h4 className="text-lg font-medium text-gray-900">
                        API Documentation
                      </h4>
                      <p className="text-sm text-gray-500">
                        For developers integrating with our system
                      </p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <a
                      href="#"
                      className="text-sm font-medium text-black hover:underline"
                    >
                      View Online
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {activeTab === 'contact' && (
        <div className="bg-white shadow sm:rounded-lg border border-gray-200">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Contact Support
            </h3>
            <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
              <div className="col-span-2">
                <form className="space-y-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="topic"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Topic
                    </label>
                    <select
                      id="topic"
                      name="topic"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
                    >
                      <option>General Inquiry</option>
                      <option>Technical Support</option>
                      <option>Report an Issue</option>
                      <option>Report Suspected Irregularity</option>
                      <option>Feature Request</option>
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
                    ></textarea>
                  </div>
                  <div>
                    <button
                      type="submit"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </div>
              <div>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="text-base font-medium text-gray-900 mb-4">
                    Contact Information
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <PhoneIcon className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Phone Support
                        </p>
                        <p className="text-sm text-gray-500">
                          +1 (555) 123-4567
                        </p>
                        <p className="text-sm text-gray-500">
                          Mon-Fri, 9AM-5PM
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <MailIcon className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Email Support
                        </p>
                        <p className="text-sm text-gray-500">
                          support@procurechain.gov
                        </p>
                        <p className="text-sm text-gray-500">
                          Response within 24 hours
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <MessageSquareIcon className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Live Chat
                        </p>
                        <p className="text-sm text-gray-500">
                          Available on business days
                        </p>
                        <button className="mt-2 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-black hover:bg-gray-800">
                          Start Chat
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
