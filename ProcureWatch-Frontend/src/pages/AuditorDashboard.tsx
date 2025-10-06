import React, { useState,Fragment } from 'react'
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
          <AuditTrail/>
        )
      case 'flagged-issues':
        return (
          <FlaggedIssues/>
        )
      case 'compliance-stats':
        return (
          <ComplianceStats/>
        )
      case 'reports':
        return (
          <div className="p-6">
          <Reports/>
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

import {
  FileTextIcon,
  SearchIcon,
  FilterIcon,
  CalendarIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  DownloadIcon,
  ExternalLinkIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from 'lucide-react'
const AuditTrail: React.FC = () => {
  const [expandedRow, setExpandedRow] = useState<number | null>(null)
  const [selectedFilter, setSelectedFilter] = useState('all')
  // Sample data for audit logs
  const auditLogs = [
    {
      id: 1,
      action: 'Contract Modification',
      entity: 'Contract #4872',
      user: 'John Smith',
      department: 'Transportation',
      timestamp: '2023-10-15 14:32:45',
      hash: '0x8f2e3c5d9b7a1f4e6d2c8b3a9f7e6d5c4b3a2f1e0d9c8b7a6f5e4d3c2b1a0f9e8',
      status: 'verified',
      details: {
        changes: 'Modified delivery timeline from Q4 2023 to Q1 2024',
        reason: 'Supplier capacity constraints',
        approvedBy: 'Maria Johnson',
        previousVersion:
          '0x7d4f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0',
      },
    },
    {
      id: 2,
      action: 'Bid Submission',
      entity: 'Tender #3945',
      user: 'Acme Corp',
      department: 'Healthcare',
      timestamp: '2023-10-15 13:21:17',
      hash: '0x7d4f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0',
      status: 'verified',
      details: {
        bidAmount: '$1,245,000',
        documents: [
          'Technical Proposal',
          'Financial Proposal',
          'Company Profile',
        ],
        submittedBy: 'Robert Chen, Procurement Manager',
      },
    },
    {
      id: 3,
      action: 'Payment Approval',
      entity: 'Invoice #7823',
      user: 'Sarah Johnson',
      department: 'Finance',
      timestamp: '2023-10-15 11:45:32',
      hash: '0x3b9c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9',
      status: 'pending',
      details: {
        amount: '$328,500',
        milestone: 'Phase 2 Completion',
        project: 'Hospital Renovation',
        approvalChain: ['Department Head', 'Finance Director', 'Pending: CFO'],
      },
    },
    {
      id: 4,
      action: 'Document Upload',
      entity: 'Contract #4569',
      user: 'Robert Davis',
      department: 'Education',
      timestamp: '2023-10-15 10:12:08',
      hash: '0x2a7f6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7',
      status: 'verified',
      details: {
        documentType: 'Performance Report',
        size: '2.4 MB',
        relatedTo: 'School Equipment Supply Contract',
        verifiedBy: 'Blockchain Node #3',
      },
    },
    {
      id: 5,
      action: 'Vendor Registration',
      entity: 'Vendor #8721',
      user: 'TechSolutions Inc',
      department: 'IT',
      timestamp: '2023-10-15 09:05:22',
      hash: '0x5e4f3d2c1b0a9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4',
      status: 'verified',
      details: {
        companyInfo: 'Technology Services Provider',
        registrationNumber: 'BIZ78945612',
        verificationStatus: 'KYC Verified',
        approvedCategories: [
          'IT Hardware',
          'Software Development',
          'Cloud Services',
        ],
      },
    },
    {
      id: 6,
      action: 'Contract Approval',
      entity: 'Contract #5023',
      user: 'Michael Wilson',
      department: 'Public Works',
      timestamp: '2023-10-14 16:48:33',
      hash: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a',
      status: 'verified',
      details: {
        contractValue: '$5.2M',
        vendor: 'BuildRight Construction',
        duration: '24 months',
        approvalWorkflow: 'Completed - All 5 approvers signed',
      },
    },
  ]
  const filteredLogs =
    selectedFilter === 'all'
      ? auditLogs
      : auditLogs.filter((log) => log.status === selectedFilter)
  const toggleRow = (id: number) => {
    if (expandedRow === id) {
      setExpandedRow(null)
    } else {
      setExpandedRow(id)
    }
  }
  return (
    <div className="mx-5 my-5 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-semibold text-gray-900">
          Blockchain Audit Trail
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
              placeholder="Search transactions..."
            />
          </div>
          <div className="flex space-x-2">
            <select
              className="block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-black focus:border-black sm:text-sm rounded-md"
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
            >
              <option value="all">All Transactions</option>
              <option value="verified">Verified Only</option>
              <option value="pending">Pending Only</option>
            </select>
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black">
              <FilterIcon className="h-4 w-4 mr-2" />
              Advanced Filters
            </button>
          </div>
        </div>
      </div>
      <div className="bg-white shadow rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <div className="flex flex-wrap items-center justify-between">
            <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
              <FileTextIcon className="h-5 w-5 mr-2" /> Immutable Audit Log
            </h3>
            <div className="flex items-center space-x-2 mt-2 sm:mt-0">
              <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black">
                <CalendarIcon className="h-4 w-4 mr-2" />
                Date Range
              </button>
              <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black">
                <DownloadIcon className="h-4 w-4 mr-2" />
                Export
              </button>
            </div>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            All procurement activities are recorded on the blockchain for
            complete transparency and immutability
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Action
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Entity
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  User
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
                  Timestamp
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Details
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLogs.map((log) => (
                <Fragment key={log.id}>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {log.action}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {log.entity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {log.user}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {log.department}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {log.timestamp}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${log.status === 'verified' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}
                      >
                        {log.status === 'verified' ? (
                          <CheckCircleIcon className="h-3 w-3 mr-1" />
                        ) : (
                          <AlertCircleIcon className="h-3 w-3 mr-1" />
                        )}
                        {log.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => toggleRow(log.id)}
                        className="text-black hover:text-gray-700 inline-flex items-center"
                      >
                        {expandedRow === log.id ? (
                          <ChevronUpIcon className="h-4 w-4 mr-1" />
                        ) : (
                          <ChevronDownIcon className="h-4 w-4 mr-1" />
                        )}
                        {expandedRow === log.id ? 'Hide' : 'View'}
                      </button>
                    </td>
                  </tr>
                  {expandedRow === log.id && (
                    <tr className="bg-gray-50">
                      <td colSpan={7} className="px-6 py-4">
                        <div className="border-t border-b border-gray-200 py-3">
                          <h4 className="text-sm font-medium text-gray-900 mb-2">
                            Transaction Details
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-xs text-gray-500 mb-1">
                                Transaction Hash:
                              </p>
                              <div className="flex items-center">
                                <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono overflow-x-auto max-w-xs">
                                  {log.hash}
                                </code>
                                <button className="ml-2 text-black hover:text-gray-700">
                                  <ExternalLinkIcon className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                            <div className="space-y-2">
                              {Object.entries(log.details).map(
                                ([key, value]) => (
                                  <div key={key}>
                                    <p className="text-xs text-gray-500 mb-0.5">
                                      {key.charAt(0).toUpperCase() +
                                        key.slice(1)}
                                      :
                                    </p>
                                    <p className="text-sm">
                                      {Array.isArray(value)
                                        ? value.join(', ')
                                        : value.toString()}
                                    </p>
                                  </div>
                                ),
                              )}
                            </div>
                          </div>
                          <div className="flex justify-end mt-4 space-x-2">
                            <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black">
                              Verify on Blockchain
                            </button>
                            <button className="inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-xs font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black">
                              View Complete History
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 sm:px-6 flex justify-between items-center">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">1</span> to{' '}
            <span className="font-medium">{filteredLogs.length}</span> of{' '}
            <span className="font-medium">1,456</span> transactions
          </div>
          <div className="flex space-x-2">
            <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black">
              Previous
            </button>
            <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black">
              Next
            </button>
          </div>
        </div>
      </div>
      <div className="bg-white shadow rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Blockchain Verification
        </h3>
        <p className="text-sm text-gray-600 mb-6">
          All procurement activities are recorded on a secure blockchain network
          for complete transparency and immutability. Each transaction is
          cryptographically signed and timestamped, creating an unalterable
          record of all procurement actions.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-50 p-4 rounded-md">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-full">
                <CheckCircleIcon className="h-6 w-6 text-green-600" />
              </div>
              <h4 className="ml-3 text-base font-medium text-gray-900">
                Tamper-Proof Records
              </h4>
            </div>
            <p className="mt-2 text-sm text-gray-600">
              Once recorded, data cannot be altered or deleted, ensuring the
              integrity of procurement records.
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-md">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-full">
                <FileTextIcon className="h-6 w-6 text-blue-600" />
              </div>
              <h4 className="ml-3 text-base font-medium text-gray-900">
                Transparent History
              </h4>
            </div>
            <p className="mt-2 text-sm text-gray-600">
              Complete audit trail from tender creation to contract completion,
              accessible to authorized parties.
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-md">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-full">
                <ExternalLinkIcon className="h-6 w-6 text-purple-600" />
              </div>
              <h4 className="ml-3 text-base font-medium text-gray-900">
                Public Verification
              </h4>
            </div>
            <p className="mt-2 text-sm text-gray-600">
              Transaction hashes can be independently verified on the public
              blockchain explorer.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}


import {
  AlertTriangleIcon,
  XCircleIcon,
  UserIcon,
  ArrowUpCircleIcon,
  ArrowDownCircleIcon,
} from 'lucide-react'
const FlaggedIssues: React.FC = () => {
  const [expandedIssue, setExpandedIssue] = useState<number | null>(null)
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [selectedSeverity, setSelectedSeverity] = useState('all')
  // Sample data for flagged issues
  const issues = [
    {
      id: 1,
      title: 'Unusual bidding pattern detected',
      description:
        'Multiple bids from related entities submitted within minutes of each other',
      entity: 'Tender #3945',
      severity: 'high',
      status: 'open',
      dateDetected: '2023-10-15 09:23:17',
      assignedTo: 'Sarah Johnson',
      department: 'Healthcare',
      details: {
        relatedEntities: [
          'MediSupply Inc.',
          'HealthEquip Co.',
          'MedTech Solutions',
        ],
        patternDescription:
          'Three companies with shared board members submitted nearly identical bids within 7 minutes',
        previousIncidents:
          'Similar pattern observed in Tender #3142 (March 2023)',
        riskScore: '87/100',
        recommendedAction: 'Suspend bid evaluation pending investigation',
      },
    },
    {
      id: 2,
      title: 'Missing required documentation',
      description: 'Contract #4872 missing regulatory compliance certificates',
      entity: 'Contract #4872',
      severity: 'medium',
      status: 'in-progress',
      dateDetected: '2023-10-14 14:45:32',
      assignedTo: 'Michael Wilson',
      department: 'Transportation',
      details: {
        missingDocuments: [
          'Environmental Impact Assessment',
          'Safety Compliance Certificate',
        ],
        contractValue: '$5.2M',
        vendor: 'RoadWorks Inc.',
        deadline: '2023-10-20',
        notes:
          'Vendor contacted and has acknowledged the missing documentation',
      },
    },
    {
      id: 3,
      title: 'Unusual payment pattern',
      description: 'Multiple small payments just below approval threshold',
      entity: 'Vendor #8721',
      severity: 'high',
      status: 'open',
      dateDetected: '2023-10-13 11:12:08',
      assignedTo: 'John Martinez',
      department: 'IT',
      details: {
        paymentPattern:
          '12 separate payments of $9,800 each (threshold is $10,000)',
        timeframe: 'All within 30 days',
        approver: 'Same approver for all payments: Robert Chen',
        vendorInfo: 'TechSolutions Inc. - registered 3 months ago',
        previousActivity: 'No prior contracts with this department',
      },
    },
    {
      id: 4,
      title: 'Contract modification without proper approval',
      description:
        'Scope change implemented without going through approval workflow',
      entity: 'Contract #5023',
      severity: 'medium',
      status: 'resolved',
      dateDetected: '2023-10-10 15:37:22',
      assignedTo: 'Emily Parker',
      department: 'Public Works',
      details: {
        originalScope: 'Construction of 3 municipal buildings',
        modifiedScope:
          'Construction of 2 municipal buildings with expanded facilities',
        valueChange: 'No change in total contract value',
        resolution: 'Retroactive approval obtained from procurement committee',
        preventiveMeasure: 'Additional training provided to contract managers',
      },
    },
    {
      id: 5,
      title: 'Vendor conflict of interest',
      description:
        'Potential undisclosed relationship between vendor and procurement officer',
      entity: 'Vendor #4256',
      severity: 'high',
      status: 'in-progress',
      dateDetected: '2023-10-09 13:15:47',
      assignedTo: 'David Thompson',
      department: 'Education',
      details: {
        vendor: 'EduTech Solutions',
        procurementOfficer: 'Amanda Lewis',
        relationship: 'Social media evidence suggests family connection',
        contractsAwarded: '3 contracts in past 6 months, total value $1.2M',
        investigationStatus: 'Ethics committee reviewing evidence',
      },
    },
    {
      id: 6,
      title: 'Suspicious bid withdrawal pattern',
      description:
        'Multiple vendors withdrawing bids after lowest bid submission',
      entity: 'Tender #4023',
      severity: 'medium',
      status: 'open',
      dateDetected: '2023-10-08 10:05:33',
      assignedTo: 'Lisa Rodriguez',
      department: 'Utilities',
      details: {
        pattern:
          '4 out of 6 bidders withdrew within 24 hours after lowest bid was submitted',
        lowestBidder: 'PowerGrid Solutions',
        contractValue: '$8.7M',
        similarIncidents: 'Pattern matches 2 previous tenders in same sector',
        algorithmConfidence: '92% likelihood of collusion',
      },
    },
  ]
  const getFilteredIssues = () => {
    return issues.filter((issue) => {
      const statusMatch =
        selectedFilter === 'all' || issue.status === selectedFilter
      const severityMatch =
        selectedSeverity === 'all' || issue.severity === selectedSeverity
      return statusMatch && severityMatch
    })
  }
  const filteredIssues = getFilteredIssues()
  const toggleIssue = (id: number) => {
    if (expandedIssue === id) {
      setExpandedIssue(null)
    } else {
      setExpandedIssue(id)
    }
  }
  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'high':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <AlertTriangleIcon className="h-3 w-3 mr-1" />
            High
          </span>
        )
      case 'medium':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <AlertCircleIcon className="h-3 w-3 mr-1" />
            Medium
          </span>
        )
      case 'low':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <AlertCircleIcon className="h-3 w-3 mr-1" />
            Low
          </span>
        )
      default:
        return null
    }
  }
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            Open
          </span>
        )
      case 'in-progress':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            In Progress
          </span>
        )
      case 'resolved':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Resolved
          </span>
        )
      default:
        return null
    }
  }
  return (
    <div className="mx-5 my-5 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-semibold text-gray-900">Flagged Issues</h1>
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
              placeholder="Search issues..."
            />
          </div>
          <div className="flex space-x-2">
            <select
              className="block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-black focus:border-black sm:text-sm rounded-md"
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
            <select
              className="block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-black focus:border-black sm:text-sm rounded-md"
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
            >
              <option value="all">All Severity</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
      </div>
      <div className="bg-white shadow rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <div className="flex flex-wrap items-center justify-between">
            <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
              <AlertTriangleIcon className="h-5 w-5 mr-2" /> Issue Tracking
              System
            </h3>
            <div className="flex items-center space-x-2 mt-2 sm:mt-0">
              <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black">
                <FilterIcon className="h-4 w-4 mr-2" />
                Advanced Filters
              </button>
            </div>
          </div>
          <div className="mt-2 flex items-center text-sm text-gray-500">
            <p>
              Issues detected by the system's risk monitoring algorithms and
              manual audits
            </p>
          </div>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredIssues.length > 0 ? (
            filteredIssues.map((issue) => (
              <div key={issue.id} className="hover:bg-gray-50">
                <div
                  className="px-6 py-4 cursor-pointer"
                  onClick={() => toggleIssue(issue.id)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <h4 className="text-base font-medium text-gray-900">
                          {issue.title}
                        </h4>
                        <div className="ml-2">
                          {getSeverityBadge(issue.severity)}
                        </div>
                      </div>
                      <p className="mt-1 text-sm text-gray-600">
                        {issue.description}
                      </p>
                      <div className="mt-2 flex items-center text-xs text-gray-500 space-x-4">
                        <div className="flex items-center">
                          <CalendarIcon className="h-3 w-3 mr-1" />
                          {issue.dateDetected}
                        </div>
                        <div className="flex items-center">
                          <UserIcon className="h-3 w-3 mr-1" />
                          {issue.assignedTo}
                        </div>
                        <div>{getStatusBadge(issue.status)}</div>
                      </div>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      {expandedIssue === issue.id ? (
                        <ChevronUpIcon className="h-5 w-5 text-gray-400" />
                      ) : (
                        <ChevronDownIcon className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                  </div>
                </div>
                {expandedIssue === issue.id && (
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                    <div className="space-y-4">
                      <div>
                        <h5 className="text-sm font-medium text-gray-900">
                          Issue Details
                        </h5>
                        <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                          {Object.entries(issue.details).map(([key, value]) => (
                            <div key={key} className="text-sm">
                              <span className="text-gray-500">
                                {key.charAt(0).toUpperCase() + key.slice(1)}
                                :{' '}
                              </span>
                              <span className="text-gray-900">
                                {Array.isArray(value)
                                  ? value.join(', ')
                                  : value.toString()}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="border-t border-gray-200 pt-4">
                        <h5 className="text-sm font-medium text-gray-900">
                          Actions
                        </h5>
                        <div className="mt-2 flex flex-wrap gap-2">
                          <button className="inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-xs font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black">
                            Investigate Issue
                          </button>
                          <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black">
                            Assign to Team
                          </button>
                          <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black">
                            View Audit Trail
                          </button>
                          <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black">
                            Generate Report
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="px-6 py-10 text-center">
              <AlertCircleIcon className="mx-auto h-10 w-10 text-gray-400" />
              <p className="mt-2 text-base font-medium text-gray-900">
                No issues found
              </p>
              <p className="mt-1 text-sm text-gray-500">
                No issues match your current filter criteria.
              </p>
            </div>
          )}
        </div>
        <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 sm:px-6 flex justify-between items-center">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">1</span> to{' '}
            <span className="font-medium">{filteredIssues.length}</span> of{' '}
            <span className="font-medium">{filteredIssues.length}</span> issues
          </div>
          <div className="flex space-x-2">
            <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black">
              Previous
            </button>
            <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black">
              Next
            </button>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <AlertTriangleIcon className="h-5 w-5 mr-2 text-red-500" /> High
            Severity
          </h3>
          <div className="flex items-center justify-between mb-4">
            <span className="text-2xl font-bold">
              {issues.filter((i) => i.severity === 'high').length}
            </span>
            <span className="text-sm text-gray-500">Issues</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Open</span>
              <span className="font-medium">
                {
                  issues.filter(
                    (i) => i.severity === 'high' && i.status === 'open',
                  ).length
                }
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">In Progress</span>
              <span className="font-medium">
                {
                  issues.filter(
                    (i) => i.severity === 'high' && i.status === 'in-progress',
                  ).length
                }
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Resolved</span>
              <span className="font-medium">
                {
                  issues.filter(
                    (i) => i.severity === 'high' && i.status === 'resolved',
                  ).length
                }
              </span>
            </div>
          </div>
        </div>
        <div className="bg-white shadow rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <AlertCircleIcon className="h-5 w-5 mr-2 text-yellow-500" /> Medium
            Severity
          </h3>
          <div className="flex items-center justify-between mb-4">
            <span className="text-2xl font-bold">
              {issues.filter((i) => i.severity === 'medium').length}
            </span>
            <span className="text-sm text-gray-500">Issues</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Open</span>
              <span className="font-medium">
                {
                  issues.filter(
                    (i) => i.severity === 'medium' && i.status === 'open',
                  ).length
                }
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">In Progress</span>
              <span className="font-medium">
                {
                  issues.filter(
                    (i) =>
                      i.severity === 'medium' && i.status === 'in-progress',
                  ).length
                }
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Resolved</span>
              <span className="font-medium">
                {
                  issues.filter(
                    (i) => i.severity === 'medium' && i.status === 'resolved',
                  ).length
                }
              </span>
            </div>
          </div>
        </div>
        <div className="bg-white shadow rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <AlertCircleIcon className="h-5 w-5 mr-2 text-blue-500" /> Trends
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-600">Issues this month</span>
                <div className="flex items-center">
                  <span className="text-sm font-medium">32</span>
                  <ArrowUpCircleIcon className="h-4 w-4 ml-1 text-red-500" />
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className="bg-black h-1.5 rounded-full"
                  style={{
                    width: '70%',
                  }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-600">Resolution rate</span>
                <div className="flex items-center">
                  <span className="text-sm font-medium">68%</span>
                  <ArrowUpCircleIcon className="h-4 w-4 ml-1 text-green-500" />
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className="bg-black h-1.5 rounded-full"
                  style={{
                    width: '68%',
                  }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-600">
                  Avg. resolution time
                </span>
                <div className="flex items-center">
                  <span className="text-sm font-medium">3.2 days</span>
                  <ArrowDownCircleIcon className="h-4 w-4 ml-1 text-green-500" />
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className="bg-black h-1.5 rounded-full"
                  style={{
                    width: '45%',
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
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
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts'
import {
  ClipboardCheckIcon,
  BuildingIcon,
  ShieldCheckIcon,
} from 'lucide-react'
import ChartWidget from '../../src/components/dashboard/ChartWidget'
import StatisticsCard from '../../src/components/dashboard/StatisticsCard'
const ComplianceStats: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState('2023')
  const [selectedQuarter, setSelectedQuarter] = useState('Q3')
  // Sample data for compliance by department
  const departmentCompliance = [
    {
      name: 'Transportation',
      compliant: 82,
      nonCompliant: 18,
    },
    {
      name: 'Healthcare',
      compliant: 91,
      nonCompliant: 9,
    },
    {
      name: 'Education',
      compliant: 75,
      nonCompliant: 25,
    },
    {
      name: 'IT',
      compliant: 88,
      nonCompliant: 12,
    },
    {
      name: 'Public Works',
      compliant: 79,
      nonCompliant: 21,
    },
  ]
  // Sample data for compliance trend over time
  const complianceTrend = [
    {
      month: 'Jan',
      rate: 72,
    },
    {
      month: 'Feb',
      rate: 75,
    },
    {
      month: 'Mar',
      rate: 73,
    },
    {
      month: 'Apr',
      rate: 78,
    },
    {
      month: 'May',
      rate: 82,
    },
    {
      month: 'Jun',
      rate: 85,
    },
    {
      month: 'Jul',
      rate: 87,
    },
    {
      month: 'Aug',
      rate: 90,
    },
    {
      month: 'Sep',
      rate: 92,
    },
  ]
  // Sample data for compliance by category
  const complianceByCategory = [
    {
      name: 'Documentation',
      value: 87,
    },
    {
      name: 'Process',
      value: 76,
    },
    {
      name: 'Regulatory',
      value: 93,
    },
    {
      name: 'Reporting',
      value: 81,
    },
    {
      name: 'Transparency',
      value: 89,
    },
  ]
  // Sample data for radar chart
  const radarData = [
    {
      subject: 'Documentation',
      A: 87,
      fullMark: 100,
    },
    {
      subject: 'Process',
      A: 76,
      fullMark: 100,
    },
    {
      subject: 'Regulatory',
      A: 93,
      fullMark: 100,
    },
    {
      subject: 'Reporting',
      A: 81,
      fullMark: 100,
    },
    {
      subject: 'Transparency',
      A: 89,
      fullMark: 100,
    },
  ]
  // Sample data for top compliance issues
  const topIssues = [
    {
      id: 1,
      issue: 'Missing documentation',
      count: 24,
      departments: ['Transportation', 'Public Works'],
      trend: 'decreasing',
    },
    {
      id: 2,
      issue: 'Late reporting',
      count: 18,
      departments: ['Healthcare', 'Education'],
      trend: 'stable',
    },
    {
      id: 3,
      issue: 'Incomplete vendor verification',
      count: 15,
      departments: ['IT', 'Public Works'],
      trend: 'increasing',
    },
    {
      id: 4,
      issue: 'Improper approval workflow',
      count: 12,
      departments: ['Transportation', 'Education'],
      trend: 'decreasing',
    },
    {
      id: 5,
      issue: 'Transparency requirements not met',
      count: 10,
      departments: ['Healthcare', 'IT'],
      trend: 'stable',
    },
  ]
  const COLORS = ['#4CAF50', '#F44336', '#2196F3', '#FF9800', '#9C27B0']
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing':
        return <span className="text-red-500">↑</span>
      case 'decreasing':
        return <span className="text-green-500">↓</span>
      case 'stable':
        return <span className="text-gray-500">→</span>
      default:
        return null
    }
  }
  return (
    <div className="mx-5 my-5 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-semibold text-gray-900">
          Compliance Statistics
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
            Export Report
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatisticsCard
          title="Overall Compliance"
          value="85%"
          icon={<ClipboardCheckIcon className="h-6 w-6 text-gray-500" />}
          change={{
            value: '7%',
            positive: true,
          }}
        />
        <StatisticsCard
          title="Contracts Reviewed"
          value="342"
          icon={<FileTextIcon className="h-6 w-6 text-gray-500" />}
          change={{
            value: '24',
            positive: true,
          }}
        />
        <StatisticsCard
          title="Departments Audited"
          value="12"
          icon={<BuildingIcon className="h-6 w-6 text-gray-500" />}
          change={{
            value: '2',
            positive: true,
          }}
        />
        <StatisticsCard
          title="Compliance Alerts"
          value="28"
          icon={<AlertCircleIcon className="h-6 w-6 text-gray-500" />}
          change={{
            value: '5',
            positive: false,
          }}
        />
      </div>
      <div className="bg-white shadow rounded-lg border border-gray-200 p-5">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <ClipboardCheckIcon className="h-5 w-5 mr-2" /> Compliance
              Overview
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {selectedYear} {selectedQuarter} Procurement Compliance Summary
            </p>
          </div>
          <div className="mt-3 md:mt-0 flex items-center">
            <CalendarIcon className="h-4 w-4 mr-1 text-gray-500" />
            <span className="text-sm text-gray-500">
              Last updated: Oct 15, 2023
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-50 p-4 rounded-md flex flex-col">
            <span className="text-sm font-medium text-gray-500">
              Compliant Contracts
            </span>
            <span className="text-2xl font-bold text-green-600 mt-1">290</span>
            <span className="text-xs text-gray-500 mt-1">85% of total</span>
          </div>
          <div className="bg-gray-50 p-4 rounded-md flex flex-col">
            <span className="text-sm font-medium text-gray-500">
              Non-Compliant
            </span>
            <span className="text-2xl font-bold text-red-600 mt-1">52</span>
            <span className="text-xs text-gray-500 mt-1">15% of total</span>
          </div>
          <div className="bg-gray-50 p-4 rounded-md flex flex-col">
            <span className="text-sm font-medium text-gray-500">
              Risk Score
            </span>
            <span className="text-2xl font-bold text-black mt-1">Low</span>
            <span className="text-xs text-green-600 mt-1">
              Improved from Medium
            </span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartWidget title="Compliance by Department" className="">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={departmentCompliance}
              layout="vertical"
              margin={{
                top: 5,
                right: 30,
                left: 100,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 100]} />
              <YAxis dataKey="name" type="category" width={100} />
              <Tooltip formatter={(value) => [`${value}%`, 'Rate']} />
              <Legend />
              <Bar
                dataKey="compliant"
                stackId="a"
                fill="#4CAF50"
                name="Compliant"
              />
              <Bar
                dataKey="nonCompliant"
                stackId="a"
                fill="#F44336"
                name="Non-Compliant"
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartWidget>
        <ChartWidget title="Compliance Trend" className="">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={complianceTrend}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis domain={[0, 100]} />
              <Tooltip
                formatter={(value) => [`${value}%`, 'Compliance Rate']}
              />
              <Line
                type="monotone"
                dataKey="rate"
                stroke="#000000"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartWidget>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ChartWidget title="Compliance Categories" className="lg:col-span-1">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={complianceByCategory}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value, index }) => {
                  const total = complianceByCategory.reduce((sum, entry) => sum + entry.value, 0)
                  const percent = total > 0 ? (value as number) / total : 0
                  return `${name}: ${(percent * 100).toFixed(0)}%`
                }}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {complianceByCategory.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [`${value}%`, 'Compliance Rate']}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartWidget>
        <ChartWidget title="Compliance Radar" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis angle={30} domain={[0, 100]} />
              <Radar
                name="Compliance Score"
                dataKey="A"
                stroke="#000000"
                fill="#000000"
                fillOpacity={0.6}
              />
              <Legend />
              <Tooltip
                formatter={(value) => [`${value}%`, 'Compliance Score']}
              />
            </RadarChart>
          </ResponsiveContainer>
        </ChartWidget>
      </div>
      <div className="bg-white shadow rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
            <AlertCircleIcon className="h-5 w-5 mr-2" /> Top Compliance Issues
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Issue
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Occurrences
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Departments
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Trend
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {topIssues.map((issue) => (
                <tr key={issue.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {issue.issue}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {issue.count}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {issue.departments.join(', ')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      {getTrendIcon(issue.trend)}
                      <span className="ml-1">
                        {issue.trend.charAt(0).toUpperCase() +
                          issue.trend.slice(1)}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="bg-white shadow rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <ShieldCheckIcon className="h-5 w-5 mr-2" /> Compliance Improvement
          Initiatives
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-50 p-4 rounded-md">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-full">
                <CheckCircleIcon className="h-6 w-6 text-green-600" />
              </div>
              <h4 className="ml-3 text-base font-medium text-gray-900">
                Training Program
              </h4>
            </div>
            <p className="mt-2 text-sm text-gray-600">
              Compliance training for procurement officers completed across 8
              departments
            </p>
            <div className="mt-3 flex justify-between items-center">
              <span className="text-xs text-gray-500">Progress</span>
              <span className="text-xs font-medium">8/12 Departments</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
              <div
                className="bg-black h-1.5 rounded-full"
                style={{
                  width: '67%',
                }}
              ></div>
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-md">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-full">
                <FileTextIcon className="h-6 w-6 text-blue-600" />
              </div>
              <h4 className="ml-3 text-base font-medium text-gray-900">
                Documentation Templates
              </h4>
            </div>
            <p className="mt-2 text-sm text-gray-600">
              Standardized templates implemented to ensure complete
              documentation
            </p>
            <div className="mt-3 flex justify-between items-center">
              <span className="text-xs text-gray-500">Progress</span>
              <span className="text-xs font-medium">100% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
              <div
                className="bg-black h-1.5 rounded-full"
                style={{
                  width: '100%',
                }}
              ></div>
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-md">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-full">
                <AlertCircleIcon className="h-6 w-6 text-yellow-600" />
              </div>
              <h4 className="ml-3 text-base font-medium text-gray-900">
                Automated Checks
              </h4>
            </div>
            <p className="mt-2 text-sm text-gray-600">
              Implementation of automated compliance checks in procurement
              workflow
            </p>
            <div className="mt-3 flex justify-between items-center">
              <span className="text-xs text-gray-500">Progress</span>
              <span className="text-xs font-medium">75% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
              <div
                className="bg-black h-1.5 rounded-full"
                style={{
                  width: '75%',
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

import {
  FileBarChartIcon,
 
  PlusIcon,
  ClockIcon,
  BarChart3Icon,
  LineChartIcon,
  PieChartIcon,
} from 'lucide-react'
const Reports: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all')
  // Sample data for reports
  const reports = [
    {
      id: 1,
      title: 'Q3 Procurement Compliance Audit',
      category: 'compliance',
      date: '2023-10-15',
      author: 'John Martinez',
      status: 'published',
      description: 'Comprehensive audit of procurement compliance for Q3 2023',
      insights: '85% overall compliance rate, 7% improvement from Q2',
      downloadUrl: '#',
    },
    {
      id: 2,
      title: 'Vendor Performance Analysis',
      category: 'vendor',
      date: '2023-10-10',
      author: 'Sarah Johnson',
      status: 'published',
      description:
        'Analysis of vendor performance metrics across all departments',
      insights: 'Top performing vendor: Construction Co. Ltd. with 94% score',
      downloadUrl: '#',
    },
    {
      id: 3,
      title: 'Risk Assessment Report',
      category: 'risk',
      date: '2023-10-05',
      author: 'David Thompson',
      status: 'published',
      description: 'Identification and assessment of procurement risks',
      insights: '32 high-risk issues identified, 18 mitigated',
      downloadUrl: '#',
    },
    {
      id: 4,
      title: 'Procurement Efficiency Analysis',
      category: 'efficiency',
      date: '2023-09-28',
      author: 'Emily Parker',
      status: 'published',
      description: 'Analysis of procurement process efficiency metrics',
      insights: 'Average procurement cycle reduced by 12% since last quarter',
      downloadUrl: '#',
    },
    {
      id: 5,
      title: 'Blockchain Implementation Impact',
      category: 'technology',
      date: '2023-09-20',
      author: 'Michael Wilson',
      status: 'published',
      description:
        'Assessment of blockchain implementation on procurement transparency',
      insights:
        '94% of transactions verified on blockchain, 100% audit trail maintained',
      downloadUrl: '#',
    },
    {
      id: 6,
      title: 'Q4 Procurement Forecast',
      category: 'planning',
      date: '2023-09-15',
      author: 'Lisa Rodriguez',
      status: 'draft',
      description:
        'Forecast of Q4 procurement activities and compliance targets',
      insights: 'Draft report - pending department input',
      downloadUrl: '#',
    },
  ]
  // Filter reports based on selected category
  const filteredReports =
    selectedCategory === 'all'
      ? reports
      : reports.filter((report) => report.category === selectedCategory)
  // Report templates
  const reportTemplates = [
    {
      id: 1,
      title: 'Compliance Audit',
      icon: <CheckCircleIcon className="h-6 w-6 text-green-500" />,
      description: 'Comprehensive audit of procurement compliance',
    },
    {
      id: 2,
      title: 'Vendor Analysis',
      icon: <BarChart3Icon className="h-6 w-6 text-blue-500" />,
      description: 'Analysis of vendor performance metrics',
    },
    {
      id: 3,
      title: 'Risk Assessment',
      icon: <LineChartIcon className="h-6 w-6 text-red-500" />,
      description: 'Identification and assessment of procurement risks',
    },
    {
      id: 4,
      title: 'Efficiency Analysis',
      icon: <PieChartIcon className="h-6 w-6 text-purple-500" />,
      description: 'Analysis of procurement process efficiency',
    },
  ]
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-semibold text-gray-900">Audit Reports</h1>
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
              placeholder="Search reports..."
            />
          </div>
          <div className="flex space-x-2">
            <select
              className="block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-black focus:border-black sm:text-sm rounded-md"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              <option value="compliance">Compliance</option>
              <option value="vendor">Vendor</option>
              <option value="risk">Risk</option>
              <option value="efficiency">Efficiency</option>
              <option value="technology">Technology</option>
              <option value="planning">Planning</option>
            </select>
            <button className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black">
              <PlusIcon className="h-4 w-4 mr-2" />
              New Report
            </button>
          </div>
        </div>
      </div>
      <div className="bg-white shadow rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <div className="flex flex-wrap items-center justify-between">
            <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
              <FileBarChartIcon className="h-5 w-5 mr-2" /> Available Reports
            </h3>
            <div className="flex items-center space-x-2 mt-2 sm:mt-0">
              <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black">
                <FilterIcon className="h-4 w-4 mr-2" />
                Advanced Filters
              </button>
              <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black">
                <CalendarIcon className="h-4 w-4 mr-2" />
                Date Range
              </button>
            </div>
          </div>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredReports.length > 0 ? (
            filteredReports.map((report) => (
              <div key={report.id} className="p-6 hover:bg-gray-50">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <FileTextIcon className="h-5 w-5 text-gray-400 mr-2" />
                      <h4 className="text-lg font-medium text-gray-900">
                        {report.title}
                      </h4>
                      {report.status === 'draft' && (
                        <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Draft
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-gray-600">
                      {report.description}
                    </p>
                    <div className="mt-2 text-sm text-gray-500">
                      <span className="font-medium">Key Insights:</span>{' '}
                      {report.insights}
                    </div>
                    <div className="mt-2 flex items-center text-xs text-gray-500 space-x-4">
                      <div className="flex items-center">
                        <CalendarIcon className="h-3 w-3 mr-1" />
                        {report.date}
                      </div>
                      <div>Author: {report.author}</div>
                      <div className="capitalize">
                        Category: {report.category}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 md:mt-0 flex-shrink-0">
                    <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black">
                      <DownloadIcon className="h-4 w-4 mr-2" />
                      Download
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 text-center">
              <FileBarChartIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No reports found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                No reports match your current filter criteria.
              </p>
            </div>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <FileTextIcon className="h-5 w-5 mr-2" /> Report Templates
          </h3>
          <div className="space-y-4">
            {reportTemplates.map((template) => (
              <div
                key={template.id}
                className="flex items-start p-4 bg-gray-50 rounded-md hover:bg-gray-100 cursor-pointer"
              >
                <div className="flex-shrink-0">{template.icon}</div>
                <div className="ml-4">
                  <h4 className="text-base font-medium text-gray-900">
                    {template.title}
                  </h4>
                  <p className="mt-1 text-sm text-gray-600">
                    {template.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <button className="inline-flex items-center justify-center w-full px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black">
              <PlusIcon className="h-4 w-4 mr-2" />
              Create Custom Report
            </button>
          </div>
        </div>
        <div className="bg-white shadow rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <ClockIcon className="h-5 w-5 mr-2" /> Scheduled Reports
          </h3>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-md">
              <div className="flex justify-between">
                <div>
                  <h4 className="text-base font-medium text-gray-900">
                    Weekly Compliance Summary
                  </h4>
                  <p className="mt-1 text-sm text-gray-600">
                    Automated compliance report sent every Monday
                  </p>
                </div>
                <div className="flex items-center">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Active
                  </span>
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                Next run: Monday, Oct 23, 2023
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-md">
              <div className="flex justify-between">
                <div>
                  <h4 className="text-base font-medium text-gray-900">
                    Monthly Risk Assessment
                  </h4>
                  <p className="mt-1 text-sm text-gray-600">
                    Comprehensive risk analysis on the 1st of each month
                  </p>
                </div>
                <div className="flex items-center">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Active
                  </span>
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                Next run: Wednesday, Nov 1, 2023
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-md">
              <div className="flex justify-between">
                <div>
                  <h4 className="text-base font-medium text-gray-900">
                    Quarterly Audit Report
                  </h4>
                  <p className="mt-1 text-sm text-gray-600">
                    Full audit report at the end of each quarter
                  </p>
                </div>
                <div className="flex items-center">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Active
                  </span>
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                Next run: Sunday, Dec 31, 2023
              </div>
            </div>
          </div>
          <div className="mt-6">
            <button className="inline-flex items-center justify-center w-full px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black">
              <PlusIcon className="h-4 w-4 mr-2" />
              Schedule New Report
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

import {
  HelpCircleIcon,
  MessageSquareIcon,
  BookOpenIcon,
  PhoneIcon,
  MailIcon,
  ChevronRightIcon,
  SendIcon,
  PaperclipIcon,
} from 'lucide-react'
const Support: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showContactForm, setShowContactForm] = useState(false)
  // Sample data for FAQs
  const faqs = [
    {
      id: 1,
      question: 'How is data verified on the blockchain?',
      answer:
        "All procurement transactions are cryptographically signed and timestamped. The system uses a permissioned blockchain network where multiple nodes validate each transaction before it's added to the immutable ledger. This creates a tamper-proof audit trail that can be independently verified.",
      category: 'blockchain',
    },
    {
      id: 2,
      question: 'What compliance standards does the system monitor?',
      answer:
        'The system monitors compliance with multiple standards including procurement laws, internal policies, regulatory requirements, and transparency guidelines. The compliance module is customizable to accommodate jurisdiction-specific requirements and organizational policies.',
      category: 'compliance',
    },
    {
      id: 3,
      question: 'How are potential compliance issues flagged?',
      answer:
        'The system uses a combination of rule-based checks and AI algorithms to detect anomalies and potential compliance issues. These include unusual bidding patterns, missing documentation, approval workflow violations, and potential conflicts of interest. Issues are categorized by severity and assigned to appropriate personnel for investigation.',
      category: 'compliance',
    },
    {
      id: 4,
      question: 'Can I export audit reports for offline review?',
      answer:
        'Yes, all audit reports can be exported in multiple formats including PDF, Excel, and CSV. The exported reports include all relevant data, charts, and timestamps. For regulatory submissions, reports can also include blockchain verification hashes to prove data integrity.',
      category: 'reports',
    },
    {
      id: 5,
      question: 'How secure is the audit data?',
      answer:
        "Audit data is secured through multiple layers of protection. First, it's stored on an immutable blockchain, preventing tampering. Second, access controls restrict who can view sensitive information. Third, all system interactions are logged and monitored for suspicious activity. Finally, the system undergoes regular security audits and penetration testing.",
      category: 'security',
    },
    {
      id: 6,
      question: 'How can I verify blockchain transactions independently?',
      answer:
        'Each transaction in the system has a unique verification hash. You can use the "Verify on Blockchain" button in the audit trail to access our public verification portal. There, you can confirm that the transaction exists on the blockchain and has not been altered since recording. For advanced users, direct blockchain node access can be requested.',
      category: 'blockchain',
    },
  ]
  // Filter FAQs based on selected category
  const filteredFaqs =
    selectedCategory === 'all'
      ? faqs
      : faqs.filter((faq) => faq.category === selectedCategory)
  // Sample data for resources
  const resources = [
    {
      id: 1,
      title: 'Auditor User Guide',
      description:
        'Comprehensive guide for auditors using the ProcureChain system',
      icon: <FileTextIcon className="h-6 w-6 text-gray-400" />,
      link: '#',
    },
    {
      id: 2,
      title: 'Compliance Standards Reference',
      description:
        'Detailed documentation of all compliance standards monitored by the system',
      icon: <BookOpenIcon className="h-6 w-6 text-gray-400" />,
      link: '#',
    },
    {
      id: 3,
      title: 'Blockchain Verification Tutorial',
      description:
        'Step-by-step guide for verifying transactions on the blockchain',
      icon: <FileTextIcon className="h-6 w-6 text-gray-400" />,
      link: '#',
    },
    {
      id: 4,
      title: 'Video Training Series',
      description:
        'Video tutorials covering all aspects of the auditor interface',
      icon: <BookOpenIcon className="h-6 w-6 text-gray-400" />,
      link: '#',
    },
  ]
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-semibold text-gray-900">
          Support & Resources
        </h1>
        <div className="relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input
            type="text"
            className="focus:ring-black focus:border-black block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 px-3 border"
            placeholder="Search support articles..."
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow rounded-lg border border-gray-200 p-6 flex flex-col items-center justify-center text-center">
          <div className="p-3 bg-gray-100 rounded-full">
            <MessageSquareIcon className="h-8 w-8 text-black" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            Contact Support
          </h3>
          <p className="mt-2 text-sm text-gray-600">
            Get help from our dedicated support team
          </p>
          <button
            onClick={() => setShowContactForm(true)}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
          >
            Contact Us
          </button>
        </div>
        <div className="bg-white shadow rounded-lg border border-gray-200 p-6 flex flex-col items-center justify-center text-center">
          <div className="p-3 bg-gray-100 rounded-full">
            <HelpCircleIcon className="h-8 w-8 text-black" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            Knowledge Base
          </h3>
          <p className="mt-2 text-sm text-gray-600">
            Browse our comprehensive help articles
          </p>
          <button className="mt-4 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black">
            Browse Articles
          </button>
        </div>
        <div className="bg-white shadow rounded-lg border border-gray-200 p-6 flex flex-col items-center justify-center text-center">
          <div className="p-3 bg-gray-100 rounded-full">
            <BookOpenIcon className="h-8 w-8 text-black" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            Training Resources
          </h3>
          <p className="mt-2 text-sm text-gray-600">
            Access training materials and tutorials
          </p>
          <button className="mt-4 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black">
            View Training
          </button>
        </div>
      </div>
      {showContactForm ? (
        <div className="bg-white shadow rounded-lg border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <MessageSquareIcon className="h-5 w-5 mr-2" /> Contact Support
            </h3>
            <button
              onClick={() => setShowContactForm(false)}
              className="text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">Close</span>
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <form className="space-y-6">
            <div>
              <label
                htmlFor="subject"
                className="block text-sm font-medium text-gray-700"
              >
                Subject
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="subject"
                  id="subject"
                  className="shadow-sm focus:ring-black focus:border-black block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="Brief description of your issue"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700"
              >
                Category
              </label>
              <div className="mt-1">
                <select
                  id="category"
                  name="category"
                  className="shadow-sm focus:ring-black focus:border-black block w-full sm:text-sm border-gray-300 rounded-md"
                >
                  <option>Technical Issue</option>
                  <option>Blockchain Verification</option>
                  <option>Compliance Question</option>
                  <option>Report Generation</option>
                  <option>Account Access</option>
                  <option>Other</option>
                </select>
              </div>
            </div>
            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-700"
              >
                Message
              </label>
              <div className="mt-1">
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  className="shadow-sm focus:ring-black focus:border-black block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="Describe your issue in detail"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Attachments
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <PaperclipIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-black hover:text-gray-700 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-black"
                    >
                      <span>Upload a file</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, PDF up to 10MB
                  </p>
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                className="mr-3 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                onClick={() => setShowContactForm(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
              >
                <SendIcon className="h-4 w-4 mr-2" />
                Submit
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <div className="flex flex-wrap items-center justify-between">
              <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
                <HelpCircleIcon className="h-5 w-5 mr-2" /> Frequently Asked
                Questions
              </h3>
              <div className="mt-2 sm:mt-0">
                <select
                  className="block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-black focus:border-black sm:text-sm rounded-md"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="all">All Categories</option>
                  <option value="blockchain">Blockchain</option>
                  <option value="compliance">Compliance</option>
                  <option value="reports">Reports</option>
                  <option value="security">Security</option>
                </select>
              </div>
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {filteredFaqs.map((faq) => (
              <div key={faq.id} className="p-6 hover:bg-gray-50">
                <h4 className="text-base font-medium text-gray-900">
                  {faq.question}
                </h4>
                <p className="mt-2 text-sm text-gray-600">{faq.answer}</p>
                <div className="mt-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 capitalize">
                    {faq.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="bg-white shadow rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6 flex items-center">
          <BookOpenIcon className="h-5 w-5 mr-2" /> Resources & Documentation
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {resources.map((resource) => (
            <a
              key={resource.id}
              href={resource.link}
              className="p-4 border border-gray-200 rounded-md hover:bg-gray-50 flex items-start"
            >
              <div className="flex-shrink-0">{resource.icon}</div>
              <div className="ml-4">
                <h4 className="text-base font-medium text-gray-900">
                  {resource.title}
                </h4>
                <p className="mt-1 text-sm text-gray-600">
                  {resource.description}
                </p>
              </div>
              <div className="ml-auto">
                <ChevronRightIcon className="h-5 w-5 text-gray-400" />
              </div>
            </a>
          ))}
        </div>
      </div>
      <div className="bg-gray-50 shadow rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Still need help?
        </h3>
        <p className="text-sm text-gray-600 mb-6">
          Our dedicated support team is available to assist you with any
          questions or issues.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <PhoneIcon className="h-6 w-6 text-gray-400" />
            </div>
            <div className="ml-3">
              <h4 className="text-sm font-medium text-gray-900">
                Phone Support
              </h4>
              <p className="mt-1 text-sm text-gray-600">+1 (800) 123-4567</p>
              <p className="mt-1 text-xs text-gray-500">Mon-Fri, 9AM-5PM ET</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <MailIcon className="h-6 w-6 text-gray-400" />
            </div>
            <div className="ml-3">
              <h4 className="text-sm font-medium text-gray-900">
                Email Support
              </h4>
              <p className="mt-1 text-sm text-gray-600">
                support@procurechain.gov
              </p>
              <p className="mt-1 text-xs text-gray-500">
                24/7 response within 4 hours
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
