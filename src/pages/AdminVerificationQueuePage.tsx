import React, { useState, useEffect } from "react";
import { 
  Search, 
  Bell, 
  CheckCircle2,
  XCircle,
  ExternalLink,
  Calendar,
  Briefcase,
  BookOpen,
  Filter,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Info,
  X
} from "lucide-react";
import Footer from "../components/Footer";
import AdminSidebar from "../components/AdminSidebar";
import { useAuth } from "../contexts/AuthContext";

const ApplicationDetailsModal = ({ isOpen, onClose, data, onApprove, onReject }: { isOpen: boolean, onClose: () => void, data: any, onApprove: () => void, onReject: () => void }) => {
  if (!isOpen || !data) return null;

  let history: any[] = [];
  if (data.work_history) {
    try {
      history = JSON.parse(data.work_history);
    } catch (e) {
      history = [];
    }
  }
  const transformedData = {
    id: data.id,
    name: data.full_name || '',
    email: data.email || '',
    registered: data.created_at ? new Date(data.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '',
    company: data.current_company || 'N/A',
    role: data.current_job_title || 'N/A',
    classOf: data.graduation_year || 'N/A',
    degree: data.field_of_study || 'N/A',
    history: history.map((h: any) => ({
      company: h.company || h.company_name,
      role: h.job_title,
      years: h.start_date ? `${h.start_date} - ${h.end_date || 'Present'}` : 'N/A'
    })),
    linkedin: data.linkedin_url || '',
    avatar: data.profile_picture || ''
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-12 overflow-y-auto">
      <div className="fixed inset-0 bg-[#022448]/60 backdrop-blur-xl" onClick={onClose}></div>
      <div className="relative w-full max-w-5xl bg-white rounded-[3rem] shadow-2xl p-16 animate-in zoom-in-95 fade-in duration-300 my-auto">
        <button onClick={onClose} className="absolute top-10 right-10 p-4 hover:bg-gray-100 rounded-2xl text-gray-400 transition-colors">
          <X className="w-6 h-6" />
        </button>

        <header className="mb-12">
          <h2 className="text-[3rem] font-black text-[#022448] tracking-tighter mb-4">Registration Details</h2>
          <p className="text-gray-500 text-lg font-medium">Complete verification breakdown for {transformedData.name}.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Phase 1: Personal Info */}
          <div className="space-y-8 p-10 bg-[#f1f3ff] rounded-[2.5rem]">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                <Search className="w-5 h-5 text-[#022448]" />
              </div>
              <h3 className="text-sm font-black uppercase tracking-widest text-[#022448]">Personal Info</h3>
            </div>
            <div className="space-y-6">
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">Full Name</p>
                <p className="text-sm font-bold text-[#022448]">{transformedData.name}</p>
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">Email Address</p>
                <p className="text-sm font-bold text-[#022448]">{transformedData.email}</p>
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">LinkedIn</p>
                {transformedData.linkedin ? (
                  <a href={transformedData.linkedin} target="_blank" rel="noreferrer" className="text-sm font-bold text-[#0b61a1] hover:underline flex items-center gap-2">
                    {transformedData.linkedin}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <p className="text-sm font-bold text-gray-400">Not provided</p>
                )}
              </div>
            </div>
          </div>

          {/* Phase 2: Academic Info */}
          <div className="space-y-8 p-10 bg-[#f8f9ff] border border-gray-100 rounded-[2.5rem]">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                <BookOpen className="w-5 h-5 text-[#022448]" />
              </div>
              <h3 className="text-sm font-black uppercase tracking-widest text-[#022448]">Academic Info</h3>
            </div>
            <div className="space-y-6">
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">Field of Study</p>
                <p className="text-sm font-bold text-[#022448]">{transformedData.degree}</p>
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">Graduation Year</p>
                <p className="text-sm font-bold text-[#022448]">{transformedData.classOf}</p>
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">Department</p>
                <p className="text-sm font-bold text-[#022448]">Engineering & Tech</p>
              </div>
            </div>
          </div>

          {/* Phase 3: Professional Info */}
          <div className="space-y-8 p-10 bg-white border border-gray-100 rounded-[2.5rem] shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#022448] flex items-center justify-center shadow-lg">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-sm font-black uppercase tracking-widest text-[#022448]">Professional Info</h3>
            </div>
            <div className="space-y-6">
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">Current Company</p>
                <p className="text-sm font-bold text-[#022448]">{transformedData.company}</p>
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">Job Title</p>
                <p className="text-sm font-bold text-[#022448]">{transformedData.role}</p>
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">Work History</p>
                <div className="space-y-2 mt-2">
                  {transformedData.history?.map((h: any, i: number) => (
                    <div key={i} className="text-xs font-bold text-gray-500 bg-[#f1f3ff] p-3 rounded-xl flex justify-between">
                      <span>{h.company}</span>
                      <span className="text-[10px] text-gray-400">{h.years}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 flex justify-end gap-6">
          <button onClick={onClose} className="px-10 py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest text-gray-400 hover:text-[#022448] transition-colors">
            Close Application
          </button>
          <button onClick={onApprove} className="bg-[#022448] text-white px-16 py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-[#022448]/30 hover:opacity-90 active:scale-[0.98] transition-all">
            Verify Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default function AdminVerificationQueuePage() {
  const { API_BASE, token } = useAuth();
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchApplications = async () => {
    try {
      const response = await fetch(`${API_BASE}/auth/admin/applications/pending`, {
        headers: {
          ...(token && { 'Authorization': `Bearer ${token}` })
        }
      });
      if (response.ok) {
        const data = await response.json();
        setApplications(data.applications || []);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const approveApplication = async (id: number) => {
    try {
      const response = await fetch(`${API_BASE}/auth/admin/applications/${id}/approve`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        }
      });
      if (response.ok) {
        fetchApplications();
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error('Error approving application:', error);
    }
  };

  const rejectApplication = async (id: number) => {
    try {
      const response = await fetch(`${API_BASE}/auth/admin/applications/${id}/reject`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify({ notes: 'Rejected by admin' })
      });
      if (response.ok) {
        fetchApplications();
      }
    } catch (error) {
      console.error('Error rejecting application:', error);
    }
  };

  const handleViewDetails = (app: any) => {
    setSelectedApp(app);
    setIsModalOpen(true);
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  if (loading) {
    return (
      <div className="bg-[#f9f9ff] min-h-screen font-sans text-[#141b2b] antialiased flex items-center justify-center">
        <div className="text-gray-500 text-lg">Loading applications...</div>
      </div>
    );
  }

  return (
    <div className="bg-[#f9f9ff] min-h-screen font-sans text-[#141b2b] antialiased">
      <AdminSidebar activePage="verifications" />

      <main className="lg:ml-72 min-h-screen flex flex-col relative">
        {/* Top Header */}
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-50">
          <div className="flex justify-between items-center px-12 h-20">
            <div className="relative w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-5 h-5" />
              <input 
                className="w-full pl-12 pr-6 py-3 bg-[#f1f3ff] border-none rounded-2xl text-sm font-bold text-[#022448] focus:ring-4 focus:ring-[#022448]/5 transition-all" 
                placeholder="Search candidates..." 
                type="text"
              />
            </div>

            <div className="flex items-center gap-6">
              <button className="text-gray-400 hover:text-[#022448] transition-colors p-2 relative">
                <Bell className="w-6 h-6" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
              <div className="h-8 w-[2px] bg-gray-100 mx-2"></div>
              <div className="text-right">
                <p className="text-sm font-black text-[#022448]">Admin Profile</p>
                <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Super Administrator</p>
              </div>
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC3alCvllfA7Zd5h90qRg76TBlXrR-w6xJzUhZqlH8WvNfwOHEP9jknc-nuL2ohBbfgKD93Mw_mlpNyDlscoR0XhS87ISXZDww-9YNpZlgcOCAFPtJ9bSmoVvw5Nomm7zYps5PivHqdy0N8r2E7l1EEtTXb818qCciy-kX8BtomQt809PPBYgfWKgU7JUsQW98Jh4PP3kRa1xOWbt63RIDjS6kmhDL88ow5HfzpvvblYmInrlWGOt8arwvr_RSWhB7IdI6J-S9zwjg" 
                className="w-10 h-10 rounded-full object-cover ring-4 ring-[#f1f3ff]" 
                alt="Admin"
              />
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-12 space-y-12 flex-1">
          {/* Header Section */}
          <section className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-4">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#0b61a1]">Verification Hub</span>
              <h1 className="text-[4rem] font-black text-[#022448] tracking-tighter leading-none -ml-1">Pending Alumni</h1>
              <p className="text-gray-500 font-medium flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
                {applications.length} applications require manual review to maintain network integrity
              </p>
            </div>
            <div className="flex gap-4">
              <button className="flex items-center gap-3 px-8 py-4 bg-white text-[#022448] font-black text-[10px] uppercase tracking-widest rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                <Filter className="w-4 h-4" />
                Filter
              </button>
              <button className="flex items-center gap-3 px-8 py-4 bg-white text-[#022448] font-black text-[10px] uppercase tracking-widest rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                <ArrowUpDown className="w-4 h-4" />
                Newest First
              </button>
            </div>
          </section>

          {/* Applications Grid */}
          <div className="grid grid-cols-1 gap-10">
            {applications.map((app) => {
              let history = [];
              if (app.work_history) {
                try {
                  history = JSON.parse(app.work_history);
                } catch (e) {
                  history = [];
                }
              }
              const transformedHistory = history.map((h: any) => ({
                company: h.company || h.company_name,
                role: h.job_title,
                years: h.start_date ? `${h.start_date} - ${h.end_date || 'Present'}` : 'N/A'
              }));
              const displayData = {
                ...app,
                registered: new Date(app.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
                classOf: app.graduation_year || 'N/A',
                history: transformedHistory
              };

              return (
                <article key={app.id} className="bg-white rounded-[3rem] shadow-sm border border-gray-50 overflow-hidden hover:shadow-2xl hover:border-[#022448]/10 transition-all group">
                  <div className="p-10">
                    {/* Top Row */}
                    <div className="flex flex-col lg:flex-row items-start justify-between gap-8 mb-12">
                      <div className="flex items-center gap-6">
                        <div className="w-20 h-20 rounded-[2rem] overflow-hidden ring-4 ring-[#f1f3ff] shadow-inner">
                          {app.profile_picture ? (
                            <img src={app.profile_picture} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={app.full_name} />
                          ) : (
                            <div className="w-full h-full bg-[#022448] flex items-center justify-center text-white font-black text-2xl">
                              {app.full_name?.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div>
                          <h3 className="text-2xl font-black text-[#022448] tracking-tight">{app.full_name}</h3>
                          <p className="text-sm font-bold text-gray-400 mt-1">{app.email}</p>
                          <div className="flex items-center gap-2 mt-3 text-[9px] font-black uppercase tracking-widest text-gray-300">
                            <Calendar className="w-3 h-3" />
                            Registered {displayData.registered}
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleViewDetails(app)}
                        className="flex items-center gap-2 text-[#0b61a1] font-black text-[10px] uppercase tracking-widest hover:text-[#022448] transition-colors group/link"
                      >
                        View Full Application
                        <ExternalLink className="w-4 h-4 group-hover/link:translate-x-1 group-hover/link:-translate-y-1 transition-transform" />
                      </button>
                    </div>

                    {/* Summary Info */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 p-10 bg-[#f8f9ff] rounded-[2.5rem] border border-[#f1f3ff] mb-10">
                      <div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">Current Company</p>
                        <p className="text-xl font-black text-[#022448] tracking-tight">{app.current_company || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">Primary Role</p>
                        <p className="text-xl font-black text-[#022448] tracking-tight">{app.current_job_title || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">Class of</p>
                        <p className="text-xl font-black text-[#022448] tracking-tight">{app.graduation_year || 'N/A'}</p>
                      </div>
                    </div>

                    {/* Work History & Actions */}
                    <div className="flex flex-col xl:flex-row gap-16">
                      <div className="flex-1">
                        <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-6 flex items-center gap-2">
                          <Briefcase className="w-3 h-3" />
                          Work History Comparison
                        </p>
                        <div className="space-y-4">
                          {transformedHistory.map((h, i) => (
                            <div key={i} className="flex items-center justify-between p-5 bg-white border border-gray-100 rounded-2xl group/item hover:bg-[#f1f3ff] transition-all">
                              <div>
                                <p className="text-sm font-black text-[#022448]">{h.company}</p>
                                <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mt-1">{h.role}</p>
                              </div>
                              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{h.years}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="xl:w-80 flex flex-col justify-end gap-4">
                        <button 
                          onClick={() => approveApplication(app.id)}
                          className="w-full bg-emerald-500 text-white font-black py-5 rounded-2xl flex items-center justify-center gap-3 hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-500/20 active:scale-[0.98]"
                        >
                          <CheckCircle2 className="w-5 h-5" />
                          Approve Alumni
                        </button>
                        <button 
                          onClick={() => rejectApplication(app.id)}
                          className="w-full border-2 border-red-50 text-red-400 font-black py-5 rounded-2xl flex items-center justify-center gap-3 hover:bg-red-50 transition-all active:scale-[0.98]"
                        >
                          <XCircle className="w-5 h-5" />
                          Reject Application
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Pagination */}
          <div className="mt-12 flex items-center justify-between">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Showing {applications.length} pending verification{applications.length !== 1 ? 's' : ''}</p>
            <div className="flex gap-3">
              <button className="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-gray-300 hover:text-[#022448] transition-all shadow-sm">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button className="w-12 h-12 rounded-2xl bg-[#022448] text-white flex items-center justify-center font-black shadow-xl shadow-[#022448]/20">1</button>
              <button className="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-gray-300 hover:text-[#022448] transition-all shadow-sm">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Security Alert */}
        <div className="fixed bottom-12 right-12 z-[100] animate-in slide-in-from-right-10 fade-in duration-700">
          <div className="bg-[#022448] text-white px-8 py-6 rounded-[2.5rem] shadow-2xl flex items-center gap-6 border border-white/10 group">
            <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:rotate-12 transition-transform">
              <Info className="w-6 h-6 text-white" />
            </div>
            <div className="pr-12">
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/50 mb-1">Security Alert</p>
              <p className="text-sm font-bold">{applications.length} verifications are pending.</p>
            </div>
            <button className="text-white/30 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <Footer />
      </main>

      <ApplicationDetailsModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        data={selectedApp}
        onApprove={() => selectedApp?.id && approveApplication(selectedApp.id)}
        onReject={() => selectedApp?.id && rejectApplication(selectedApp.id)}
      />
    </div>
  );
}
