import React, { useState, useEffect } from "react";
import { 
  Star, 
  ExternalLink, 
  Linkedin, 
  Github, 
  Globe, 
  Briefcase, 
  GraduationCap,
  Award,
  ChevronRight,
  ShieldCheck,
  Quote
} from "lucide-react";
import { Link } from "react-router-dom";
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

export default function AlumniOwnProfilePage() {
  const { user, API_BASE, fetchUserProfile } = useAuth();
  const [profile, setProfile] = useState<any | null>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!user) return;
      try {
        const userProfile = await fetchUserProfile(user.id);
        setProfile(userProfile);
        
        // Fetch bookings
        const bookingsRes = await fetch(`${API_BASE}/bookings/alumni/${user.id}`);
        const bookingsData = await bookingsRes.json();
        setBookings(bookingsData.bookings || []);
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [user, fetchUserProfile, API_BASE]);

  const completedSessions = bookings.filter(b => b.status === 'Completed').length;
  const rating = profile?.avgRating ? profile.avgRating.toFixed(1) : 'N/A';

  if (loading) {
    return (
      <div className="bg-[#f9f9ff] min-h-screen font-sans text-[#141b2b] antialiased flex items-center justify-center">
        <div className="text-gray-500 text-lg">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="bg-[#f9f9ff] min-h-screen font-sans text-[#141b2b] antialiased">
      <AlumniNavbar activePage="none" />

      <main className="max-w-[1600px] mx-auto pt-24 px-12 pb-20">
        {/* Profile Hero Header */}
        <section className="relative mb-12">
          {/* Cover Photo */}
          <div className="h-64 w-full rounded-[2.5rem] overflow-hidden bg-gradient-to-r from-[#022448]/10 to-[#1e3a5f]/20 relative">
            <img 
              className="w-full h-full object-cover opacity-30 grayscale" 
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1600" 
              alt="Cover" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#f9f9ff] via-transparent to-transparent"></div>
          </div>

          {/* Profile Identity Area */}
          <div className="flex flex-col md:flex-row items-end -mt-20 px-12 gap-10 relative z-10">
            <div className="relative">
              <img 
                className="w-48 h-48 rounded-[2rem] object-cover shadow-2xl border-[10px] border-white ring-1 ring-black/5" 
                src={getMediaUrl(user?.profile_picture, API_BASE) || getDefaultAvatar(user?.full_name || "User")} 
                alt={user?.full_name || "Profile"} 
              />
            </div>
            
            <div className="flex-1 pb-4">
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="text-[10px] font-black tracking-widest uppercase bg-[#d5e3ff] text-[#022448] px-4 py-1.5 rounded-full border border-[#022448]/5">
                  {profile?.profile?.current_job_title || "Alumni"}
                </span>
                <span className="text-[10px] font-black tracking-widest uppercase bg-white text-gray-400 px-4 py-1.5 rounded-full border border-gray-100 shadow-sm">
                  {profile?.profile?.graduation_year || "Class of 20XX"}
                </span>
              </div>
              <h1 className="text-5xl font-black tracking-tighter text-[#022448] mb-1">{user?.full_name || "Alumni"}</h1>
              <p className="text-xl text-gray-500 font-bold uppercase tracking-tight">
                {profile?.profile?.current_job_title || "Alumni"} @ 
                <span className="text-[#022448]"> {profile?.profile?.current_company || "Company"}</span>
              </p>
            </div>

            <div className="flex items-center gap-16 pb-6 border-l border-gray-200/50 pl-16">
              <div className="text-center">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-2">Rating</p>
                <div className="flex items-center justify-center gap-1.5">
                  <span className="text-3xl font-black text-[#022448]">{rating}</span>
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                </div>
              </div>
              <div className="text-center">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-2">Sessions</p>
                <p className="text-3xl font-black text-[#022448]">{completedSessions}</p>
              </div>
              <Link 
                to="/dashboard/alumni/profile/edit"
                className="bg-[#022448] text-white px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-[#022448]/20 hover:opacity-90 transition-all active:scale-95 ml-4 flex items-center justify-center"
              >
                Edit Profile
              </Link>
            </div>
          </div>
        </section>

        {/* Profile Content Grid */}
        <div className="grid grid-cols-12 gap-16">
          {/* Left Column: Bio & Career */}
          <div className="col-span-12 lg:col-span-8 space-y-16">
            {/* Professional Narrative */}
            <section>
              <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#0b61a1] mb-10 flex items-center gap-4">
                Professional Narrative
                <div className="h-px flex-1 bg-[#0b61a1]/10"></div>
              </h2>
              <div className="relative bg-[#f1f3ff] p-12 rounded-[2.5rem] border border-[#022448]/5">
                <Quote className="absolute top-8 left-8 w-16 h-16 text-[#022448]/5 -scale-x-100" />
                <p className="text-xl text-gray-600 leading-relaxed font-medium italic relative z-10">
                  {profile?.profile?.bio || "No bio yet. Update your profile to add a bio!"}
                </p>
              </div>
            </section>

            {/* Career Trajectory */}
            <section>
              <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#0b61a1] mb-12 flex items-center gap-4">
                Career Trajectory
                <div className="h-px flex-1 bg-[#0b61a1]/10"></div>
              </h2>
              <div className="space-y-12">
                {profile?.workHistory && profile.workHistory.length > 0 ? (
                  profile.workHistory.map((job: any, idx: number) => {
                    const startYear = job.start_date ? new Date(job.start_date).getFullYear() : '';
                    const endYear = job.is_current ? 'Present' : (job.end_date ? new Date(job.end_date).getFullYear() : '');
                    const initial = job.company ? job.company[0].toUpperCase() : 'W';
                    const isFirst = idx === 0;
                    const isLast = idx === profile.workHistory.length - 1;
                    return (
                      <div key={job.id} className="flex gap-8 group">
                        <div className="flex flex-col items-center">
                          <div className={`w-14 h-14 rounded-2xl bg-[#022448] flex items-center justify-center font-black text-xl shadow-lg group-hover:scale-110 transition-transform text-white`}>
                            <span>{initial}</span>
                          </div>
                          {!isLast && <div className="w-0.5 flex-1 bg-gray-100 my-4"></div>}
                        </div>
                        <div className="flex-1 pb-4">
                          <p className="text-[10px] font-black text-[#0b61a1] tracking-widest mb-2 uppercase">
                            {startYear} — {endYear}
                          </p>
                          <h3 className="text-2xl font-black text-[#022448] mb-1">{job.job_title}</h3>
                          <p className="text-gray-400 font-bold mb-4">{job.company} • {job.location || ''}</p>
                          {job.description && (
                            <p className="text-gray-500 leading-relaxed font-medium max-w-2xl">{job.description}</p>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="bg-white p-12 rounded-[2rem] text-center border border-gray-100">
                    <p className="text-gray-500">No work history added yet</p>
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Right Column: Presence & Expertise */}
          <div className="col-span-12 lg:col-span-4 space-y-12">
            {/* Digital Presence */}
            <section>
              <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#0b61a1] mb-8">Digital Presence</h2>
              <div className="space-y-4">
                {[
                  { name: "Linkedin", sub: "Professional Network", icon: Linkedin, url: profile?.profile?.linkedin_url },
                  { name: "GitHub", sub: "Open Source", icon: Github, url: profile?.profile?.github_url },
                  { name: "Portfolio", sub: "Selected Works", icon: Globe, url: profile?.profile?.portfolio_url },
                  { name: "Research", sub: "Academic Publications", icon: GraduationCap, url: profile?.profile?.research_url }
                ].filter(site => site.url).map((site) => (
                  <a 
                    key={site.name} 
                    href={site.url} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-6 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-[#022448]/5 transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-[#f1f3ff] rounded-xl flex items-center justify-center text-[#022448]">
                        <site.icon className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-black text-[#022448] text-sm">{site.name}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">{site.sub}</p>
                      </div>
                    </div>
                    <ExternalLink className="w-5 h-5 text-gray-200 group-hover:text-[#022448] transition-colors" />
                  </a>
                ))}
              </div>
            </section>

            {/* Expertise */}
            <section>
              <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#0b61a1] mb-8">Expertise</h2>
              <div className="bg-[#f1f3ff] p-8 rounded-[2.5rem] border border-[#022448]/5">
                <div className="flex flex-wrap gap-3">
                  {profile?.profile?.expertise && profile.profile.expertise.length > 0 ? (
                    profile.profile.expertise.map((skill: string, idx: number) => (
                      <span key={idx} className="bg-white px-5 py-2.5 rounded-xl text-[11px] font-black text-[#022448] shadow-sm border border-gray-50">
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">No expertise added yet</p>
                  )}
                </div>
              </div>
            </section>

            {/* Referral Power */}
            <section className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-gray-50 relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center gap-3 text-[#0b61a1] mb-6">
                  <ShieldCheck className="w-6 h-6" />
                  <h2 className="text-sm font-black uppercase tracking-widest">Can refer at:</h2>
                </div>
                <div className="flex gap-3 mb-8 flex-wrap">
                  {profile?.profile?.referral_companies && profile.profile.referral_companies.length > 0 ? (
                    profile.profile.referral_companies.map((co: string, idx: number) => (
                      <span key={idx} className="bg-[#f1f3ff] px-4 py-2 rounded-lg text-[10px] font-black text-[#022448]">
                        {co}
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">No referral companies added yet</p>
                  )}
                </div>
                <button className="w-full py-4 rounded-2xl border-2 border-gray-100 text-[#022448] font-black text-[10px] uppercase tracking-[0.2em] hover:bg-gray-50 transition-all active:scale-95">
                  Referral Guidelines
                </button>
              </div>
              <div className="absolute -right-8 -bottom-8 opacity-[0.02]">
                <Briefcase className="w-48 h-48" />
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
