import React, { useState, useEffect } from "react";
import { 
  LayoutDashboard, 
  Users, 
  UserCheck, 
  BarChart3, 
  ShieldCheck, 
  Settings, 
  LogOut, 
  Search, 
  Bell, 
  GraduationCap,
  Calendar,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import Footer from "../components/Footer";
import AdminSidebar from "../components/AdminSidebar";
import { useAuth } from "../contexts/AuthContext";

export default function AdminDashboardPage() {
  const { API_BASE } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_BASE}/admin/stats`);
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="bg-white min-h-screen font-sans text-[#141b2b] antialiased flex items-center justify-center">
        <div className="text-gray-500 text-lg">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen font-sans text-[#141b2b] antialiased">
      <AdminSidebar activePage="dashboard" />

      <main className="lg:ml-72 min-h-screen flex flex-col">
        {/* Top Header */}
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-50">
          <div className="flex justify-between items-center px-12 h-20">
            <div className="relative w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-5 h-5" />
              <input 
                className="w-full pl-12 pr-6 py-3 bg-[#f1f3ff] border-none rounded-2xl text-sm font-bold text-[#022448] focus:ring-4 focus:ring-[#022448]/5 transition-all" 
                placeholder="Global search..." 
                type="text"
              />
            </div>

            <div className="flex items-center gap-6">
              <button className="text-gray-400 hover:text-[#022448] transition-colors p-2">
                <Bell className="w-6 h-6" />
              </button>
              <div className="h-8 w-[2px] bg-gray-100 mx-2"></div>
              <button className="bg-[#022448] text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-[#022448]/20">
                Admin Panel
              </button>
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBwfuBVnXYxJpNz5tL_8bVSOzkQDGpqvU178PIj3tODK0jbf00DKIuwIlZ92N1aYf0ANCmotm1J2p5PmpLTtpq8DPNRYADcXKeqLwYEWQnT-1tNEZBzYQTXH6H2DCXbirjfsxzMcmrIqBAAlaj7tMnURlDbq-qDOhxECY8I3JpkYdhCnhqXLmUQNFrASClb0tgDcaCt_Ien3MKIbebcsYD_mbmuyQ5anzIiEhcFFsb7W4orbeZ0e3CjDMzPAUkh8fvlJeaB4vh5qS4" 
                className="w-10 h-10 rounded-full object-cover ring-4 ring-[#f1f3ff]" 
                alt="Admin"
              />
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-12 space-y-12 flex-1">
          {/* Hero Section */}
          <section className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#0b61a1] mb-4">Dashboard Overview</p>
              <h2 className="text-[4rem] font-black leading-none tracking-tighter text-[#022448] -ml-1">System Overview</h2>
            </div>
            <button className="flex items-center gap-3 px-8 py-4 bg-[#f1f3ff] text-[#022448] font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-white border border-transparent hover:border-[#f1f3ff] transition-all">
              <Calendar className="w-4 h-4" />
              Last 30 Days
            </button>
          </section>

          {/* Metrics Grid */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
            {[
              { label: "Total Users", value: stats?.totalUsers?.toString() || "0", trend: "+12% from last month", icon: TrendingUp, color: "text-green-500" },
              { label: "Alumni", value: stats?.totalAlumni?.toString() || "0", trend: "47% of total", icon: GraduationCap, color: "text-[#0b61a1]" },
              { label: "Students", value: stats?.totalStudents?.toString() || "0", trend: "53% of total", icon: Users, color: "text-[#0b61a1]" },
              { label: "Jobs", value: stats?.totalJobs?.toString() || "0", trend: "This Month", icon: Calendar, color: "text-gray-400" },
              { label: "Connections", value: stats?.totalConnections?.toString() || "0", trend: "+8 this week", icon: CheckCircle2, color: "text-green-500" },
              { label: "Pending", value: stats?.pendingVerifications?.toString() || "0", trend: "Immediate Action", icon: AlertTriangle, color: "text-amber-500", highlight: true }
            ].map((stat, i) => (
              <div key={i} className={`bg-white p-8 rounded-[2.5rem] shadow-sm border ${stat.highlight ? 'border-amber-100 bg-amber-50/10' : 'border-gray-50'} group hover:shadow-xl transition-all relative overflow-hidden`}>
                {stat.highlight && <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>}
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4">{stat.label}</p>
                <h3 className="text-3xl font-black text-[#022448] mb-4">{stat.value}</h3>
                <div className={`flex items-center gap-2 text-[9px] font-black uppercase tracking-widest ${stat.color}`}>
                  <stat.icon className="w-3 h-3" />
                  {stat.trend}
                </div>
              </div>
            ))}
          </section>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left Col: Charts */}
            <div className="lg:col-span-8 space-y-10">
              <div className="bg-[#f1f3ff]/50 p-10 rounded-[3rem] border border-[#f1f3ff]">
                <div className="flex items-center justify-between mb-12">
                  <h4 className="text-xl font-black text-[#022448] tracking-tight">Sessions Booked Per Month</h4>
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">Year-to-date</span>
                </div>
                <div className="flex items-end justify-between h-80 gap-6">
                  {[
                    { month: "JAN", val: "h-[40%]", opacity: "opacity-20" },
                    { month: "FEB", val: "h-[65%]", opacity: "opacity-40" },
                    { month: "MAR", val: "h-[55%]", opacity: "opacity-60" },
                    { month: "APR", val: "h-[85%]", opacity: "bg-[#022448]" },
                    { month: "MAY", val: "h-[70%]", opacity: "opacity-70" },
                    { month: "JUN", val: "h-[95%]", opacity: "opacity-90" }
                  ].map((bar, i) => (
                    <div key={i} className="flex flex-col items-center flex-1 gap-4 group">
                      <div className={`w-full ${bar.opacity.startsWith('bg') ? bar.opacity : 'bg-[#022448] ' + bar.opacity} rounded-2xl ${bar.val} group-hover:scale-y-105 transition-transform origin-bottom`}></div>
                      <span className="text-[9px] font-black text-gray-400">{bar.month}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[#f1f3ff]/30 p-10 rounded-[3rem] border border-[#f1f3ff]/50">
                <h4 className="text-xl font-black text-[#022448] tracking-tight mb-12">Industry Representation</h4>
                <div className="space-y-8">
                  {[
                    { label: "Software Engineering", val: 42, color: "bg-[#022448]" },
                    { label: "Business Administration", val: 28, color: "bg-[#0b61a1]" },
                    { label: "Creative Arts & Design", val: 15, color: "bg-blue-300" },
                    { label: "Biotechnology", val: 10, color: "bg-amber-400" }
                  ].map((item, i) => (
                    <div key={i} className="space-y-3">
                      <div className="flex justify-between text-[10px] font-black text-[#022448] uppercase tracking-widest">
                        <span>{item.label}</span>
                        <span>{item.val}%</span>
                      </div>
                      <div className="h-3 bg-white rounded-full overflow-hidden">
                        <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.val}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Col: Feed */}
            <div className="lg:col-span-4 space-y-10">
              <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-50">
                <div className="flex items-center justify-between mb-10">
                  <h4 className="text-xl font-black text-[#022448] tracking-tight">Pending Verifications</h4>
                  <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">{stats?.pendingVerifications?.toString() || "0"} NEW</span>
                </div>
                <div className="space-y-6">
                  <button className="w-full mt-10 py-4 border-2 border-gray-50 rounded-[1.5rem] text-[10px] font-black text-gray-400 uppercase tracking-widest hover:bg-[#f1f3ff] hover:border-transparent transition-all">
                    View All Requests
                  </button>
                </div>
              </div>

              <div className="p-6">
                <h4 className="text-xl font-black text-[#022448] tracking-tight mb-10">Recent Activity</h4>
                <div className="relative space-y-10 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gray-100">
                  {[
                    { title: "New User Verified", desc: "Dr. Helena Vogt was successfully verified as Alumni.", color: "bg-green-500", time: "2 mins ago" },
                    { title: "System Update", desc: "Monthly report for May has been generated.", color: "bg-[#0b61a1]", time: "1 hour ago" },
                    { title: "Flagged Content", desc: "A discussion post in 'Tech Careers' was flagged.", color: "bg-amber-500", time: "4 hours ago" }
                  ].map((activity, i) => (
                    <div key={i} className="relative pl-10 group">
                      <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-white border-4 border-white shadow-sm flex items-center justify-center z-10 group-hover:scale-110 transition-transform">
                        <div className={`w-2.5 h-2.5 rounded-full ${activity.color}`}></div>
                      </div>
                      <div>
                        <p className="text-sm font-black text-[#022448] leading-tight">{activity.title}</p>
                        <p className="text-[11px] text-gray-400 font-medium leading-relaxed mt-1">{activity.desc}</p>
                        <span className="text-[9px] font-black text-gray-300 uppercase mt-3 block">{activity.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </main>
    </div>
  );
}
