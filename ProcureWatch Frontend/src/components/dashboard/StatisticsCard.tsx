import React from 'react'
interface StatisticsCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  change?: {
    value: string | number
    positive: boolean
  }
}
const StatisticsCard: React.FC<StatisticsCardProps> = ({
  title,
  value,
  icon,
  change,
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-5 border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-semibold text-gray-900 mt-1">{value}</p>
          {change && (
            <div
              className={`flex items-center mt-1 text-sm ${change.positive ? 'text-green-600' : 'text-red-600'}`}
            >
              {change.positive ? '↑' : '↓'} {change.value}
            </div>
          )}
        </div>
        <div className="p-3 bg-gray-50 rounded-full">{icon}</div>
      </div>
    </div>
  )
}
export default StatisticsCard
