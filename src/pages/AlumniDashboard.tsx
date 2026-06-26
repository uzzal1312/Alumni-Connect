import React, { useState, useEffect } from "react";
import { 
  CheckCircle2, 
  Calendar, 
  Clock, 
  Send, 
  PlusCircle, 
  UserRound, 
  FilePlus, 
  BarChart3,
  Star,
  FileText,
  Lock,
  Radio
} from "lucide-react";
import AlumniNavbar from "../components/AlumniNavbar";
import Footer from "../components/Footer";
import { useAuth } from "../contexts/AuthContext";
import { getDefaultAvatar } from "../utils/avatars";

interface Booking {
  id: number;
  student_name: string;
  university?: string;
  department?: string;
  date: string;
  start_time: string;
  end_time: string;
  notes?: string;
  status: string;
  student_id: any;
}

interface Slot {
  id: number;
  date: string;
  start_time: string;
  end_time: string;
  is_booked: boolean;
}

export default function AlumniDashboard() {
  const { user, token, API_BASE, fetchUserProfile } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (user?.id) {
        // Fetch bookings, slots, and profile
        const fetchBookings = fetch(`${API_BASE}/bookings/alumni/${user.id}`)
          .then(res => res.json())
          .then(data => setBookings(data.bookings || []));
        
        const fetchSlots = fetch(`${API_BASE}/slots/alumni/${user.id}`)
          .then(res => res.json())
          .then(data => setSlots(data.slots || []));

        const userProfile = await fetchUserProfile(user.id);
        setProfile(userProfile);

        Promise.all([fetchBookings, fetchSlots])
          .finally(() => setLoading(false));
      }
    };
    fetchData();
  }, [user?.id, API_BASE, fetchUserProfile]);

  // Calculate stats
  const pendingBookings = bookings.filter(b => b.status === 'Pending').length;
  const upcomingSlots = slots.filter(s => new Date(s.date) >= new Date());

  // Extract first name for welcome message
  const firstName = user?.full_name?.split(' ')[0] || 'there';
  const pendingReferrals = 0; // Placeholder

  return (
    <div className="bg-[#f9f9ff] min-h-screen font-sans text-[#141b2b] antialiased">
      <AlumniNavbar activePage="dashboard" />

      <main className="max-w-[1600px] mx-auto pt-24 px-12 pb-20">
        {/* Header Section */}
        <header className="mb-12">
          <h1 className="text-[2.5rem] font-extrabold tracking-tight text-[#022448] mb-2">Welcome back, {firstName}</h1>
          <p className="text-gray-500 font-medium italic">
            {pendingBookings > 0 
              ? `You have ${pendingBookings} new booking requests${pendingReferrals > 0 ? ` and ${pendingReferrals} pending referrals this week.` : ' this week.'}
            `
            : "You have no new booking requests this week."}
          </p>
        </header>

        {/* Stats Bento Grid */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          <div className="bg-[#f1f3ff] p-6 rounded-2xl flex flex-col justify-between transition-all hover:bg-[#e9edff] cursor-default border border-transparent hover:border-[#022448]/5">
            <div className="flex justify-between items-start mb-6">
              <div className="bg-[#d5e3ff] p-3 rounded-xl text-[#022448]">
                <Clock className="w-5 h-5" />
              </div>
            </div>
            <div>
              <h4 className="text-4xl font-black text-[#022448] mb-1">{pendingBookings}</h4>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Pending Bookings</p>
            </div>
          </div>

          <div className="bg-[#f1f3ff] p-6 rounded-2xl flex flex-col justify-between transition-all hover:bg-[#e9edff] cursor-default border border-transparent hover:border-[#022448]/5">
            <div className="flex justify-between items-start mb-6">
              <div className="bg-[#d1e4ff] p-3 rounded-xl text-[#0b61a1]">
                <Calendar className="w-5 h-5" />
              </div>
            </div>
            <div>
              <h4 className="text-4xl font-black text-[#022448] mb-1">{slots.length}</h4>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Slots Created</p>
            </div>
          </div>

          <div className="bg-[#f1f3ff] p-6 rounded-2xl flex flex-col justify-between transition-all hover:bg-[#e9edff] cursor-default border border-transparent hover:border-[#022448]/5">
            <div className="flex justify-between items-start mb-6">
              <div className="bg-[#ffddb2] p-3 rounded-xl text-[#341f00]">
                <PlusCircle className="w-5 h-5" />
              </div>
            </div>
            <div>
              <h4 className="text-4xl font-black text-[#022448] mb-1">{pendingReferrals}</h4>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Open Referrals</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#022448] to-[#1e3a5f] p-6 rounded-2xl flex flex-col justify-between text-white shadow-xl shadow-[#022448]/20">
            <div className="flex justify-between items-start mb-6">
              <div className="bg-white/10 p-3 rounded-xl">
                <Star className="w-5 h-5 fill-current" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#adc8f5]">Top 1%</span>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h4 className="text-4xl font-black">4.9</h4>
                <Star className="w-4 h-4 fill-current text-yellow-400" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Your Profile Rating</p>
            </div>
          </div>
        </section>

        {/* Main Workspace Layout */}
        <div className="grid grid-cols-12 gap-10">
          {/* Left Column: Bookings & Referrals */}
          <div className="col-span-12 lg:col-span-8 space-y-12">
            {/* New Booking Requests */}
            <section>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black tracking-tight text-[#022448]">New Booking Requests</h2>
              </div>
              <div className="space-y-6">
                {loading ? (
                  <p className="text-gray-500">Loading...</p>
                ) : pendingBookings === 0 ? (
                  <div className="bg-white p-12 rounded-[2rem] text-center">
                    <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No pending booking requests</p>
                  </div>
                ) : (
                  bookings
                    .filter(b => b.status === 'Pending')
                    .map((req) => (
                      <div key={req.id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex items-start gap-6 hover:shadow-xl transition-all">
                        <div className="w-16 h-16 rounded-2xl bg-[#f1f3ff] flex items-center justify-center shadow-md">
                          <img 
                            src={getDefaultAvatar(req.student_name)} 
                            alt={req.student_name} 
                            className="w-16 h-16 rounded-2xl object-cover" 
                          />
                        </div>
                        <div className="flex-grow">
                          <div className="flex justify-between items-center mb-2">
                            <h5 className="font-black text-[#022448] text-lg">{req.student_name}</h5>
                            <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 bg-[#f8faff] px-3 py-1 rounded-full border border-gray-100">
                              {req.university ? `${req.university} - ${req.department}` : ''}
                            </span>
                          </div>
                          {req.notes && (
                            <p className="text-sm text-gray-500 mb-6 leading-relaxed font-medium italic">"{req.notes}"</p>
                          )}
                          <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#0b61a1]">
                              <Calendar className="w-3.5 h-3.5" />
                              {new Date(req.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </div>
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#0b61a1]">
                              <Clock className="w-3.5 h-3.5" />
                              {req.start_time} - {req.end_time}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col gap-3">
                          <button className="bg-[#022448] text-white px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-[#022448]/20 active:scale-95 transition-all">Confirm</button>
                          <button className="bg-[#f8faff] text-gray-400 px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-50 hover:text-red-500 transition-all border border-gray-100">Decline</button>
                        </div>
                      </div>
                    ))
                )}
              </div>
            </section>

            {/* Referral Inbox */}
            <section>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black tracking-tight text-[#022448]">Referral Inbox</h2>
                <span className="bg-[#d5e3ff] text-[#022448] px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em]">Active Candidates</span>
              </div>
              <div className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden shadow-sm">
                <div className="p-12 text-center">
                  <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No referrals yet</p>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column: Actions & Slots */}
          <div className="col-span-12 lg:col-span-4 space-y-12">
            {/* Quick Actions */}
            <section>
              <h2 className="text-xl font-black tracking-tight text-[#022448] mb-8">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-5">
                {[
                  { icon: PlusCircle, label: "Create Slot" },
                  { icon: UserRound, label: "Edit Profile" },
                  { icon: FilePlus, label: "Post Job" },
                  { icon: BarChart3, label: "Analytics" }
                ].map((action, idx) => (
                  <button key={idx} className="bg-white p-6 rounded-[1.5rem] flex flex-col items-center justify-center text-center shadow-sm border border-gray-100 hover:bg-[#022448] hover:text-white group transition-all active:scale-95">
                    <action.icon className="w-7 h-7 mb-3 text-[#022448] group-hover:text-white transition-colors" />
                    <span className="text-[10px] font-black uppercase tracking-widest">{action.label}</span>
                  </button>
                ))}
              </div>
            </section>

            {/* Upcoming Slots */}
            <section className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-black tracking-tight text-[#022448]">Upcoming Slots</h2>
              </div>
              <div className="space-y-6">
                {loading ? (
                  <p className="text-gray-500">Loading...</p>
                ) : upcomingSlots.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No upcoming slots</p>
                  </div>
                ) : (
                  upcomingSlots.slice(0, 3).map((slot) => {
                    const date = new Date(slot.date);
                    return (
                      <div key={slot.id} className="flex items-center gap-5 group">
                        <div className="flex flex-col items-center justify-center w-14 h-16 bg-[#f1f3ff] rounded-[1.25rem] border border-gray-100 group-hover:bg-[#d5e3ff] transition-colors shadow-sm">
                          <span className="text-[9px] font-black uppercase text-gray-400 group-hover:text-[#022448]">{date.toLocaleDateString('en-US', { month: 'short' })}</span>
                          <span className="text-2xl font-black text-[#022448]">{date.getDate()}</span>
                        </div>
                        <div className="flex-grow">
                          <h6 className="text-sm font-black text-[#022448]">Mentoring Session</h6>
                          <p className="text-[11px] text-gray-400 font-bold mt-0.5">
                            {slot.start_time} - {slot.end_time}
                            {slot.is_booked ? " (Booked)" : " (Available)"}
                          </p>
                        </div>
                        {slot.is_booked && <Lock className="w-5 h-5 text-gray-200" />}
                        {!slot.is_booked && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                      </div>
                    );
                  })
                )}
              </div>
              <button className="w-full mt-10 bg-[#f8faff] text-[#022448] py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[#f1f3ff] transition-all border border-gray-100">Manage Schedule</button>
            </section>

            {/* Mentor Spotlight Card */}
            <section className="relative">
              <div className="bg-[#022448] text-white p-8 rounded-[2rem] relative overflow-hidden shadow-2xl shadow-[#022448]/20">
                <div className="relative z-10">
                  <span className="bg-white/10 text-white px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] mb-6 inline-block border border-white/10">Mentor Insights</span>
                  <h3 className="text-2xl font-black mb-4 leading-tight">Your impact is growing.</h3>
                  <p className="text-sm text-white/60 mb-8 font-medium leading-relaxed">3 mentees from your last cohort secured roles at Tier 1 firms this week.</p>
                  <button className="text-white border-b-2 border-white/20 text-[10px] font-black uppercase tracking-[0.3em] hover:border-white transition-all">Share achievement</button>
                </div>
                <div className="absolute -right-16 -bottom-16 opacity-5 rotate-12">
                  <BarChart3 className="w-64 h-64" />
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
