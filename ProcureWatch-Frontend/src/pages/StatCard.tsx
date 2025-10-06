import React from 'react'
interface StatCardProps {
  title: string
  value: string
  change: string
  icon: React.ReactNode
  iconBg: string
  iconColor: string
}
export function StatCard({
  title,
  value,
  change,
  icon,
  iconBg,
  iconColor,
}: StatCardProps) {
  const isPositive = change.startsWith('+')
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <div className="flex items-center">
        <div className={`p-3 rounded-full ${iconBg} ${iconColor} mr-4`}>
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
          <div className="flex items-center mt-1">
            <span
              className={`text-xs font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}
            >
              {change}
            </span>
            <span className="text-xs text-gray-500 ml-1">from last month</span>
          </div>
        </div>
      </div>
    </div>
  )
}
