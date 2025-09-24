import React from 'react'
import { BellIcon } from 'lucide-react'
interface Notification {
  id: number
  title: string
  description: string
  time: string
  read: boolean
}
interface NotificationsPanelProps {
  notifications: Notification[]
}
const NotificationsPanel: React.FC<NotificationsPanelProps> = ({
  notifications,
}) => {
  return (
    <div className="bg-white rounded-lg shadow border border-gray-100">
      <div className="border-b border-gray-200 p-4 flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900 flex items-center">
          <BellIcon className="h-5 w-5 mr-2" /> Notifications
        </h3>
        <span className="text-sm text-gray-500 hover:text-black cursor-pointer">
          Mark all as read
        </span>
      </div>
      <div
        className="overflow-y-auto"
        style={{
          maxHeight: '400px',
        }}
      >
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-4 border-b border-gray-100 ${!notification.read ? 'bg-gray-50' : ''}`}
          >
            <div className="flex justify-between">
              <h4 className="text-sm font-medium text-gray-900">
                {notification.title}
              </h4>
              <span className="text-xs text-gray-500">{notification.time}</span>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              {notification.description}
            </p>
          </div>
        ))}
      </div>
      <div className="p-4 text-center">
        <button className="text-sm font-medium text-black hover:underline">
          View all notifications
        </button>
      </div>
    </div>
  )
}
export default NotificationsPanel
