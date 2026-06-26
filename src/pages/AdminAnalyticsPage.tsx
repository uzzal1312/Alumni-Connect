import React, { useState, useEffect } from "react";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  GraduationCap, 
  Briefcase, 
  Calendar, 
  ArrowUpRight, 
  ArrowDownRight,
  Download,
  Filter,
  CheckCircle2,
  Clock,
  Globe
} from "lucide-react";
import AdminSidebar from "../components/AdminSidebar";
import Footer from "../components/Footer";
import { useAuth } from "../contexts/AuthContext";

export default function AdminAnalyticsPage() {
  const { API_BASE } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [statsRes, analyticsRes] = await Promise.all([
        fetch(`${API_BASE}/admin/stats`),
        fetch(`${API_BASE}/admin/analytics`)
      ]);
      if (statsRes.ok) {
        const data = await statsRes.json();
        setStats(data.stats);
      }
      if (analyticsRes.ok) {
        const data = await analyticsRes.json();
        setAnalytics(data.analytics);
      }
    } catch (error) {
      console.error("Error fetching analytics data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="bg-[#f9f9ff] min-h-screen font-sans text-[#141b2b] antialiased flex items-center justify-center">
        <div className="text-gray-500 text-lg">Loading analytics...</div>
      </div>
    );
  }

  return (
    <div className="bg-[#f9f9ff] min-h-screen font-sans text-[#141b2b] antialiased">
      <AdminSidebar activePage="analytics" />

      <main className="lg:ml-72 min-h-screen flex flex-col relative">
        {/* Top Header */}
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-50">
          <div className="flex justify-between items-center px-12 h-20">
            <div>
              <h1 className="text-xl font-black text-[#022448] tracking-tight">System Analytics</h1>
              <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Real-time performance monitoring</p>
            </div>

            <div className="flex items-center gap-6">
              <button className="flex items-center gap-3 px-6 py-3 bg-[#f1f3ff] text-[#022448] font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-white border border-transparent hover:border-[#f1f3ff] transition-all">
                <Download className="w-4 h-4" />
                Export Report
              </button>
              <div className="h-8 w-[2px] bg-gray-100 mx-2"></div>
              <button className="bg-[#022448] text-white px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-[#022448]/20">
                Live Feed
              </button>
            </div>
          </div>
        </header>

        <div className="p-12 space-y-12 flex-1">
          {/* Controls & Date Picker */}
          <section className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-white rounded-2xl shadow-sm border border-gray-50 flex items-center gap-4">
                <Calendar className="w-5 h-5 text-[#0b61a1]" />
                <span className="text-[10px] font-black uppercase tracking-widest text-[#022448]">Jan - Jun 2024</span>
              </div>
              <button className="p-4 bg-white rounded-2xl shadow-sm border border-gray-100 hover:border-[#022448]/20 transition-all">
                <Filter className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div className="flex gap-4">
              <span className="px-6 py-3 bg-[#e8f1ff] text-[#0b61a1] rounded-xl text-[10px] font-black uppercase tracking-widest">Monthly View</span>
              <span className="px-6 py-3 bg-white text-gray-300 rounded-xl text-[10px] font-black uppercase tracking-widest border border-gray-50 cursor-pointer hover:bg-gray-50 transition-all">Quarterly</span>
            </div>
          </section>

          {/* Primary High-Level Metrics */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { label: "Active Users", value: stats?.totalUsers?.toString() || "0", growth: "+14.2%", isUp: true, icon: Users, color: "bg-blue-500" },
              { label: "Total Alumni", value: stats?.totalAlumni?.toString() || "0", growth: "+8.1%", isUp: true, icon: GraduationCap, color: "bg-indigo-500" },
              { label: "Total Students", value: stats?.totalStudents?.toString() || "0", growth: "+5.3%", isUp: true, icon: Users, color: "bg-purple-500" },
              { label: "Pending Verifications", value: stats?.pendingVerifications?.toString() || "0", growth: "-12.0%", isUp: false, icon: Clock, color: "bg-amber-500" }
            ].map((stat, i) => (
              <div key={i} className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-50 group hover:shadow-xl transition-all relative overflow-hidden">
                <div className={`absolute top-0 right-0 w-32 h-32 ${stat.color} opacity-[0.03] rounded-full -translate-y-16 translate-x-16`}></div>
                <div className="flex justify-between items-start mb-8">
                  <div className={`w-14 h-14 rounded-2xl ${stat.color} bg-opacity-10 flex items-center justify-center`}>
                    <stat.icon className={`w-7 h-7 ${stat.color.replace('bg-', 'text-')}`} />
                  </div>
                  <div className={`flex items-center gap-1 ${stat.isUp ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {stat.isUp ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                    <span className="text-xs font-black tracking-tight">{stat.growth}</span>
                  </div>
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">{stat.label}</p>
                <h3 className="text-4xl font-black text-[#022448]">{stat.value}</h3>
              </div>
            ))}
          </section>

          {/* Main Analytics Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* User Growth Chart */}
            <div className="lg:col-span-8 space-y-12">
              <div className="bg-white p-12 rounded-[3.5rem] shadow-sm border border-gray-50">
                <div className="flex items-center justify-between mb-16">
                  <div>
                    <h2 className="text-2xl font-black text-[#022448] tracking-tight">Platform Growth</h2>
                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mt-1">Monthly registration trends</p>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-[#022448]"></div>
                      <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">Alumni</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-[#0b61a1]"></div>
                      <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">Students</span>
                    </div>
                  </div>
                </div>

                <div className="relative h-96 flex items-end justify-between gap-4">
                  {/* Fake Grid Lines */}
                  <div className="absolute inset-0 flex flex-col justify-between">
                    {[1,2,3,4,5].map(i => <div key={i} className="w-full h-px bg-gray-50"></div>)}
                  </div>
                  
                  {/* Multi-Bar Chart Representation */}
                  {[
                    { month: "Jan", a: 45, s: 60 },
                    { month: "Feb", a: 55, s: 75 },
                    { month: "Mar", a: 40, s: 85 },
                    { month: "Apr", a: 85, s: 95 },
                    { month: "May", a: 70, s: 80 },
                    { month: "Jun", a: 95, s: 110 }
                  ].map((data, i) => (
                    <div key={i} className="relative z-10 flex flex-col items-center flex-1 group">
                      <div className="flex items-end gap-2 w-full px-2">
                        <div 
                          className="flex-1 bg-[#022448] rounded-t-xl transition-all duration-700 group-hover:brightness-125" 
                          style={{ height: `${data.a}%` }}
                        ></div>
                        <div 
                          className="flex-1 bg-[#0b61a1] rounded-t-xl transition-all duration-700 group-hover:brightness-125" 
                          style={{ height: `${data.s}%` }}
                        ></div>
                      </div>
                      <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-6">{data.month}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mentorship Impact */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="bg-white p-10 rounded-[3rem] border border-gray-50 shadow-sm">
                  <div className="flex items-center justify-between mb-10">
                    <h3 className="text-xl font-black text-[#022448] tracking-tight">Top Industries</h3>
                    <Globe className="w-5 h-5 text-gray-200" />
                  </div>
                  <div className="space-y-6">
                    {[
                      { name: "Artificial Intelligence", val: 34, color: "bg-blue-500" },
                      { name: "Financial Services", val: 28, color: "bg-indigo-500" },
                      { name: "Healthcare Tech", val: 22, color: "bg-emerald-500" },
                      { name: "Digital Marketing", val: 16, color: "bg-amber-400" }
                    ].map((industry, i) => (
                      <div key={i} className="space-y-2">
                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                          <span className="text-[#022448]">{industry.name}</span>
                          <span className="text-gray-400">{industry.val}%</span>
                        </div>
                        <div className="h-3 bg-[#f8f9ff] rounded-full overflow-hidden">
                          <div className={`h-full ${industry.color} rounded-full`} style={{ width: `${industry.val}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-[#022448] p-10 rounded-[3rem] shadow-2xl shadow-[#022448]/20 text-white relative overflow-hidden group">
                  <TrendingUp className="absolute bottom-[-20%] right-[-10%] w-64 h-64 text-white/5 rotate-[-15deg] group-hover:rotate-0 transition-transform duration-1000" />
                  <div className="relative z-10">
                    <h3 className="text-xl font-black tracking-tight mb-8">Verification Success</h3>
                    <div className="flex items-end gap-6 mb-10">
                      <span className="text-6xl font-black">99.2%</span>
                      <div className="flex items-center gap-1 text-emerald-400 pb-2">
                        <ArrowUpRight className="w-5 h-5" />
                        <span className="text-xs font-black">+0.4%</span>
                      </div>
                    </div>
                    <p className="text-sm text-white/60 leading-relaxed font-medium">
                      Network integrity is at an all-time high. Manual verification response time has decreased by 4.2 hours this month.
                    </p>
                    <button className="mt-10 w-full py-4 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">
                      View Quality Audit
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Sidebar: Quick Stats & Activity */}
            <div className="lg:col-span-4 space-y-12">
              <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-50">
                <h3 className="text-xl font-black text-[#022448] tracking-tight mb-10">Real-time Insights</h3>
                <div className="space-y-8">
                  {[
                    { label: "Avg. Mentorship Rating", value: "4.85", sub: "Based on 1.2k reviews", icon: CheckCircle2, color: "text-emerald-500" },
                    { label: "Total Jobs", value: stats?.totalJobs?.toString() || "0", sub: "Active job postings", icon: Briefcase, color: "text-blue-500" },
                    { label: "Total Connections", value: stats?.totalConnections?.toString() || "0", sub: "Active connections", icon: Globe, color: "text-indigo-500" },
                  ].map((insight, i) => (
                    <div key={i} className="flex gap-6">
                      <div className={`w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center shrink-0`}>
                        <insight.icon className={`w-6 h-6 ${insight.color}`} />
                      </div>
                      <div>
                        <p className="text-base font-black text-[#022448]">{insight.value}</p>
                        <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mt-0.5">{insight.label}</p>
                        <p className="text-[9px] font-medium text-gray-400 mt-2">{insight.sub}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-8">
                <h3 className="text-xl font-black text-[#022448] tracking-tight mb-10">Engagement Levels</h3>
                <div className="space-y-10 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gray-100">
                  {[
                    { batch: "Class of 2024", activity: "High", color: "bg-emerald-500" },
                    { batch: "Class of 2023", activity: "Medium", color: "bg-amber-500" },
                    { batch: "Class of 2022", activity: "High", color: "bg-emerald-500" },
                    { batch: "Class of 2021", activity: "Low", color: "bg-rose-500" },
                  ].map((item, i) => (
                    <div key={i} className="relative pl-10">
                      <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-white border-4 border-white shadow-sm flex items-center justify-center z-10">
                        <div className={`w-2.5 h-2.5 rounded-full ${item.color}`}></div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-black text-[#022448]">{item.batch}</span>
                        <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${item.color.replace('bg-', 'bg-opacity-10 ' + item.color.replace('bg-', 'text-'))}`}>
                          {item.activity} Activity
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-12 py-5 bg-[#f8f9ff] text-[#022448] rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest hover:bg-[#022448] hover:text-white transition-all shadow-sm">
                  Full Engagement Report
                </button>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </main>
    </div>
  );
}
