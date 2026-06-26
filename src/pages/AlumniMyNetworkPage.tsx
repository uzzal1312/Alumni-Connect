import React, { useState, useEffect } from "react";
import { 
  Users, 
  UserPlus, 
  MessageSquare, 
  ArrowRight, 
  CheckCircle, 
  XCircle,
  FileText,
  Search,
  Filter,
  MoreVertical,
  Eye,
  X,
  Send
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

export default function AlumniMyNetworkPage() {
  const [activeTab, setActiveTab] = useState<"students" | "requests">("students");
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [myStudents, setMyStudents] = useState<any[]>([]);
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, API_BASE } = useAuth();

  const fetchConnections = async () => {
    if (!user) return;
    try {
      console.log('=== AlumniMyNetworkPage fetchConnections called, user.id:', user.id);
      const [studentsRes, requestsRes] = await Promise.all([
        fetch(`${API_BASE}/connections/alumni/${user.id}/accepted`),
        fetch(`${API_BASE}/connections/alumni/${user.id}/pending`)
      ]);
      
      console.log('studentsRes ok:', studentsRes.ok, 'requestsRes ok:', requestsRes.ok);
      
      if (studentsRes.ok) {
        const data = await studentsRes.json();
        console.log('students data:', data);
        setMyStudents(data.students || []);
      }
      if (requestsRes.ok) {
        const data = await requestsRes.json();
        console.log('requests data:', data);
        setPendingRequests(data.requests || []);
      }
    } catch (error) {
      console.error("Failed to fetch connections:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, [API_BASE, user]);

  const handleUpdateConnection = async (requestId: number, status: string) => {
    try {
      await fetch(`${API_BASE}/connections/${requestId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      setIsReviewModalOpen(false);
      fetchConnections();
    } catch (error) {
      console.error("Failed to update connection:", error);
    }
  };

  const handleReview = (request: any) => {
    setSelectedRequest(request);
    setIsReviewModalOpen(true);
  };

  if (loading) {
    return (
      <div className="bg-[#f9f9ff] min-h-screen font-sans text-[#141b2b] antialiased">
        <AlumniNavbar activePage="network" />
        <main className="max-w-7xl mx-auto pt-32 pb-24 px-8 flex items-center justify-center">
          <div className="text-lg text-gray-500">Loading...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="bg-[#f9f9ff] min-h-screen font-sans text-[#141b2b] antialiased">
      <AlumniNavbar activePage="network" />

      <main className="max-w-7xl mx-auto pt-32 pb-24 px-8">
        <header className="mb-16">
          <h1 className="text-[3.5rem] font-black text-[#022448] tracking-tighter leading-none mb-4 uppercase">My Network</h1>
          <p className="text-lg text-gray-500 font-medium max-w-2xl">Manage your active students and pending connection requests.</p>
        </header>

        {/* Tab Navigation */}
        <div className="flex gap-8 mb-16 border-b border-gray-100">
          <button 
            onClick={() => setActiveTab("students")}
            className={`pb-4 text-xs font-black uppercase tracking-[0.2em] transition-all relative ${activeTab === "students" ? "text-[#022448]" : "text-gray-300 hover:text-gray-500"}`}
          >
            My Students
            {activeTab === "students" && <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#022448] rounded-full"></div>}
          </button>
          <button 
            onClick={() => setActiveTab("requests")}
            className={`pb-4 text-xs font-black uppercase tracking-[0.2em] transition-all relative flex items-center gap-2 ${activeTab === "requests" ? "text-[#022448]" : "text-gray-300 hover:text-gray-500"}`}
          >
            Connection Requests
            <span className={`px-2 py-0.5 rounded-full text-[9px] ${activeTab === "requests" ? "bg-[#022448] text-white" : "bg-gray-100 text-gray-400"}`}>
              {pendingRequests.length}
            </span>
            {activeTab === "requests" && <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#022448] rounded-full"></div>}
          </button>
        </div>

        {activeTab === "students" ? (
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between mb-10">
              <div className="relative w-full max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-5 h-5" />
                <input 
                  type="text" 
                  placeholder="Search students..." 
                  className="w-full pl-12 pr-6 py-4 bg-white border-none rounded-2xl text-sm font-bold shadow-sm focus:ring-4 focus:ring-[#022448]/5 transition-all"
                />
              </div>
              <div className="flex gap-4">
                <button className="p-4 bg-white rounded-2xl shadow-sm text-gray-400 hover:text-[#022448] transition-colors">
                  <Filter className="w-5 h-5" />
                </button>
              </div>
            </div>

            {myStudents.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-8">
                  <Users className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-[#022448] mb-2">No students in your network yet</h3>
                <p className="text-gray-500">When students connect with you, they'll appear here.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {myStudents.map((student) => (
                  <div key={student.user_id || student.id} className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-transparent hover:border-[#022448]/5 hover:shadow-xl transition-all duration-500 group">
                    <div className="flex flex-col items-center text-center">
                      <div className="relative mb-6">
                        <div className="w-24 h-24 rounded-[2rem] overflow-hidden ring-4 ring-[#f1f3ff] group-hover:scale-105 transition-transform duration-500">
                          <img 
                  src={getMediaUrl(student.profile_picture, API_BASE) || getDefaultAvatar(student.full_name || student.name)} 
                  alt={student.full_name || student.name} 
                  className="w-full h-full object-cover" 
                />
                        </div>
                      </div>
                      <h4 className="text-lg font-black text-[#022448] mb-1">{student.full_name || student.name}</h4>
                      <p className="text-[10px] font-black text-[#0b61a1] uppercase tracking-widest mb-8">
                        {student.major || "Student"} • {student.year || ""}
                      </p>
                      <div className="w-full space-y-3">
                        <button className="w-full bg-[#022448] text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-[#022448]/20 hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                          <MessageSquare className="w-4 h-4" />
                          Message
                        </button>
                        <button className="w-full py-3 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-[#022448] transition-colors">
                          View Profile
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        ) : (
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {pendingRequests.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-8">
                  <UserPlus className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-[#022448] mb-2">No pending connection requests</h3>
                <p className="text-gray-500">When students request to connect with you, they'll appear here.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {pendingRequests.map((request) => (
                  <div key={request.id} className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-transparent hover:border-[#022448]/5 hover:shadow-2xl transition-all duration-500 group">
                    <div className="flex flex-col items-center text-center">
                      <div className="relative mb-6">
                        <div className="w-28 h-28 rounded-[2.2rem] overflow-hidden ring-4 ring-[#f1f3ff] group-hover:scale-105 transition-transform duration-500">
                          <img 
                  src={getMediaUrl(request.profile_picture, API_BASE) || getDefaultAvatar(request.full_name || request.name)} 
                  alt={request.full_name || request.name} 
                  className="w-full h-full object-cover" 
                />
                        </div>
                        <div className="absolute -bottom-1 -right-1 bg-[#022448] text-white p-2 rounded-full border-4 border-white shadow-lg">
                          <UserPlus className="w-4 h-4" />
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-black text-[#022448] tracking-tight">{request.full_name || request.name}</h3>
                      <p className="text-[10px] font-black text-[#0b61a1] uppercase tracking-widest mt-1">
                        {request.major || "Student"} • {request.year || ""}
                      </p>
                      {request.expected_grad && (
                        <p className="text-[9px] font-bold text-gray-300 uppercase tracking-widest mt-0.5">Exp. Grad: {request.expected_grad}</p>
                      )}

                      <button 
                        onClick={() => handleReview(request)}
                        className="mt-8 w-full bg-[#f1f3ff] text-[#022448] py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-[#022448] hover:text-white active:scale-[0.98] transition-all flex items-center justify-center gap-2 group/rev"
                      >
                        <Eye className="w-4 h-4 group-hover/rev:scale-110 transition-transform" />
                        Review Request
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </main>

      {/* Review Modal */}
      {isReviewModalOpen && selectedRequest && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 overflow-hidden">
          <div className="absolute inset-0 bg-primary/40 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setIsReviewModalOpen(false)}></div>
          
          <div className="relative bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-center px-10 py-8 border-b border-gray-50">
              <div>
                <h3 className="text-2xl font-black text-primary">Review Connection</h3>
                <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mt-1">Mentorship inquiry from {selectedRequest.full_name || selectedRequest.name}</p>
              </div>
              <button 
                onClick={() => setIsReviewModalOpen(false)}
                className="p-3 hover:bg-gray-50 rounded-2xl transition-colors text-gray-400 hover:text-primary"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-10 space-y-10">
              <div className="flex items-center gap-8">
                <div className="w-24 h-24 rounded-[2rem] overflow-hidden ring-4 ring-[#f1f3ff]">
                  <img 
                  src={getMediaUrl(selectedRequest.profile_picture, API_BASE) || getDefaultAvatar(selectedRequest.full_name || selectedRequest.name)} 
                  alt={selectedRequest.full_name || selectedRequest.name} 
                  className="w-full h-full object-cover" 
                />
                </div>
                <div>
                  <h4 className="text-2xl font-black text-primary">{selectedRequest.full_name || selectedRequest.name}</h4>
                  <p className="text-sm font-bold text-secondary uppercase tracking-widest">
                    {selectedRequest.major || "Student"} • {selectedRequest.year || ""}
                  </p>
                  {selectedRequest.expected_grad && (
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Class of {selectedRequest.expected_grad}</p>
                  )}
                </div>
              </div>

              <div className="bg-gray-50 p-8 rounded-[2rem] border border-gray-100 relative group/note">
                <FileText className="absolute right-6 top-6 w-5 h-5 text-primary/10 group-hover/note:text-primary/30 transition-colors" />
                <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4">Request Message</h5>
                <p className="text-base font-medium text-primary leading-relaxed italic">
                  "{selectedRequest.reason || "Student wants to connect"}"
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <button 
                  onClick={() => handleUpdateConnection(selectedRequest.id, 'accepted')}
                  className="flex-1 bg-primary text-white py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-primary/20 hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                >
                  <CheckCircle className="w-5 h-5" />
                  Accept Request
                </button>
                <button 
                  onClick={() => handleUpdateConnection(selectedRequest.id, 'rejected')}
                  className="flex-1 bg-white text-primary py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] border-2 border-gray-100 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                >
                  <XCircle className="w-5 h-5" />
                  Ignore
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
