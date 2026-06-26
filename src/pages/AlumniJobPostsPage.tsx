import React, { useState, useEffect } from "react";
import { 
  Plus, 
  Briefcase, 
  Users, 
  CheckCircle2, 
  History, 
  Archive, 
  AlertCircle,
  TrendingUp,
  ExternalLink,
  ChevronRight
} from "lucide-react";
import AlumniNavbar from "../components/AlumniNavbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function AlumniJobPostsPage() {
  const { user, API_BASE } = useAuth();
  const [activeTab, setActiveTab] = useState("Active");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [referralLimit, setReferralLimit] = useState(5);
  const [selectedRoleType, setSelectedRoleType] = useState("Full-time");
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const openCreateModal = () => setIsCreateModalOpen(true);
  const closeCreateModal = () => setIsCreateModalOpen(false);

  const fetchJobs = async () => {
    if (!user) return;
    try {
      const response = await fetch(`${API_BASE}/jobs/alumni/${user.id}`);
      const data = await response.json();
      if (response.ok) {
        setJobs(data.jobs);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [user]);

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    const formData = new FormData(e.target as HTMLFormElement);
    const jobData = {
      alumni_id: user.id,
      company: formData.get("organization") as string,
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      location: formData.get("location") as string,
      job_type: selectedRoleType,
      deadline: formData.get("deadline") as string,
      total_spots: referralLimit,
    };

    try {
      const response = await fetch(`${API_BASE}/jobs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jobData),
      });
      
      if (response.ok) {
        closeCreateModal();
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
        fetchJobs(); // Refresh job list
      }
    } catch (error) {
      console.error('Error creating job:', error);
    }
  };

  const filteredJobs = activeTab === "Active" 
    ? jobs.filter(job => job.status === "Open") 
    : jobs.filter(job => job.status === "Closed");

  const activeJobsCount = jobs.filter(job => job.status === "Open").length;
  const closedJobsCount = jobs.filter(job => job.status === "Closed").length;
  const totalApplications = jobs.reduce((sum, job) => sum + (job.total_applications || 0), 0);
  const totalReferralsAccepted = jobs.reduce((sum, job) => sum + (job.filled_spots || 0), 0);

  if (loading) {
    return (
      <div className="bg-[#f9f9ff] min-h-screen font-sans text-[#141b2b] antialiased flex items-center justify-center">
        <div className="text-gray-500 text-lg">Loading jobs...</div>
      </div>
    );
  }

  return (
    <div className="bg-[#f9f9ff] min-h-screen font-sans text-[#141b2b] antialiased">
      <AlumniNavbar activePage="jobs" />

      <main className="pt-24 pb-20 px-12 max-w-[1600px] mx-auto">
        {/* Page Header */}
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <h1 className="text-[3.5rem] font-black text-[#022448] tracking-tighter mb-4">My Job Posts</h1>
            <p className="text-gray-500 text-lg font-medium">Manage your recruitment pipeline and alumni referrals.</p>
          </div>
          <button 
            onClick={openCreateModal}
            className="bg-[#022448] text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-[#022448]/30 hover:opacity-90 active:scale-[0.98] transition-all flex items-center gap-3"
          >
            <Plus className="w-5 h-5" />
            Create a Job Post
          </button>
        </header>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {[
            { label: "Active Posts", value: activeJobsCount.toString(), color: "text-[#022448]", bg: "bg-white" },
            { label: "Total Applications", value: totalApplications.toString(), color: "text-[#0b61a1]", bg: "bg-[#f1f3ff]" },
            { label: "Referrals Accepted", value: totalReferralsAccepted.toString(), color: "text-[#022448]", bg: "bg-white" },
            { label: "Closed Posts", value: closedJobsCount.toString(), color: "text-gray-400", bg: "bg-[#f1f3ff]" }
          ].map((stat, i) => (
            <div key={i} className={`${stat.bg} p-10 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col items-start relative overflow-hidden group`}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#022448]/5 rounded-bl-full -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-6">{stat.label}</p>
              <p className={`text-5xl font-black tracking-tighter ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-12 mb-12 border-b border-gray-100">
          {[
            { label: "Active Posts", count: activeJobsCount },
            { label: "Closed Posts", count: closedJobsCount },
            { label: "All Posts", count: jobs.length }
          ].map((tab) => (
            <button
              key={tab.label}
              onClick={() => setActiveTab(tab.label.split(' ')[0])}
              className={`pb-5 text-[10px] font-black uppercase tracking-[0.3em] transition-all relative ${
                activeTab === tab.label.split(' ')[0] 
                ? "text-[#022448]" 
                : "text-gray-400 hover:text-[#022448]"
              }`}
            >
              {tab.label} ({tab.count})
              {activeTab === tab.label.split(' ')[0] && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#022448] rounded-full"></div>
              )}
            </button>
          ))}
        </div>

        {/* Job Cards Stack */}
        <div className="flex flex-col gap-8">
          {activeTab === "Active" ? (
            filteredJobs.map((job, i) => (
              <div key={job.id} className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100 flex flex-col lg:flex-row items-center gap-10 hover:shadow-2xl transition-all group overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#022448]/5 rounded-bl-full -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                {/* Logo Area */}
                <div className={`w-16 h-16 rounded-2xl ${job.company_logo ? '' : 'bg-[#022448]'} flex items-center justify-center p-4 shadow-lg group-hover:scale-105 transition-transform`}>
                  {job.company_logo ? (
                    <img src={job.company_logo} alt={job.company} className="w-full h-full object-contain" />
                  ) : (
                    <div className="text-white font-black text-xl">{job.company[0]}</div>
                  )}
                </div>

                {/* Job Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <h3 className="text-2xl font-black text-[#022448] tracking-tight">{job.title}</h3>
                    <span className={`bg-green-50 text-green-600 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest`}>
                      {job.status}
                    </span>
                  </div>
                  <p className="text-gray-400 font-bold text-sm mb-8">{job.company} • {job.location}</p>
                  
                  <div className="flex flex-wrap gap-16">
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-300 mb-2">Applications</p>
                      <p className="text-lg font-black text-[#022448]">{job.total_applications || 0} Received</p>
                    </div>
                    <div className="flex-1 max-w-xs">
                      <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-300 mb-2">Referral Progress</p>
                      <div className="flex items-center gap-4">
                        <div className="flex-1 h-2 bg-[#f1f3ff] rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-[#022448] rounded-full transition-all duration-500"
                            style={{ width: `${job.total_spots ? (job.filled_spots || 0) / job.total_spots * 100 : 0}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-black text-[#022448]">{job.filled_spots || 0}/{job.total_spots || 5}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action */}
                <div className="shrink-0">
                  <button 
                    onClick={() => navigate(`/dashboard/alumni/jobs/manage/${job.id}`)}
                    className="bg-[#022448] text-white px-10 py-5 rounded-[2rem] font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-[#022448]/20 hover:opacity-90 active:scale-[0.98] transition-all"
                  >
                    View Applications
                  </button>
                </div>
              </div>
            ))
          ) : (
            filteredJobs.map((job, i) => (
              <div key={job.id} className="bg-[#f1f3ff] p-10 rounded-[3rem] opacity-75 border-2 border-dashed border-gray-200 group relative">
                <div className="flex flex-col lg:flex-row gap-10 items-start">
                  <div className="w-16 h-16 rounded-2xl bg-gray-200 flex items-center justify-center p-4">
                    <Archive className="text-gray-400 w-8 h-8" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <h3 className="text-2xl font-black text-gray-400 tracking-tight">{job.title}</h3>
                      <span className="bg-gray-200 text-gray-500 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">
                        ARCHIVE
                      </span>
                    </div>
                    <p className="text-gray-400 font-bold text-sm mb-8">{job.company} • {job.location}</p>
                    
                    <div className="flex flex-wrap gap-16">
                      <div>
                        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-300 mb-2">Total Hires</p>
                        <p className="text-lg font-black text-gray-400">0 Hired</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-300 mb-2">Closed On</p>
                        <p className="text-lg font-black text-gray-400">{job.deadline}</p>
                      </div>
                    </div>
                  </div>
                  <button className="text-[10px] font-black uppercase tracking-[0.2em] text-[#022448] underline mt-4 lg:mt-0">
                    Repost Vacancy
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Create Job Modal */}
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 md:p-12 overflow-y-auto">
            <div className="fixed inset-0 bg-[#022448]/40 backdrop-blur-md" onClick={closeCreateModal}></div>
            
            <div className="relative w-full max-w-4xl bg-white rounded-[3rem] shadow-2xl p-16 animate-in zoom-in-95 fade-in duration-300 my-auto">
              {/* Modal Header */}
              <header className="mb-12">
                <h2 className="text-[3rem] font-black text-[#022448] tracking-tighter mb-4">Post a Job Opportunity</h2>
                <p className="text-gray-500 text-lg font-medium">Empower the next generation of graduates by sharing exclusive career paths at your organization.</p>
              </header>

              <form className="space-y-10" onSubmit={handlePublish}>
                {/* Organization */}
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 px-1">Organization</label>
                  <div className="relative">
                    <input 
                      list="organizations"
                      name="organization"
                      className="w-full bg-[#f1f3ff] border-none rounded-2xl px-8 py-5 text-sm font-bold text-[#022448] focus:ring-4 focus:ring-[#022448]/5 transition-all" 
                      placeholder="Type or select organization..."
                      required
                    />
                    <datalist id="organizations">
                      <option value="Google" />
                      <option value="HSBC" />
                      <option value="McKinsey & Co." />
                      <option value="Amazon" />
                      <option value="Microsoft" />
                      <option value="Apple" />
                    </datalist>
                  </div>
                </div>

                {/* Job Title */}
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 px-1">Job Title</label>
                  <input 
                    className="w-full bg-[#f1f3ff] border-none rounded-2xl px-8 py-5 text-sm font-bold text-[#022448] focus:ring-4 focus:ring-[#022448]/5 transition-all" 
                    placeholder="e.g. Senior Product Manager" 
                    type="text"
                    name="title"
                    required
                  />
                </div>

                {/* Location */}
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 px-1">Location</label>
                  <input 
                    className="w-full bg-[#f1f3ff] border-none rounded-2xl px-8 py-5 text-sm font-bold text-[#022448] focus:ring-4 focus:ring-[#022448]/5 transition-all" 
                    placeholder="e.g. Mountain View, CA" 
                    type="text"
                    name="location"
                    required
                  />
                </div>

                {/* Role Type */}
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 px-1">Role Type</label>
                  <div className="flex gap-4 p-2 bg-[#f1f3ff] rounded-2xl w-fit">
                    {["Full-time", "Contract", "Internship"].map((type) => (
                      <button
                        key={type}
                        type="button"
                        className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                          selectedRoleType === type ? "bg-white text-[#022448] shadow-sm" : "text-gray-400 hover:text-[#022448]"
                        }`}
                        onClick={() => setSelectedRoleType(type)}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Application Deadline */}
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 px-1">Application Deadline</label>
                  <input 
                    className="w-full bg-[#f1f3ff] border-none rounded-2xl px-8 py-5 text-sm font-bold text-[#022448] focus:ring-4 focus:ring-[#022448]/5 transition-all" 
                    type="date"
                    name="deadline"
                    defaultValue="2024-12-31"
                    required
                  />
                </div>

                {/* Job Description */}
                <div className="space-y-4">
                  <div className="flex justify-between items-end px-1">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Job Description</label>
                    <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest">148 / 1000 Characters</span>
                  </div>
                  <textarea 
                    rows={6}
                    name="description"
                    className="w-full bg-[#f1f3ff] border-none rounded-[2rem] px-8 py-8 text-sm font-bold text-[#022448] focus:ring-4 focus:ring-[#022448]/5 transition-all leading-relaxed"
                    defaultValue="We are looking for a Senior Product Manager to join our Cloud Infrastructure team. You will lead the strategy for next-generation developer platforms, collaborating with cross-functional engineering teams to scale global operations."
                  />
                </div>

                {/* Maximum Referrals */}
                <div className="bg-[#f1f3ff]/50 p-10 rounded-[2.5rem] border border-[#f1f3ff] flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-widest text-[#022448] mb-1">Maximum Referrals</h4>
                    <p className="text-[10px] font-bold text-gray-400 max-w-[240px]">Number of students you are willing to personally mentor through the referral process.</p>
                  </div>
                  <div className="bg-white p-2 rounded-2xl flex items-center gap-6 shadow-sm">
                    <button 
                      type="button"
                      onClick={() => setReferralLimit(Math.max(1, referralLimit - 1))}
                      className="w-10 h-10 rounded-xl hover:bg-[#f1f3ff] flex items-center justify-center text-gray-400 transition-colors"
                    >
                      <Plus className="w-5 h-5 rotate-45" />
                    </button>
                    <span className="text-xl font-black text-[#022448] w-8 text-center">{referralLimit}</span>
                    <button 
                      type="button"
                      onClick={() => setReferralLimit(referralLimit + 1)}
                      className="w-10 h-10 rounded-xl hover:bg-[#f1f3ff] flex items-center justify-center text-[#022448] transition-colors"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="pt-8 flex justify-end items-center gap-12">
                  <button 
                    type="button"
                    onClick={closeCreateModal}
                    className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 hover:text-[#022448] transition-colors"
                  >
                    Cancel
                  </button>
                  <button className="bg-[#022448] text-white px-16 py-5 rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-[#022448]/30 hover:opacity-90 active:scale-[0.98] transition-all">
                    Publish
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Success Confirmation Toast */}
        {showSuccess && (
          <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[200] animate-in slide-in-from-top-10 fade-in duration-500">
            <div className="bg-[#022448] text-white px-10 py-5 rounded-[2rem] shadow-2xl flex items-center gap-4">
              <div className="bg-white/20 p-2 rounded-xl">
                <CheckCircle2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-black uppercase tracking-widest">Job Posted Successfully</p>
                <p className="text-[10px] font-bold text-white/60">Your opportunity is now live for all students.</p>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
