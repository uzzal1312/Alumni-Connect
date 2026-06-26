import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Bell, 
  MessageSquare,
  ChevronDown,
  GraduationCap
} from "lucide-react";
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

interface AlumniNavbarProps {
  activePage?: "dashboard" | "slots" | "bookings" | "referrals" | "jobs" | "network" | "none";
}

export default function AlumniNavbar({ activePage = "dashboard" }: AlumniNavbarProps) {
  const [isMentoringOn, setIsMentoringOn] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user, logout, API_BASE, fetchUserProfile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Initialize toggle state from user profile if available
    if (user?.profile?.is_mentor !== undefined) {
      setIsMentoringOn(user.profile.is_mentor);
    }
  }, [user]);

  const toggleMentoringMode = async () => {
    const newState = !isMentoringOn;
    setIsMentoringOn(newState);
    try {
      const response = await fetch(`${API_BASE}/users/${user?.id}/alumni-profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_mentor: newState })
      });
      if (response.ok) {
        await fetchUserProfile(user!.id);
      }
    } catch (error) {
      console.error("Error updating mentoring mode:", error);
      // Revert on error
      setIsMentoringOn(!newState);
    }
  };

  const getLinkClass = (page: string) => {
    return page === activePage 
      ? "text-[#022448] font-bold border-b-2 border-[#022448] py-5 transition-colors cursor-pointer"
      : "text-[#141B2B]/60 hover:text-[#022448] transition-colors cursor-pointer font-bold py-5";
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#F9F9FF]/80 backdrop-blur-xl h-16 px-10 flex justify-between items-center shadow-[0px_20px_40px_rgba(20,27,43,0.05)] border-b border-slate-200/20">
      <div className="flex items-center gap-12">
        <Link to="/" className="flex items-center gap-2">
          <GraduationCap className="text-[#022448] w-8 h-8" />
          <span className="text-2xl font-black tracking-tighter text-[#022448]">AlumniConnect</span>
        </Link>
        <div className="hidden lg:flex gap-10 items-center">
          <Link className={getLinkClass("dashboard")} to="/dashboard/alumni">Dashboard</Link>
          <Link className={getLinkClass("slots")} to="/dashboard/alumni/slots">Slots</Link>
          <Link className={getLinkClass("bookings")} to="/dashboard/alumni/bookings">Bookings</Link>
          <Link className={getLinkClass("referrals")} to="/dashboard/alumni/referrals">Referrals</Link>
          <Link className={getLinkClass("jobs")} to="/dashboard/alumni/jobs">Job Posts</Link>
          <Link className={getLinkClass("network")} to="/dashboard/alumni/network">My Network</Link>
        </div>
      </div>

      <div className="flex items-center gap-8">
        {/* Mentoring Toggle */}
        <div className="hidden sm:flex items-center bg-[#f1f3ff] px-5 py-2 rounded-full gap-4 border border-slate-100 shadow-inner">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#43474e]">Mentoring Mode</span>
          <button 
            onClick={toggleMentoringMode}
            className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${isMentoringOn ? 'bg-[#022448]' : 'bg-gray-300'}`}
          >
            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 shadow-sm ${isMentoringOn ? 'right-1' : 'left-1'}`}></div>
          </button>
          <span className={`text-[10px] font-black uppercase tracking-widest ${isMentoringOn ? 'text-[#022448]' : 'text-gray-400'}`}>
            {isMentoringOn ? 'ON' : 'OFF'}
          </span>
        </div>

        <div className="flex items-center gap-5 border-l border-slate-200/50 pl-8">
          <button className="p-2 hover:bg-slate-100 rounded-xl transition-all text-[#43474e] relative group">
            <Bell className="w-6 h-6 group-hover:scale-110 transition-transform" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-[#F9F9FF]"></span>
          </button>
          <button className="p-2 hover:bg-slate-100 rounded-xl transition-all text-[#43474e] group">
            <MessageSquare className="w-6 h-6 group-hover:scale-110 transition-transform" />
          </button>
          
          {/* Profile Dropdown */}
          <div className="relative ml-2">
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-11 h-11 rounded-xl overflow-hidden border-2 border-white cursor-pointer active:scale-95 transition-all shadow-md group"
            >
              <img 
                alt="User profile avatar" 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform" 
                src={getMediaUrl(user?.profile_picture, API_BASE) || getDefaultAvatar(user?.full_name || 'User')} 
              />
            </button>

            {isDropdownOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)}></div>
                <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-gray-50 py-3 z-50 animate-in fade-in zoom-in-95 duration-200">
                  <div className="px-5 py-3 border-b border-gray-50 mb-2">
                    <p className="text-sm font-black text-[#022448]">{user?.full_name || 'User'}</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Senior Mentor</p>
                  </div>
                  <Link to="/dashboard/alumni/profile" className="flex items-center gap-3 px-5 py-3 text-sm text-gray-600 hover:bg-slate-50 transition-colors font-bold uppercase tracking-widest text-[10px]">
                    My Profile
                  </Link>
                  <div className="h-px bg-gray-50 my-2 mx-4"></div>
                  <button 
                    onClick={() => {
                      setIsDropdownOpen(false);
                      logout(navigate);
                    }} 
                    className="w-full text-left flex items-center gap-3 px-5 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors font-bold uppercase tracking-widest text-[10px]"
                  >
                    Logout Session
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
