import React, { useState, useEffect } from "react";
import { 
  Link as LinkIcon, 
  Linkedin, 
  Github, 
  Globe, 
  Info, 
  CheckCircle2,
  GraduationCap
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import AlumniNavbar from "../components/AlumniNavbar";
import Footer from "../components/Footer";
import { useAuth } from "../contexts/AuthContext";

export default function AlumniEditResourcesPage() {
  const { user, API_BASE, fetchUserProfile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    linkedin_url: "",
    github_url: "",
    portfolio_url: "",
    research_url: ""
  });

  useEffect(() => {
    const loadProfile = async () => {
      if (!user?.id) return;
      try {
        const userProfile = await fetchUserProfile(user.id);
        setFormData({
          linkedin_url: userProfile.profile?.linkedin_url || "",
          github_url: userProfile.profile?.github_url || "",
          portfolio_url: userProfile.profile?.portfolio_url || "",
          research_url: userProfile.profile?.research_url || ""
        });
      } catch (error) {
        console.error('Failed to load profile:', error);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [user?.id, fetchUserProfile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    try {
      await fetch(`${API_BASE}/users/${user.id}/alumni-profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          linkedin_url: formData.linkedin_url,
          github_url: formData.github_url,
          portfolio_url: formData.portfolio_url,
          research_url: formData.research_url
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
            Curate your professional presence. Ensure your resources and social links are up-to-date for aspiring students and fellow alumni.
          </p>
        </section>

        <div className="flex items-center gap-12 mb-16 border-b border-gray-100">
          <Link to="/dashboard/alumni/profile/edit" className="pb-4 text-sm font-bold text-gray-400 hover:text-[#022448] transition-colors">
            Personal Info
          </Link>
          <Link to="/dashboard/alumni/profile/edit/professional" className="pb-4 text-sm font-bold text-gray-400 hover:text-[#022448] transition-colors">
            Professional Experience
          </Link>
          <button className="pb-4 text-sm font-black text-[#022448] border-b-2 border-[#022448]">
            Resources & Links
          </button>
        </div>

        <div className="grid grid-cols-12 gap-16">
          <div className="col-span-12 lg:col-span-8">
            <div className="bg-[#f1f3ff] rounded-[3rem] p-10 space-y-10 border border-[#022448]/5">
              <div>
                <div className="flex items-center gap-3 mb-10">
                  <LinkIcon className="text-[#022448] w-6 h-6" />
                  <h3 className="text-2xl font-black text-[#022448]">Professional Links</h3>
                </div>

                <form className="space-y-10" onSubmit={handleSaveChanges}>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Linkedin className="text-[#022448] w-5 h-5" />
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">LinkedIn URL</label>
                    </div>
                    <input 
                      className="w-full bg-white border-none focus:ring-4 focus:ring-[#022448]/5 rounded-2xl px-6 py-4 transition-all font-bold text-[#022448] shadow-sm" 
                      type="url" 
                      name="linkedin_url"
                      value={formData.linkedin_url}
                      onChange={handleInputChange}
                      placeholder="https://linkedin.com/in/username"
                    />
                    <p className="text-[10px] text-gray-400 px-1 font-medium italic">Your professional network profile link.</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Github className="text-[#022448] w-5 h-5" />
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">GitHub URL</label>
                    </div>
                    <input 
                      className="w-full bg-white border-none focus:ring-4 focus:ring-[#022448]/5 rounded-2xl px-6 py-4 transition-all font-bold text-[#022448] shadow-sm" 
                      type="url" 
                      name="github_url"
                      value={formData.github_url}
                      onChange={handleInputChange}
                      placeholder="https://github.com/username"
                    />
                    <p className="text-[10px] text-gray-400 px-1 font-medium italic">Showcase your repositories and open-source contributions.</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Globe className="text-[#022448] w-5 h-5" />
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Personal Website / Portfolio</label>
                    </div>
                    <input 
                      className="w-full bg-white border-none focus:ring-4 focus:ring-[#022448]/5 rounded-2xl px-6 py-4 transition-all font-bold text-[#022448] shadow-sm" 
                      type="url" 
                      name="portfolio_url"
                      value={formData.portfolio_url}
                      onChange={handleInputChange}
                      placeholder="https://yourportfolio.com"
                    />
                    <p className="text-[10px] text-gray-400 px-1 font-medium italic">A link to your personal site or design portfolio.</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="text-[#022448] w-5 h-5" />
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Research / Academic Link</label>
                    </div>
                    <input 
                      className="w-full bg-white border-none focus:ring-4 focus:ring-[#022448]/5 rounded-2xl px-6 py-4 transition-all font-bold text-[#022448] shadow-sm" 
                      type="url" 
                      name="research_url"
                      value={formData.research_url}
                      onChange={handleInputChange}
                      placeholder="https://scholar.google.com/..."
                    />
                    <p className="text-[10px] text-gray-400 px-1 font-medium italic">Link to your publications, research lab, or academic profile.</p>
                  </div>

                  <div className="pt-8 flex justify-end items-center gap-10">
                    <Link to="/dashboard/alumni/profile" className="text-[10px] font-black uppercase tracking-[0.2em] text-[#022448] hover:opacity-70 transition-all">
                      Discard Changes
                    </Link>
                    <button 
                      type="submit"
                      className="bg-[#022448] text-white px-12 py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-[#022448]/20 hover:opacity-90 active:scale-[0.95] transition-all"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>

              <div className="bg-[#d5e3ff]/30 p-8 rounded-[2rem] flex items-start gap-5 border border-[#022448]/5">
                <div className="bg-[#022448] p-2 rounded-lg text-white">
                  <Info className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-[#022448] mb-1">Visibility Settings</h4>
                  <p className="text-[11px] text-gray-500 leading-relaxed font-medium">
                    These links will be prominently displayed on your public mentor profile. Ensure they are set to 'Public' on their respective platforms so students can view your work.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-4">
            <div className="bg-[#022448] text-white p-10 rounded-[2.5rem] shadow-2xl shadow-[#022448]/20 relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/5 rounded-full blur-3xl"></div>
              
              <h3 className="text-2xl font-black mb-8 relative z-10">Why Link?</h3>
              <ul className="space-y-8 relative z-10">
                {[
                  "Build trust with mentees by showing your real-world impact.",
                  "Centralize your professional identity in one architect's hub.",
                  "Increase your discoverability for high-tier referrals"
                ].map((tip, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <CheckCircle2 className="text-[#d5e3ff] w-5 h-5 mt-0.5 shrink-0" />
                    <p className="text-sm font-medium text-[#d5e3ff] leading-relaxed">{tip}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
