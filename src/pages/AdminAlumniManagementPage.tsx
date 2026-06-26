import React, { useState, useEffect } from "react";
import { 
  Search, 
  Bell, 
  Plus,
  Star,
  Eye,
  CalendarDays,
  Ban,
  TrendingUp,
  CheckCircle2,
} from "lucide-react";
import Footer from "../components/Footer";
import AdminSidebar from "../components/AdminSidebar";
import { useAuth } from "../contexts/AuthContext";

export default function AdminAlumniManagementPage() {
  const { API_BASE, token } = useAuth();
  const [alumniList, setAlumniList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchAlumni = async () => {
    try {
      const params = new URLSearchParams();
      params.set("role", "alumni");
      if (searchQuery) params.set("search", searchQuery);

      const response = await fetch(`${API_BASE}/admin/users?${params}`, {
        headers: {
          ...(token && { 'Authorization': `Bearer ${token}` })
        }
      });
      if (response.ok) {
        const data = await response.json();
        setAlumniList(data.users || []);
      }
    } catch (error) {
      console.error("Error fetching alumni:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlumni();
  }, [searchQuery]);

  if (loading) {
    return (
      <div className="bg-[#f9f9ff] min-h-screen font-sans text-[#141b2b] antialiased flex items-center justify-center">
        <div className="text-gray-500 text-lg">Loading alumni...</div>
      </div>
    );
  }

  return (
    <div className="bg-[#f9f9ff] min-h-screen font-sans text-[#141b2b] antialiased">
      <AdminSidebar activePage="alumni" />

      <main className="lg:ml-72 min-h-screen flex flex-col relative">
        {/* Top Header */}
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-50">
          <div className="flex justify-between items-center px-12 h-20">
            <div className="relative w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-5 h-5" />
              <input
                className="w-full pl-12 pr-6 py-3 bg-[#f1f3ff] border-none rounded-2xl text-sm font-bold text-[#022448] focus:ring-4 focus:ring-[#022448]/5 transition-all"
                placeholder="Quick search alumni..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-6">
              <button className="text-gray-400 hover:text-[#022448] transition-colors p-2 relative">
                <Bell className="w-6 h-6" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
              <div className="h-8 w-[2px] bg-gray-100 mx-2"></div>
              <div className="text-right">
                <p className="text-sm font-black text-[#022448]">Admin User</p>
                <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Super Admin</p>
              </div>
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA8Kz6ec_BdWNJOPlRKH85mST5UH4Bb7gi-D59O6mjwJKElLsnPFCVah-Wq9KgxuCIYbE3vAbq36cmu3yB0jOzsxQZKt9FbzajLdHk_SRSY1SqyyQrrgVjnrYolkuSdwYW7A3b-Ow-MVb4GxBToXTMQ33RKXI3sJTvMxP5gcY8cQEOH532--6lT2eM3LrBeWIyKWlWVOHv0Jrm4CRXG4Di8QHS0d-zC6euS_ddsNOMsk6SVXS93LJmr5JvAGWtoyHd5ClBah_VJuA"
                className="w-10 h-10 rounded-full object-cover ring-4 ring-[#f1f3ff]"
                alt="Admin"
              />
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-12 space-y-12 flex-1">
          {/* Hero Header */}
          <section>
            <h1 className="text-[4rem] font-black text-[#022448] tracking-tighter leading-tight mb-4 -ml-1">Alumni Management</h1>
            <p className="text-gray-500 font-medium max-w-2xl text-lg">
              Overview of all verified mentors and their platform activity. Track engagement, ratings, and active mentorship slots.
            </p>
          </section>

          {/* Stats Grid */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { label: "Total Alumni", value: alumniList.length.toString(), trend: "+12%", trendColor: "text-green-500" },
              { label: "Active Mentors", value: alumniList.filter((a) => a.is_verified).length.toString(), trend: "Live", trendColor: "text-[#0b61a1]" },
              { label: "Avg. Mentor Rating", value: "4.8", trend: "Star", trendColor: "text-[#0b61a1]", isRating: true },
              { label: "Referrals Provided", value: "1.2k", trend: "Total", trendColor: "text-gray-400" },
            ].map((stat, i) => (
              <div key={i} className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-50 group hover:shadow-xl transition-all relative overflow-hidden">
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#022448]/5 rounded-full group-hover:scale-125 transition-transform duration-500"></div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4">{stat.label}</p>
                <div className="flex items-end gap-3">
                  <h3 className="text-4xl font-black text-[#022448] leading-none">{stat.value}</h3>
                  <div className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-widest ${stat.trendColor} mb-1`}>
                    {stat.isRating ? <Star className="w-3 h-3 fill-current" /> : null}
                    {stat.trend}
                  </div>
                </div>
              </div>
            ))}
          </section>

          {/* Filter Bar */}
          <section className="p-8 bg-white rounded-[2.5rem] shadow-sm border border-gray-50 flex flex-wrap items-center gap-8">
            <div className="flex-1 min-w-[300px] relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 w-5 h-5" />
              <input
                className="w-full pl-14 pr-6 py-4 bg-[#f8f9ff] border-none rounded-2xl text-sm font-bold text-[#022448] focus:ring-4 focus:ring-[#022448]/5 transition-all outline-none"
                placeholder="Search by name, company or role..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-4">
              <select className="bg-[#f8f9ff] border-none rounded-2xl py-4 pl-6 pr-12 text-[10px] font-black uppercase tracking-widest text-[#022448] focus:ring-4 focus:ring-[#022448]/5 transition-all cursor-pointer appearance-none">
                <option>Industry: All</option>
                <option>Tech & SaaS</option>
                <option>Design</option>
                <option>Finance</option>
              </select>
              <select className="bg-[#f8f9ff] border-none rounded-2xl py-4 pl-6 pr-12 text-[10px] font-black uppercase tracking-widest text-[#022448] focus:ring-4 focus:ring-[#022448]/5 transition-all cursor-pointer appearance-none">
                <option>Year: All</option>
                <option>2024</option>
                <option>2023</option>
                <option>2022</option>
              </select>
              <button className="bg-[#022448] text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-[#022448]/20 hover:opacity-90 active:scale-[0.98] transition-all flex items-center gap-3">
                <Plus className="w-4 h-4" />
                Invite Alumni
              </button>
            </div>
          </section>

          {/* Table Container */}
          <div className="bg-white rounded-[3rem] shadow-sm border border-gray-50 overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#f8f9ff]">
                  <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Alumni</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Status</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Mentoring Status</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 text-center">Rating</th>
                  <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {alumniList.map((alumnus) => (
                  <tr key={alumnus.id} className="hover:bg-[#f8f9ff]/50 transition-colors group">
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-2xl overflow-hidden ring-4 ring-[#f1f3ff] group-hover:scale-105 transition-transform">
                          {alumnus.profile_picture ? (
                            <img src={alumnus.profile_picture} className="w-full h-full object-cover" alt={alumnus.full_name} />
                          ) : (
                            <div className="w-full h-full bg-[#022448] flex items-center justify-center text-white font-black text-xl">
                              {alumnus.full_name?.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-base font-black text-[#022448]">{alumnus.full_name}</p>
                          <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mt-1">
                            {alumnus.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-8">
                      <span className={`px-4 py-2 text-[9px] font-black uppercase tracking-widest rounded-full ${
                        alumnus.is_verified ? "bg-green-50 text-green-600" : "bg-amber-50 text-amber-600"
                      }`}>
                        {alumnus.is_verified ? "Verified" : "Pending"}
                      </span>
                    </td>
                    <td className="px-8 py-8">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-6 rounded-full p-1 transition-colors cursor-pointer ${
                          alumnus.is_verified ? "bg-[#0b61a1]" : "bg-gray-200"
                        }`}>
                          <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                            alumnus.is_verified ? "translate-x-6" : "translate-x-0"
                          }`}></div>
                        </div>
                        <span className={`text-[10px] font-black uppercase tracking-widest ${
                          alumnus.is_verified ? "text-[#0b61a1]" : "text-gray-300"
                        }`}>
                          {alumnus.is_verified ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-8 text-center">
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#f8f9ff] rounded-xl">
                        <span className="text-sm font-black text-[#022448]">4.8</span>
                        <Star className="w-3 h-3 text-[#0b61a1] fill-current" />
                      </div>
                    </td>
                    <td className="px-10 py-8 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#f8f9ff] text-[#022448] hover:bg-[#022448] hover:text-white transition-all shadow-sm">
                          <Eye className="w-5 h-5" />
                        </button>
                        <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#f8f9ff] text-[#022448] hover:bg-[#022448] hover:text-white transition-all shadow-sm">
                          <CalendarDays className="w-5 h-5" />
                        </button>
                        <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#f8f9ff] text-red-400 hover:bg-red-500 hover:text-white transition-all shadow-sm">
                          <Ban className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Pagination */}
            <div className="px-10 py-6 bg-[#f8f9ff]/50 border-t border-gray-50 flex justify-between items-center">
              <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">Showing 1-{alumniList.length} of {alumniList.length} alumni</p>
              <div className="flex gap-3">
                <button className="px-6 py-3 bg-white rounded-xl text-[10px] font-black text-[#022448] uppercase tracking-widest shadow-sm hover:shadow-md transition-all">Previous</button>
                <button className="px-6 py-3 bg-[#022448] text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-[#022448]/20">Next</button>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </main>
    </div>
  );
}
