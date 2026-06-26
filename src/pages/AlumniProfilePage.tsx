import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { 
  CheckCircle,
  ArrowLeft, 
  Star, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  Globe, 
  Info,
  ExternalLink,
  ChevronRight,
  UserPlus,
  X,
  Send,
  FileText
} from "lucide-react";
import StudentNavbar from "../components/StudentNavbar";
import Footer from "../components/Footer";
import { useAuth } from "../contexts/AuthContext";
import { getDefaultAvatar } from "../utils/avatars";

interface User {
  id: number;
  full_name: string;
  email: string;
  role: string;
  profile_picture?: string;
  is_verified?: boolean;
  profile?: any;
  workHistory?: any[];
  reviews?: any[];
  avgRating?: number;
}

// Helper to get full media URL
const getMediaUrl = (path: string | null | undefined, apiBase: string) => {
  if (!path) return null;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  // API_BASE is http://localhost:5000/api, so replace /api with '' to get http://localhost:5000
  const base = apiBase.replace('/api', '');
  return `${base}${path}`;
};

export default function AlumniProfilePage() {
  const { userId } = useParams<{ userId: string }>();
  const { user: currentUser, API_BASE } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [connectReason, setConnectReason] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // Referral modal state
  const [isReferralModalOpen, setIsReferralModalOpen] = useState(false);
  const [referralForm, setReferralForm] = useState({
    company: "",
    position: "",
    message: ""
  });
  const [isReferralSubmitted, setIsReferralSubmitted] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  
  // Resources state
  const [resources, setResources] = useState<any[]>([]);

  useEffect(() => {
    const fetchAlumniProfile = async () => {
      if (!userId) return;
      try {
        // Fetch user profile
        const response = await fetch(`${API_BASE}/users/${userId}`);
        const data = await response.json();
        setUser(data.user);
        
        // Fetch alumni resources
        const resourcesResponse = await fetch(`${API_BASE}/resources/alumni/${userId}`);
        if (resourcesResponse.ok) {
          const resourcesData = await resourcesResponse.json();
          setResources(resourcesData.resources || []);
        }
      } catch (error) {
        console.error("Failed to fetch alumni profile:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchCurrentUserProfile = async () => {
      if (!currentUser) return;
      try {
        const response = await fetch(`${API_BASE}/users/${currentUser.id}`);
        const data = await response.json();
        setUserProfile(data.user);
      } catch (error) {
        console.error("Failed to fetch current user profile:", error);
      }
    };

    fetchAlumniProfile();
    fetchCurrentUserProfile();
  }, [userId, API_BASE, currentUser]);

  const handleConnectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !user) return;
    
    try {
      const response = await fetch(`${API_BASE}/connections/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderId: currentUser.id,
          receiverId: user.id,
          reason: connectReason
        })
      });
      
      if (response.ok) {
        setIsSubmitted(true);
        setTimeout(() => {
          setIsConnectModalOpen(false);
          setIsSubmitted(false);
          setConnectReason("");
        }, 2000);
      }
    } catch (error) {
      console.error("Failed to send connection request:", error);
    }
  };
  
  const handleSendReferral = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !user || !userProfile?.profile?.resume_url) return;
    try {
      const response = await fetch(`${API_BASE}/referrals`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_id: currentUser.id,
          alumni_id: user.id,
          company: referralForm.company,
          position: referralForm.position,
          message: referralForm.message,
          resume_url: userProfile.profile.resume_url
        })
      });
      if (response.ok) {
        setIsReferralSubmitted(true);
        setTimeout(() => {
          setIsReferralModalOpen(false);
          setIsReferralSubmitted(false);
          setReferralForm({ company: "", position: "", message: "" });
        }, 2000);
      }
    } catch (error) {
      console.error("Failed to send referral request:", error);
    }
  };


  return (
    <div className="bg-surface text-on-surface min-h-screen font-body antialiased">
      <StudentNavbar activePage="none" />
      
      <main className="w-full px-8 py-10">
        {/* Back Button */}
        <Link 
          to="/dashboard/alumni-network" 
          className="inline-flex items-center gap-2 text-primary font-bold text-sm mb-10 hover:gap-3 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Go back to Alumni Network
        </Link>

        {loading ? (
          <div className="text-center py-20 text-on-surface-variant">Loading...</div>
        ) : user ? (
          <>
            {/* Hero Section */}
            <section className="relative mb-20">
              <div className="h-64 w-full rounded-2xl overflow-hidden bg-surface-container-low relative">
                <img 
                  className="w-full h-full object-cover opacity-20 grayscale" 
                  src={getMediaUrl(user.profile_picture, API_BASE) || getDefaultAvatar(user.full_name)} 
                  alt="Banner" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent"></div>
              </div>
              <div className="flex flex-col md:flex-row items-end -mt-20 px-10 gap-8 relative z-10">
                <div className="relative">
                  <img 
                    className="w-48 h-48 rounded-2xl object-cover shadow-2xl border-8 border-surface-container-lowest" 
                    src={getMediaUrl(user.profile_picture, API_BASE) || getDefaultAvatar(user.full_name)} 
                    alt={user.full_name} 
                  />
                </div>
                <div className="flex-1 pb-4">
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="text-[0.7rem] font-bold tracking-[0.1em] uppercase bg-secondary-container/30 text-secondary px-3 py-1 rounded-full">
                      {user.profile?.industry || "Alumni"}
                    </span>
                    {user.profile?.graduation_year && (
                      <span className="text-[0.7rem] font-bold tracking-[0.1em] uppercase bg-surface-container-highest text-on-surface-variant px-3 py-1 rounded-full">
                        Class of {user.profile.graduation_year}
                      </span>
                    )}
                  </div>
                  <h1 className="text-5xl font-extrabold tracking-tighter text-on-surface mb-1">
                    {user.full_name}
                  </h1>
                  <p className="text-xl text-on-surface-variant font-medium">
                    {user.profile?.current_job_title} @ {user.profile?.current_company && <span className="text-primary">{user.profile.current_company}</span>}
                  </p>
                </div>
                <div className="pb-4 hidden lg:flex gap-12 border-l border-slate-200/50 pl-12">
                  <div>
                    <p className="text-[0.75rem] font-bold uppercase tracking-widest text-slate-400 mb-1">Rating</p>
                    <div className="flex items-center gap-1">
                      <span className="text-2xl font-black text-on-surface">
                        {user.avgRating ? user.avgRating.toFixed(1) : "N/A"}
                      </span>
                      {user.avgRating && <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />}
                    </div>
                  </div>
                  <div>
                    <p className="text-[0.75rem] font-bold uppercase tracking-widest text-slate-400 mb-1">Sessions</p>
                    <p className="text-2xl font-black text-on-surface">{user.reviews?.length || 0}</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Main Content Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
              {/* Left Column */}
          <div className="lg:col-span-2 space-y-20">
            {/* About Section */}
            <article>
              <h2 className="text-[0.75rem] font-bold uppercase tracking-[0.2em] text-secondary mb-6">About</h2>
              <p className="text-lg text-on-surface-variant leading-relaxed max-w-3xl">
                {user.profile?.bio || "This alumni hasn't added a bio yet."}
              </p>
            </article>
            
            {/* Expertise Section */}
            {user.profile?.expertise && user.profile.expertise.length > 0 && (
              <section>
                <h2 className="text-[0.75rem] font-bold uppercase tracking-[0.2em] text-secondary mb-6">Expertise</h2>
                <div className="flex flex-wrap gap-3">
                  {user.profile.expertise.map((skill: string, idx: number) => (
                    <span key={idx} className="px-5 py-2 rounded-xl bg-surface-container-low text-on-surface font-bold text-sm border border-slate-100">
                      {skill}
                    </span>
                  ))}
                </div>
              </section>
            )}
            
            {/* Links Section */}
            {(user.profile?.linkedin_url || user.profile?.github_url || user.profile?.portfolio_url || user.profile?.research_url) && (
              <section>
                <h2 className="text-[0.75rem] font-bold uppercase tracking-[0.2em] text-secondary mb-6">Links</h2>
                <div className="space-y-4">
                  {user.profile?.linkedin_url && (
                    <a href={user.profile.linkedin_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 rounded-xl bg-surface-container-low border border-slate-100 hover:bg-surface-container-high transition-all">
                      <Globe className="w-5 h-5 text-primary" />
                      <span className="font-bold text-on-surface">LinkedIn</span>
                      <ExternalLink className="w-4 h-4 text-on-surface-variant ml-auto" />
                    </a>
                  )}
                  {user.profile?.github_url && (
                    <a href={user.profile.github_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 rounded-xl bg-surface-container-low border border-slate-100 hover:bg-surface-container-high transition-all">
                      <Globe className="w-5 h-5 text-primary" />
                      <span className="font-bold text-on-surface">GitHub</span>
                      <ExternalLink className="w-4 h-4 text-on-surface-variant ml-auto" />
                    </a>
                  )}
                  {user.profile?.portfolio_url && (
                    <a href={user.profile.portfolio_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 rounded-xl bg-surface-container-low border border-slate-100 hover:bg-surface-container-high transition-all">
                      <Globe className="w-5 h-5 text-primary" />
                      <span className="font-bold text-on-surface">Portfolio</span>
                      <ExternalLink className="w-4 h-4 text-on-surface-variant ml-auto" />
                    </a>
                  )}
                  {user.profile?.research_url && (
                    <a href={user.profile.research_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 rounded-xl bg-surface-container-low border border-slate-100 hover:bg-surface-container-high transition-all">
                      <Globe className="w-5 h-5 text-primary" />
                      <span className="font-bold text-on-surface">Research</span>
                      <ExternalLink className="w-4 h-4 text-on-surface-variant ml-auto" />
                    </a>
                  )}
                </div>
              </section>
            )}

            {/* Work History */}
            {user.workHistory && user.workHistory.length > 0 && (
              <section>
                <h2 className="text-[0.75rem] font-bold uppercase tracking-[0.2em] text-secondary mb-10">Professional Journey</h2>
                <div className="space-y-12">
                  {user.workHistory.map((job, idx) => (
                    <div key={job.id} className="relative pl-12">
                      {idx !== user.workHistory.length - 1 && <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-surface-container-high"></div>}
                      <div className={`absolute left-[-5px] top-1.5 w-3 h-3 rounded-full ${job.is_current ? 'bg-primary' : 'bg-slate-300'} ring-4 ring-surface`}></div>
                      <h3 className="text-xl font-bold text-on-surface">{job.job_title}</h3>
                      <p className="text-secondary font-semibold">
                        {job.company} • {job.start_date}{job.is_current ? ' — Present' : job.end_date ? ` — ${job.end_date}` : ''}
                      </p>
                      {job.description && <p className="mt-3 text-on-surface-variant leading-relaxed">{job.description}</p>}
                    </div>
                  ))}
                </div>
              </section>
            )}
            
            {/* Resources Section */}
            {resources.length > 0 && (
              <section>
                <h2 className="text-[0.75rem] font-bold uppercase tracking-[0.2em] text-secondary mb-6">Resources</h2>
                <div className="space-y-4">
                  {resources.map((resource: any, idx: number) => (
                    <div key={resource.id} className="bg-surface-container-low p-6 rounded-xl border border-slate-100">
                      <h3 className="font-bold text-lg text-on-surface mb-2">{resource.title}</h3>
                      {resource.description && (
                        <p className="text-on-surface-variant text-sm mb-4 leading-relaxed">{resource.description}</p>
                      )}
                      {resource.file_url && (
                        <a href={getMediaUrl(resource.file_url, API_BASE)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-primary font-bold text-sm hover:underline">
                          <ExternalLink className="w-4 h-4" />
                          View Resource
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Feedback */}
            {user.reviews && user.reviews.length > 0 && (
              <section>
                <h2 className="text-[0.75rem] font-bold uppercase tracking-[0.2em] text-secondary mb-8">Mentee Feedback</h2>
                <div className="space-y-8">
                  {user.reviews.map((review, idx) => (
                    <div key={review.id} className="bg-surface-container-low p-8 rounded-2xl border-l-4 border-primary">
                      <div className="flex gap-1 mb-4 text-yellow-500">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : ''}`} />
                        ))}
                      </div>
                      <blockquote className="text-lg font-medium text-on-surface mb-4">"{review.comment}"</blockquote>
                      <div className="flex items-center gap-3">
                        <img 
                          src={getMediaUrl(review.student_picture, API_BASE) || getDefaultAvatar(review.student_name)} 
                          alt={review.student_name} 
                          className="w-8 h-8 rounded-full object-cover" 
                        />
                        <span className="text-sm font-bold text-on-surface-variant">{review.student_name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

              {/* Right Column */}
              <div className="lg:col-span-1">
                <aside className="sticky top-28 space-y-6">
                  {/* engagement Card */}
                  <div className="bg-surface-container-lowest p-8 rounded-2xl shadow-sm border border-slate-100">
                    <h3 className="text-sm font-black uppercase tracking-widest text-on-surface mb-6">Engagement</h3>
                    <div className="space-y-6">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-on-surface-variant flex items-center gap-2">
                          <ShieldCheck className="text-primary w-4 h-4" />
                          Verified
                        </span>
                        <CheckCircle className="text-secondary w-4 h-4 fill-secondary/10" />
                      </div>
                    </div>
                    <div className="mt-10 space-y-3">
                      <button
                        onClick={() => setIsConnectModalOpen(true)}
                        className="flex items-center justify-center gap-3 w-full bg-[#f1f3ff] text-[#022448] py-4 rounded-xl font-bold tracking-tight transition-all hover:bg-[#022448] hover:text-white active:scale-95 group"
                      >
                        <UserPlus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        Connect
                      </button>
                      {user.profile?.referral_companies && user.profile.referral_companies.length > 0 && (
                        <button
                          onClick={() => setIsReferralModalOpen(true)}
                          className="flex items-center justify-center gap-3 w-full bg-[#022448] text-white py-4 rounded-xl font-bold tracking-tight shadow-lg shadow-primary/20 transition-all hover:opacity-90 active:scale-95"
                        >
                          <UserPlus className="w-5 h-5" />
                          Ask for a Referral
                        </button>
                      )}
                      <Link
                        to="/dashboard/book-session"
                        className="block w-full bg-primary text-white py-4 rounded-xl font-bold tracking-tight shadow-lg shadow-primary/20 transition-all hover:opacity-90 active:scale-95 text-center"
                      >
                        Book a Session
                      </Link>
                    </div>
                  </div>

                  {/* Referral Network */}
                  {user.profile?.referral_companies && user.profile.referral_companies.length > 0 && (
                    <div className="bg-surface-container-lowest p-8 rounded-2xl shadow-sm border border-slate-100">
                      <h3 className="text-sm font-black uppercase tracking-widest text-on-surface mb-6">Referral Network</h3>
                      <p className="text-xs text-on-surface-variant mb-6 leading-relaxed">
                        This alumni can provide internal referrals for active roles at these organizations:
                      </p>
                      <ul className="space-y-4">
                        {user.profile.referral_companies.map((company: string, idx: number) => (
                          <li key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-surface-container-low/50">
                            <span className="font-bold text-on-surface">{company}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </aside>
              </div>
            </div>

            {/* Connect Request Modal */}
            {isConnectModalOpen && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 overflow-hidden">
                <div className="absolute inset-0 bg-primary/40 backdrop-blur-md animate-in fade-in duration-300" onClick={() => !isSubmitted && setIsConnectModalOpen(false)}></div>
                
                <div className="relative bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                  {isSubmitted ? (
                    <div className="p-12 text-center space-y-6">
                      <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto">
                        <CheckCircle className="w-10 h-10 text-emerald-500" />
                      </div>
                      <h3 className="text-2xl font-black text-primary">Request Sent!</h3>
                      <p className="text-gray-500 font-medium">
                        {user.full_name} will be notified of your request. You'll receive an update once they accept.
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between items-center px-10 py-8 border-b border-gray-50">
                        <div>
                          <h3 className="text-xl font-black text-primary">Connect with {user.full_name}</h3>
                          <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mt-1">Personalize your invitation</p>
                        </div>
                        <button 
                          onClick={() => setIsConnectModalOpen(false)}
                          className="p-3 hover:bg-gray-50 rounded-2xl transition-colors text-gray-400 hover:text-primary"
                        >
                          <X className="w-6 h-6" />
                        </button>
                      </div>

                      <form onSubmit={handleConnectSubmit} className="p-10 space-y-8">
                        <div className="space-y-4">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Why would you like to connect?</label>
                          <textarea 
                            required
                            value={connectReason}
                            onChange={(e) => setConnectReason(e.target.value)}
                            placeholder="e.g., I'm interested in learning more about your journey and seeking career advice..."
                            className="w-full h-40 p-6 bg-gray-50 border-none rounded-3xl text-sm font-medium focus:ring-4 focus:ring-primary/5 transition-all resize-none placeholder:text-gray-300"
                          ></textarea>
                        </div>

                        <div className="bg-blue-50 p-6 rounded-2xl flex gap-4">
                          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shrink-0">
                            <Info className="w-5 h-5 text-primary" />
                          </div>
                          <p className="text-[10px] font-bold text-primary/70 leading-relaxed uppercase tracking-widest">
                            Personalized notes increase connection acceptance rates by over 70% in the AlumniConnect network.
                          </p>
                        </div>

                        <button 
                          type="submit"
                          className="w-full bg-primary text-white py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-primary/20 hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                        >
                          <Send className="w-4 h-4" />
                          Send Connection Request
                        </button>
                      </form>
                    </>
                  )}
                </div>
              </div>
            )}
            
            {/* Referral Request Modal */}
            {isReferralModalOpen && user && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 overflow-hidden">
                <div className="absolute inset-0 bg-primary/40 backdrop-blur-md animate-in fade-in duration-300" onClick={() => !isReferralSubmitted && setIsReferralModalOpen(false)}></div>
                
                <div className="relative bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                  {isReferralSubmitted ? (
                    <div className="p-12 text-center space-y-6">
                      <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto">
                        <CheckCircle className="w-10 h-10 text-emerald-500" />
                      </div>
                      <h3 className="text-2xl font-black text-primary">Referral Request Sent!</h3>
                      <p className="text-gray-500 font-medium">
                        {user.full_name} will be notified of your referral request. You'll receive an update once they respond.
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between items-center px-10 py-8 border-b border-gray-50">
                        <div>
                          <h3 className="text-xl font-black text-primary">Ask {user.full_name} for a Referral</h3>
                          <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mt-1">Fill in the details below</p>
                        </div>
                        <button 
                          onClick={() => setIsReferralModalOpen(false)}
                          className="p-3 hover:bg-gray-50 rounded-2xl transition-colors text-gray-400 hover:text-primary"
                        >
                          <X className="w-6 h-6" />
                        </button>
                      </div>

                      <form onSubmit={handleSendReferral} className="p-10 space-y-6">
                        <div className="space-y-4">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Company</label>
                          <select
                            required
                            value={referralForm.company}
                            onChange={(e) => setReferralForm({ ...referralForm, company: e.target.value })}
                            className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-medium focus:ring-4 focus:ring-primary/5 transition-all"
                          >
                            <option value="">Select a company</option>
                            {user.profile?.referral_companies?.map((company: string, idx: number) => (
                              <option key={idx} value={company}>{company}</option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-4">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Position</label>
                          <input
                            type="text"
                            required
                            value={referralForm.position}
                            onChange={(e) => setReferralForm({ ...referralForm, position: e.target.value })}
                            placeholder="e.g., Software Engineer"
                            className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-medium focus:ring-4 focus:ring-primary/5 transition-all placeholder:text-gray-300"
                          />
                        </div>

                        <div className="space-y-4">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Message</label>
                          <textarea 
                            required
                            value={referralForm.message}
                            onChange={(e) => setReferralForm({ ...referralForm, message: e.target.value })}
                            placeholder="Explain why you're a great fit for this role..."
                            className="w-full h-40 p-6 bg-gray-50 border-none rounded-2xl text-sm font-medium focus:ring-4 focus:ring-primary/5 transition-all resize-none placeholder:text-gray-300"
                          ></textarea>
                        </div>

                        {/* Resume Section */}
                        <section>
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Attached Resume</h3>
                          </div>
                          <div className="flex items-center gap-5 p-6 bg-gray-50 rounded-2xl border border-gray-200">
                            <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center text-primary shadow-sm">
                              <FileText className="w-8 h-8" />
                            </div>
                            <div className="flex-grow">
                              {userProfile?.profile?.resume_url ? (
                                <a 
                                  href={getMediaUrl(userProfile.profile.resume_url, API_BASE)} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="hover:opacity-80 transition-opacity"
                                >
                                  <p className="font-bold text-[#022448] text-lg underline underline-offset-2">
                                    {userProfile?.profile?.resume_url?.split('/').pop() || 'Resume.pdf'}
                                  </p>
                                  <div className="flex items-center gap-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                                    <span>From your profile</span>
                                  </div>
                                </a>
                              ) : (
                                <p className="text-sm text-red-500 font-semibold">No resume uploaded. Please upload a resume in your profile first.</p>
                              )}
                            </div>
                          </div>
                        </section>

                        <div className="bg-blue-50 p-6 rounded-2xl flex gap-4">
                          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shrink-0">
                            <Info className="w-5 h-5 text-primary" />
                          </div>
                          <p className="text-[10px] font-bold text-primary/70 leading-relaxed uppercase tracking-widest">
                            Personalized messages increase referral acceptance rates by over 60% in the AlumniConnect network.
                          </p>
                        </div>

                        <button 
                          type="submit"
                          disabled={!userProfile?.profile?.resume_url}
                          className={`w-full py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl transition-all flex items-center justify-center gap-3 ${!userProfile?.profile?.resume_url ? 'bg-gray-300 cursor-not-allowed' : 'bg-primary text-white hover:opacity-90 active:scale-[0.98] shadow-primary/20'}`}
                        >
                          <Send className="w-4 h-4" />
                          Send Referral Request
                        </button>
                      </form>
                    </>
                  )}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20 text-on-surface-variant">Alumni not found.</div>
        )}
      </main>

      <Footer />
    </div>
  );
}