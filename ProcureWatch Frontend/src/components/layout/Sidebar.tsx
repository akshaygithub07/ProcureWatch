import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  HomeIcon,
  BarChart3Icon,
  AwardIcon,
  LineChartIcon,
  ScrollTextIcon,
  HelpCircleIcon,
  ShieldAlertIcon,
  ClipboardCheckIcon,
  FileBarChartIcon,
  AlertTriangleIcon,
} from 'lucide-react'
const Sidebar: React.FC = () => {
  const location = useLocation()
  // This would normally come from authentication context
  // For now, we're setting it to 'auditor' to showcase that role
  const userRole = 'auditor'
  // Navigation items based on user role
  const navigationItems = {
    citizen: [
      {
        name: 'Dashboard',
        href: '/',
        icon: HomeIcon,
      },
      {
        name: 'Transparency Stats',
        href: '/transparency-stats',
        icon: BarChart3Icon,
      },
      {
        name: 'Awarded Contracts',
        href: '/awarded-contracts',
        icon: AwardIcon,
      },
      {
        name: 'Spending Reports',
        href: '/spending-reports',
        icon: LineChartIcon,
      },
      {
        name: 'Audit Logs',
        href: '/audit-logs',
        icon: ScrollTextIcon,
      },
      {
        name: 'Support',
        href: '/support',
        icon: HelpCircleIcon,
      },
    ],
    auditor: [
      {
        name: 'Dashboard',
        href: '/auditor',
        icon: HomeIcon,
      },
      {
        name: 'Audit Trail',
        href: '/auditor/audit-trail',
        icon: ScrollTextIcon,
      },
      {
        name: 'Flagged Issues',
        href: '/auditor/flagged-issues',
        icon: AlertTriangleIcon,
      },
      {
        name: 'Compliance Stats',
        href: '/auditor/compliance-stats',
        icon: ClipboardCheckIcon,
      },
      {
        name: 'Reports',
        href: '/auditor/reports',
        icon: FileBarChartIcon,
      },
      {
        name: 'Support',
        href: '/auditor/support',
        icon: HelpCircleIcon,
      },
    ],
    // Other roles could be added here (vendor, buyer)
  }
  const navigation =
    navigationItems[userRole as keyof typeof navigationItems] ||
    navigationItems.citizen
  // Role display information
  const roleInfo = {
    citizen: {
      label: 'Citizen User',
      description: 'Public Access',
      icon: 'C',
    },
    auditor: {
      label: 'Auditor',
      description: 'Full System Access',
      icon: 'A',
    },
  }
  const currentRole =
    roleInfo[userRole as keyof typeof roleInfo] || roleInfo.citizen
  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64">
        <div className="flex flex-col h-0 flex-1 border-r border-gray-200 bg-white">
          <div className="flex items-center h-16 flex-shrink-0 px-4 bg-black">
            <div className="flex items-center">
              <ShieldAlertIcon className="h-8 w-8 text-white" />
              <span className="ml-2 text-white font-semibold text-lg">
                ProcureWatch
              </span>
            </div>
          </div>
          <div className="flex-1 flex flex-col overflow-y-auto pt-5 pb-4">
            <nav className="mt-5 flex-1 px-2 space-y-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${isActive ? 'bg-gray-100 text-black' : 'text-gray-600 hover:bg-gray-50 hover:text-black'}`}
                  >
                    <item.icon
                      className={`mr-3 flex-shrink-0 h-5 w-5 ${isActive ? 'text-black' : 'text-gray-400 group-hover:text-gray-500'}`}
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                )
              })}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-sm font-medium text-gray-500">
                  {currentRole.icon}
                </span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">
                  {currentRole.label}
                </p>
                <p className="text-xs font-medium text-gray-500">
                  {currentRole.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Sidebar
