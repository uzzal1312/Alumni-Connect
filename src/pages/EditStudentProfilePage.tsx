import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Camera, 
  Trash2, 
  Plus, 
  ArrowRight,
  User,
  Briefcase,
  Link as LinkIcon,
  Star,
  FileText,
  GraduationCap,
  Linkedin,
  BookOpen,
  Upload,
  X
} from "lucide-react";
import StudentNavbar from "../components/StudentNavbar";
import Footer from "../components/Footer";
import { useAuth } from "../contexts/AuthContext";
import { getDefaultAvatar } from "../utils/avatars";

// Suggested tags
const SUGGESTED_CAREER_INTERESTS = [
  "Software Engineering",
  "Product Management",
  "Data Science",
  "Machine Learning",
  "Consulting",
  "Fintech",
  "Healthtech",
  "UX/UI Design"
];

const SUGGESTED_SKILLS = [
  "JavaScript",
  "Python",
  "React",
  "Node.js",
  "SQL",
  "Git",
  "Figma",
  "Tableau",
  "Machine Learning",
  "AWS"
];

// Helper to get full media URL
const getMediaUrl = (path: string | null | undefined, apiBase: string) => {
  if (!path) return null;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  // API_BASE is http://localhost:5000/api, so replace /api with '' to get http://localhost:5000
  const base = apiBase.replace('/api', '');
  return `${base}${path}`;
};

export default function EditStudentProfilePage() {
  const navigate = useNavigate();
  const { user, API_BASE, fetchUserProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<"personal" | "career" | "resources">("personal");
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [resumeFile, setResumeFile] = useState<any>(null);
  const [gpaError, setGpaError] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({
    fullName: "",
    university: "",
    department: "",
    current_year: "",
    gpa: "",
    secondary_email: "",
    bio: "",
    linkedin_url: "",
    resume_url: "",
    github_url: "",
    academic_research_url: "",
    personal_website_url: "",
    skills: [],
    career_interests: []
  });

  // Calculate profile completeness
  const calculateProfileCompleteness = () => {
    let total = 10;
    let filled = 0;
    
    if (profilePicture || user?.profile_picture) filled++;
    if (formData.fullName) filled++;
    if (formData.university) filled++;
    if (formData.department) filled++;
    if (formData.current_year) filled++;
    if (formData.gpa) filled++;
    if (formData.bio) filled++;
    if (formData.linkedin_url) filled++;
    if (formData.github_url) filled++;
    if (formData.resume_url || resumeFile) filled++;
    
    return Math.round((filled / total) * 100);
  };

  useEffect(() => {
    const loadProfile = async () => {
      if (!user?.id) return;
      try {
        const userProfile = await fetchUserProfile(user.id);
        setProfile(userProfile);
        
        // Skills and career interests are already arrays from backend
        const skills = userProfile.profile?.skills || [];
        const careerInterests = userProfile.profile?.career_interests || [];
        
        setFormData({
          fullName: userProfile.full_name || "",
          university: userProfile.profile?.university || "",
          department: userProfile.profile?.department || "",
          current_year: userProfile.profile?.current_year || "",
          gpa: userProfile.profile?.gpa || "",
          secondary_email: "",
          bio: userProfile.profile?.bio || "",
          linkedin_url: userProfile.profile?.linkedin_url || "",
          resume_url: userProfile.profile?.resume_url || "",
          github_url: userProfile.profile?.github_url || "",
          academic_research_url: userProfile.profile?.academic_research_url || "",
          personal_website_url: userProfile.profile?.personal_website_url || "",
          skills: skills,
          career_interests: careerInterests
        });
      } catch (error) {
        console.error("Failed to load profile:", error);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [user?.id, fetchUserProfile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === "gpa") {
      setGpaError(null);
      const gpaValue = parseFloat(value);
      if (value && (isNaN(gpaValue) || gpaValue < 0 || gpaValue > 4)) {
        setGpaError("GPA must be between 0 and 4");
      }
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addSkill = (skill: string) => {
    if (skill && !formData.skills.includes(skill)) {
      setFormData(prev => ({ ...prev, skills: [...prev.skills, skill] }));
    }
  };

  const removeSkill = (skill: string) => {
    setFormData(prev => ({ ...prev, skills: prev.skills.filter((s: string) => s !== skill) }));
  };

  const addCareerInterest = (interest: string) => {
    if (interest && !formData.career_interests.includes(interest)) {
      setFormData(prev => ({ ...prev, career_interests: [...prev.career_interests, interest] }));
    }
  };

  const removeCareerInterest = (interest: string) => {
    setFormData(prev => ({ ...prev, career_interests: prev.career_interests.filter((i: string) => i !== interest) }));
  };

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result;
        if (typeof result === "string") {
          setProfilePicture(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removeProfilePicture = () => {
    setProfilePicture(null);
  };

  const handleSaveChanges = async () => {
    if (!user) return;
    console.log("Saving student profile with form data:", formData);
    try {
      // Create FormData for student profile
      const formDataToSend = new FormData();
      formDataToSend.append('university', formData.university);
      formDataToSend.append('department', formData.department);
      formDataToSend.append('current_year', formData.current_year);
      formDataToSend.append('bio', formData.bio);
      formDataToSend.append('linkedin_url', formData.linkedin_url);
      formDataToSend.append('resume_url', formData.resume_url);
      formDataToSend.append('gpa', formData.gpa);
      formDataToSend.append('github_url', formData.github_url);
      formDataToSend.append('academic_research_url', formData.academic_research_url);
      formDataToSend.append('personal_website_url', formData.personal_website_url);
      formDataToSend.append('skills', JSON.stringify(formData.skills));
      formDataToSend.append('career_interests', JSON.stringify(formData.career_interests));
      
      // Add profile picture if selected
      if (profilePicture && profilePicture.startsWith('data:')) {
        // If it's a data URL (new upload), create a File object
        const response = await fetch(profilePicture);
        const blob = await response.blob();
        const file = new File([blob], 'profile.jpg', { type: blob.type });
        formDataToSend.append('profilePicture', file);
      }
      
      // Add resume if selected
      if (resumeFile) {
        formDataToSend.append('resume', resumeFile);
      }

      // Update student profile
      const profileRes = await fetch(`${API_BASE}/users/${user.id}/student-profile`, {
        method: "PUT",
        body: formDataToSend
      });
      console.log("Student profile update response:", profileRes.ok, await profileRes.text());

      // Refresh the user profile data in context/localStorage
      const updatedProfile = await fetchUserProfile(user.id);
      console.log("Updated profile after save:", updatedProfile);

      navigate("/dashboard/student-profile");
    } catch (error) {
      console.error("Failed to update profile:", error);
      alert("Failed to save changes. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="bg-[#f8fafc] text-[#1e293b] min-h-screen font-sans antialiased flex items-center justify-center">
        <div className="text-gray-500 text-lg">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="bg-[#f8fafc] text-[#1e293b] min-h-screen font-sans antialiased">
      <StudentNavbar activePage="none" />
      
      <main className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        {/* Title Section */}
        <section className="mb-10">
          <h1 className="text-3xl font-bold text-slate-900">Edit Your Student Profile</h1>
          {activeTab === "career" && (
            <p className="text-slate-500 max-w-2xl leading-relaxed mt-4">
              Refine your professional identity. Your career details help our matchmaking engine pair you with alumni who can offer the most impactful guidance.
            </p>
          )}
        </section>

        {/* Completeness Tracker */}
        <section className="mb-10 p-6 bg-white rounded-2xl border border-blue-50 shadow-sm">
          <div className="flex justify-between items-end mb-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Profile Completeness</span>
            <span className="text-xs font-bold text-[#1e293b]">{calculateProfileCompleteness()}%</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-3">
            <div className="h-full bg-[#1e293b]" style={{ width: `${calculateProfileCompleteness()}%` }}></div>
          </div>
          <p className="text-xs text-slate-400">
            {calculateProfileCompleteness() === 100 
              ? "Great job! Your profile is complete!" 
              : "Fill in all fields to maximize your visibility for recruiters"}
          </p>
        </section>

        {/* Tab Navigation */}
        <nav className="flex border-b border-slate-200 mb-8">
          <button 
            onClick={() => setActiveTab("personal")}
            className={`px-6 py-4 border-b-2 text-sm font-bold flex items-center gap-2 transition-all ${activeTab === "personal" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-400 hover:text-slate-600"}`}
          >
            <User className="w-4 h-4" />
            Personal Info
          </button>
          <button 
            onClick={() => setActiveTab("career")}
            className={`px-6 py-4 border-b-2 text-sm font-bold flex items-center gap-2 transition-all ${activeTab === "career" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-400 hover:text-slate-600"}`}
          >
            <Briefcase className="w-4 h-4" />
            Career
          </button>
          <button 
            onClick={() => setActiveTab("resources")}
            className={`px-6 py-4 border-b-2 text-sm font-bold flex items-center gap-2 transition-all ${activeTab === "resources" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-400 hover:text-slate-600"}`}
          >
            <LinkIcon className="w-4 h-4" />
            Resources & Links
          </button>
        </nav>

        {/* Personal Info Tab Content */}
        {activeTab === "personal" && (
          <section className="bg-white rounded-xl shadow-sm border border-slate-100 p-8 animate-in fade-in slide-in-from-left-4 duration-500">
            {/* Profile Photo Section */}
            <div className="flex items-start gap-8 mb-10">
              <div className="relative">
                <div className="w-24 h-24 rounded-2xl bg-slate-100 overflow-hidden border border-slate-200 shadow-inner">
                  <img 
                    alt={user?.full_name} 
                    className="w-full h-full object-cover" 
                    src={profilePicture || getMediaUrl(user?.profile_picture, API_BASE) || getDefaultAvatar(user?.full_name || "User")}
                  />
                </div>
                <label className="absolute -bottom-2 -right-2 bg-slate-900 text-white p-2 rounded-xl shadow-lg border-2 border-white hover:scale-110 transition-transform cursor-pointer">
                  <Camera className="w-4 h-4" />
                  <input 
                    type="file" 
                    accept="image/*" 
                    hidden 
                    onChange={handleProfilePictureChange}
                  />
                </label>
              </div>
              <div className="flex-1 pt-1">
                <h3 className="text-base font-semibold text-slate-900 mb-1">Profile Photo</h3>
                <p className="text-xs text-slate-500 mb-4 leading-relaxed">Upload a professional headshot. High resolution JPG or PNG are preferred. Max file size: 5MB.</p>
                <div className="flex gap-4 items-center">
                  <label className="text-[11px] font-bold text-blue-700 uppercase tracking-wider hover:underline cursor-pointer">
                    Change Photo
                    <input 
                      type="file" 
                      accept="image/*" 
                      hidden 
                      onChange={handleProfilePictureChange}
                    />
                  </label>
                  <button 
                    onClick={removeProfilePicture}
                    className="text-[11px] font-bold text-red-600 uppercase tracking-wider hover:underline flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    Remove
                  </button>
                </div>
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Full Name</label>
                  <input 
                    className="w-full bg-slate-50 border-slate-200 rounded-lg text-sm text-slate-600 focus:ring-blue-500 focus:border-blue-500 p-3 transition-all" 
                    type="text" 
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                  />
                </div>
                {/* Institution */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Institution</label>
                  <input 
                    className="w-full bg-slate-100 border-slate-200 rounded-lg text-sm text-slate-500 p-3 cursor-not-allowed" 
                    type="text" 
                    name="university"
                    value={formData.university}
                    disabled
                  />
                </div>
                {/* Department */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Department</label>
                  <select 
                    className="w-full bg-slate-50 border-slate-200 rounded-lg text-sm text-slate-600 focus:ring-blue-500 focus:border-blue-500 p-3 transition-all"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                  >
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
                </div>
                {/* Current Year */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Current Year</label>
                  <select 
                    className="w-full bg-slate-50 border-slate-200 rounded-lg text-sm text-slate-600 focus:ring-blue-500 focus:border-blue-500 p-3 transition-all"
                    name="current_year"
                    value={formData.current_year}
                    onChange={handleInputChange}
                  >
                    <option>First Year</option>
                    <option>Second Year</option>
                    <option>Third Year</option>
                    <option>Final Year</option>
                  </select>
                </div>
                {/* GPA */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Cumulative GPA</label>
                  <input 
                    className={`w-full bg-slate-50 rounded-lg text-sm text-slate-600 focus:ring-blue-500 focus:border-blue-500 p-3 transition-all ${gpaError ? 'border-red-500' : 'border-slate-200'}`} 
                    type="number" 
                    step="0.01"
                    min="0"
                    max="4"
                    name="gpa"
                    value={formData.gpa}
                    onChange={handleInputChange}
                  />
                  {gpaError && (
                    <p className="text-xs text-red-600 font-medium">{gpaError}</p>
                  )}
                </div>
                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Secondary Email</label>
                  <div className="relative">
                    <input 
                      className="w-full bg-slate-50 border-slate-200 rounded-lg text-sm text-slate-600 focus:ring-blue-500 focus:border-blue-500 p-3 pr-10 transition-all" 
                      type="email" 
                      name="secondaryEmail"
                      value={formData.secondaryEmail}
                      onChange={handleInputChange}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <Plus className="w-4 h-4 text-slate-400" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Short Bio</label>
                <textarea 
                  className="w-full bg-slate-50 border-slate-200 rounded-lg text-sm text-slate-600 focus:ring-blue-500 focus:border-blue-500 leading-relaxed p-4 transition-all min-h-[120px] resize-none" 
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                ></textarea>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{formData.bio.length} / 300 characters</span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Career Tab Content */}
        {activeTab === "career" && (
          <section className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
            {/* Why this matters Info Box */}
            <div className="bg-[#eff6ff] border border-blue-100 rounded-2xl p-8 flex items-start gap-6 relative overflow-hidden">
              <div className="bg-[#1e293b] p-3 rounded-xl text-white shadow-lg shadow-blue-900/10">
                <Star className="w-6 h-6 fill-current" />
              </div>
              <div className="relative z-10">
                <h3 className="text-[#1e293b] font-bold text-lg mb-2">Why this matters?</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Alumni mentors use these tags to quickly understand your aspirations and technical foundation. A detailed profile increases your chances of being accepted for high-value mentorship tracks by 40%.
                </p>
              </div>
              <div className="absolute -top-4 -right-4 w-32 h-32 bg-blue-100/50 rounded-full"></div>
            </div>

            {/* Career Interests */}
            <div className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-slate-900">Career Interests</h2>
                <p className="text-sm text-slate-500 mt-1">What professional paths are you exploring? Select up to 5.</p>
              </div>
              {/* Suggested tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {SUGGESTED_CAREER_INTERESTS.map((interest) => (
                  <button
                    key={interest}
                    disabled={formData.career_interests.includes(interest) || formData.career_interests.length >= 5}
                    onClick={() => addCareerInterest(interest)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    formData.career_interests.includes(interest) 
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                      : 'bg-blue-50 text-blue-700 hover:bg-blue-100 cursor-pointer'
                  }`}
                  >
                    {interest}
                  </button>
                ))}
              </div>
              {/* Selected tags */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 min-h-[100px] flex flex-wrap gap-2">
                {formData.career_interests.map((interest: string) => (
                  <span key={interest} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-[#1d4ed8] rounded-lg text-xs font-bold">
                    {interest}
                    <button 
                      className="hover:text-blue-900"
                      onClick={() => removeCareerInterest(interest)}
                    >×</button>
                  </span>
                ))}
                <input 
                  type="text" 
                  placeholder="Type to add..." 
                  className="bg-transparent border-none focus:ring-0 text-sm text-slate-500 flex-1 min-w-[150px]"
                  disabled={formData.career_interests.length >= 5}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && formData.career_interests.length < 5) {
                      addCareerInterest(e.currentTarget.value);
                      e.currentTarget.value = "";
                    }
                  }}
                />
              </div>
            </div>

            {/* Skills & Tools */}
            <div className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-slate-900">Skills & Tools</h2>
                <p className="text-sm text-slate-500 mt-1">List technical proficiencies, languages, or specialized software you use.</p>
              </div>
              {/* Suggested tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {SUGGESTED_SKILLS.map((skill) => (
                  <button
                    key={skill}
                    disabled={formData.skills.includes(skill)}
                    onClick={() => addSkill(skill)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    formData.skills.includes(skill) 
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                      : 'bg-blue-50 text-blue-700 hover:bg-blue-100 cursor-pointer'
                  }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
              {/* Selected tags */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-wrap gap-2">
                {formData.skills.map((skill: string) => (
                  <span key={skill} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-[#1d4ed8] rounded-lg text-xs font-bold">
                    {skill}
                    <button 
                      className="hover:text-blue-900"
                      onClick={() => removeSkill(skill)}
                    >×</button>
                  </span>
                ))}
                <input 
                  type="text" 
                  placeholder="Type to add..." 
                  className="bg-transparent border-none focus:ring-0 text-sm text-slate-500 flex-1 min-w-[150px]"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      addSkill(e.currentTarget.value);
                      e.currentTarget.value = "";
                    }
                  }}
                />
              </div>
              <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-dashed border-slate-300 text-center">
                <p className="text-xs text-slate-400 font-medium italic">Add a skill (e.g. Adobe Creative Suite, Spanish, Public Speaking)</p>
              </div>
            </div>
          </section>
        )}
        {/* Resources & Links Tab Content */}
        {activeTab === "resources" && (
          <section className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            {/* Resume Management Card */}
            <div className="bg-[#f0f4ff] rounded-2xl p-8 border border-blue-100">
              <div className="flex items-start gap-4 mb-6">
                <div className="bg-white p-2.5 rounded-xl shadow-sm text-slate-700">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Resume Management</h2>
                  <p className="text-sm text-slate-500">Upload your latest CV for recruiters to download.</p>
                </div>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-center justify-between shadow-sm">
                {resumeFile || formData.resume_url ? (
                  <div className="flex items-center gap-4">
                    <div className="bg-red-50 p-2.5 rounded-lg">
                      <FileText className="w-8 h-8 text-red-500" />
                    </div>
                    <div>
                      {formData.resume_url && !resumeFile ? (
                        <a 
                          href={getMediaUrl(formData.resume_url, API_BASE) || '#'} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm font-bold text-blue-600 hover:underline"
                        >
                          {resumeFile ? resumeFile.name : 'Resume.pdf'}
                        </a>
                      ) : (
                        <p className="text-sm font-bold text-slate-900">
                          {resumeFile ? resumeFile.name : 'Resume.pdf'}
                        </p>
                      )}
                      <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tight">
                        {resumeFile ? `Uploaded • ${(resumeFile.size / 1024 / 1024).toFixed(1)} MB` : 'Uploaded previously'}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-slate-500">No resume uploaded yet</p>
                )}
                <label className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all active:scale-95 cursor-pointer">
                  <Upload className="w-4 h-4" />
                  {resumeFile || formData.resume_url ? 'Replace' : 'Upload'}
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
            </div>

            {/* Social Links Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* LinkedIn Profile */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block text-center">LinkedIn Profile</label>
                <div className="relative">
                  <input 
                    className="w-full bg-white border-slate-200 rounded-xl text-sm text-slate-600 focus:ring-blue-500 focus:border-blue-500 p-3 transition-all shadow-sm" 
                    type="text" 
                    name="linkedin_url"
                    value={formData.linkedin_url}
                    onChange={handleInputChange}
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 hidden">
                    <Linkedin className="w-4 h-4 text-slate-400" />
                  </div>
                </div>
              </div>
              {/* GitHub Username */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block text-center">GitHub Profile</label>
                <input 
                  className="w-full bg-white border-slate-200 rounded-xl text-sm text-slate-600 focus:ring-blue-500 focus:border-blue-500 p-3 transition-all shadow-sm" 
                  type="text" 
                  name="github_url"
                  value={formData.github_url}
                  onChange={handleInputChange}
                  placeholder="https://github.com/yourusername"
                />
              </div>
            </div>

            {/* Research Link (Requested) */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block px-2">Academic Research Links</label>
              <div className="relative">
                <input 
                  className="w-full bg-white border-slate-200 rounded-xl text-sm text-slate-600 focus:ring-blue-500 focus:border-blue-500 p-3 transition-all shadow-sm" 
                  type="text" 
                  name="academic_research_url"
                  value={formData.academic_research_url}
                  onChange={handleInputChange}
                  placeholder="https://researchgate.net/profile/alex-rivera"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <BookOpen className="w-4 h-4 text-slate-400" />
                </div>
              </div>
              <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-tight mt-2">Add links to your publications or research profile.</p>
            </div>

            {/* Portfolio URL */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block px-2">Personal Website / Portfolio</label>
              <input 
                className="w-full bg-white border-slate-200 rounded-xl text-sm text-slate-600 focus:ring-blue-500 focus:border-blue-500 p-3 transition-all shadow-sm" 
                type="text" 
                name="personal_website_url"
                value={formData.personal_website_url}
                onChange={handleInputChange}
                placeholder="https://yourportfolio.com"
              />
              <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-tight mt-2">This link will be featured prominently on your public profile header.</p>
            </div>
          </section>
        )}

        {/* Form Actions */}
        <div className="flex justify-end items-center mt-10 gap-6 pb-20 border-t border-slate-100 pt-10">
          <button 
            onClick={() => navigate("/dashboard/student-profile")}
            className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors uppercase tracking-widest"
          >
            Discard Changes
          </button>
          <button 
            onClick={handleSaveChanges}
            className="bg-[#1e293b] text-white px-10 py-4 rounded-xl text-sm font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20 active:scale-95 flex items-center gap-2"
          >
            Save Changes
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
