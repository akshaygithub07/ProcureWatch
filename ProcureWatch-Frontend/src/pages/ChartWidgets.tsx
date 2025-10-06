import React from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts'
import { useUser } from '../contexts/UserContext.tsx'
export function ChartWidgets() {
  const { user } = useUser()
  // Sample data for charts
  const budgetData = [
    {
      name: 'IT Infrastructure',
      value: 4000,
    },
    {
      name: 'Facilities',
      value: 3000,
    },
    {
      name: 'Office Supplies',
      value: 2000,
    },
    {
      name: 'Consulting',
      value: 2780,
    },
    {
      name: 'Marketing',
      value: 1890,
    },
    {
      name: 'Security',
      value: 2390,
    },
  ]
  const bidsData = [
    {
      name: 'Project A',
      bids: 12,
    },
    {
      name: 'Project B',
      bids: 19,
    },
    {
      name: 'Project C',
      bids: 7,
    },
    {
      name: 'Project D',
      bids: 15,
    },
    {
      name: 'Project E',
      bids: 11,
    },
    {
      name: 'Project F',
      bids: 6,
    },
  ]
  const spendingData = [
    {
      name: 'Jan',
      amount: 4000,
    },
    {
      name: 'Feb',
      amount: 3000,
    },
    {
      name: 'Mar',
      amount: 5000,
    },
    {
      name: 'Apr',
      amount: 4500,
    },
    {
      name: 'May',
      amount: 6000,
    },
    {
      name: 'Jun',
      amount: 5500,
    },
    {
      name: 'Jul',
      amount: 7000,
    },
    {
      name: 'Aug',
      amount: 6500,
    },
    {
      name: 'Sep',
      amount: 8000,
    },
  ]
  const COLORS = [
    '#0088FE',
    '#00C49F',
    '#FFBB28',
    '#FF8042',
    '#8884D8',
    '#82CA9D',
  ]
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Budget Allocation
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={budgetData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, }) =>
                `${name}`
              }
            >
              {budgetData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip formatter={(value: { toLocaleString: () => any }) => `$${value.toLocaleString()}`} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Bids per Project
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={bidsData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="bids" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Spending Trends
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={spendingData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value: { toLocaleString: () => any }) => `$${value.toLocaleString()}`} />
            <Line
              type="monotone"
              dataKey="amount"
              stroke="#8884d8"
              activeDot={{
                r: 8,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
