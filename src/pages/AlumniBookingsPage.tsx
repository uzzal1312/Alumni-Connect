import React, { useState, useEffect } from "react";
import { 
  Calendar, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  UserCheck, 
  Info,
  ChevronRight,
  UserPlus
} from "lucide-react";
import AlumniNavbar from "../components/AlumniNavbar";
import Footer from "../components/Footer";
import { useAuth } from "../contexts/AuthContext";
import { getDefaultAvatar } from "../utils/avatars";

// Helper to get full media URL
const getMediaUrl = (path: string | null | undefined, apiBase: string) => {
  if (!path) return null;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  // API_BASE is http://localhost:5000/api, so replace /api with '' to get http://localhost:5000
  const base = apiBase.replace('/api', '');
  return `${base}${path}`;
};

export default function AlumniBookingsPage() {
  const { user, API_BASE } = useAuth();
  const [activeTab, setActiveTab] = useState("Pending");
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    if (!user) return;
    try {
      const response = await fetch(`${API_BASE}/bookings/alumni/${user.id}`);
      const data = await response.json();
      if (response.ok) {
        setBookings(data.bookings);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [user]);

  const handleUpdateStatus = async (bookingId: number, status: string) => {
    try {
      const response = await fetch(`${API_BASE}/bookings/${bookingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      if (response.ok) {
        fetchBookings();
      }
    } catch (error) {
      console.error('Error updating booking status:', error);
    }
  };

  const filteredBookings = bookings.filter(booking => {
    if (activeTab === "Pending") return booking.status === "Pending";
    if (activeTab === "Confirmed") return booking.status === "Upcoming";
    if (activeTab === "Declined") return booking.status === "Rejected";
    if (activeTab === "Past") return booking.status === "Completed" || new Date(booking.date) < new Date();
    return true;
  });

  // Group bookings by slot date/time
  const groupedBookings = filteredBookings.reduce((acc: any, booking: any) => {
    const key = `${booking.date}-${booking.start_time}-${booking.end_time}`;
    if (!acc[key]) {
      acc[key] = {
        id: booking.slot_id,
        title: booking.slot_title || "Mentorship Session",
        date: booking.date,
        time: `${booking.start_time} — ${booking.end_time}`,
        count: 0,
        students: []
      };
    }
    acc[key].count += 1;
    acc[key].students.push(booking);
    return acc;
  }, {});

  const groupEntries = Object.entries(groupedBookings);

  if (loading) {
    return (
      <div className="bg-[#f9f9ff] min-h-screen font-sans text-[#141b2b] antialiased flex items-center justify-center">
        <div className="text-gray-500 text-lg">Loading bookings...</div>
      </div>
    );
  }

  return (
    <div className="bg-[#f9f9ff] min-h-screen font-sans text-[#141b2b] antialiased">
      <AlumniNavbar activePage="bookings" />

      <main className="pt-24 pb-20 px-12 max-w-[1400px] mx-auto">
        <header className="mb-12">
          <h1 className="text-[3.5rem] font-black text-[#022448] tracking-tighter mb-4">Booking Inbox</h1>
          <p className="text-gray-500 text-lg font-medium">Manage your mentorship sessions and student connections.</p>
        </header>

        {/* Status Tabs */}
        <div className="flex items-center gap-10 mb-12 border-b border-gray-100">
          {[
            { label: "Pending", count: bookings.filter(b => b.status === "Pending").length },
            { label: "Confirmed", count: bookings.filter(b => b.status === "Upcoming").length },
            { label: "Declined", count: bookings.filter(b => b.status === "Rejected").length },
            { label: "Past", count: bookings.filter(b => b.status === "Completed" || new Date(b.date) < new Date()).length }
          ].map((tab) => (
            <button
              key={tab.label}
              onClick={() => setActiveTab(tab.label)}
              className={`pb-5 text-sm font-black uppercase tracking-[0.2em] transition-all relative ${
                activeTab === tab.label 
                ? "text-[#022448]" 
                : "text-gray-400 hover:text-[#022448]"
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className={`ml-2 px-2 py-0.5 rounded-lg text-[9px] font-black ${
                  activeTab === tab.label ? "bg-[#022448] text-white" : "bg-gray-100 text-gray-400"
                }`}>
                  {tab.count}
                </span>
              )}
              {activeTab === tab.label && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#022448] rounded-full"></div>
              )}
            </button>
          ))}
        </div>

        {/* Slot Groups */}
        <div className="space-y-12">
          {groupEntries.map(([key, slot]: [string, any], index) => (
            <SlotGroup 
              key={key} 
              slot={slot} 
              index={index} 
              onUpdateStatus={handleUpdateStatus}
              activeTab={activeTab}
              API_BASE={API_BASE}
            />
          ))}
          {groupEntries.length === 0 && (
            <div className="bg-white rounded-[2.5rem] p-12 border border-gray-100 text-center">
              <p className="text-gray-400 text-lg font-medium">No {activeTab.toLowerCase()} bookings.</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

function SlotGroup({ slot, index, onUpdateStatus, activeTab, API_BASE }: any) {
  const [expanded, setExpanded] = useState(index === 0);
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-gray-100 pb-6">
        <div 
          className="flex items-center gap-6 cursor-pointer group"
          onClick={() => setExpanded(!expanded)}
        >
          <div className="bg-[#f1f3ff] p-3 rounded-2xl group-hover:bg-[#022448] group-hover:text-white transition-all">
            {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>
          <div>
            <h2 className="text-2xl font-black text-[#022448] tracking-tight group-hover:translate-x-1 transition-transform">{slot.title}</h2>
            <div className="flex items-center gap-4 mt-1">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <Calendar className="w-3 h-3" /> {new Date(slot.date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })} • <Clock className="w-3 h-3 ml-1" /> {slot.time}
              </p>
              <span className="bg-[#d5e3ff] text-[#022448] text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-tighter">
                {slot.count} Requests
              </span>
            </div>
          </div>
        </div>
        {activeTab === "Pending" && (
          <button className="flex items-center gap-2 bg-[#f1f3ff] text-[#022448] px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#022448] hover:text-white transition-all shadow-sm active:scale-95">
            <UserPlus className="w-4 h-4" />
            Accept All
          </button>
        )}
      </div>

      {expanded && (
        <div className="grid grid-cols-1 gap-6 animate-in slide-in-from-top-4 duration-500">
          {slot.students.map((booking: any) => (
            <div key={booking.id} className="bg-white border border-gray-100 rounded-[2.5rem] p-8 hover:shadow-2xl hover:border-[#022448]/5 transition-all group overflow-hidden">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="relative">
                  <img 
                    src={getMediaUrl(booking.student_picture, API_BASE) || getDefaultAvatar(booking.student_name)} 
                    alt={booking.student_name} 
                    className="w-24 h-24 rounded-[1.5rem] object-cover shadow-lg border-4 border-white group-hover:scale-105 transition-transform" 
                  />
                  <div className="absolute -bottom-2 -right-2 bg-green-500 w-6 h-6 rounded-full border-4 border-white"></div>
                </div>
                <div className="flex-1 space-y-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-black text-[#022448] mb-1">{booking.student_name}</h3>
                      <div className="flex items-center gap-3">
                        <span className="text-[#0b61a1] bg-[#f1f3ff] px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">
                          {booking.university || "University"}
                        </span>
                        <span className="text-gray-400 text-xs font-bold">{booking.department || "Department"}</span>
                      </div>
                    </div>
                    {activeTab === "Pending" && (
                      <div className="flex gap-3">
                        <button 
                          onClick={() => onUpdateStatus(booking.id, "Upcoming")}
                          className="bg-[#022448] text-white text-[10px] font-black uppercase tracking-widest px-6 py-3 rounded-xl hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-[#022448]/20"
                        >
                          Confirm
                        </button>
                        <button 
                          onClick={() => onUpdateStatus(booking.id, "Rejected")}
                          className="bg-white text-red-500 border border-red-100 text-[10px] font-black uppercase tracking-widest px-6 py-3 rounded-xl hover:bg-red-50 transition-all"
                        >
                          Decline
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="bg-[#f9f9ff] p-6 rounded-[1.5rem] border border-gray-100/50 relative">
                    <div className="absolute top-4 left-4">
                      <Info className="w-3 h-3 text-[#0b61a1] opacity-30" />
                    </div>
                    <p className="text-sm text-gray-500 italic leading-relaxed font-medium pl-6">
                      "{booking.notes || "No notes provided."}"
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
