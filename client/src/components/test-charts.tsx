import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const data = [
  { name: 'Group A', value: 400 },
  { name: 'Group B', value: 300 },
  { name: 'Group C', value: 300 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

export function TestCharts() {
  console.log("TestCharts component rendering");
  console.log("Data:", data);
  
  return (
    <div className="h-64 w-full border-2 border-red-500 p-4">
      <h3 className="text-xl font-bold text-red-600">Test Chart - Should be visible</h3>
      <div className="bg-gray-200 p-4">
        <p>If you can see this text, React is working</p>
        <div className="h-48 bg-blue-100">
          Chart should be here
        </div>
      </div>
    </div>
  );
}