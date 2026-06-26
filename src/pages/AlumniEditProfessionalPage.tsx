import React, { useState, useEffect } from "react";
import { 
  Plus, 
  X, 
  Trash2,
  Edit2,
  ShieldCheck
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import AlumniNavbar from "../components/AlumniNavbar";
import Footer from "../components/Footer";
import { useAuth } from "../contexts/AuthContext";

interface WorkHistoryItem {
  id?: number;
  job_title: string;
  company: string;
  location?: string;
  start_date: string;
  end_date?: string;
  is_current: boolean;
  description?: string;
}

export default function AlumniEditProfessionalPage() {
  const { user, API_BASE, fetchUserProfile } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddWorkModal, setShowAddWorkModal] = useState(false);
  const [editingWorkId, setEditingWorkId] = useState<number | null>(null);
  const [workForm, setWorkForm] = useState<WorkHistoryItem>({
    job_title: "",
    company: "",
    location: "",
    start_date: "",
    end_date: "",
    is_current: false,
    description: ""
  });
  const [formData, setFormData] = useState({
    expertise: [] as string[],
    referralCompanies: [] as string[],
    newExpertise: "",
    newReferralCompany: ""
  });

  useEffect(() => {
    const loadProfile = async () => {
      if (!user?.id) return;
      try {
        const userProfile = await fetchUserProfile(user.id);
        setProfile(userProfile);
        setFormData({
          expertise: userProfile.profile?.expertise || [],
          referralCompanies: userProfile.profile?.referral_companies || [],
          newExpertise: "",
          newReferralCompany: ""
        });
      } catch (error) {
        console.error('Failed to load profile:', error);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [user?.id, fetchUserProfile]);

  const handleWorkInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target;
    setWorkForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const formatDateForApi = (monthStr: string): string => {
    if (!monthStr) return "";
    return `${monthStr}-01`; // Convert YYYY-MM to YYYY-MM-01 for DATE column
  };

  const formatDateForInput = (dateStr: string): string => {
    if (!dateStr) return "";
    return dateStr.slice(0, 7); // Convert YYYY-MM-DD to YYYY-MM for input
  };

  const addOrUpdateWork = async () => {
    if (!user) {
      alert("User not found!");
      return;
    }
    try {
      const workData = {
        ...workForm,
        start_date: formatDateForApi(workForm.start_date),
        end_date: workForm.is_current ? null : formatDateForApi(workForm.end_date)
      };

      if (editingWorkId !== null) {
        const res = await fetch(`${API_BASE}/users/work-history/${editingWorkId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(workData)
        });
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.message || "Failed to update work history");
        }
        setProfile(prev => ({
          ...prev,
          workHistory: prev.workHistory.map((item: any) => 
            item.id === editingWorkId ? { ...item, ...workData } : item
          )
        }));
      } else {
        const res = await fetch(`${API_BASE}/users/${user.id}/work-history`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(workData)
        });
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.message || "Failed to add work history");
        }
        const data = await res.json();
        setProfile(prev => ({
          ...prev,
          workHistory: [...(prev.workHistory || []), { ...workData, id: data.workHistoryId }]
        }));
      }
      resetWorkForm();
      setShowAddWorkModal(false);
    } catch (error) {
      console.error('Failed to add/update work history:', error);
      alert(`Failed to save work history: ${(error as Error).message}`);
    }
  };

  const removeWorkHistory = async (id: number) => {
    if (!user) return;
    if (!confirm("Are you sure you want to delete this work history entry?")) return;
    try {
      const res = await fetch(`${API_BASE}/users/work-history/${id}`, {
        method: "DELETE"
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to delete work history");
      }
      setProfile(prev => ({
        ...prev,
        workHistory: prev.workHistory.filter((item: any) => item.id !== id)
      }));
    } catch (error) {
      console.error('Failed to delete work history:', error);
      alert(`Failed to delete: ${(error as Error).message}`);
    }
  };

  const resetWorkForm = () => {
    setWorkForm({
      job_title: "",
      company: "",
      location: "",
      start_date: "",
      end_date: "",
      is_current: false,
      description: ""
    });
    setEditingWorkId(null);
  };

  const editWorkHistory = (item: WorkHistoryItem) => {
    setWorkForm({
      ...item,
      start_date: formatDateForInput(item.start_date),
      end_date: formatDateForInput(item.end_date || "")
    });
    setEditingWorkId(item.id || null);
    setShowAddWorkModal(true);
  };

  const addExpertise = () => {
    if (formData.newExpertise.trim()) {
      setFormData(prev => ({
        ...prev,
        expertise: [...prev.expertise, prev.newExpertise.trim()],
        newExpertise: ""
      }));
    }
  };

  const removeExpertise = (index: number) => {
    setFormData(prev => ({
      ...prev,
      expertise: prev.expertise.filter((_, i) => i !== index)
    }));
  };

  const addReferralCompany = () => {
    if (formData.newReferralCompany.trim()) {
      setFormData(prev => ({
        ...prev,
        referralCompanies: [...prev.referralCompanies, prev.newReferralCompany.trim()],
        newReferralCompany: ""
      }));
    }
  };

  const removeReferralCompany = (index: number) => {
    setFormData(prev => ({
      ...prev,
      referralCompanies: prev.referralCompanies.filter((_, i) => i !== index)
    }));
  };

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    try {
      await fetch(`${API_BASE}/users/${user.id}/alumni-profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          expertise: formData.expertise,
          referral_companies: formData.referralCompanies
        })
      });
      await fetchUserProfile(user.id);
      navigate("/dashboard/alumni/profile");
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert("Failed to save changes");
    }
  };

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

      <main className="max-w-[1400px] mx-auto pt-24 px-12 pb-20">
        <section className="mb-12">
          <h1 className="text-[3.5rem] font-black tracking-tight text-[#022448] mb-4">Edit Profile</h1>
          <p className="text-lg text-gray-500 font-medium max-w-2xl">
            Curate your professional presence to help students and fellow alumni understand your journey and expertise.
          </p>
        </section>

        <div className="flex items-center gap-12 mb-16 border-b border-gray-100">
          <Link to="/dashboard/alumni/profile/edit" className="pb-4 text-sm font-bold text-gray-400 hover:text-[#022448] transition-colors">
            Personal Info
          </Link>
          <button className="pb-4 text-sm font-black text-[#022448] border-b-2 border-[#022448]">
            Professional Experience
          </button>
          <Link to="/dashboard/alumni/profile/edit/resources" className="pb-4 text-sm font-bold text-gray-400 hover:text-[#022448] transition-colors">
            Resources & Links
          </Link>
        </div>

        <div className="grid grid-cols-12 gap-16">
          <div className="col-span-12 lg:col-span-8 space-y-10">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-black text-[#022448]">Work History</h3>
              <button 
                className="flex items-center gap-2 text-[#0b61a1] font-black text-xs uppercase tracking-widest hover:bg-blue-50 px-5 py-2.5 rounded-xl transition-all"
                onClick={() => setShowAddWorkModal(true)}
              >
                <Plus className="w-4 h-4" />
                Add New Position
              </button>
            </div>

            <div className="space-y-6">
              {profile?.workHistory?.length > 0 ? (
                profile.workHistory.map((item: WorkHistoryItem, idx: number) => {
                  const startYear = item.start_date ? new Date(item.start_date).getFullYear() : '';
                  const endYear = item.is_current ? 'Present' : (item.end_date ? new Date(item.end_date).getFullYear() : '');
                  return (
                    <div key={item.id || idx} className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:border-[#022448]/5 transition-all relative group">
                      <div className="flex gap-6">
                        <div className="w-16 h-16 rounded-[1.5rem] bg-[#022448] flex items-center justify-center font-black text-xl shadow-md text-white">
                          {item.company[0]?.toUpperCase() || 'W'}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="text-xl font-black text-[#022448] mb-1">{item.job_title}</h4>
                              <p className="text-[#0b61a1] font-bold text-sm mb-2">{item.company}</p>
                              <p className="text-[10px] font-black text-gray-400 tracking-[0.2em] mb-4 uppercase">
                                {startYear} — {endYear}
                              </p>
                            </div>
                            <div className="flex gap-2 opacity-100">
                              <button 
                                onClick={() => editWorkHistory(item)}
                                className="p-2 text-gray-400 hover:text-[#022448] hover:bg-gray-50 rounded-lg transition-all"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => item.id && removeWorkHistory(item.id)}
                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                          {item.description && (
                            <p className="text-sm text-gray-500 leading-relaxed font-medium max-w-2xl">{item.description}</p>
                          )}
                        </div>
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
          </div>

          <div className="col-span-12 lg:col-span-4 space-y-10">
            <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100">
              <h3 className="text-xl font-black text-[#022448] mb-8">Skills & Expertise</h3>
              
              <div className="space-y-10">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-5">Core Expertise</label>
                  <div className="flex flex-wrap gap-3 mb-6">
                    {formData.expertise.map((skill, i) => (
                      <span key={i} className="bg-[#f1f3ff] px-4 py-2 rounded-xl text-[11px] font-black text-[#022448] flex items-center gap-2">
                        {skill}
                        <button onClick={() => removeExpertise(i)} className="text-gray-400 hover:text-red-500">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Add a skill..." 
                      value={formData.newExpertise}
                      onChange={(e) => setFormData(prev => ({ ...prev, newExpertise: e.target.value }))}
                      onKeyDown={(e) => e.key === 'Enter' && addExpertise()}
                      className="flex-1 bg-[#f8faff] border-none rounded-xl px-5 py-3.5 text-sm font-bold placeholder:text-gray-300 focus:ring-2 focus:ring-[#022448]/5 transition-all"
                    />
                    <button onClick={addExpertise} className="bg-[#022448] text-white px-4 py-3 rounded-xl text-xs font-black uppercase">
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 text-[#0b61a1] mb-8">
                <ShieldCheck className="w-5 h-5" />
                <h3 className="text-sm font-black uppercase tracking-widest">Can Refer At</h3>
              </div>
              <div className="flex flex-wrap gap-3 mb-6">
                {formData.referralCompanies.map((company, i) => (
                  <span key={i} className="bg-[#f1f3ff] px-4 py-2 rounded-lg text-[10px] font-black text-[#022448] flex items-center gap-2">
                    {company}
                    <button onClick={() => removeReferralCompany(i)} className="text-gray-400 hover:text-red-500">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2 mb-8">
                <input
                  type="text"
                  placeholder="Add company"
                  value={formData.newReferralCompany}
                  onChange={(e) => setFormData(prev => ({ ...prev, newReferralCompany: e.target.value }))}
                  onKeyDown={(e) => e.key === 'Enter' && addReferralCompany()}
                  className="flex-1 bg-[#f8faff] border-none rounded-xl px-4 py-3 text-xs font-bold placeholder:text-gray-300 focus:ring-2 focus:ring-[#022448]/5 transition-all"
                />
                <button onClick={addReferralCompany} className="bg-[#022448] text-white px-4 py-3 rounded-xl text-xs font-black uppercase">
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20 flex justify-end items-center gap-10 py-10 border-t border-gray-100">
          <Link to="/dashboard/alumni/profile" className="text-[10px] font-black uppercase tracking-[0.2em] text-[#022448] hover:opacity-70 transition-all">
            Discard Changes
          </Link>
          <button 
            type="button"
            onClick={handleSaveChanges}
            className="bg-[#022448] text-white px-12 py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-[#022448]/20 hover:opacity-90 active:scale-[0.95] transition-all"
          >
            Save Changes
          </button>
        </div>

        {showAddWorkModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 z-50">
            <div className="bg-white rounded-[3rem] max-w-2xl w-full p-10 shadow-2xl">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-black text-[#022448]">
                  {editingWorkId ? "Edit Position" : "Add New Position"}
                </h3>
                <button onClick={() => { setShowAddWorkModal(false); resetWorkForm(); }} className="text-gray-400 hover:text-[#022448]">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <form className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Job Title</label>
                    <input 
                      type="text" 
                      name="job_title" 
                      value={workForm.job_title} 
                      onChange={handleWorkInputChange}
                      required
                      className="w-full bg-[#f1f3ff] border-none focus:ring-4 focus:ring-[#022448]/5 rounded-2xl px-6 py-4 transition-all font-bold text-[#022448]"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Company</label>
                    <input 
                      type="text" 
                      name="company" 
                      value={workForm.company} 
                      onChange={handleWorkInputChange}
                      required
                      className="w-full bg-[#f1f3ff] border-none focus:ring-4 focus:ring-[#022448]/5 rounded-2xl px-6 py-4 transition-all font-bold text-[#022448]"
                    />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Location</label>
                  <input 
                    type="text" 
                    name="location" 
                    value={workForm.location} 
                    onChange={handleWorkInputChange}
                    className="w-full bg-[#f1f3ff] border-none focus:ring-4 focus:ring-[#022448]/5 rounded-2xl px-6 py-4 transition-all font-bold text-[#022448]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Start Date</label>
                    <input 
                      type="month" 
                      name="start_date" 
                      value={workForm.start_date} 
                      onChange={handleWorkInputChange}
                      required
                      className="w-full bg-[#f1f3ff] border-none focus:ring-4 focus:ring-[#022448]/5 rounded-2xl px-6 py-4 transition-all font-bold text-[#022448]"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">End Date</label>
                    <div className="flex items-center gap-4">
                      <input 
                        type="month" 
                        name="end_date" 
                        value={workForm.end_date} 
                        onChange={handleWorkInputChange}
                        disabled={workForm.is_current}
                        className="flex-1 bg-[#f1f3ff] border-none focus:ring-4 focus:ring-[#022448]/5 rounded-2xl px-6 py-4 transition-all font-bold text-[#022448] disabled:opacity-50"
                      />
                      <div className="flex items-center gap-2">
                        <input 
                          type="checkbox" 
                          id="is_current" 
                          name="is_current" 
                          checked={workForm.is_current} 
                          onChange={handleWorkInputChange}
                          className="w-4 h-4 text-[#022448]"
                        />
                        <label htmlFor="is_current" className="text-sm font-bold text-[#022448]">Current</label>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Description</label>
                  <textarea 
                    name="description" 
                    value={workForm.description} 
                    onChange={handleWorkInputChange}
                    rows={4}
                    className="w-full bg-[#f1f3ff] border-none focus:ring-4 focus:ring-[#022448]/5 rounded-[2rem] px-8 py-6 transition-all resize-none font-medium text-gray-600"
                  />
                </div>
                
                <div className="flex gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => { setShowAddWorkModal(false); resetWorkForm(); }}
                    className="flex-1 py-4 rounded-2xl border-2 border-gray-200 text-[#022448] font-black text-xs uppercase tracking-[0.2em] hover:bg-gray-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="button"
                    onClick={addOrUpdateWork}
                    className="flex-1 bg-[#022448] text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-[#022448]/20 hover:opacity-90 active:scale-[0.95] transition-all"
                  >
                    Save Position
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
