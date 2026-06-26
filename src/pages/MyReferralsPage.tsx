import React, { useState, useEffect } from "react";
import { 
  Search, 
  Bell, 
  MessageSquare, 
  ChevronDown,
  Building2,
  MapPin,
  Clock,
  CheckCircle2,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
  Zap,
  ArrowRight
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
  alumni_name?: string;
  alumni_picture?: string;
  resume_url?: string;
  note?: string;
}

export default function MyReferralsPage() {
  const [activeTab, setActiveTab] = useState("ACTIVE");
  const [referrals, setReferrals] = useState<ReferralRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, API_BASE } = useAuth();
  // Modal state for viewing note
  const [showModal, setShowModal] = useState(false);
  const [selectedReferral, setSelectedReferral] = useState<ReferralRequest | null>(null);

  useEffect(() => {
    const fetchReferrals = async () => {
      if (!user) return;
      try {
        const response = await fetch(`${API_BASE}/referrals/student/${user.id}`);
        const data = await response.json();
        setReferrals(data.referralRequests || []);
      } catch (error) {
        console.error("Failed to fetch referrals:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReferrals();
  }, [user, API_BASE]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Accepted": return "bg-green-50 text-green-600";
      case "Pending": return "bg-gray-100 text-gray-500";
      case "Rejected": return "bg-red-50 text-red-600";
      default: return "bg-[#022448]/10 text-[#022448]";
    }
  };

  const getLogoBg = (company: string) => {
    const hash = company.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const colors = ["bg-blue-50", "bg-red-50", "bg-sky-50", "bg-orange-50", "bg-purple-50"];
    return colors[hash % colors.length];
  };

  const getLogoColor = (company: string) => {
    const hash = company.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const colors = ["text-blue-600", "text-red-600", "text-sky-600", "text-orange-600", "text-purple-600"];
    return colors[hash % colors.length];
  };

  const activeReferrals = referrals.filter(r => ["Pending", "Accepted"].includes(r.status));
  const pastReferrals = referrals.filter(r => ["Rejected"].includes(r.status));
  const currentDisplay = activeTab === "ACTIVE" ? activeReferrals : pastReferrals;

  return (
    <>
      <div className="bg-[#f9f9ff] min-h-screen font-sans text-[#141b2b] antialiased">
        <StudentNavbar activePage="referrals" />

        <main className="max-w-7xl mx-auto px-8 py-16">
          {/* Header Section */}
          <header className="mb-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <h1 className="text-[3.5rem] font-bold tracking-tight text-[#022448] leading-tight mb-2">My Referrals</h1>
                <p className="text-lg text-gray-500 font-medium">Track your active and past referral requests</p>
              </div>
            </div>
          </header>

          {/* Tabs Navigation */}
          <div className="flex gap-10 mb-12 border-b border-gray-200">
            {["ACTIVE", "PAST REFERRALS"].map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 text-sm font-bold tracking-wide transition-all border-b-2 ${
                  activeTab === tab 
                  ? "border-[#022448] text-[#022448]" 
                  : "border-transparent text-gray-400 hover:text-[#022448]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Referral Cards Grid */}
          <div className="grid grid-cols-1 gap-8 mb-20">
            {loading && <p className="text-center text-gray-500">Loading...</p>}
            {!loading && currentDisplay.map((ref) => (
              <div key={ref.id} className="group bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-[#022448]/5 transition-all duration-300">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                  <div className="flex items-start gap-6">
                    <div className={`w-16 h-16 rounded-2xl ${getLogoBg(ref.company)} flex items-center justify-center ${getLogoColor(ref.company)} font-black text-2xl shadow-inner`}>
                      {ref.company.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-xl font-bold text-[#022448]">{ref.position}</h3>
                        <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-tighter ${getStatusColor(ref.status)}`}>
                          {ref.status}
                        </span>
                      </div>
                      <p className="text-gray-500 font-medium mb-4">{ref.company}</p>
                      <div className="flex items-center gap-2">
                        <img 
                          src={getMediaUrl(ref.alumni_picture, API_BASE) || getDefaultAvatar(ref.alumni_name || "Alumni")} 
                          alt={ref.alumni_name || "Alumni"} 
                          className="w-6 h-6 rounded-full object-cover border border-gray-100" 
                        />
                        <span className="text-sm text-gray-500">Referred by <span className="font-bold text-[#022448]">{ref.alumni_name}</span></span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col lg:items-end gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Created At</span>
                    <span className="text-[#022448] font-bold text-lg">{new Date(ref.created_at).toLocaleDateString()}</span>
                    {/* Buttons based on status */}
                    {activeTab === 'ACTIVE' && ref.status === 'Accepted' && (
                      <button 
                        onClick={() => { setSelectedReferral(ref); setShowModal(true); }}
                        className="mt-4 px-8 py-3.5 rounded-xl text-sm font-bold transition-all active:scale-95 shadow-lg bg-gradient-to-br from-[#022448] to-[#1e3a5f] text-white shadow-[#022448]/20"
                      >
                        View Details
                      </button>
                    )}
                    {activeTab === 'PAST REFERRALS' && ref.status === 'Rejected' && ref.note && (
                      <button 
                        onClick={() => { setSelectedReferral(ref); setShowModal(true); }}
                        className="mt-4 px-8 py-3.5 rounded-xl text-sm font-bold transition-all active:scale-95 shadow-lg border-2 border-gray-200 text-gray-600"
                      >
                        View Reason
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {currentDisplay.length === 0 && (
              <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                <p className="text-gray-400 font-medium italic">No {activeTab.toLowerCase()} referrals found.</p>
              </div>
            )}
          </div>

          {/* Asymmetric Mentor Spotlight Section */}
          <section className="relative mt-32 mb-16">
            <div className="flex flex-col md:flex-row items-center gap-16">
              <div className="relative w-full md:w-1/2 group">
                <div className="absolute -top-6 -left-6 w-full h-full bg-[#022448]/5 rounded-[2rem] -z-10 transition-transform group-hover:translate-x-2 group-hover:translate-y-2"></div>
                <img 
                  alt="Mentor spotlight" 
                  className="w-full h-[480px] object-cover rounded-[2rem] shadow-2xl" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuA14S6FFYf9kuX5Mnkw2OHO7XI12lX3emicefImoYJTrIXs2Gm9dQ5qbtp09YLOo3RbP_1F08vXmLdxNxyIzbf5lTBFu7ZtBVNbYyj07JoGgIjQYd6TjXhXMW5C1Uri9OdL2DoE4VrTU-eNrDPOLI-ftgszOvYrteaYjQ_nrsp72z3m7moEmEu8-pr8eT0UJQf_JxWwknIkIgwq6Et7ITaAp4TYidDsLrXCyVghabTVhNjCOwA3SnuT5wRtewZ-v_KocHyBIFUlG3U"
                />
                <div className="absolute -bottom-8 -right-8 bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl max-w-xs border border-white/20">
                  <p className="text-[#022448] font-black text-xl mb-1">Sarah Jenkins</p>
                  <p className="text-sm text-gray-500 font-bold uppercase tracking-tight">Head of Design at Meta</p>
                  <div className="flex items-center gap-2 mt-4 text-[#0b61a1]">
                    <ShieldCheck className="w-4 h-4 fill-current" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Top Referrer</span>
                  </div>
                </div>
              </div>
              <div className="w-full md:w-1/2 md:pl-12">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#0b61a1] mb-6 block">Elevate Your Career</span>
                <h2 className="text-5xl font-black text-[#022448] tracking-tighter mb-8 leading-[1.1]">Increase your referral chances by 40%</h2>
                <p className="text-xl text-gray-500 leading-relaxed mb-10 font-medium">
                  Connect with top-tier mentors who can provide direct internal referrals. Our spotlighted alumni have helped over 500 students secure roles in Fortune 500 companies this year alone.
                </p>
                <div className="flex flex-col sm:flex-row gap-6">
                  <button className="px-10 py-5 rounded-2xl bg-[#022448] text-white font-bold text-lg shadow-xl shadow-[#022448]/20 hover:opacity-90 transition-all active:scale-95 flex items-center justify-center gap-3">
                    Browse Mentors
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
      {/* View Note Modal */}
      {showModal && selectedReferral && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-y-auto relative">
            {/* Modal Header */}
            <div className="p-8 border-b border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl font-black text-[#022448]">
                  {selectedReferral.status === 'Accepted' ? 'Alumni Note' : 'Reason for Decline'}
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
                For referral to {selectedReferral.company} - {selectedReferral.position}
              </p>
            </div>
            {/* Modal Body */}
            <div className="p-8">
              <div className="mb-6">
                <p className="text-[#022448] text-base leading-relaxed font-semibold whitespace-pre-wrap">
                  {selectedReferral.note || 'No additional details provided.'}
                </p>
              </div>
              <button 
                onClick={() => setShowModal(false)}
                className="w-full px-6 py-3.5 rounded-2xl text-sm font-bold text-[#022448] bg-[#022448]/5 hover:bg-[#022448]/10 transition-all border-2 border-[#022448]/10"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}