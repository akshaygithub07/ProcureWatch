import React from 'react'
interface ChartWidgetProps {
  title: string
  children: React.ReactNode
  className?: string
}
const ChartWidget: React.FC<ChartWidgetProps> = ({
  title,
  children,
  className,
}) => {
  return (
    <div
      className={`bg-white rounded-lg shadow p-5 border border-gray-100 ${className}`}
    >
      <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
      <div className="h-64">{children}</div>
    </div>
  )
}
export default ChartWidget
