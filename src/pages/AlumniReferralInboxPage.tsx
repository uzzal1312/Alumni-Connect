import React, { useState, useEffect } from "react";
import { 
  Briefcase, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  ExternalLink, 
  FileText, 
  History,
  ShieldCheck,
  Send,
  MessageSquare,
  Search,
  Quote,
  Info
} from "lucide-react";
import AlumniNavbar from "../components/AlumniNavbar";
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

interface ReferralRequest {
  id: number;
  student_id: number;
  alumni_id: number;
  company: string;
  position: string;
  message: string;
  status: string;
  created_at: string;
  updated_at: string;
  student_name?: string;
  student_picture?: string;
  university?: string;
  department?: string;
  resume_url?: string;
  note?: string;
}

export default function AlumniReferralInboxPage() {
  const [activeTab, setActiveTab] = useState("All");
  const [referrals, setReferrals] = useState<ReferralRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, API_BASE } = useAuth();
  const [acceptingId, setAcceptingId] = useState<number | null>(null);
  const [rejectingId, setRejectingId] = useState<number | null>(null);
  // Modal state for accept/reject
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'accept' | 'reject' | null>(null);
  const [selectedReferral, setSelectedReferral] = useState<ReferralRequest | null>(null);
  const [note, setNote] = useState('');

  const loadReferrals = async () => {
    if (!user) return;
    try {
      const response = await fetch(`${API_BASE}/referrals/alumni/${user.id}`);
      const data = await response.json();
      setReferrals(data.referralRequests || []);
    } catch (error) {
      console.error("Failed to fetch referrals:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReferrals();
  }, [user, API_BASE]);

  const openModal = (type: 'accept' | 'reject', referral: ReferralRequest) => {
    setModalType(type);
    setSelectedReferral(referral);
    setNote('');
    setShowModal(true);
  };

  const handleModalSubmit = async () => {
    if (!selectedReferral || !user?.id) return;
    const status = modalType === 'accept' ? 'Accepted' : 'Rejected';
    const id = selectedReferral.id;
    const isAccepting = modalType === 'accept';
    isAccepting ? setAcceptingId(id) : setRejectingId(id);
    try {
      const response = await fetch(`${API_BASE}/referrals/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, note: note.trim() || null })
      });
      if (!response.ok) throw new Error('Failed to update referral');
      await loadReferrals();
      setShowModal(false);
    } catch (error) {
      console.error('Error updating referral:', error);
    } finally {
      setAcceptingId(null);
      setRejectingId(null);
    }
  };

  const filteredReferrals = activeTab === "All" 
    ? referrals 
    : referrals.filter(r => {
        // Map "Declined" tab to "Rejected" status (database uses Rejected)
        const statusToFilter = activeTab === "Declined" ? "Rejected" : activeTab;
        return r.status === statusToFilter;
      });


  return (
    <div className="bg-[#f9f9ff] min-h-screen font-sans text-[#141b2b] antialiased">
      <AlumniNavbar activePage="referrals" />

      <main className="pt-24 pb-20 px-12 max-w-[1400px] mx-auto">
        <header className="mb-16 max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#0b61a1] mb-3 block">Referral Management</span>
              <h1 className="text-5xl font-black text-[#022448] tracking-tighter">Referral Inbox</h1>
            </div>
            <div className="flex p-1.5 bg-[#f1f3ff] rounded-[1.5rem] border border-gray-100 shadow-inner">
              {["Pending", "Accepted", "Declined", "All"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-8 py-3 rounded-xl text-sm font-black uppercase tracking-widest transition-all ${
                    activeTab === tab 
                    ? "bg-white text-[#022448] shadow-md scale-105" 
                    : "text-gray-400 hover:text-[#022448]"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </header>

        <div className="max-w-6xl mx-auto space-y-12">
          {loading && <p className="text-center text-gray-500">Loading...</p>}
          {!loading && filteredReferrals.map((ref) => (
            <article 
              key={ref.id} 
              className={`bg-white rounded-[3rem] shadow-sm border border-gray-100 flex flex-col md:flex-row overflow-hidden hover:shadow-2xl hover:border-[#022448]/5 transition-all group ${
                ref.status === 'Accepted' ? 'opacity-70 grayscale-[0.5]' : ''
              }`}
            >
              {/* Left Column: Profile Info */}
              <div className="md:w-1/3 p-12 bg-[#f1f3ff]/50 flex flex-col items-center text-center border-r border-gray-100/50">
                <div className="relative mb-8">
                  <img 
                    src={getMediaUrl(ref.student_picture, API_BASE) || getDefaultAvatar(ref.student_name || "Student")} 
                    alt={ref.student_name || "Student"} 
                    className="w-32 h-32 rounded-[2rem] object-cover ring-8 ring-white shadow-2xl group-hover:scale-105 transition-transform" 
                  />
                  {ref.status === 'Pending' && (
                    <div className="absolute -bottom-3 -right-3 bg-green-500 text-white p-2 rounded-full shadow-lg border-4 border-white">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  )}
                </div>
                <h3 className="text-2xl font-black text-[#022448] mb-1">{ref.student_name}</h3>
                <p className="text-gray-400 font-bold text-sm mb-6">{ref.department} • {ref.university || "University"}</p>
                
                <div className="flex items-center gap-3 bg-white px-5 py-2.5 rounded-2xl shadow-sm border border-gray-50">
                  <ShieldCheck className="text-[#0b61a1] w-4 h-4 fill-current" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#0b61a1]">{ref.company}</span>
                </div>

                <div className="mt-10 w-full pt-8 border-t border-gray-100">
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-300 mb-2">Target Role</p>
                  <p className="text-sm font-black text-[#022448] leading-tight">{ref.position}</p>
                </div>
              </div>

              {/* Right Column: Content & Actions */}
              <div className="flex-1 p-12 flex flex-col relative">
                <div className="flex justify-between items-start mb-8">
                  {ref.status === 'Pending' && (
                    <div className="flex items-center gap-2 text-red-500 font-black text-[10px] uppercase tracking-[0.2em] bg-red-50 px-4 py-2 rounded-full border border-red-100">
                      <Clock className="w-3.5 h-3.5" />
                      New Request
                    </div>
                  )}
                  {ref.status === 'Accepted' && (
                    <div className="flex items-center gap-2 text-[#0b61a1] font-black text-[10px] uppercase tracking-[0.2em] bg-[#d5e3ff] px-4 py-2 rounded-full">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Request Accepted
                    </div>
                  )}
                  {ref.status === 'Rejected' && (
                    <div className="flex items-center gap-2 text-gray-400 font-black text-[10px] uppercase tracking-[0.2em] bg-gray-100 px-4 py-2 rounded-full">
                      <History className="w-3.5 h-3.5" />
                      Declined
                    </div>
                  )}
                  <button className="flex items-center gap-2 text-[#022448] text-xs font-black uppercase tracking-widest hover:opacity-70 transition-all border-b-2 border-transparent hover:border-[#022448]" disabled={!ref.resume_url} onClick={() => ref.resume_url && window.open(getMediaUrl(ref.resume_url, API_BASE), '_blank')}>
                    <FileText className="w-4 h-4" />
                    View Resume
                  </button>
                </div>

                <div className="bg-[#f9f9ff] p-8 rounded-[2rem] mb-10 relative border border-gray-100">
                  <Quote className="absolute -top-4 -left-4 text-[#022448]/5 w-16 h-16" />
                  <p className="text-sm text-gray-500 italic leading-relaxed font-medium relative z-10">
                    "{ref.message}"
                  </p>
                </div>

                <div className="mt-auto flex items-center justify-between gap-6">
                  {ref.status === 'Pending' && (
                    <>
                      <button 
                        onClick={() => openModal('reject', ref)}
                        disabled={acceptingId === ref.id || rejectingId === ref.id}
                        className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {rejectingId === ref.id ? '...' : 'Decline Request'}
                      </button>
                      <button 
                        onClick={() => openModal('accept', ref)}
                        disabled={acceptingId === ref.id || rejectingId === ref.id}
                        className="bg-[#022448] text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-[#022448]/20 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {acceptingId === ref.id ? '...' : 'Accept Referral'}
                      </button>
                    </>
                  )}
                  {ref.status === 'Accepted' && (
                    <>
                      <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 italic">
                        <Info className="w-3.5 h-3.5" />
                        Submit on company portal
                      </div>
                      <div className="ml-auto flex items-center gap-3 text-[#0b61a1] font-black text-xs uppercase tracking-[0.2em]">
                        <CheckCircle2 className="w-5 h-5 fill-current" />
                        Request Accepted
                      </div>
                    </>
                  )}
                  {ref.status === 'Rejected' && (
                    <div className="ml-auto flex items-center gap-3 text-gray-400 font-black text-xs uppercase tracking-[0.2em]">
                      <XCircle className="w-5 h-5 fill-current" />
                      Request Declined
                    </div>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>

      <Footer />
      {/* Accept/Reject Modal */}
      {showModal && selectedReferral && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-y-auto relative">
            {/* Modal Header */}
            <div className="p-8 border-b border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl font-black text-[#022448]">
                  {modalType === 'accept' ? 'Accept Referral' : 'Decline Request'}
                </h2>
                <button 
                  onClick={() => setShowModal(false)}
                  className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100 transition-all"
                >
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="text-gray-500 text-sm font-semibold">
                {modalType === 'accept' 
                  ? 'Add a note for the student (optional)' 
                  : 'Let the student know why you declined (optional)'
                }
              </p>
            </div>
            {/* Modal Body */}
            <div className="p-8">
              <div className="mb-6">
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
                  Note for Student
                </label>
                <textarea 
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder={modalType === 'accept' 
                    ? 'e.g., "I\'d be happy to refer you! I\'ll review your resume and reach out soon."' 
                    : 'e.g., "Unfortunately, I don\'t have openings in this role right now, but feel free to reach out in 6 months."'
                  }
                  className="w-full px-5 py-4 rounded-2xl border-2 border-gray-100 text-[#022448] font-semibold placeholder-gray-300 focus:outline-none focus:border-[#022448]/30 focus:ring-4 focus:ring-[#022448]/10 resize-none min-h-[160px]"
                />
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-6 py-3.5 rounded-2xl text-sm font-bold text-gray-500 hover:bg-gray-50 transition-all border-2 border-gray-100"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleModalSubmit}
                  disabled={acceptingId === selectedReferral.id || rejectingId === selectedReferral.id}
                  className={`flex-1 px-6 py-3.5 rounded-2xl text-sm font-black uppercase tracking-widest text-white shadow-lg transition-all hover:shadow-xl hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${modalType === 'accept' ? 'bg-[#022448]' : 'bg-red-500'}`}
                >
                  {acceptingId === selectedReferral.id || rejectingId === selectedReferral.id ? 'Processing...' : (modalType === 'accept' ? 'Confirm Accept' : 'Confirm Decline')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}