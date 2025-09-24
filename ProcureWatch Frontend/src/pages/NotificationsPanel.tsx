import React from 'react'
import { BellIcon, ChevronRightIcon } from 'lucide-react'
export function NotificationsPanel() {
  const notifications = [
    {
      title: 'New Tender Available',
      description: 'A new tender for IT services has been published.',
      time: '5 min ago',
      type: 'info',
    },
    {
      title: 'Bid Deadline Approaching',
      description: 'Your bid #BID-2023-089 is due in 24 hours.',
      time: '2 hours ago',
      type: 'warning',
    },
    {
      title: 'Contract Awarded',
      description: 'Congratulations! Your bid for Project Alpha was accepted.',
      time: 'Yesterday',
      type: 'success',
    },
    {
      title: 'New Comment',
      description: 'John Smith commented on your bid proposal.',
      time: '2 days ago',
      type: 'info',
    },
    {
      title: 'Budget Update',
      description: 'The budget for Project Beta has been increased by 10%.',
      time: '3 days ago',
      type: 'info',
    },
  ]
  const getTypeStyles = (type: string) => {
    switch (type) {
      case 'warning':
        return 'bg-amber-100 text-amber-800'
      case 'success':
        return 'bg-green-100 text-green-800'
      case 'info':
      default:
        return 'bg-blue-100 text-blue-800'
    }
  }
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 h-full">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center">
          <BellIcon size={18} className="text-gray-500 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">Notifications</h3>
        </div>
        <a href="#" className="text-sm text-gray-600 hover:text-gray-900">
          View all
        </a>
      </div>
      <div className="p-1 max-h-[500px] overflow-y-auto">
        {notifications.map((notification, index) => (
          <div
            key={index}
            className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
          >
            <div className="flex items-start">
              <div
                className={`rounded-full w-2 h-2 mt-2 mr-3 ${getTypeStyles(notification.type)}`}
              ></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {notification.title}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {notification.description}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {notification.time}
                </p>
              </div>
              <ChevronRightIcon size={16} className="text-gray-400" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
