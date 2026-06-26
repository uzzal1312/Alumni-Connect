import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Mail, 
  MapPin, 
  Code, 
  Calendar, 
  Linkedin, 
  Github, 
  Globe, 
  BookOpen,
  ArrowRight,
  Trophy,
  GraduationCap,
  FileText
} from "lucide-react";
import StudentNavbar from "../components/StudentNavbar";
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

export default function StudentProfilePage() {
  const { user, API_BASE, fetchUserProfile } = useAuth();
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [upcomingBookings, setUpcomingBookings] = useState<any[]>([]);

  const fetchData = async () => {
    if (!user?.id) return;
    try {
      const userProfile = await fetchUserProfile(user.id);
      console.log("Fetched user profile for student page:", userProfile);
      console.log("Student profile details:", userProfile?.profile);
      console.log("GitHub URL from profile:", userProfile?.profile?.github_url);
      setProfile(userProfile);
      
      // Fetch bookings for stats
      const bookingsRes = await fetch(`${API_BASE}/bookings/student/${user.id}`);
      const bookingsData = bookingsRes.ok ? await bookingsRes.json() : { bookings: [] };
      setUpcomingBookings(bookingsData.bookings);
    } catch (error) {
      console.error("Failed to load profile:", error);
    } finally {
      setLoading(false);
    }
  };

  // Skills and career interests are already arrays from backend
  const skills = profile?.profile?.skills || [];
  const careerInterests = profile?.profile?.career_interests || [];

  useEffect(() => {
    fetchData();
  }, [user?.id, fetchUserProfile]);

  if (loading) {
    return (
      <div className="bg-[#f8fafc] text-[#1e293b] min-h-screen font-sans antialiased flex items-center justify-center">
        <div className="text-gray-500 text-lg">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="bg-[#f8fafc] text-[#1e293b] min-h-screen font-sans antialiased">
      <StudentNavbar activePage="none" />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Profile Header */}
        <section className="bg-white rounded-3xl p-8 mb-8 border border-gray-100 shadow-sm flex flex-col md:flex-row items-center md:items-start justify-between">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
            {/* Profile Image Container */}
            <div className="w-32 h-32 rounded-2xl bg-[#eff6ff] overflow-hidden border-4 border-white shadow-sm flex items-center justify-center">
              <img 
                alt={user?.full_name} 
                className="w-full h-full object-cover" 
                src={getMediaUrl(user?.profile_picture, API_BASE) || getDefaultAvatar(user?.full_name || "User")} 
              />
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-4xl font-bold text-[#1e293b] mb-3">{user?.full_name}</h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-6 text-[#64748b] text-sm">
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span>{user?.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span>{profile?.profile?.university || "University not specified"}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Code className="w-4 h-4" />
                  <span>{profile?.profile?.department || "Department not specified"}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>{profile?.profile?.current_year || "Year not specified"}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8 md:mt-0 flex space-x-3">
            <Link 
              to="/dashboard/my-network"
              className="px-6 py-2.5 border border-gray-200 rounded-lg text-sm font-semibold text-[#1e293b] bg-white hover:bg-gray-50 transition flex items-center justify-center"
            >
              My Network
            </Link>
            <Link 
              to="/dashboard/edit-profile"
              className="px-6 py-2.5 bg-[#1e293b] text-white rounded-lg text-sm font-semibold hover:bg-slate-800 transition shadow-lg shadow-[#1e293b]/20"
            >
              Edit Profile
            </Link>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-8">
            {/* About Me */}
            <section className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
              <h2 className="text-xl font-bold text-[#1e293b] mb-6">About Me</h2>
              <div className="bg-gray-50/50 rounded-2xl p-6 border border-gray-50">
                <p className="text-[#64748b] leading-relaxed">
                  {profile?.profile?.bio || "No bio yet. Update your profile to add a bio!"}
                </p>
              </div>
            </section>

            {/* Technical Skills */}
            <section>
              <h2 className="text-xl font-bold text-[#1e293b] mb-6">Technical Skills</h2>
              <div className="flex flex-wrap gap-3">
                {skills.length > 0 ? (
                  skills.map((skill: string, index: number) => (
                    <span key={index} className="px-4 py-2 bg-[#1e293b] text-white rounded-full text-xs font-medium">{skill}</span>
                  ))
                ) : (
                  <p className="text-gray-400 text-sm">No skills added yet</p>
                )}
              </div>
            </section>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-6">
              <div className="bg-[#eff6ff]/40 rounded-2xl p-6 text-center border border-[#eff6ff]">
                <p className="text-[10px] uppercase tracking-widest text-[#64748b] font-bold mb-1">Sessions</p>
                <p className="text-3xl font-black text-[#1e293b]">{upcomingBookings.length}</p>
              </div>
              <div className="bg-[#eff6ff]/40 rounded-2xl p-6 text-center border border-[#eff6ff]">
                <p className="text-[10px] uppercase tracking-widest text-[#64748b] font-bold mb-1">Referrals</p>
                <p className="text-3xl font-black text-[#1e293b]">0</p>
              </div>
              <div className="bg-[#eff6ff]/40 rounded-2xl p-6 text-center border border-[#eff6ff]">
                <p className="text-[10px] uppercase tracking-widest text-[#64748b] font-bold mb-1">Bookmarks</p>
                <p className="text-3xl font-black text-[#1e293b]">0</p>
              </div>
            </div>

            {/* Academic & Career Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Academic Standing */}
              <section className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                <h3 className="text-[10px] uppercase tracking-widest text-[#64748b] font-bold mb-6">Academic Standing</h3>
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <span className="text-[#64748b] text-sm">Current Year</span>
                    <span className="text-[#1e293b] font-bold">{profile?.profile?.current_year || "Not specified"}</span>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl relative overflow-hidden">
                    <p className="text-[10px] uppercase tracking-widest text-[#64748b] font-bold mb-1">Cumulative GPA</p>
                    <div className="flex items-baseline space-x-1">
                      <span className="text-3xl font-black text-[#1e293b]">{profile?.profile?.gpa || "N/A"}</span>
                      <span className="text-[#64748b] text-sm">/ 4.0</span>
                    </div>
                    <div className="absolute right-4 bottom-4 text-gray-200">
                      <GraduationCap className="w-10 h-10" />
                    </div>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-[#64748b] text-sm">Department</span>
                    <span className="text-[#1e293b] font-bold">{profile?.profile?.department || "Not specified"}</span>
                  </div>
                </div>
              </section>

              {/* Career Interests */}
              <section className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                <h3 className="text-[10px] uppercase tracking-widest text-[#64748b] font-bold mb-6">Career Interests</h3>
                <div className="flex flex-col space-y-3">
                  {careerInterests.length > 0 ? (
                    careerInterests.map((interest: string, index: number) => (
                      <span key={index} className="px-4 py-2 bg-[#eff6ff] text-[#1d4ed8] rounded-lg text-xs font-bold w-fit">{interest}</span>
                    ))
                  ) : (
                    <p className="text-gray-400 text-sm">No career interests added yet</p>
                  )}
                </div>
              </section>
            </div>
          </div>

          {/* Sidebar Content */}
          <aside className="lg:col-span-4 space-y-8">
            {/* Professional Links */}
            <section className="space-y-4">
              <h3 className="text-[10px] uppercase tracking-widest text-[#64748b] font-bold ml-1">Professional Links</h3>
              
              {/* Resume */}
              {profile?.profile?.resume_url && (
                <a className="group flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition" href={getMediaUrl(profile?.profile?.resume_url, API_BASE) || '#'} target="_blank" rel="noopener noreferrer">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-red-500">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#1e293b]">Resume</p>
                      <p className="text-[10px] text-[#64748b]">Download CV</p>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-[#1e293b] transition-colors" />
                </a>
              )}
              
              {/* LinkedIn */}
              {profile?.profile?.linkedin_url && (
                <a className="group flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition" href={profile?.profile?.linkedin_url} target="_blank" rel="noopener noreferrer">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-[#eff6ff] rounded-xl flex items-center justify-center text-[#1d4ed8]">
                      <Linkedin className="w-6 h-6 fill-current" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#1e293b]">LinkedIn</p>
                      <p className="text-[10px] text-[#64748b]">Connect professionally</p>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-[#1e293b] transition-colors" />
                </a>
              )}

              {/* GitHub */}
              {profile?.profile?.github_url && (
                <a className="group flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition" href={profile?.profile?.github_url} target="_blank" rel="noopener noreferrer">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-[#1e293b]">
                      <Github className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#1e293b]">GitHub</p>
                      <p className="text-[10px] text-[#64748b]">View repositories</p>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-[#1e293b] transition-colors" />
                </a>
              )}
              
              {/* Academic Research */}
              {profile?.profile?.academic_research_url && (
                <a className="group flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition" href={profile?.profile?.academic_research_url} target="_blank" rel="noopener noreferrer">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500">
                      <BookOpen className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#1e293b]">Research</p>
                      <p className="text-[10px] text-[#64748b]">View publications</p>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-[#1e293b] transition-colors" />
                </a>
              )}
              
              {/* Personal Website */}
              {profile?.profile?.personal_website_url && (
                <a className="group flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition" href={profile?.profile?.personal_website_url} target="_blank" rel="noopener noreferrer">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-500">
                      <Globe className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#1e293b]">Portfolio</p>
                      <p className="text-[10px] text-[#64748b]">Personal website</p>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-[#1e293b] transition-colors" />
                </a>
              )}
            </section>

            {/* Profile Strength */}
            <section className="bg-[#eff6ff]/20 rounded-3xl p-8 border border-[#eff6ff]/40">
              <h3 className="text-[10px] uppercase tracking-widest text-[#64748b] font-bold mb-6">Profile Strength</h3>
              <div className="flex justify-between items-end mb-2">
                <span className="text-[10px] font-bold text-[#1d4ed8] bg-[#eff6ff] px-2 py-0.5 rounded">EXPERT</span>
                <span className="text-xs font-bold text-[#1e293b]">85%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-6 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#1e293b] to-[#3b82f6] rounded-full" style={{ width: "85%" }}></div>
              </div>
              <p className="text-xs text-[#64748b] italic leading-relaxed">
                "Complete your internship history to reach All-Star status."
              </p>
            </section>

            {/* Portfolio Promo Card */}
            <section className="bg-[#dfe7f3] rounded-3xl p-8 border border-white relative overflow-hidden">
              <div className="relative z-10">
                <h4 className="text-lg font-bold text-[#1e293b] mb-4">Portfolio</h4>
                <p className="text-xs text-[#64748b] leading-relaxed mb-6">
                  Keep your portfolio/resume updated to get referred by Alumni
                </p>
                <a className="inline-flex items-center text-sm font-bold text-[#1e293b] hover:underline" href="#">
                  View
                  <ArrowRight className="ml-2 w-4 h-4" />
                </a>
              </div>
              <div className="absolute -right-12 -top-12 w-32 h-32 bg-white/20 rounded-full"></div>
            </section>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}
