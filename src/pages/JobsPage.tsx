import React, { useState, useEffect } from "react";
import { 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  MapPin, 
  Briefcase, 
  Clock,
  ExternalLink,
  ChevronDown,
  X,
  CheckCircle2,
  Bookmark,
  Building2,
  Calendar,
  Zap,
  Play,
  FileText,
  Upload
} from "lucide-react";
import StudentNavbar from "../components/StudentNavbar";
import Footer from "../components/Footer";
import { useAuth } from "../contexts/AuthContext";
import { getDefaultAvatar } from "../utils/avatars";

// Helper to get full media URL
const getMediaUrl = (path: string | null | undefined, apiBase: string) => {
  if (!path) return null;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  const base = apiBase.replace('/api', '');
  return `${base}${path}`;
};

export default function JobsPage() {
  const { user, API_BASE } = useAuth();
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showReferralModal, setShowReferralModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [coverNote, setCoverNote] = useState("");
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [applications, setApplications] = useState<any[]>([]);
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [openPositionsOnly, setOpenPositionsOnly] = useState(true);
  const [selectedRoleType, setSelectedRoleType] = useState('All Types');

  // Helper to get application status for a job
  const getApplicationStatus = (jobId: number) => {
    const app = applications.find(a => a.job_id === jobId);
    return app?.status || null;
  };

  // Fetch jobs, user profile, and applications on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchPromises = [fetch(`${API_BASE}/jobs`)];
        let appsResponse: Response | null = null;
        let profileResponse: Response | null = null;
        
        if (user?.id) {
          profileResponse = await fetch(`${API_BASE}/users/${user.id}`);
          appsResponse = await fetch(`${API_BASE}/jobs/student/${user.id}/applications`);
        }
        
        const jobsResponse = await fetchPromises[0];
        const jobsData = await jobsResponse.json();
        
        if (jobsResponse.ok) {
          const transformedJobs = jobsData.jobs.map((job: any) => {
            const deadlineDate = new Date(job.deadline);
            const today = new Date();
            const daysLeft = Math.ceil((deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
            const remainingSpots = job.total_spots - (job.filled_spots || 0);
            
            return {
              id: job.id,
              company: job.company,
              companyLogo: job.company_logo?.charAt(0) || job.company.charAt(0),
              logoBg: "bg-blue-50",
              logoColor: "text-blue-600",
              title: job.title,
              poster: job.poster_name,
              posterRole: job.poster_role,
              posterImg: job.poster_img || getDefaultAvatar(job.poster_name),
              posterBio: job.poster_bio,
              desc: job.description?.substring(0, 100) + "...",
              fullDesc: job.description,
              responsibilities: job.responsibilities ? job.responsibilities.split('\n') : [],
              spots: `${job.filled_spots || 0}/${job.total_spots}`,
              progress: job.total_spots > 0 ? Math.round(((job.filled_spots || 0) / job.total_spots) * 100) : 0,
              deadline: daysLeft === 1 ? "1 day left" : `${daysLeft} days left`,
              postedAt: new Date(job.created_at).toLocaleDateString(),
              status: remainingSpots <= 0 ? 'Full' : job.status,
              location: job.location,
              alumni_id: job.alumni_id,
              job_type: job.job_type,
              experience_required: job.experience_required
            };
          });
          setJobs(transformedJobs);
        }
        
        if (profileResponse && profileResponse.ok) {
          const profileData = await profileResponse.json();
          setUserProfile(profileData.user);
        }
        
        if (appsResponse && appsResponse.ok) {
          const appsData = await appsResponse.json();
          setApplications(appsData.applications || []);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [API_BASE, user?.id]);

  const openJobDetails = (job: any) => {
    setSelectedJob(job);
    setShowDetailsModal(true);
  };

  const openReferralForm = (job: any) => {
    setSelectedJob(job);
    setShowDetailsModal(false);
    setShowReferralModal(true);
  };

  const handleSendReferral = async () => {
    if (!user || !selectedJob) return;
    try {
      const formData = new FormData();
      formData.append("student_id", String(user.id));
      formData.append("alumni_id", String(selectedJob.alumni_id));
      formData.append("cover_note", coverNote);
      
      // Add resume URL from profile if available
      if (userProfile?.profile?.resume_url) {
        formData.append("resume_url", userProfile.profile.resume_url);
      }
      
      // Add uploaded resume file if selected
      if (resumeFile) {
        formData.append("resume", resumeFile);
      }

      const response = await fetch(`${API_BASE}/jobs/${selectedJob.id}/apply`, {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        setShowReferralModal(false);
        setShowSuccessModal(true);
        // Refresh applications
        if (user?.id) {
          const appsRes = await fetch(`${API_BASE}/jobs/student/${user.id}/applications`);
          if (appsRes.ok) {
            const appsData = await appsRes.json();
            setApplications(appsData.applications || []);
          }
        }
      }
    } catch (error) {
      console.error("Failed to send referral:", error);
    }
  };

  const closeAllModals = () => {
    setShowDetailsModal(false);
    setShowReferralModal(false);
    setShowSuccessModal(false);
    setShowNoteModal(false);
    setCoverNote("");
  };
  const openNoteModal = (jobId: number) => {
    const app = applications.find(a => a.job_id === jobId);
    setSelectedApplication(app);
    setShowNoteModal(true);
  };

  return (
    <div className="bg-[#f9f9ff] min-h-screen font-sans text-[#141b2b] antialiased">
      <StudentNavbar activePage="jobs" />

      <main className="max-w-7xl mx-auto px-6 pt-10 pb-20">
        {/* Page Header */}
        <header className="bg-white rounded-2xl p-10 mb-8 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center border border-gray-50">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-[#022448] mb-2">Alumni Job Opportunities</h1>
            <p className="text-gray-500 font-medium">Positions posted by alumni who are ready to refer you</p>
          </div>
          <div className="mt-6 md:mt-0 flex items-center gap-8 text-sm">
            <div className="flex flex-col items-end">
              <span className="font-bold text-[#022448] text-lg">{jobs.length} open positions</span>
              <div className="flex items-center text-[#0b61a1] cursor-pointer hover:underline font-bold uppercase tracking-wider text-[10px] mt-1">
                Sorted by: Newest first
                <ChevronDown className="w-3.5 h-3.5 ml-1" />
              </div>
            </div>
          </div>
        </header>

        {/* Filter Bar */}
        <section className="bg-white rounded-2xl p-8 mb-10 shadow-sm border border-gray-50">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-8">
            <div className="relative w-full max-w-lg">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Search roles, companies, or keywords..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-6 py-4 bg-[#f8faff] border-none rounded-2xl focus:ring-2 focus:ring-[#022448]/10 transition-all placeholder:text-gray-400"
              />
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">Open positions only</span>
              <button 
                onClick={() => setOpenPositionsOnly(!openPositionsOnly)}
                className={`w-14 h-7 rounded-full relative transition-all shadow-lg active:scale-95 ${
                  openPositionsOnly ? 'bg-[#022448]' : 'bg-gray-200'
                }`}
              >
                <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-sm transition-all ${
                  openPositionsOnly ? 'right-1' : 'left-1'
                }`}></div>
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mr-4">Role Type:</span>
              <button 
                onClick={() => setSelectedRoleType('All Types')}
                className={`px-6 py-2 rounded-full text-xs font-bold transition-all ${
                  selectedRoleType === 'All Types' 
                    ? 'bg-[#022448] text-white shadow-md' 
                    : 'bg-[#f1f3ff] text-gray-500 hover:bg-[#e9edff]'
                }`}
              >
                All Types
              </button>
              {["Full-time", "Internship", "Contract", "Part-time"].map((type) => (
                <button 
                  key={type}
                  onClick={() => setSelectedRoleType(type)}
                  className={`px-6 py-2 rounded-full text-xs font-bold transition-all ${
                    selectedRoleType === type 
                      ? 'bg-[#022448] text-white shadow-md' 
                      : 'bg-[#f1f3ff] text-gray-500 hover:bg-[#e9edff]'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Grid Header */}
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#022448]">Showing {(() => {
            let filtered = jobs;
            if (openPositionsOnly) filtered = filtered.filter(job => job.status === 'Open');
            if (selectedRoleType !== 'All Types') filtered = filtered.filter(job => job.job_type === selectedRoleType);
            if (searchQuery) {
              const q = searchQuery.toLowerCase();
              filtered = filtered.filter(job => 
                job.title.toLowerCase().includes(q) || 
                job.company.toLowerCase().includes(q) || 
                job.description.toLowerCase().includes(q)
              );
            }
            return filtered.length;
          })()} job posts</h2>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="text-gray-500 text-lg">Loading jobs...</div>
          </div>
        )}

        {/* Jobs Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {(() => {
              let filtered = jobs;
              if (openPositionsOnly) filtered = filtered.filter(job => job.status === 'Open');
              if (selectedRoleType !== 'All Types') filtered = filtered.filter(job => job.job_type === selectedRoleType);
              if (searchQuery) {
                const q = searchQuery.toLowerCase();
                filtered = filtered.filter(job => 
                  job.title.toLowerCase().includes(q) || 
                  job.company.toLowerCase().includes(q) || 
                  job.description.toLowerCase().includes(q)
                );
              }
              return filtered;
            })().map((job) => (
              <article key={job.id} className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all group border border-gray-50 hover:border-[#022448]/10">
                <div className="flex justify-between items-start mb-6">
                  <div className={`w-14 h-14 rounded-2xl ${job.logoBg} flex items-center justify-center ${job.logoColor} font-black text-2xl shadow-inner`}>
                    {job.companyLogo}
                  </div>
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${job.status === 'Open' ? 'bg-green-50 text-green-600' : job.status === 'Closed' ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-400'}`}>
                      {job.status === 'Open' ? job.spots + ' spots left' : job.status}
                    </span>
                </div>

                <h3 className="text-xl font-bold text-[#022448] mb-2 group-hover:text-[#0b61a1] transition-colors leading-snug">{job.title}</h3>
                
                <div className="flex items-center gap-2 mb-6">
                  <img src={job.posterImg} alt="poster" className="w-6 h-6 rounded-full border border-[#d5e3ff]" />
                  <span className="text-[11px] text-gray-500 font-bold uppercase tracking-tight">Posted by <span className="text-[#022448]">{job.poster}</span></span>
                </div>

                <p className="text-sm text-gray-500 line-clamp-2 mb-8 leading-relaxed font-medium">{job.desc}</p>

                <div className="space-y-5 mb-8">
                  <div>
                    <div className="flex justify-between text-[10px] font-bold uppercase text-gray-400 tracking-widest mb-2">
                      <span>Referral Progress</span>
                      <span className="text-[#022448]">{job.spots} spots</span>
                    </div>
                    <div className="h-2 w-full bg-[#f1f3ff] rounded-full overflow-hidden shadow-inner">
                      <div 
                        className={`h-full transition-all duration-1000 ${job.status === 'Full' ? 'bg-gray-400' : 'bg-gradient-to-r from-[#022448] to-[#1e3a5f]'}`}
                        style={{ width: `${job.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className={`flex items-center text-[10px] font-bold uppercase tracking-widest ${job.deadline.includes('4') ? 'text-red-500' : 'text-gray-400'}`}>
                    <Clock className="w-3.5 h-3.5 mr-1.5" />
                    Deadline: {job.deadline}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {(() => {
                    const appStatus = getApplicationStatus(job.id);
                    if (job.status === 'Closed') {
                      return (
                        <>
                          <div className="py-3.5 rounded-xl text-sm font-bold text-red-600 bg-red-50 px-6 text-center">
                            Closed
                          </div>
                          <button 
                            onClick={() => openJobDetails(job)}
                            className="bg-[#f0f4ff] text-[#022448] py-3.5 rounded-xl text-sm font-bold hover:bg-blue-100 transition-all active:scale-95 shadow-sm"
                          >
                            View Job
                          </button>
                        </>
                      );
                    } else if (appStatus === 'Pending') {
                      return (
                        <>
                          <div className="py-3.5 rounded-xl text-sm font-bold text-amber-600 bg-amber-50 px-6 text-center">
                            Request Sent
                          </div>
                          <button 
                            onClick={() => openJobDetails(job)}
                            className="bg-[#f0f4ff] text-[#022448] py-3.5 rounded-xl text-sm font-bold hover:bg-blue-100 transition-all active:scale-95 shadow-sm"
                          >
                            View Job
                          </button>
                        </>
                      );
                    } else if (appStatus === 'Accepted') {
                      return (
                        <>
                          <div className="py-3.5 rounded-xl text-sm font-bold text-green-600 bg-green-50 px-6 text-center">
                            Referred
                          </div>
                          <button 
                            onClick={() => openNoteModal(job.id)}
                            className="bg-[#f0f4ff] text-[#022448] py-3.5 rounded-xl text-sm font-bold hover:bg-blue-100 transition-all active:scale-95 shadow-sm"
                          >
                            View Details
                          </button>
                        </>
                      );
                    } else if (appStatus === 'Rejected') {
                      return (
                        <>
                          <div className="py-3.5 rounded-xl text-sm font-bold text-red-600 bg-red-50 px-6 text-center">
                            Rejected
                          </div>
                          <button 
                            onClick={() => openNoteModal(job.id)}
                            className="bg-[#f0f4ff] text-[#022448] py-3.5 rounded-xl text-sm font-bold hover:bg-blue-100 transition-all active:scale-95 shadow-sm"
                          >
                            View Reason
                          </button>
                        </>
                      );
                    } else {
                      return (
                        <>
                          <button 
                            onClick={() => openReferralForm(job)}
                            className={`py-3.5 rounded-xl text-sm font-bold shadow-lg transition-all active:scale-95 ${
                              job.status === 'Full' ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none' : 'bg-[#022448] text-white hover:opacity-90 shadow-[#022448]/20'
                            }`}
                          >
                            {job.status === 'Full' ? 'Full' : 'Request Referral'}
                          </button>
                          <button 
                            onClick={() => openJobDetails(job)}
                            className="bg-[#f0f4ff] text-[#022448] py-3.5 rounded-xl text-sm font-bold hover:bg-blue-100 transition-all active:scale-95 shadow-sm"
                          >
                            View Job
                          </button>
                        </>
                      );
                    }
                  })()}
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Job Details Modal */}
        {showDetailsModal && selectedJob && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#022448]/10 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-5xl rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300 border border-gray-50">
              <div className="flex-1 overflow-y-auto flex">
                {/* Left Panel */}
                <div className="flex-1 p-12 border-r border-gray-50">
                  <header className="mb-12">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex gap-5 items-center">
                        <div className={`w-16 h-16 rounded-2xl ${selectedJob.logoBg} flex items-center justify-center ${selectedJob.logoColor} font-black text-3xl shadow-inner`}>
                          {selectedJob.companyLogo}
                        </div>
                        <div>
                          <h1 className="text-3xl font-extrabold text-[#022448] leading-tight">{selectedJob.title}</h1>
                          <div className="flex items-center gap-2 text-[#0b61a1] font-bold uppercase tracking-wider text-[11px] mt-1">
                            <Building2 className="w-3.5 h-3.5" />
                            {selectedJob.company} • {selectedJob.location}
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={closeAllModals}
                        className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-50 transition-colors text-gray-400"
                      >
                        <X className="w-6 h-6" />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-5 py-1.5 bg-[#f1f3ff] text-gray-500 text-[10px] font-bold uppercase tracking-widest rounded-full">{selectedJob.job_type}</span>
                      {selectedJob.location && selectedJob.location.toLowerCase().includes('remote') && (
                        <span className="px-5 py-1.5 bg-[#f1f3ff] text-gray-500 text-[10px] font-bold uppercase tracking-widest rounded-full">Remote-friendly</span>
                      )}
                      {selectedJob.experience_required && (
                        <span className="px-5 py-1.5 bg-[#f1f3ff] text-gray-500 text-[10px] font-bold uppercase tracking-widest rounded-full">{selectedJob.experience_required}</span>
                      )}
                    </div>
                  </header>

                  <div className="space-y-12">
                    <section>
                      <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-4">About this role</h2>
                      <p className="text-gray-500 leading-relaxed text-lg font-medium">
                        {selectedJob.fullDesc}
                      </p>
                    </section>

                    <section>
                      <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-6">Key Responsibilities</h2>
                      <ul className="space-y-5">
                        {selectedJob.responsibilities.map((item: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-4 group">
                            <div className="w-6 h-6 rounded-full bg-green-50 flex items-center justify-center shrink-0 mt-0.5">
                              <CheckCircle2 className="w-4 h-4 text-green-500" />
                            </div>
                            <span className="text-gray-600 text-[15px] leading-relaxed font-medium">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </section>
                  </div>
                </div>

                {/* Right Sidebar */}
                <aside className="w-[380px] bg-[#fbfbfe] p-12 flex flex-col gap-10">
                  {/* Alumni Card */}
                  <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-50 relative">
                    <img 
                      src={selectedJob.posterImg} 
                      alt={selectedJob.poster} 
                      className="w-16 h-16 rounded-2xl object-cover absolute -top-8 left-8 shadow-xl border-4 border-white"
                    />
                    <div className="mt-8">
                      <h3 className="font-bold text-xl text-[#022448]">{selectedJob.poster}</h3>
                      <p className="text-sm text-gray-400 font-bold uppercase tracking-tight mb-4">{selectedJob.posterRole}</p>
                      <div className="bg-[#f0f4ff] p-4 rounded-2xl mb-6 italic text-gray-500 text-sm leading-relaxed border-l-4 border-[#0b61a1]">
                        {selectedJob.posterBio || "Happy to chat about the role and refer qualified candidates!"}
                      </div>
                      <div className="flex items-center gap-2 text-[#0b61a1] font-bold text-[10px] uppercase tracking-widest">
                        <Zap className="w-4 h-4 fill-current" />
                        Verified Mentor
                      </div>
                    </div>
                  </div>

                  {/* Referral Progress */}
                  <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-50">
                    <div className="flex justify-between items-end mb-4">
                      <div>
                        <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-1">Referral Availability</h2>
                        <p className="text-2xl font-black text-[#022448]">{selectedJob.spots} spots</p>
                      </div>
                      <span className="text-[#0b61a1] font-bold text-xs bg-[#f1f3ff] px-3 py-1 rounded-lg">High Demand</span>
                    </div>
                    <div className="w-full h-2.5 bg-[#f1f3ff] rounded-full overflow-hidden shadow-inner">
                      <div className="h-full bg-gradient-to-r from-[#022448] to-[#1e3a5f] w-[${selectedJob.progress}%] rounded-full shadow-lg" style={{width: `${selectedJob.progress}%`}}></div>
                    </div>
                    <p className="text-[11px] text-gray-400 mt-4 italic font-medium leading-relaxed">
                      Requests are reviewed based on profile completeness and community engagement.
                    </p>
                  </div>

                  <div className="mt-auto space-y-4">
                    {(() => {
                      const appStatus = getApplicationStatus(selectedJob.id);
                      const isSlotsFull = selectedJob.status === 'Full';
                      if (selectedJob.status === 'Closed') {
                        return (
                          <div className="w-full bg-gray-100 text-gray-400 py-5 rounded-2xl font-bold flex items-center justify-center gap-3">
                            This job posting is closed
                          </div>
                        );
                      } else if (appStatus === 'Pending') {
                        return (
                          <div className="w-full bg-amber-50 text-amber-600 py-5 rounded-2xl font-bold flex items-center justify-center gap-3">
                            Request Sent
                          </div>
                        );
                      } else if (appStatus === 'Accepted') {
                        return (
                          <div className="w-full bg-green-50 text-green-600 py-5 rounded-2xl font-bold flex items-center justify-center gap-3">
                            Referred
                          </div>
                        );
                      } else if (appStatus === 'Rejected') {
                        return (
                          <div className="w-full bg-red-50 text-red-600 py-5 rounded-2xl font-bold flex items-center justify-center gap-3">
                            Rejected
                          </div>
                        );
                      } else {
                        return (
                          <button 
                            onClick={() => openReferralForm(selectedJob)}
                            disabled={isSlotsFull}
                            className={`w-full py-5 rounded-2xl font-bold flex items-center justify-center gap-3 active:scale-95 transition-all shadow-xl ${
                              isSlotsFull ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none' : 'bg-[#022448] text-white hover:opacity-90 shadow-[#022448]/20 group'
                            }`}
                          >
                            {isSlotsFull ? 'Full' : 'Request a Referral'}
                            {!isSlotsFull && <Play className="w-3.5 h-3.5 fill-current transition-transform group-hover:translate-x-1" />}
                          </button>
                        );
                      }
                    })()}
                    <p className="text-[10px] text-center text-gray-400 font-bold uppercase tracking-widest">Typical response time: 2-3 days</p>
                  </div>
                </aside>
              </div>

              {/* Modal Footer */}
              <footer className="px-12 py-6 bg-white border-t border-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-8">
                  <div className="flex items-center gap-2.5 text-gray-400 text-xs font-bold uppercase tracking-tight">
                    <Calendar className="w-4 h-4" />
                    Posted on {selectedJob.postedAt}
                  </div>
                  <div className="flex items-center gap-2.5 text-red-500 text-xs font-bold uppercase tracking-tight">
                    <Clock className="w-4 h-4" />
                    Closes in {selectedJob.deadline}
                  </div>
                </div>
                <button className="flex items-center gap-2.5 text-gray-400 hover:text-[#022448] transition-colors text-xs font-bold uppercase tracking-widest group">
                  <Bookmark className="w-4 h-4 group-hover:fill-current" />
                  Save Position
                </button>
              </footer>
            </div>
          </div>
        )}

        {/* Referral Application Modal */}
        {showReferralModal && selectedJob && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-[#022448]/15 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-4xl rounded-[2.5rem] shadow-2xl p-12 animate-in zoom-in-95 duration-300 border border-gray-50 relative overflow-y-auto max-h-[90vh]">
              <button 
                onClick={closeAllModals}
                className="absolute top-8 right-8 w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-50 text-gray-400"
              >
                <X className="w-6 h-6" />
              </button>

              <header className="mb-10 pr-12">
                <h2 className="text-4xl font-extrabold text-[#022448] mb-3 tracking-tight">Apply for a Referral through {selectedJob.poster}</h2>
                <p className="text-gray-500 font-medium text-lg leading-relaxed">
                  Complete your referral request details to help {selectedJob.poster.split(' ')[0]} provide the best recommendation for your profile.
                </p>
              </header>

              <div className="space-y-12">
                {/* Job Context (Locked) */}
                <section>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#022448]">Job Context</h3>
                    <div className="bg-gray-100 p-1.5 rounded-full"><X className="w-3 h-3 text-gray-400 rotate-45" /></div>
                  </div>
                  <div className="bg-[#f8faff] rounded-[2rem] p-8 border border-gray-100 flex gap-12">
                    <div className="flex-1">
                      <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-gray-400 mb-2">Company</p>
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl ${selectedJob.logoBg} flex items-center justify-center ${selectedJob.logoColor} font-black text-lg shadow-inner`}>
                          {selectedJob.companyLogo}
                        </div>
                        <span className="font-bold text-[#022448]">{selectedJob.company}</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-gray-400 mb-2">Position</p>
                      <span className="font-bold text-[#022448] text-lg">{selectedJob.title}</span>
                    </div>
                  </div>
                </section>

                {/* Your Application */}
                <section>
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#022448] mb-4">Your Application</h3>
                  <div className="space-y-4">
                    <label className="block text-sm font-bold text-[#022448]">Cover Note for {selectedJob.poster.split(' ')[0]}</label>
                    <div className="relative">
                      <textarea 
                        value={coverNote}
                        onChange={(e) => setCoverNote(e.target.value)}
                        placeholder="Explain why you're a great fit for this role..."
                        className="w-full bg-[#f8faff] border-none rounded-[1.5rem] p-6 text-gray-600 focus:ring-2 focus:ring-[#022448]/5 min-h-[200px] resize-none"
                        maxLength={800}
                      ></textarea>
                      <div className="absolute bottom-6 right-6 text-[10px] font-bold text-gray-300 uppercase tracking-widest">
                        {coverNote.length} / 800
                      </div>
                    </div>
                    
                    <details className="group bg-white rounded-2xl border border-gray-100 overflow-hidden">
                      <summary className="list-none p-5 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-all font-bold text-sm text-[#022448]">
                        <div className="flex items-center gap-3">
                          <Zap className="w-4 h-4 text-[#c69b5f] fill-current" />
                          Writing Tips: How to ask for a referral
                        </div>
                        <ChevronDown className="w-4 h-4 transition-transform group-open:rotate-180" />
                      </summary>
                      <div className="p-6 pt-0 text-sm text-gray-500 leading-relaxed font-medium">
                        <p className="mb-3">• Mention your specific interest in {selectedJob.company} and why this role aligns with your background.</p>
                        <p className="mb-3">• Highlight 2-3 key accomplishments that map directly to the job requirements.</p>
                        <p>• Keep it concise—{selectedJob.poster.split(' ')[0]} is more likely to refer you if the message is quick to read.</p>
                      </div>
                    </details>
                  </div>
                </section>

                {/* Resume Section */}
                <section>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#022448]">Attached Resume</h3>
                  </div>
                  <div className="flex items-center gap-5 p-6 bg-[#f8faff] rounded-[1.5rem] border border-dashed border-gray-200">
                    <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center text-[#022448] shadow-sm">
                      <FileText className="w-8 h-8" />
                    </div>
                    <div className="flex-grow">
                      {userProfile?.profile?.resume_url || resumeFile ? (
                        <>
                          {userProfile?.profile?.resume_url && !resumeFile ? (
                            <a
                              href={getMediaUrl(userProfile.profile.resume_url, API_BASE)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:opacity-80 transition-opacity"
                            >
                              <p className="font-bold text-[#022448] text-lg underline underline-offset-2">
                                {userProfile.profile.resume_url?.split('/').pop() || 'Resume.pdf'}
                              </p>
                            </a>
                          ) : (
                            <p className="font-bold text-[#022448] text-lg">
                              {resumeFile ? resumeFile.name : 'Resume.pdf'}
                            </p>
                          )}
                          <div className="flex items-center gap-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                            <span>{resumeFile ? `${(resumeFile.size / 1024 / 1024).toFixed(1)} MB` : 'Uploaded'}</span>
                            <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
                            <span>{resumeFile ? 'Just now' : 'From your profile'}</span>
                          </div>
                        </>
                      ) : (
                        <p className="text-sm text-gray-500">No resume uploaded yet</p>
                      )}
                    </div>
                    <label className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all active:scale-95 cursor-pointer">
                      <Upload className="w-4 h-4" />
                      {userProfile?.profile?.resume_url || resumeFile ? 'Replace' : 'Upload'}
                      <input 
                        type="file" 
                        accept=".pdf,.doc,.docx" 
                        hidden 
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) setResumeFile(file);
                        }}
                      />
                    </label>
                  </div>
                </section>

                <div className="flex items-center gap-6 pt-4">
                  <button 
                    onClick={handleSendReferral}
                    className="bg-[#022448] text-white px-10 py-4 rounded-2xl font-bold tracking-wide shadow-xl shadow-[#022448]/20 active:scale-95 transition-all"
                  >
                    Send Referral Application
                  </button>
                  <button 
                    onClick={closeAllModals}
                    className="px-10 py-4 rounded-2xl font-bold text-gray-400 hover:text-[#022448] hover:bg-gray-50 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Success Modal */}
        {showSuccessModal && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-[#022448]/20 backdrop-blur-md animate-in fade-in duration-500">
            <div className="bg-white w-full max-w-lg rounded-[3rem] p-12 text-center shadow-2xl border border-gray-50 animate-in zoom-in-95 duration-300">
              <div className="w-24 h-24 bg-[#f0f4ff] rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-[#0b61a1] shadow-md">
                  <CheckCircle2 className="w-8 h-8 fill-current" />
                </div>
              </div>
              <h2 className="text-5xl font-black text-[#022448] mb-4 tracking-tighter">Application Sent!</h2>
              <p className="text-gray-500 font-medium text-lg mb-10">
                Your referral application has been sent to {selectedJob?.poster}
              </p>
              <button 
                onClick={closeAllModals}
                className="w-full bg-[#022448] text-white py-5 rounded-2xl font-bold shadow-xl shadow-[#022448]/20 active:scale-95 transition-all"
              >
                Back to Jobs Feed
              </button>
            </div>
          </div>
        )}

        {/* Note View Modal */}
        {showNoteModal && selectedApplication && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-y-auto relative">
              <div className="p-8 border-b border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-2xl font-black text-[#022448]">
                  {selectedApplication.status === 'Accepted' ? 'Alumni Note' : 'Reason for Rejection'}
                </h2>
                  <button 
                    onClick={closeAllModals}
                    className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100 transition-all"
                  >
                    <X className="w-6 h-6 text-gray-400" />
                  </button>
                </div>
              </div>
              <div className="p-8">
                <div className="mb-6">
                  <p className="text-[#022448] text-base leading-relaxed font-semibold whitespace-pre-wrap">
                    {selectedApplication.note || 'No additional details provided.'}
                  </p>
                </div>
                <button 
                  onClick={closeAllModals}
                  className="w-full px-6 py-3.5 rounded-2xl text-sm font-bold text-[#022448] bg-[#022448]/5 hover:bg-[#022448]/10 transition-all border-2 border-[#022448]/10"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Pagination */}
        <nav className="flex items-center justify-center gap-2">
          <button className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white text-gray-400 transition-all border border-transparent hover:border-gray-100">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button className="w-10 h-10 rounded-xl bg-[#022448] text-white font-bold shadow-lg">1</button>
          <button className="w-10 h-10 rounded-xl hover:bg-white text-gray-500 font-bold transition-all border border-transparent hover:border-gray-100">2</button>
          <button className="w-10 h-10 rounded-xl hover:bg-white text-gray-500 font-bold transition-all border border-transparent hover:border-gray-100">3</button>
          <span className="px-2 text-gray-300 font-bold">...</span>
          <button className="w-10 h-10 rounded-xl hover:bg-white text-gray-500 font-bold transition-all border border-transparent hover:border-gray-100">8</button>
          <button className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white text-gray-400 transition-all border border-transparent hover:border-gray-100">
            <ChevronRight className="w-5 h-5" />
          </button>
        </nav>
      </main>

      <Footer />
    </div>
  );
}
