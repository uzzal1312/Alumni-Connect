import React, { useState, useEffect } from "react";
import { 
  ChevronRight, 
  FileText, 
  Download, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  UserCheck, 
  Info,
  Quote,
  MessageSquare,
  AlertCircle,
  Handshake,
  Archive
} from "lucide-react";
import AlumniNavbar from "../components/AlumniNavbar";
import Footer from "../components/Footer";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getDefaultAvatar } from "../utils/avatars";

// Helper to get full media URL
const getMediaUrl = (path: string | null | undefined, apiBase: string) => {
  if (!path) return null;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  const base = apiBase.replace('/api', '');
  return `${base}${path}`;
};

export default function AlumniManageApplicationsPage() {
  const [activeTab, setActiveTab] = useState("ALL");
  const navigate = useNavigate();
  const { jobId } = useParams<{ jobId: string }>();
  const { API_BASE } = useAuth();
  const [job, setJob] = useState<any>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [jobDetails, setJobDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [statusUpdating, setStatusUpdating] = useState<number | null>(null);
  // Modal states
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState<'ACCEPT' | 'DECLINE' | null>(null);
  const [reason, setReason] = useState('');

  const fetchJobAndApplications = async () => {
    if (!jobId) return;
    try {
      const [jobRes, appsRes] = await Promise.all([
        fetch(`${API_BASE}/jobs/${jobId}`),
        fetch(`${API_BASE}/jobs/${jobId}/applications`)
      ]);
      
      const jobData = await jobRes.json();
      const appsData = await appsRes.json();
      
      if (jobRes.ok) setJob(jobData.job);
      if (appsRes.ok) {
        setApplications(appsData.applications || []);
        setJobDetails(appsData.job);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobAndApplications();
  }, [jobId]);

  const openActionModal = (app: any, action: 'ACCEPT' | 'DECLINE') => {
    setSelectedApp(app);
    setActionType(action);
    setReason('');
    setShowActionModal(true);
  };

  const handleActionSubmit = async () => {
    if (!selectedApp) return;
    setStatusUpdating(selectedApp.id);
    try {
      const response = await fetch(`${API_BASE}/jobs/applications/${selectedApp.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          status: actionType === 'ACCEPT' ? 'Accepted' : 'Rejected',
          note: reason
        })
      });
      if (response.ok) {
        await fetchJobAndApplications(); // Refresh the list
        setShowActionModal(false);
      }
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setStatusUpdating(null);
    }
  };

  const closeJob = async () => {
    if (!jobId) return;
    try {
      await fetch(`${API_BASE}/jobs/${jobId}/close`, { method: 'PUT' });
      fetchJobAndApplications();
    } catch (error) {
      console.error('Error closing job:', error);
    }
  };

  const filteredApplications = activeTab === "ALL" 
    ? applications 
    : applications.filter(app => app.status === activeTab);

  if (loading) {
    return (
      <div className="bg-[#f9f9ff] min-h-screen flex items-center justify-center">
        <div className="text-gray-500 text-lg">Loading applications...</div>
      </div>
    );
  }

  return (
    <div className="bg-[#f9f9ff] min-h-screen font-sans text-[#141b2b] antialiased">
      <AlumniNavbar activePage="jobs" />

      <main className="pt-24 pb-20 px-12 max-w-[1400px] mx-auto">
        {/* Breadcrumb & Header */}
        <header className="mb-12">
          <nav className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-6">
            <span className="cursor-pointer hover:text-[#022448]" onClick={() => navigate('/dashboard/alumni/jobs')}>Jobs</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#022448]">Manage</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <h1 className="text-[3.5rem] font-black text-[#022448] tracking-tighter mb-4 leading-tight">
                Applications for {job?.title}
              </h1>
              <p className="text-gray-500 text-lg font-medium">{job?.company} • {job?.location}</p>
            </div>
            {job?.status !== "Closed" && (
              <button onClick={closeJob} className="bg-[#022448] text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-[#022448]/20 hover:opacity-90 transition-all">
                Close Post
              </button>
            )}
          </div>

          {/* Stats Chips */}
          <div className="flex flex-wrap gap-4 mt-12">
            {[
              { label: `${applications.length} Apps`, color: "bg-[#022448]", dot: "bg-[#022448]" },
              { label: `${applications.filter(a => a.status === "Accepted").length} Accepted`, color: "bg-[#0b61a1]", dot: "bg-[#0b61a1]" },
              { label: `${(job?.total_spots || 0) - applications.filter(a => a.status === "Accepted").length} Spots Left`, color: "text-red-500", dot: "bg-red-500" }
            ].map((chip, i) => (
              <div key={i} className="flex items-center gap-3 px-6 py-2.5 bg-white rounded-full shadow-sm border border-gray-100">
                <span className={`w-2 h-2 rounded-full ${chip.dot}`}></span>
                <span className={`text-[10px] font-black uppercase tracking-widest ${chip.color && chip.color.startsWith('text') ? chip.color : 'text-[#141b2b]'}`}>
                  {chip.label}
                </span>
              </div>
            ))}
          </div>
        </header>

        {/* Tab Bar */}
        <div className="flex gap-12 mb-12 border-b border-gray-100">
          {["ALL", "Pending", "Accepted", "Rejected"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-5 text-[10px] font-black uppercase tracking-[0.3em] transition-all relative ${
                activeTab === tab ? "text-[#022448]" : "text-gray-400 hover:text-[#022448]"
              }`}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#022448] rounded-full"></div>
              )}
            </button>
          ))}
        </div>

        {/* Applications List */}
        {filteredApplications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-8">
              <Archive className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-black text-[#022448] mb-2">No applications yet</h3>
            <p className="text-gray-500 max-w-md">Applications will appear here once students apply for this job posting.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {filteredApplications.map((app) => (
              <div 
                key={app.id} 
                className={`bg-white rounded-[3rem] p-10 shadow-sm border border-gray-100 relative overflow-hidden transition-all hover:shadow-xl ${
                  app.status === 'Pending' ? 'border-l-8 border-amber-400' : 
                  app.status === 'Accepted' ? 'border-l-8 border-green-500' : 'border-l-8 border-red-400'
                }`}
              >
                <div className="flex flex-col md:flex-row gap-10">
                  <div className="shrink-0 relative">
                    <img 
                      src={getMediaUrl(app.profile_picture, API_BASE) || getDefaultAvatar(app.student_name)} 
                      alt={app.student_name} 
                      className="w-24 h-24 rounded-[2rem] object-cover shadow-lg" 
                    />
                    {app.status === 'ACCEPTED' && (
                      <div className="absolute -bottom-2 -right-2 bg-green-500 text-white p-1.5 rounded-full border-4 border-white">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-2xl font-black text-[#022448] tracking-tight">{app.student_name}</h3>
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-1">
                          {app.department ? app.department + " • " : ""}{app.university || "University"}
                        </p>
                      </div>
                      {app.status === 'Pending' && (
                        <span className="bg-amber-50 text-amber-600 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border border-amber-100">
                          Pending Review
                        </span>
                      )}
                      {app.status === 'Accepted' && (
                        <div className="flex items-center gap-2 bg-green-50 text-green-600 px-4 py-1.5 rounded-full border border-green-100">
                          <CheckCircle2 className="w-3 h-3" />
                          <span className="text-[9px] font-black uppercase tracking-widest">Accepted</span>
                        </div>
                      )}
                      {app.status === 'Rejected' && (
                        <span className="bg-red-50 text-red-500 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border border-red-100">
                          Rejected
                        </span>
                      )}
                    </div>

                    {app.cover_note && (
                      <div className="bg-[#f1f3ff] p-8 rounded-[2rem] mb-8 relative border border-gray-50">
                        <Quote className="absolute top-4 left-4 text-[#022448]/5 w-16 h-16" />
                        <p className="text-sm text-gray-500 italic leading-relaxed font-medium relative z-10 pl-6">
                          "{app.cover_note}"
                        </p>
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                      <div className="flex items-center gap-4">
                        {app.resume_url && (
                          <div className="flex items-center gap-4 bg-[#f9f9ff] px-6 py-3 rounded-2xl border border-gray-100">
                            <FileText className="text-[#0b61a1] w-4 h-4" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{app.resume_url.split('/').pop()}</span>
                            <button 
                              onClick={() => {
                                const url = getMediaUrl(app.resume_url, API_BASE);
                                if (url) window.open(url, '_blank');
                              }}
                              className="text-[#0b61a1] hover:scale-110 transition-transform"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                        <button 
                          onClick={() => { setSelectedApp(app); setShowDetailsModal(true); }}
                          className="px-8 py-3 rounded-2xl text-sm font-bold text-[#022448] border-2 border-[#022448] hover:bg-[#022448] hover:text-white transition-all active:scale-95"
                        >
                          View Details
                        </button>
                      </div>

                      <div className="flex items-center gap-4 ml-auto">
                        {app.status === 'Pending' && (
                          <>
                            <button 
                              disabled={statusUpdating === app.id} 
                              onClick={() => openActionModal(app, 'DECLINE')} 
                              className="text-[10px] font-black uppercase tracking-widest text-red-400 hover:text-red-500 transition-colors mr-4 disabled:opacity-50"
                            >
                              Decline
                            </button>
                            <button 
                              disabled={statusUpdating === app.id || (jobDetails?.filled_spots >= jobDetails?.total_spots)} 
                              onClick={() => openActionModal(app, 'ACCEPT')} 
                              className="bg-[#022448] text-white px-12 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-[#022448]/20 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:bg-gray-400"
                            >
                              {jobDetails?.filled_spots >= jobDetails?.total_spots ? 'Slots Full' : 'Accept'}
                            </button>
                          </>
                        )}
                        {app.status === 'Accepted' && (
                          <div className="flex gap-4">
                            <button className="flex items-center gap-3 border-2 border-[#0b61a1] text-[#0b61a1] px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#0b61a1] hover:text-white transition-all">
                              <Handshake className="w-4 h-4" />
                              Mark as Referred
                            </button>
                            <button className="bg-[#f1f3ff] text-gray-400 px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest cursor-not-allowed">
                              Application Closed
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* View Details Modal */}
      {showDetailsModal && selectedApp && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[3rem] shadow-2xl max-w-3xl w-full max-h-[80vh] overflow-y-auto relative">
            <button 
              onClick={() => setShowDetailsModal(false)}
              className="absolute top-8 right-8 w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100 transition-all"
            >
              <XCircle className="w-5 h-5 text-gray-400" />
            </button>
            <div className="p-12">
              <div className="flex items-start gap-8 mb-10">
                <img 
                  src={getMediaUrl(selectedApp.profile_picture, API_BASE) || getDefaultAvatar(selectedApp.student_name)} 
                  alt={selectedApp.student_name} 
                  className="w-24 h-24 rounded-[2rem] object-cover shadow-lg" 
                />
                <div>
                  <h2 className="text-3xl font-black text-[#022448] tracking-tight">{selectedApp.student_name}</h2>
                  <p className="text-gray-400 font-bold text-sm mt-2">
                    {selectedApp.department ? selectedApp.department + " • " : ""}{selectedApp.university || "University"}
                  </p>
                </div>
              </div>
              
              {selectedApp.cover_note && (
                <div className="mb-8">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-4">Cover Note</h4>
                  <div className="bg-[#f1f3ff] p-8 rounded-[2rem] relative border border-gray-50">
                    <Quote className="absolute top-4 left-4 text-[#022448]/5 w-16 h-16" />
                    <p className="text-sm text-gray-500 italic leading-relaxed font-medium relative z-10 pl-6">
                      "{selectedApp.cover_note}"
                    </p>
                  </div>
                </div>
              )}
              
              {selectedApp.resume_url && (
                <div className="mb-10">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-4">Resume</h4>
                  <a 
                    href={getMediaUrl(selectedApp.resume_url, API_BASE)} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 bg-[#f9f9ff] px-8 py-4 rounded-2xl border border-gray-100 hover:bg-[#f1f3ff] transition-all"
                  >
                    <FileText className="text-[#0b61a1] w-6 h-6" />
                    <span className="font-bold text-[#022448]">{selectedApp.resume_url.split('/').pop()}</span>
                    <Info className="text-gray-400 w-4 h-4 ml-auto" />
                  </a>
                </div>
              )}
              
              {selectedApp.status === 'Pending' && (
                <div className="flex gap-4 pt-4">
                  <button 
                    onClick={() => { setShowDetailsModal(false); openActionModal(selectedApp, 'DECLINE'); }}
                    className="flex-1 px-8 py-4 rounded-2xl border-2 border-red-400 text-red-500 font-black text-xs uppercase tracking-widest hover:bg-red-50 transition-all"
                  >
                    Decline
                  </button>
                  <button 
                    disabled={jobDetails?.filled_spots >= jobDetails?.total_spots}
                    onClick={() => { setShowDetailsModal(false); openActionModal(selectedApp, 'ACCEPT'); }}
                    className="flex-1 px-8 py-4 rounded-2xl bg-[#022448] text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-[#022448]/20 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:bg-gray-400"
                  >
                    {jobDetails?.filled_spots >= jobDetails?.total_spots ? 'Slots Full' : 'Accept'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Accept/Decline with Reason Modal */}
      {showActionModal && selectedApp && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-[3rem] shadow-2xl max-w-md w-full relative">
            <button 
              onClick={() => setShowActionModal(false)}
              className="absolute top-8 right-8 w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100 transition-all"
            >
              <XCircle className="w-5 h-5 text-gray-400" />
            </button>
            <div className="p-12">
              <h2 className="text-3xl font-black text-[#022448] tracking-tight mb-2">
                {actionType === 'ACCEPT' ? 'Accept Application' : 'Decline Application'}
              </h2>
              <p className="text-gray-500 text-lg font-medium mb-8">
                {actionType === 'ACCEPT' 
                  ? 'Add a note for the student (optional)' 
                  : 'Let the student know why you declined (optional)'}
              </p>
              
              <div className="mb-10">
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">
                  Your Note
                </label>
                <textarea 
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder={actionType === 'ACCEPT' 
                    ? 'e.g., "Great to see your background! I\'ll review your resume and reach out soon."' 
                    : 'e.g., "Unfortunately, I don\'t have openings for this role right now, but feel free to apply again in 6 months."'}
                  className="w-full px-6 py-4 rounded-2xl border-2 border-gray-100 text-[#022448] font-semibold placeholder-gray-300 focus:outline-none focus:border-[#022448]/30 focus:ring-4 focus:ring-[#022448]/10 resize-none min-h-[160px]"
                />
              </div>
              
              <div className="flex gap-4">
                <button 
                  onClick={() => setShowActionModal(false)}
                  className="flex-1 px-8 py-4 rounded-2xl border-2 border-gray-100 text-gray-400 font-bold text-sm hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleActionSubmit}
                  disabled={statusUpdating === selectedApp.id}
                  className={`flex-1 px-8 py-4 rounded-2xl text-white font-black text-xs uppercase tracking-widest shadow-xl transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50 ${
                    actionType === 'ACCEPT' ? 'bg-[#022448]' : 'bg-red-500'
                  }`}
                >
                  {statusUpdating === selectedApp.id ? 'Processing...' : (actionType === 'ACCEPT' ? 'Confirm Accept' : 'Confirm Decline')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <Footer />
    </div>
  );
}
