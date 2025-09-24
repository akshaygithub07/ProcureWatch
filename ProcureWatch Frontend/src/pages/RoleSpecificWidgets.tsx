import React from 'react'
import { useUser } from '../contexts/UserContext.tsx'
import {
  FileTextIcon,
  HandshakeIcon,
  FileCheckIcon,
  ShieldIcon,
  AlertTriangleIcon,
  BarChart2Icon,
  ClipboardIcon,
  UsersIcon,
  PieChartIcon,
  LineChartIcon,
  TrendingUpIcon,
  CheckCircleIcon,
} from 'lucide-react'
export function RoleSpecificWidgets() {
  const { user } = useUser()
  const renderVendorWidgets = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
        <div className="flex items-center mb-4">
          <FileTextIcon size={20} className="text-blue-600 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">Active Tenders</h3>
        </div>
        <div className="space-y-3">
          {[
            {
              id: 'T-2023-042',
              title: 'IT Infrastructure Upgrade',
              deadline: 'Oct 15, 2023',
              status: 'Open',
            },
            {
              id: 'T-2023-039',
              title: 'Office Supplies',
              deadline: 'Oct 10, 2023',
              status: 'Open',
            },
            {
              id: 'T-2023-036',
              title: 'Security Services',
              deadline: 'Oct 5, 2023',
              status: 'Open',
            },
          ].map((tender) => (
            <div
              key={tender.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
            >
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {tender.title}
                </p>
                <p className="text-xs text-gray-500">
                  ID: {tender.id} | Deadline: {tender.deadline}
                </p>
              </div>
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                {tender.status}
              </span>
            </div>
          ))}
        </div>
        <a
          href="#"
          className="text-sm text-blue-600 hover:text-blue-800 mt-4 inline-block"
        >
          View all tenders
        </a>
      </div>
      <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
        <div className="flex items-center mb-4">
          <HandshakeIcon size={20} className="text-green-600 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">My Bids</h3>
        </div>
        <div className="space-y-3">
          {[
            {
              id: 'B-2023-087',
              tender: 'IT Infrastructure Upgrade',
              amount: '$125,000',
              status: 'Submitted',
            },
            {
              id: 'B-2023-082',
              tender: 'Office Supplies',
              amount: '$28,500',
              status: 'Under Review',
            },
            {
              id: 'B-2023-079',
              tender: 'Consulting Services',
              amount: '$75,000',
              status: 'Accepted',
            },
          ].map((bid) => (
            <div
              key={bid.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
            >
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {bid.tender}
                </p>
                <p className="text-xs text-gray-500">
                  ID: {bid.id} | Amount: {bid.amount}
                </p>
              </div>
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full ${bid.status === 'Accepted' ? 'bg-green-100 text-green-800' : bid.status === 'Under Review' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}`}
              >
                {bid.status}
              </span>
            </div>
          ))}
        </div>
        <a
          href="#"
          className="text-sm text-blue-600 hover:text-blue-800 mt-4 inline-block"
        >
          View all bids
        </a>
      </div>
    </div>
  )
  const renderBuyerWidgets = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
        <div className="flex items-center mb-4">
          <ClipboardIcon size={20} className="text-blue-600 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">
            Procurement Requests
          </h3>
        </div>
        <div className="space-y-3">
          {[
            {
              id: 'PR-2023-042',
              title: 'IT Infrastructure Upgrade',
              department: 'IT',
              status: 'Published',
            },
            {
              id: 'PR-2023-039',
              title: 'Office Supplies',
              department: 'Admin',
              status: 'Draft',
            },
            {
              id: 'PR-2023-036',
              title: 'Security Services',
              department: 'Facilities',
              status: 'Pending Approval',
            },
          ].map((request) => (
            <div
              key={request.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
            >
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {request.title}
                </p>
                <p className="text-xs text-gray-500">
                  ID: {request.id} | Dept: {request.department}
                </p>
              </div>
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full ${request.status === 'Published' ? 'bg-green-100 text-green-800' : request.status === 'Draft' ? 'bg-gray-100 text-gray-800' : 'bg-yellow-100 text-yellow-800'}`}
              >
                {request.status}
              </span>
            </div>
          ))}
        </div>
        <a
          href="#"
          className="text-sm text-blue-600 hover:text-blue-800 mt-4 inline-block"
        >
          View all requests
        </a>
      </div>
      <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
        <div className="flex items-center mb-4">
          <UsersIcon size={20} className="text-purple-600 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">
            Vendor Responses
          </h3>
        </div>
        <div className="space-y-3">
          {[
            {
              id: 'T-2023-042',
              title: 'IT Infrastructure Upgrade',
              responses: 8,
              status: 'Open',
            },
            {
              id: 'T-2023-039',
              title: 'Office Supplies',
              responses: 12,
              status: 'Under Review',
            },
            {
              id: 'T-2023-036',
              title: 'Security Services',
              responses: 5,
              status: 'Closed',
            },
          ].map((tender) => (
            <div
              key={tender.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
            >
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {tender.title}
                </p>
                <p className="text-xs text-gray-500">
                  ID: {tender.id} | Responses: {tender.responses}
                </p>
              </div>
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full ${tender.status === 'Open' ? 'bg-green-100 text-green-800' : tender.status === 'Under Review' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}
              >
                {tender.status}
              </span>
            </div>
          ))}
        </div>
        <a
          href="#"
          className="text-sm text-blue-600 hover:text-blue-800 mt-4 inline-block"
        >
          View all tenders
        </a>
      </div>
    </div>
  )
  const renderAuditorWidgets = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
        <div className="flex items-center mb-4">
          <ShieldIcon size={20} className="text-blue-600 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">Audit Trail</h3>
        </div>
        <div className="space-y-3">
          {[
            {
              id: 'A-2023-142',
              action: 'Contract Signed',
              user: 'Jane Cooper (Buyer)',
              time: 'Today, 10:23 AM',
            },
            {
              id: 'A-2023-141',
              action: 'Bid Accepted',
              user: 'Alex Morgan (Buyer)',
              time: 'Today, 09:15 AM',
            },
            {
              id: 'A-2023-140',
              action: 'Bid Submitted',
              user: 'Tech Solutions Inc. (Vendor)',
              time: 'Yesterday, 04:30 PM',
            },
          ].map((entry) => (
            <div
              key={entry.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
            >
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {entry.action}
                </p>
                <p className="text-xs text-gray-500">By: {entry.user}</p>
                <p className="text-xs text-gray-400">{entry.time}</p>
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-blue-600 rounded-full mr-1"></span>
                <CheckCircleIcon size={16} className="text-green-600" />
              </div>
            </div>
          ))}
        </div>
        <a
          href="#"
          className="text-sm text-blue-600 hover:text-blue-800 mt-4 inline-block"
        >
          View full audit log
        </a>
      </div>
      <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
        <div className="flex items-center mb-4">
          <AlertTriangleIcon size={20} className="text-amber-600 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">Flagged Issues</h3>
        </div>
        <div className="space-y-3">
          {[
            {
              id: 'F-2023-027',
              issue: 'Unusual bid pattern detected',
              severity: 'High',
              status: 'Open',
            },
            {
              id: 'F-2023-026',
              issue: 'Missing documentation',
              severity: 'Medium',
              status: 'Under Review',
            },
            {
              id: 'F-2023-025',
              issue: 'Potential conflict of interest',
              severity: 'High',
              status: 'Resolved',
            },
          ].map((issue) => (
            <div
              key={issue.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
            >
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {issue.issue}
                </p>
                <p className="text-xs text-gray-500">
                  ID: {issue.id} | Severity: {issue.severity}
                </p>
              </div>
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full ${issue.status === 'Open' ? 'bg-red-100 text-red-800' : issue.status === 'Under Review' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}
              >
                {issue.status}
              </span>
            </div>
          ))}
        </div>
        <a
          href="#"
          className="text-sm text-blue-600 hover:text-blue-800 mt-4 inline-block"
        >
          View all issues
        </a>
      </div>
    </div>
  )
  const renderCitizenWidgets = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
        <div className="flex items-center mb-4">
          <PieChartIcon size={20} className="text-blue-600 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">
            Transparency Stats
          </h3>
        </div>
        <div className="space-y-3">
          {[
            {
              metric: 'Open Tenders',
              value: '28',
              change: '+12% from last month',
            },
            {
              metric: 'Public Funds Allocated',
              value: '$12.4M',
              change: '+5% from last quarter',
            },
            {
              metric: 'Average Bids per Tender',
              value: '8.3',
              change: '+2.1 from last year',
            },
          ].map((stat, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
            >
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {stat.metric}
                </p>
                <p className="text-xs text-gray-500">{stat.change}</p>
              </div>
              <span className="text-lg font-semibold text-gray-900">
                {stat.value}
              </span>
            </div>
          ))}
        </div>
        <a
          href="#"
          className="text-sm text-blue-600 hover:text-blue-800 mt-4 inline-block"
        >
          View detailed statistics
        </a>
      </div>
      <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
        <div className="flex items-center mb-4">
          <TrendingUpIcon size={20} className="text-green-600 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">Recent Awards</h3>
        </div>
        <div className="space-y-3">
          {[
            {
              project: 'City Park Renovation',
              awarded: 'Green Spaces Inc.',
              value: '$1.2M',
              date: 'Oct 2, 2023',
            },
            {
              project: 'Public School IT Upgrade',
              awarded: 'TechEdu Solutions',
              value: '$450K',
              date: 'Sep 28, 2023',
            },
            {
              project: 'Municipal Building Maintenance',
              awarded: 'BuildRight Services',
              value: '$820K',
              date: 'Sep 15, 2023',
            },
          ].map((award, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
            >
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {award.project}
                </p>
                <p className="text-xs text-gray-500">
                  Awarded to: {award.awarded}
                </p>
                <p className="text-xs text-gray-400">Date: {award.date}</p>
              </div>
              <span className="text-sm font-semibold text-gray-900">
                {award.value}
              </span>
            </div>
          ))}
        </div>
        <a
          href="#"
          className="text-sm text-blue-600 hover:text-blue-800 mt-4 inline-block"
        >
          View all awards
        </a>
      </div>
    </div>
  )
  const renderWidgetsByRole = () => {
    switch (user.role) {
      case 'vendor':
        return renderVendorWidgets()
      case 'buyer':
        return renderBuyerWidgets()
      case 'auditor':
        return renderAuditorWidgets()
      case 'citizen':
        return renderCitizenWidgets()
      default:
        return <div>No widgets available</div>
    }
  }
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 capitalize">
          {user.role} Dashboard
        </h3>
      </div>
      <div className="p-5">{renderWidgetsByRole()}</div>
    </div>
  )
}
