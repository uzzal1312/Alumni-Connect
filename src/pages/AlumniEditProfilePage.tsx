import React, { useState, useEffect } from "react";
import { 
  Camera, 
  Lock, 
  ShieldCheck, 
  X
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
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

export default function AlumniEditProfilePage() {
  const { user, API_BASE, fetchUserProfile } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);
  const [industryInputType, setIndustryInputType] = useState<'select' | 'input'>('select');
  const [formData, setFormData] = useState<any>({
    fullName: "",
    graduationYear: "",
    fieldOfStudy: "",
    currentJobTitle: "",
    currentCompany: "",
    industry: "",
    bio: "",
    university: "",
    department: ""
  });

  useEffect(() => {
    const loadProfile = async () => {
      if (!user?.id) return;
      try {
        const userProfile = await fetchUserProfile(user.id);
        setProfile(userProfile);
        setFormData({
          fullName: userProfile.full_name || "",
          graduationYear: userProfile.profile?.graduation_year || "",
          fieldOfStudy: userProfile.profile?.field_of_study || "",
          currentJobTitle: userProfile.profile?.current_job_title || "",
          currentCompany: userProfile.profile?.current_company || "",
          industry: userProfile.profile?.industry || "",
          bio: userProfile.profile?.bio || "",
          university: userProfile.profile?.university || "University of X",
          department: userProfile.profile?.department || ""
        });
      } catch (error) {
        console.error('Failed to load profile:', error);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [user?.id, fetchUserProfile]);

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePictureFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result && typeof event.target.result === 'string') {
          setProfilePicture(event.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    try {
      // Update user info with profile picture
      const userFormData = new FormData();
      userFormData.append('full_name', formData.fullName);
      if (profilePictureFile) {
        userFormData.append('profilePicture', profilePictureFile);
      }
      
      const userRes = await fetch(`${API_BASE}/users/${user.id}`, {
        method: "PUT",
        body: userFormData
      });
      if (!userRes.ok) throw new Error("Failed to update user info");

      const profileRes = await fetch(`${API_BASE}/users/${user.id}/alumni-profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          graduation_year: formData.graduationYear,
          field_of_study: formData.fieldOfStudy,
          current_job_title: formData.currentJobTitle,
          current_company: formData.currentCompany,
          industry: formData.industry,
          bio: formData.bio,
          university: formData.university,
          department: formData.department
        })
      });
      if (!profileRes.ok) throw new Error("Failed to update profile");

      const updatedProfile = await fetchUserProfile(user.id);
      setProfile(updatedProfile);

      navigate("/dashboard/alumni/profile");
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert(`Failed to save changes: ${(error as Error).message}`);
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
        <div className="mb-12">
          <h1 className="text-[3.5rem] font-black tracking-tight text-[#022448]">Edit Profile</h1>
        </div>

        <div className="flex gap-10 border-b border-gray-200 mb-16">
          <button className="pb-4 text-sm font-black border-b-2 border-[#022448] text-[#022448] transition-all">
            Personal Info
          </button>
          <Link to="/dashboard/alumni/profile/edit/professional" className="pb-4 text-sm font-bold text-gray-400 hover:text-[#022448] transition-all">
            Professional Experience
          </Link>
          <Link to="/dashboard/alumni/profile/edit/resources" className="pb-4 text-sm font-bold text-gray-400 hover:text-[#022448] transition-all">
            Resources & Links
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-gray-100 flex flex-col items-center text-center">
              <div className="relative mb-6">
                <img 
                  className="w-32 h-32 rounded-[2rem] object-cover shadow-xl border-8 border-white" 
                  src={profilePicture || getMediaUrl(user?.profile_picture, API_BASE) || getDefaultAvatar(user?.full_name || "User")} 
                  alt={user?.full_name || "Profile"} 
                />
                <label className="absolute -bottom-2 -right-2 bg-[#022448] text-white p-2.5 rounded-xl shadow-lg hover:scale-110 transition-transform cursor-pointer">
                  <Camera className="w-4 h-4" />
                  <input 
                    type="file" 
                    accept="image/*" 
                    hidden 
                    onChange={handleProfilePictureChange} 
                  />
                </label>
              </div>
              <h3 className="text-lg font-black text-[#022448]">Profile Photo</h3>
              <p className="text-[10px] font-bold text-gray-400 mt-2 uppercase tracking-tight">High-resolution JPEG or PNG. Max 5MB.</p>
            </div>

            <div className="bg-[#f1f3ff] rounded-[2.5rem] p-10 space-y-6 border border-[#022448]/5">
              <div className="flex items-center gap-3 text-[#0b61a1]">
                <ShieldCheck className="w-5 h-5" />
                <span className="text-[10px] font-black uppercase tracking-widest">Verified Account</span>
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Primary Email</label>
                <div className="flex items-center gap-2 text-gray-400 font-bold text-sm">
                  <Lock className="w-4 h-4" />
                  <span>{user?.email || "email@example.com"}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8">
            <div className="bg-white rounded-[3rem] p-12 shadow-sm border border-gray-100">
              <form className="space-y-10" onSubmit={handleSaveChanges}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Full Name</label>
                    <input 
                      className="w-full bg-[#f1f3ff] border-none focus:ring-4 focus:ring-[#022448]/5 rounded-2xl px-6 py-4 transition-all font-bold text-[#022448]" 
                      type="text" 
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">University</label>
                    <input 
                      className="w-full bg-gray-100 border-none rounded-2xl px-6 py-4 font-bold text-gray-500 cursor-not-allowed" 
                      type="text" 
                      name="university"
                      value={formData.university}
                      disabled
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Department</label>
                    <div className="relative">
                      <select 
                        className="w-full appearance-none bg-[#f1f3ff] border-none focus:ring-4 focus:ring-[#022448]/5 rounded-2xl px-6 py-4 transition-all cursor-pointer font-bold text-[#022448]"
                        name="department"
                        value={formData.department}
                        onChange={handleInputChange}
                      >
                        <option value="">Select Department</option>
                        <option>Computer Science</option>
                        <option>Engineering</option>
                        <option>Mathematics</option>
                        <option>BBA</option>
                        <option>English</option>
                        <option>Civil</option>
                        <option>Electrical</option>
                        <option>Mechanical</option>
                        <option>Business</option>
                        <option>Finance</option>
                        <option>Marketing</option>
                      </select>
                      <X className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 w-5 h-5" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Graduation Year</label>
                    <input 
                      className="w-full bg-[#f1f3ff] border-none focus:ring-4 focus:ring-[#022448]/5 rounded-2xl px-6 py-4 transition-all font-bold text-[#022448]" 
                      type="text" 
                      name="graduationYear"
                      value={formData.graduationYear}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Field of Study</label>
                    <input 
                      className="w-full bg-[#f1f3ff] border-none focus:ring-4 focus:ring-[#022448]/5 rounded-2xl px-6 py-4 transition-all font-bold text-[#022448]" 
                      type="text" 
                      name="fieldOfStudy"
                      value={formData.fieldOfStudy}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Current Job Title</label>
                    <input 
                      className="w-full bg-[#f1f3ff] border-none focus:ring-4 focus:ring-[#022448]/5 rounded-2xl px-6 py-4 transition-all font-bold text-[#022448]" 
                      type="text" 
                      name="currentJobTitle"
                      value={formData.currentJobTitle}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Current Company</label>
                    <input 
                      className="w-full bg-[#f1f3ff] border-none focus:ring-4 focus:ring-[#022448]/5 rounded-2xl px-6 py-4 transition-all font-bold text-[#022448]" 
                      type="text" 
                      name="currentCompany"
                      value={formData.currentCompany}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 justify-between">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Primary Industry</label>
                    <button 
                      type="button" 
                      onClick={() => {
                        if (industryInputType === 'select') {
                          setIndustryInputType('input');
                        } else {
                          setIndustryInputType('select');
                        }
                      }}
                      className="text-[10px] font-bold text-[#022448] hover:underline"
                    >
                      {industryInputType === 'select' ? 'Enter Manually' : 'Select from List'}
                    </button>
                  </div>
                  <div className="relative">
                    {industryInputType === 'select' ? (
                      <>
                        <select 
                          className="w-full appearance-none bg-[#f1f3ff] border-none focus:ring-4 focus:ring-[#022448]/5 rounded-2xl px-6 py-4 transition-all cursor-pointer font-bold text-[#022448]"
                          name="industry"
                          value={formData.industry}
                          onChange={handleInputChange}
                        >
                          <option value="">Select Industry</option>
                          <option>Technology & Software</option>
                          <option>Finance & Banking</option>
                          <option>Higher Education</option>
                          <option>Creative Arts & Design</option>
                          <option>Healthcare & Biotech</option>
                        </select>
                        <X className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 w-5 h-5" />
                      </>
                    ) : (
                      <input 
                        className="w-full bg-[#f1f3ff] border-none focus:ring-4 focus:ring-[#022448]/5 rounded-2xl px-6 py-4 transition-all font-bold text-[#022448]" 
                        type="text" 
                        name="industry"
                        value={formData.industry}
                        onChange={handleInputChange}
                        placeholder="Enter industry manually"
                      />
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-end px-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Professional Bio</label>
                    <span className="text-[9px] font-black text-gray-300 uppercase tracking-tighter">
                      {formData.bio.length} / 1000
                    </span>
                  </div>
                  <textarea 
                    className="w-full bg-[#f1f3ff] border-none focus:ring-4 focus:ring-[#022448]/5 rounded-[2rem] px-8 py-8 transition-all resize-none font-medium text-gray-600 leading-relaxed" 
                    rows={6}
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="pt-8 flex justify-end items-center gap-10">
                  <Link to="/dashboard/alumni/profile" className="text-[10px] font-black uppercase tracking-widest text-[#022448] hover:opacity-70 transition-all">
                    Discard Changes
                  </Link>
                  <button 
                    type="submit"
                    className="bg-[#022448] text-white px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-[#022448]/20 hover:opacity-90 active:scale-[0.95] transition-all"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
