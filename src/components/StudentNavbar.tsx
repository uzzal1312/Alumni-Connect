import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  GraduationCap, 
  Bell, 
  MessageSquare, 
  Search,
  User,
  LogOut,
  ChevronDown
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

interface StudentNavbarProps {
  activePage?: "dashboard" | "network" | "bookings" | "jobs" | "referrals" | "messages" | "none";
}

export default function StudentNavbar({ activePage = "dashboard" }: StudentNavbarProps) {
  const { user, logout, API_BASE } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const getLinkClass = (page: string) => {
    return page === activePage 
      ? "text-sm font-semibold text-primary border-b-2 border-primary py-5"
      : "text-sm font-medium text-gray-500 hover:text-primary transition-colors py-5";
  };

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="w-full px-6 flex justify-between items-center h-16">
        <div className="flex items-center gap-10">
          <Link to="/" className="flex items-center gap-2">
            <GraduationCap className="text-primary w-8 h-8" />
            <span className="text-xl font-bold tracking-tight text-primary">AlumniConnect</span>
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link className={getLinkClass("dashboard")} to="/dashboard/student">Dashboard</Link>
            <Link className={getLinkClass("network")} to="/dashboard/alumni-network">Alumni Network</Link>
            <Link className={getLinkClass("bookings")} to="/dashboard/my-bookings">My Bookings</Link>
            <Link className={getLinkClass("jobs")} to="/dashboard/jobs">Job Posts</Link>
            <Link className={getLinkClass("referrals")} to="/dashboard/my-referrals">My Referrals</Link>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 rounded-full hover:bg-slate-100 transition-colors relative">
            <Bell className="w-5 h-5 text-slate-600" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          <Link to="/dashboard/messages" className={`p-2 rounded-full transition-colors ${activePage === "messages" ? "bg-slate-100 text-[#022448]" : "hover:bg-slate-100 text-slate-600"}`}>
            <MessageSquare className="w-5 h-5" />
          </Link>
          <button className="p-2 text-gray-400 hover:text-primary transition-colors">
            <Search className="w-5 h-5" />
          </button>
          
          {/* Profile Dropdown */}
          <div className="relative ml-4">
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-3 p-1 rounded-full hover:bg-gray-50 transition-all active:scale-95 border-l border-gray-100 pl-4"
            >
              <span className="text-sm font-semibold text-gray-700 hidden sm:block">{user?.full_name || "User"}</span>
              <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-white shadow-sm bg-gray-200">
                <img 
                  alt={user?.full_name || "User"} 
                  className="w-full h-full object-cover" 
                  src={getMediaUrl(user?.profile_picture, API_BASE) || getDefaultAvatar(user?.full_name || "User")}
                />
              </div>
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isDropdownOpen && (
              <>
                {/* Backdrop to close dropdown */}
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setIsDropdownOpen(false)}
                ></div>
                
                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                  <Link 
                    to="/dashboard/student-profile" 
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-primary/5 hover:text-primary transition-colors font-medium"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <User className="w-4 h-4" />
                    Profile
                  </Link>
                  <div className="h-px bg-gray-100 my-1 mx-2"></div>
                  <button 
                    className="w-full text-left flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium"
                    onClick={() => {
                      logout(navigate);
                      setIsDropdownOpen(false);
                    }}
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
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
