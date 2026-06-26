import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Search, 
  Send, 
  UserPlus, 
  MoreVertical, 
  Filter,
  ArrowUpDown,
  GraduationCap,
  CheckCircle2,
  XCircle
} from "lucide-react";
import StudentNavbar from "../components/StudentNavbar";
import Footer from "../components/Footer";
import { useAuth } from "../contexts/AuthContext";
import { getDefaultAvatar } from "../utils/avatars";

export default function MyNetworkPage() {
  const { user, API_BASE } = useAuth();
  const [connections, setConnections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all"); // all, accepted, pending

  // Fetch connections
  const fetchConnections = async () => {
    if (!user) return;
    try {
      const response = await fetch(`${API_BASE}/connections/user/${user.id}`);
      const data = await response.json();
      if (response.ok) {
        setConnections(data.connections);
      }
    } catch (error) {
      console.error("Failed to fetch connections:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, [API_BASE, user]);

  // Handle accept/reject
  const handleAccept = async (connectionId: number) => {
    try {
      const response = await fetch(`${API_BASE}/connections/${connectionId}/accept`, {
        method: "PUT"
      });
      if (response.ok) {
        fetchConnections();
      }
    } catch (error) {
      console.error("Failed to accept connection:", error);
    }
  };

  const handleReject = async (connectionId: number) => {
    try {
      const response = await fetch(`${API_BASE}/connections/${connectionId}/reject`, {
        method: "DELETE"
      });
      if (response.ok) {
        fetchConnections();
      }
    } catch (error) {
      console.error("Failed to reject connection:", error);
    }
  };

  // Filter connections
  const filteredConnections = connections.filter(conn => {
    const matchesSearch = conn.user.full_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = activeFilter === "all" || 
                         (activeFilter === "accepted" && conn.status === "Accepted") ||
                         (activeFilter === "pending" && conn.status === "Pending");
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="bg-[#f9f9ff] min-h-screen font-sans text-[#141b2b] antialiased">
      <StudentNavbar activePage="network" />

      <main className="max-w-7xl mx-auto pt-24 px-8 pb-12 min-h-screen">
        <header className="mb-12">
          <h1 className="text-[4rem] font-black text-[#022448] tracking-tighter leading-none -ml-1 mb-4">My Network</h1>
          <p className="text-gray-500 text-lg font-medium">Manage and connect with your professional relationships.</p>
        </header>

        {/* Search and Filter Bar */}
        <section className="mb-12 flex flex-col lg:flex-row gap-6 items-center justify-between">
          <div className="relative w-full lg:max-w-xl">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              className="w-full pl-14 pr-6 py-5 rounded-3xl bg-white border-none shadow-sm focus:ring-4 focus:ring-[#022448]/5 transition-all text-sm font-bold placeholder:text-gray-300" 
              placeholder="Search your network by name, company or role..." 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-4 w-full lg:w-auto">
            <label className="text-[10px] uppercase tracking-[0.2em] font-black text-gray-400 whitespace-nowrap">Filter by</label>
            <div className="relative group flex gap-2">
              <button 
                onClick={() => setActiveFilter("all")}
                className={`px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${activeFilter === "all" ? "bg-[#022448] text-white" : "bg-white text-gray-500 hover:bg-gray-50"}`}
              >
                All
              </button>
              <button 
                onClick={() => setActiveFilter("accepted")}
                className={`px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${activeFilter === "accepted" ? "bg-[#022448] text-white" : "bg-white text-gray-500 hover:bg-gray-50"}`}
              >
                Accepted
              </button>
              <button 
                onClick={() => setActiveFilter("pending")}
                className={`px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${activeFilter === "pending" ? "bg-[#022448] text-white" : "bg-white text-gray-500 hover:bg-gray-50"}`}
              >
                Pending
              </button>
            </div>
            <button className="p-4 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all text-gray-400 hover:text-[#022448]">
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </section>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="text-gray-500 text-lg">Loading network...</div>
          </div>
        )}

        {/* Connections Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
            {filteredConnections.map((conn) => (
              <div key={conn.id} className={`group relative bg-white rounded-[2.5rem] p-10 flex flex-col h-full shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 border border-transparent hover:border-[#022448]/5`}>
                <div className="flex items-start gap-6 mb-6">
                  <div className="relative">
                    <div className={`w-20 h-20 rounded-[1.8rem] overflow-hidden shadow-inner ring-4 ring-[#f1f3ff] transition-transform duration-500 ${conn.user.role === "alumni" ? '-mt-10 shadow-2xl group-hover:scale-105' : 'group-hover:scale-105'}`}>
                      <img 
                        src={conn.user.profile_picture || getDefaultAvatar(conn.user.full_name)} 
                        className="w-full h-full object-cover" 
                        alt={conn.user.full_name} 
                      />
                    </div>
                  </div>
                  <div className={conn.user.role === "alumni" ? 'pt-2' : ''}>
                    {conn.user.role === "alumni" && (
                      <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#0b61a1] mb-1 block">Alumni</span>
                    )}
                    <Link 
                      to={`/dashboard/alumni-profile/${conn.user.id}`} 
                      className="text-xl font-black text-[#022448] tracking-tight hover:text-[#0b61a1] transition-colors"
                    >
                      {conn.user.full_name}
                    </Link>
                    <p className="text-[11px] font-black text-[#0b61a1] uppercase tracking-widest mt-1">
                      {conn.status === "Pending" ? "Connection Request" : "Connected"}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-10 mt-auto">
                  <span className="px-4 py-2 bg-[#f1f3ff] text-[#022448] text-[9px] font-black uppercase tracking-widest rounded-full">
                    {conn.user.role}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {conn.status === "Pending" && conn.initiated_by !== user?.id ? (
                    <>
                      <button 
                        onClick={() => handleAccept(conn.id)}
                        className="flex items-center justify-center gap-2 px-6 py-4 bg-green-500 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-green-600 transition-all"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Accept
                      </button>
                      <button 
                        onClick={() => handleReject(conn.id)}
                        className="flex items-center justify-center gap-2 px-6 py-4 bg-red-100 text-red-600 font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-red-200 transition-all"
                      >
                        <XCircle className="w-4 h-4" />
                        Reject
                      </button>
                    </>
                  ) : conn.status === "Pending" ? (
                    <button className="col-span-2 px-6 py-4 bg-gray-100 text-gray-500 font-black text-[10px] uppercase tracking-widest rounded-2xl cursor-not-allowed">
                      Request Pending
                    </button>
                  ) : (
                    <>
                      <button className="flex items-center justify-center gap-3 px-6 py-4 text-[#022448] font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-[#f1f3ff] transition-all border-2 border-[#f1f3ff] group/btn">
                        <Send className="w-4 h-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                        Message
                      </button>
                      <Link 
                        to="/dashboard/alumni-network" 
                        className="bg-[#022448] text-white font-black text-[10px] uppercase tracking-widest py-4 rounded-2xl hover:opacity-90 transition-all shadow-xl shadow-[#022448]/20 active:scale-[0.98] flex items-center justify-center"
                      >
                        Book Session
                      </Link>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Load More */}
        {!loading && filteredConnections.length > 0 && (
          <div className="mt-24 flex flex-col items-center">
            <div className="w-20 h-1.5 bg-gray-100 rounded-full mb-8"></div>
            <button className="text-[#022448] font-black uppercase tracking-[0.2em] text-[10px] px-12 py-5 border-2 border-[#022448]/10 rounded-2xl hover:bg-[#022448] hover:text-white transition-all shadow-sm active:scale-95">
              Show more connections
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredConnections.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-8">
              <GraduationCap className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-[#022448] mb-2">No connections found</h3>
            <p className="text-gray-500">Start connecting with alumni to build your network!</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
