
import React, { useState } from 'react';
import { OrderData, OrderStatus, Product, User } from '../types';
import { PRODUCTS } from '../constants';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  AreaChart, Area, LineChart, Line,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import { 
  Trash2, Key, BarChart3, Users, ShoppingBag, LogOut, 
  Home, Info, Bell, Gauge, Link as LinkIcon, Settings,
  Wallet, TrendingDown, TrendingUp, Edit3, ChevronDown
} from 'lucide-react';

interface AdminPanelProps {
  orders: OrderData[];
  products: Product[];
  users: User[];
  onUpdateStatus: (id: string, status: OrderStatus) => void;
  onUpdateUserRole: (userId: string, role: 'user' | 'admin') => void;
  onDeleteUser: (userId: string) => void;
  onChangeUserPassword: (userId: string) => void;
  onLogout: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ 
  orders, 
  products, 
  users, 
  onUpdateStatus, 
  onUpdateUserRole, 
  onDeleteUser,
  onChangeUserPassword,
  onLogout 
}) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'users' | 'analytics'>('analytics');
  const [filter, setFilter] = useState<string>('All');

  const filteredOrders = filter === 'All' 
    ? orders 
    : orders.filter(o => o.status === filter);

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === OrderStatus.PLACED).length,
    delivered: orders.filter(o => o.status === OrderStatus.DELIVERED).length,
    revenue: orders.reduce((acc, curr) => {
      const p = products.find(prod => prod.id === curr.productId);
      return acc + (p ? p.price * curr.quantity : 0);
    }, 0),
    users: users.length
  };

  const barData = [
    { name: 'Jan', value: 40, value2: 24, value3: 35 },
    { name: 'Feb', value: 30, value2: 13, value3: 45 },
    { name: 'Mar', value: 20, value2: 98, value3: 30 },
  ];

  const liveData = Array.from({ length: 20 }, (_, i) => ({
    name: i * 10,
    value: Math.floor(Math.random() * 50) + 20,
    value2: Math.floor(Math.random() * 30) + 10,
  }));

  const annualData = Array.from({ length: 12 }, (_, i) => ({
    name: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
    spread: Math.floor(Math.random() * 40) + 20,
    loss: Math.floor(Math.random() * 20) + 10,
    income: Math.floor(Math.random() * 30) + 40,
  }));

  const radarData = [
    { subject: 'A', A: 120, B: 110, fullMark: 150 },
    { subject: 'B', A: 98, B: 130, fullMark: 150 },
    { subject: 'C', A: 86, B: 130, fullMark: 150 },
    { subject: 'D', A: 99, B: 100, fullMark: 150 },
    { subject: 'E', A: 85, B: 90, fullMark: 150 },
    { subject: 'F', A: 65, B: 85, fullMark: 150 },
  ];

  const SidebarIcon = ({ icon: Icon, active }: { icon: any, active?: boolean }) => (
    <div className={`p-3 cursor-pointer transition-all duration-300 ${active ? 'text-blue-600 bg-blue-50' : 'text-slate-400 hover:text-slate-600'}`}>
      <Icon size={20} />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F0F4F8] flex">
      {/* Sidebar */}
      <div className="w-20 bg-white border-r border-slate-200 flex flex-col items-center py-8 space-y-8 hidden md:flex">
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold mb-8">A</div>
        <SidebarIcon icon={Home} active={activeTab === 'analytics'} />
        <SidebarIcon icon={Info} />
        <SidebarIcon icon={Bell} />
        <SidebarIcon icon={Gauge} />
        <SidebarIcon icon={LinkIcon} />
        <div className="flex-grow" />
        <SidebarIcon icon={Settings} />
        <div onClick={onLogout} className="p-3 text-slate-400 hover:text-red-500 cursor-pointer transition-colors">
          <LogOut size={20} />
        </div>
      </div>

      <div className="flex-grow flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 md:hidden">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">A</div>
            <h1 className="text-lg font-bold text-slate-800">Admin Hub</h1>
          </div>
          <button onClick={onLogout} className="text-slate-400 hover:text-red-500">
            <LogOut size={20} />
          </button>
        </header>

        <main className="flex-grow overflow-y-auto p-4 md:p-8 space-y-8">
          {/* Tab Switcher */}
          <div className="flex space-x-8 border-b border-slate-200 pb-4">
            {['analytics', 'orders', 'users'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`text-sm font-bold uppercase tracking-wider transition-all relative ${
                  activeTab === tab ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <div className="absolute -bottom-[17px] left-0 right-0 h-1 bg-blue-600 rounded-t-full" />
                )}
              </button>
            ))}
          </div>

          {activeTab === 'analytics' && (
            <div className="space-y-8 animate-in fade-in duration-500">
              {/* Top Row */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Percent Ratio */}
                <div className="lg:col-span-5 bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col">
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <h3 className="text-2xl font-bold text-slate-800">Percent</h3>
                      <p className="text-sm text-slate-400">Ratio</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Percent Segmentation</p>
                      <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Visualization</p>
                    </div>
                  </div>
                  <div className="flex-grow flex items-center justify-center relative">
                    <div className="w-64 h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={[{ value: 76 }, { value: 24 }]}
                            cx="50%"
                            cy="50%"
                            innerRadius={70}
                            outerRadius={90}
                            startAngle={180}
                            endAngle={-180}
                            paddingAngle={0}
                            dataKey="value"
                          >
                            <Cell fill="#3b82f6" />
                            <Cell fill="#f1f5f9" />
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <div className="flex items-center text-blue-600">
                        <ChevronDown className="rotate-180 w-4 h-4" />
                        <span className="text-4xl font-bold">76%</span>
                      </div>
                      <div className="flex items-center text-red-400 text-sm font-bold">
                        <ChevronDown className="w-3 h-3" />
                        <span>15%</span>
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 text-xs font-bold text-slate-400">0%</div>
                    <div className="absolute bottom-0 right-0 text-xs font-bold text-slate-400">100%</div>
                  </div>
                </div>

                {/* Last 3 Month */}
                <div className="lg:col-span-3 bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                  <h3 className="text-lg font-bold text-slate-800 mb-8">Last <span className="text-blue-600">3</span> Month</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={barData}>
                        <Bar dataKey="value" fill="#4ade80" radius={[4, 4, 0, 0]} barSize={8} />
                        <Bar dataKey="value2" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={8} />
                        <Bar dataKey="value3" fill="#2dd4bf" radius={[4, 4, 0, 0]} barSize={8} />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                        <Tooltip cursor={{ fill: 'transparent' }} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Live Info Sparklines */}
                <div className="lg:col-span-4 space-y-4">
                  <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-sm font-bold text-slate-800">Live Information</h4>
                      <p className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">Real Time Data Graph</p>
                    </div>
                    <div className="h-32">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={liveData}>
                          <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} dot={false} />
                          <Line type="monotone" dataKey="value2" stroke="#4ade80" strokeWidth={3} dot={false} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="grid grid-cols-4 gap-2 mt-4">
                      {[
                        { label: 'Main', val: 14, color: 'bg-green-400' },
                        { label: 'Copy', val: 19, color: 'bg-blue-400' },
                        { label: 'Code', val: 23, color: 'bg-teal-400' },
                        { label: 'Total', val: 12, color: 'bg-indigo-400' },
                      ].map((item, i) => (
                        <div key={i} className="text-center">
                          <div className={`${item.color} text-white text-xs font-bold py-1 rounded-md mb-1`}>{item.val}</div>
                          <p className="text-[8px] font-bold text-slate-400 uppercase">{item.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Middle Row */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Live Info Area */}
                <div className="lg:col-span-7 bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                  <div className="flex justify-between items-center mb-8">
                    <h3 className="text-lg font-bold text-slate-800">Live Information</h3>
                    <p className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">Real Time Visualization In Minutes</p>
                  </div>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={liveData}>
                        <defs>
                          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorValue2" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#4ade80" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#4ade80" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <Area type="monotone" dataKey="value" stroke="#3b82f6" fillOpacity={1} fill="url(#colorValue)" strokeWidth={3} />
                        <Area type="monotone" dataKey="value2" stroke="#4ade80" fillOpacity={1} fill="url(#colorValue2)" strokeWidth={3} />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#cbd5e1' }} />
                        <YAxis hide />
                        <Tooltip />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Spread Radar */}
                <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center">
                  <div className="w-full flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-slate-800">Spread</h3>
                    <span className="text-[10px] font-bold text-slate-300">100%</span>
                  </div>
                  <div className="h-48 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                        <PolarGrid stroke="#f1f5f9" />
                        <Radar name="A" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                        <Radar name="B" dataKey="B" stroke="#ef4444" fill="#ef4444" fillOpacity={0.4} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="w-full mt-4 space-y-2">
                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Expected Spread Visualization</p>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold text-slate-300">0%</span>
                      <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                        <BarChart3 size={14} />
                      </div>
                      <span className="text-[10px] font-bold text-slate-300">25%</span>
                    </div>
                  </div>
                </div>

                {/* Percentile Gauges */}
                <div className="lg:col-span-3 bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                  <div className="flex h-full">
                    <div className="w-1/3 flex flex-col justify-between items-center py-4">
                      <h3 className="text-lg font-bold text-slate-800 rotate-[-90deg] origin-center whitespace-nowrap">Percentile</h3>
                      <div className="space-y-2 text-[10px] font-bold text-slate-300">
                        <p>42%</p>
                        <p>83%</p>
                        <p>64%</p>
                      </div>
                    </div>
                    <div className="w-2/3 grid grid-cols-2 gap-4">
                      {[
                        { val: 33, color: '#4ade80' },
                        { val: 76, color: '#3b82f6' },
                        { val: 65, color: '#f43f5e' },
                        { val: 46, color: '#fbbf24' },
                      ].map((item, i) => (
                        <div key={i} className="flex flex-col items-center justify-center space-y-2">
                          <div className="w-16 h-16 relative">
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie
                                  data={[{ value: item.val }, { value: 100 - item.val }]}
                                  innerRadius={20}
                                  outerRadius={28}
                                  startAngle={90}
                                  endAngle={-270}
                                  dataKey="value"
                                >
                                  <Cell fill={item.color} />
                                  <Cell fill="#f1f5f9" />
                                </Pie>
                              </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold">
                              <ChevronDown className={`w-2 h-2 rotate-180 mr-0.5`} style={{ color: item.color }} />
                              {item.val}%
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Row */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Annual Information */}
                <div className="lg:col-span-9 bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                  <div className="flex justify-between items-center mb-8">
                    <h3 className="text-lg font-bold text-slate-800">Annual Information</h3>
                    <p className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">Annual Visualization By Month</p>
                  </div>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={annualData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                        <Tooltip />
                        <Bar dataKey="income" stackId="a" fill="#3b82f6" radius={[0, 0, 0, 0]} barSize={12} />
                        <Bar dataKey="loss" stackId="a" fill="#4ade80" radius={[0, 0, 0, 0]} barSize={12} />
                        <Bar dataKey="spread" stackId="a" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={12} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Income Statistics */}
                <div className="lg:col-span-3 bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col">
                  <div className="flex justify-between items-start mb-8">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <span className="text-2xl font-bold text-slate-800">%</span>
                        <div className="space-y-1">
                          <div className="bg-green-400 text-white text-[10px] font-bold px-2 py-0.5 rounded">43</div>
                          <div className="bg-blue-400 text-white text-[10px] font-bold px-2 py-0.5 rounded">86</div>
                          <div className="bg-indigo-400 text-white text-[10px] font-bold px-2 py-0.5 rounded">61</div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <h4 className="text-sm font-bold text-slate-800">Income Statistics</h4>
                      <p className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">(Year)</p>
                    </div>
                  </div>
                  <div className="flex-grow flex items-end justify-between px-4">
                    <div className="h-32 w-4 bg-green-400 rounded-t-sm" />
                    <div className="h-40 w-4 bg-blue-400 rounded-t-sm" />
                    <div className="h-24 w-4 bg-indigo-400 rounded-t-sm" />
                  </div>
                  <div className="mt-8 space-y-2">
                    {[
                      { label: 'Spread', color: 'bg-blue-400' },
                      { label: 'Loss', color: 'bg-green-400' },
                      { label: 'Income', color: 'bg-indigo-400' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center space-x-2">
                        <div className={`w-3 h-3 ${item.color} rounded-sm`} />
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden animate-in fade-in duration-500">
            <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
              <h2 className="text-lg font-bold text-slate-800">Delivery Dashboard</h2>
              <div className="flex flex-wrap bg-slate-100 p-1 rounded-[12px] gap-1">
                {['All', ...Object.values(OrderStatus)].map(s => (
                  <button 
                    key={s}
                    onClick={() => setFilter(s)}
                    className={`px-3 py-1.5 rounded-[8px] text-[10px] font-bold transition-all ${filter === s ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[700px]">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-6 py-4 text-[10px] font-bold uppercase text-slate-400 tracking-widest">ID</th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase text-slate-400 tracking-widest">Customer</th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase text-slate-400 tracking-widest">Order</th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase text-slate-400 tracking-widest">Status</th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase text-slate-400 tracking-widest">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-12 text-center text-slate-400 font-medium">No orders to display.</td>
                    </tr>
                  ) : (
                    filteredOrders.map(o => (
                      <tr key={o.id} className="hover:bg-slate-50/50">
                        <td className="px-6 py-4">
                          <span className="font-bold text-slate-900 block text-xs">{o.id}</span>
                          <span className="text-[10px] text-slate-400">{new Date(o.createdAt).toLocaleDateString()}</span>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-bold text-slate-800 text-sm">{o.name}</p>
                          <p className="text-[11px] text-slate-400">{o.phone} • {o.area}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-xs font-bold text-slate-700">{o.quantity}x {products.find(p => p.id === o.productId)?.name}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-[6px] text-[10px] font-bold uppercase ${
                            o.status === OrderStatus.DELIVERED ? 'bg-green-50 text-green-600' : 
                            o.status === OrderStatus.OUT_FOR_DELIVERY ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-500'
                          }`}>
                            {o.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <select 
                            value={o.status}
                            onChange={(e) => onUpdateStatus(o.id, e.target.value as OrderStatus)}
                            className="bg-slate-50 border border-slate-200 rounded-[8px] text-[10px] font-bold px-2 py-1.5 outline-none focus:ring-1 focus:ring-blue-600"
                          >
                            {Object.values(OrderStatus).map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
            <div className="bg-white rounded-[12px] shadow-md border border-slate-200 overflow-hidden animate-in fade-in duration-500">
              <div className="p-6 border-b border-slate-100">
                <h2 className="text-lg font-bold text-slate-800">User Management</h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[600px]">
                  <thead>
                    <tr className="bg-slate-50/50">
                      <th className="px-6 py-4 text-[10px] font-bold uppercase text-slate-400 tracking-widest">User</th>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase text-slate-400 tracking-widest">Username</th>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase text-slate-400 tracking-widest">Role</th>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase text-slate-400 tracking-widest">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {users.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="p-12 text-center text-slate-400 font-medium">No users found.</td>
                      </tr>
                    ) : (
                      users.map(u => (
                        <tr key={u.id} className="hover:bg-slate-50/50">
                          <td className="px-6 py-4">
                            <p className="font-bold text-slate-800 text-sm">{u.name || 'No Name'}</p>
                            <p className="text-[11px] text-slate-400">{u.email}</p>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-xs font-medium text-slate-600">@{u.username}</p>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-[6px] text-[10px] font-bold uppercase ${
                              u.role === 'admin' ? 'bg-purple-50 text-purple-600' : 'bg-slate-100 text-slate-500'
                            }`}>
                              {u.role}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-2">
                              <select 
                                value={u.role}
                                onChange={(e) => onUpdateUserRole(u.id, e.target.value as 'user' | 'admin')}
                                className="bg-slate-50 border border-slate-200 rounded-[8px] text-[10px] font-bold px-2 py-1.5 outline-none focus:ring-1 focus:ring-blue-600"
                              >
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                              </select>
                              <button 
                                onClick={() => onChangeUserPassword(u.id)}
                                className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
                                title="Change Password"
                              >
                                <Key className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => onDeleteUser(u.id)}
                                className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                                title="Delete User"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminPanel;
