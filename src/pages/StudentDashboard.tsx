import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  GraduationCap, 
  Bell, 
  MessageSquare, 
  Search, 
  Plus, 
  Calendar, 
  FileText, 
  History, 
  Briefcase 
} from "lucide-react";
import Footer from "../components/Footer";
import StudentNavbar from "../components/StudentNavbar";
import { useAuth } from "../contexts/AuthContext";
import { getDefaultAvatar } from "../utils/avatars";

export default function StudentDashboard() {
  const { user, API_BASE } = useAuth();
  const [upcomingBookings, setUpcomingBookings] = useState<any[]>([]);
  const [connections, setConnections] = useState<any[]>([]);
  const [pendingReferrals, setPendingReferrals] = useState<any[]>([]);
  const [recommendedAlumni, setRecommendedAlumni] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    if (!user?.id) return;

    try {
      // Fetch bookings
      const bookingsRes = await fetch(`${API_BASE}/bookings/student/${user.id}`);
      const bookingsData = bookingsRes.ok ? await bookingsRes.json() : { bookings: [] };

      // Fetch connections
      const connectionsRes = await fetch(`${API_BASE}/connections/user/${user.id}`);
      const connectionsData = connectionsRes.ok ? await connectionsRes.json() : { connections: [] };

      // Fetch referrals
      const referralsRes = await fetch(`${API_BASE}/referrals/student/${user.id}`);
      const referralsData = referralsRes.ok ? await referralsRes.json() : { referralRequests: [] };

      // Fetch all alumni for recommendations
      const usersRes = await fetch(`${API_BASE}/users?role=alumni`);
      const usersData = usersRes.ok ? await usersRes.json() : { users: [] };

      // Process bookings
      const now = new Date();
      const upcoming = bookingsData.bookings.filter((b: any) => {
        const bookingDate = new Date(`${b.date}T${b.start_time}`);
        return bookingDate >= now && b.status === "Upcoming";
      }).slice(0, 5);

      // Process connections (accepted only)
      const acceptedConnections = connectionsData.connections.filter((c: any) => c.status === "Accepted");

      // Process pending referrals
      const pending = referralsData.referralRequests.filter((r: any) => r.status === "Pending");

      // Process recommendations: simple logic - first 3 verified alumni not connected yet
      const connectedIds = new Set(acceptedConnections.map((c: any) => c.user.id));
      const recommendations = usersData.users
        .filter((u: any) => u.is_verified && !connectedIds.has(u.id))
        .slice(0, 3);

      setUpcomingBookings(upcoming);
      setConnections(acceptedConnections);
      setPendingReferrals(pending);
      setRecommendedAlumni(recommendations);
    } catch (error) {
      console.error("Fetch dashboard data error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user?.id]);

  if (loading) {
    return (
      <div className="bg-surface min-h-screen font-body text-on-surface antialiased flex items-center justify-center">
        <div className="text-gray-500 text-lg">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="bg-surface min-h-screen font-body text-on-surface antialiased">
      <StudentNavbar activePage="dashboard" />

      <main className="w-full px-6 py-10">
        {/* Greeting & CTA */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-primary">Good morning, {user?.full_name || "User"} 👋</h1>
            <p className="text-gray-500 mt-1">You have {upcomingBookings.length} sessions scheduled. Ready to build your future?</p>
          </div>
          <Link to="/dashboard/alumni-network" className="bg-primary text-white px-6 py-2.5 rounded-lg font-semibold flex items-center gap-2 hover:opacity-90 transition-opacity">
            <Plus className="w-5 h-5" />
            Book New Session
          </Link>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Active Sessions */}
          <div className="bg-[#eef2ff] p-6 rounded-2xl relative">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 bg-white/80 rounded-lg flex items-center justify-center text-primary">
                <Calendar className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary/60">Active</span>
            </div>
            <div className="text-3xl font-bold text-primary mb-1">{upcomingBookings.length}</div>
            <div className="text-xs font-semibold text-primary/70">Upcoming Sessions</div>
          </div>
          {/* Pending Referrals */}
          <div className="bg-[#f0f4ff] p-6 rounded-2xl relative">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 bg-white/80 rounded-lg flex items-center justify-center text-primary">
                <FileText className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary/60">Review</span>
            </div>
            <div className="text-3xl font-bold text-primary mb-1">{pendingReferrals.length}</div>
            <div className="text-xs font-semibold text-primary/70">Pending Referrals</div>
          </div>
          {/* Connected Alumni */}
          <div className="bg-[#eef2ff] p-6 rounded-2xl relative">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 bg-white/80 rounded-lg flex items-center justify-center text-primary">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary/60">Lifetime</span>
            </div>
            <div className="text-3xl font-bold text-primary mb-1">{connections.length}</div>
            <div className="text-xs font-semibold text-primary/70">Connected Alumni</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-8 space-y-8">
            {/* Upcoming Sessions */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-primary">Upcoming Sessions</h2>
                <Link className="text-sm font-semibold text-primary hover:underline" to="/dashboard/my-bookings">View Calendar</Link>
              </div>
              <div className="space-y-4">
                {upcomingBookings.length === 0 ? (
                  <div className="bg-white p-10 rounded-2xl border border-gray-100 text-center text-gray-500">
                    No upcoming sessions. Book your first session!
                  </div>
                ) : (
                  upcomingBookings.map((booking) => (
                    <div key={booking.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-50 flex flex-wrap md:flex-nowrap items-center gap-6">
                      <img 
                        alt={booking.alumni_name} 
                        className="w-12 h-12 rounded-full object-cover" 
                        src={booking.alumni_picture || getDefaultAvatar(booking.alumni_name || "Alumni")}
                      />
                      <div className="flex-grow min-w-[200px]">
                        <h3 className="font-bold text-gray-900">{booking.alumni_name}</h3>
                        <p className="text-xs text-gray-500">{booking.alumni_role || "Alumni"}</p>
                      </div>
                      <div className="flex items-center gap-8 text-xs font-medium">
                        <div>
                          <span className="text-gray-400 block uppercase text-[9px] mb-0.5 tracking-wider">Date &amp; Time</span>
                          <span className="text-gray-700">
                            {new Date(booking.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                            {`, ${new Date(`2000-01-01T${booking.start_time}`).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-400 block uppercase text-[9px] mb-0.5 tracking-wider">Duration</span>
                          <span className="text-gray-700">45 Mins</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 ml-auto">
                        <MessageSquare className="text-gray-400 w-5 h-5" />
                        {booking.meeting_url ? (
                          <a 
                            href={booking.meeting_url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="bg-primary text-white px-5 py-2.5 rounded-lg text-sm font-bold shadow-md hover:opacity-90 transition-all"
                          >
                            Meeting Link
                          </a>
                        ) : (
                          <button className="bg-gray-300 text-gray-700 px-5 py-2.5 rounded-lg text-sm font-bold cursor-not-allowed">
                            No Link Yet
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>

            {/* Pending Referrals Section */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-primary">Pending Referrals</h2>
                <Link className="text-sm font-semibold text-primary hover:underline" to="/dashboard/my-referrals">Track All</Link>
              </div>
              <div className="space-y-3">
                {pendingReferrals.length === 0 ? (
                  <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-50 text-center text-gray-500">
                    No pending referrals.
                  </div>
                ) : (
                  pendingReferrals.map((referral) => (
                    <div key={referral.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-50 flex items-center gap-4">
                      <img 
                        alt={referral.alumni_name} 
                        className="w-10 h-10 rounded-full object-cover" 
                        src={referral.alumni_picture || getDefaultAvatar(referral.alumni_name || "Alumni")}
                      />
                      <div className="flex-grow">
                        <h4 className="font-bold text-sm text-gray-900">{referral.alumni_name}</h4>
                        <p className="text-[10px] text-gray-500">{referral.company} - {referral.position}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-4 space-y-8">
            {/* My Network Card */}
            <div className="bg-primary text-white p-8 rounded-2xl relative overflow-hidden h-[300px] flex flex-col justify-between">
              <div className="relative z-10">
                <h3 className="text-lg font-bold">My Network</h3>
                <p className="text-white/60 text-xs mt-1">View all the alumnis you are connected with</p>
              </div>
              <div className="relative z-10">
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-4xl font-extrabold">{connections.length} Alumni</span>
                  <span className="text-white/60 text-[10px] font-bold uppercase tracking-wider">Connected With</span>
                </div>
                <Link to="/dashboard/my-network" className="w-full bg-white text-primary py-3 rounded-lg font-bold text-sm hover:bg-gray-100 transition-colors flex items-center justify-center">
                  View All
                </Link>
              </div>
              {/* Subtle background decoration */}
              <GraduationCap className="absolute -bottom-4 -right-4 text-white/5 w-48 h-48 -rotate-12" />
            </div>

            {/* Recommended Alumni */}
            <section>
              <h2 className="text-lg font-bold text-primary mb-6">Recommended Alumni</h2>
              <div className="space-y-3">
                {recommendedAlumni.length === 0 ? (
                  <div className="bg-white p-5 rounded-2xl border border-gray-100 text-center text-gray-500">
                    No recommendations at this time.
                  </div>
                ) : (
                  recommendedAlumni.map((alumni) => (
                    <div key={alumni.id} className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center gap-4">
                      <img 
                        alt={alumni.full_name} 
                        className="w-10 h-10 rounded-full object-cover" 
                        src={alumni.profile_picture || getDefaultAvatar(alumni.full_name || "Alumni")}
                      />
                      <div className="flex-grow">
                        <h4 className="font-bold text-sm text-gray-900">{alumni.full_name}</h4>
                        <p className="text-[10px] text-gray-500">Alumni</p>
                        <Link to={`/dashboard/alumni-profile/${alumni.id}`} className="text-primary text-[10px] font-bold uppercase tracking-wider mt-1 hover:underline">View Profile</Link>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
