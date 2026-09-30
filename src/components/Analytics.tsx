import React from 'react';
import { motion } from 'motion/react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Legend, 
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line
} from 'recharts';
import { 
  TrendingUp, 
  DollarSign, 
  Clock, 
  Award,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Download,
  Calendar
} from 'lucide-react';
import DataVisualization from './DataVisualization';

const roiData = [
  { name: 'Jan', savings: 4000, investment: 2400 },
  { name: 'Feb', savings: 3000, investment: 1398 },
  { name: 'Mar', savings: 2000, investment: 9800 },
  { name: 'Apr', savings: 2780, investment: 3908 },
  { name: 'May', savings: 1890, investment: 4800 },
  { name: 'Jun', savings: 2390, investment: 3800 },
  { name: 'Jul', savings: 3490, investment: 4300 },
];

const knowledgeHealth = [
  { name: 'هندسة', value: 400 },
  { name: 'إدارة', value: 300 },
  { name: 'تقنية', value: 300 },
  { name: 'قانوني', value: 200 },
];

const COLORS = ['#006C35', '#C5A059', '#1A1A1A', '#4A5568'];

export default function Analytics() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-saudi-dark">التحليلات والتقارير</h1>
          <p className="text-gray-500 mt-1">قياس العائد على الاستثمار (ROI) وصحة الأصول المعرفية.</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium">تحميل PDF</button>
          <button className="px-4 py-2 bg-saudi-green text-white rounded-xl text-sm font-medium">تخصيص اللوحة</button>
        </div>
      </div>

      {/* ROI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="p-3 bg-green-50 text-saudi-green rounded-2xl">
              <DollarSign className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-green-500 flex items-center gap-1">
              +15.4% <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-400 font-medium">التوفير في تكاليف الاستشارات</p>
            <h3 className="text-2xl font-bold text-saudi-dark mt-1">2.4M ريال</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="p-3 bg-saudi-gold/10 text-saudi-gold rounded-2xl">
              <Clock className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-green-500 flex items-center gap-1">
              -30% <ArrowDownRight className="w-3 h-3" />
            </span>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-400 font-medium">تقليص وقت تدريب الموظفين</p>
            <h3 className="text-2xl font-bold text-saudi-dark mt-1">45 يوم</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="p-3 bg-saudi-dark/10 text-saudi-dark rounded-2xl">
              <Award className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-green-500 flex items-center gap-1">
              +88% <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-400 font-medium">مؤشر جودة المعرفة</p>
            <h3 className="text-2xl font-bold text-saudi-dark mt-1">92/100</h3>
          </div>
        </div>
      </div>

      {/* NEW COMPONENT: Data Visualization (Knowledge Assets Growth Trends Across Months) */}
      <DataVisualization />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* ROI Chart */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-xl mb-8">العائد المالي مقابل الاستثمار</h3>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={roiData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F1F1" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Legend verticalAlign="top" align="right" height={36} iconType="circle" />
                <Line name="التوفير" type="monotone" dataKey="savings" stroke="#006C35" strokeWidth={4} dot={{ r: 4, fill: '#006C35' }} activeDot={{ r: 6 }} />
                <Line name="الاستثمار" type="monotone" dataKey="investment" stroke="#C5A059" strokeWidth={4} dot={{ r: 4, fill: '#C5A059' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Knowledge Distribution */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-xl mb-8">صحة الأصول المعرفية حسب القطاع</h3>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={knowledgeHealth}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {knowledgeHealth.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" align="center" iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 p-4 bg-gray-50 rounded-2xl">
            <p className="text-sm text-gray-500 text-center">
              تم استخلاص <span className="font-bold text-saudi-green">420</span> معرفة جديدة هذا الشهر في قطاع الهندسة.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
