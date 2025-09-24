import React from 'react'
import { useUser } from '../contexts/UserContext.tsx'
import { StatCard } from './StatCard.tsx'
import { NotificationsPanel } from './NotificationsPanel.tsx'
import { RoleSpecificWidgets } from './RoleSpecificWidgets.tsx'
import { ChartWidgets } from './ChartWidgets.tsx'
import {
  FileTextIcon,
  HandshakeIcon,
  FileCheckIcon,
  DollarSignIcon,
} from 'lucide-react'
export function Buyer_Dashboard() {
  const { user, setUser } = useUser()
  // For demo purposes, allow switching roles
  const handleRoleChange = (
    role: 'vendor' | 'buyer' | 'auditor' | 'citizen',
  ) => {
    setUser((prev) => ({
      ...prev,
      role,
    }))
  }
  return (
    <div className="container mx-auto">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        {/* Role switcher for demo */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Demo Role:</span>
          <select
            value={user.role}
            onChange={(e) => handleRoleChange(e.target.value as any)}
            className="border border-gray-300 rounded-md text-sm py-1 px-2 focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
          >
            <option value="vendor">Vendor</option>
            <option value="buyer">Buyer</option>
            <option value="auditor">Auditor</option>
            <option value="citizen">Citizen</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Active Tenders"
          value="28"
          change="+3"
          icon={<FileTextIcon size={24} />}
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
        />
        <StatCard
          title="Total Bids"
          value="124"
          change="+12"
          icon={<HandshakeIcon size={24} />}
          iconBg="bg-green-100"
          iconColor="text-green-600"
        />
        <StatCard
          title="Active Contracts"
          value="47"
          change="+5"
          icon={<FileCheckIcon size={24} />}
          iconBg="bg-purple-100"
          iconColor="text-purple-600"
        />
        <StatCard
          title="Budget Utilized"
          value="$4.2M"
          change="+$320K"
          icon={<DollarSignIcon size={24} />}
          iconBg="bg-amber-100"
          iconColor="text-amber-600"
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <RoleSpecificWidgets />
        </div>
        <div className="lg:col-span-1">
          <NotificationsPanel />
        </div>
      </div>
      <div className="mb-6">
        <ChartWidgets />
      </div>
    </div>
  )
}
