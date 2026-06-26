import React, { useState } from 'react';
import { ArrowLeft, Camera, Link as LinkIcon, Pencil } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import AlumniSidebar from '../components/AlumniSidebar';
import { useAuth } from '../contexts/AuthContext';

export default function AlumniProfessionalProfile() {
  const navigate = useNavigate();
  const { registerAlumniStep2, alumniRegistrationData } = useAuth();
  const [formData, setFormData] = useState({
    currentJobTitle: alumniRegistrationData.currentJobTitle || '',
    currentCompany: alumniRegistrationData.currentCompany || '',
    industry: alumniRegistrationData.industry || '',
    professionalBio: alumniRegistrationData.professionalBio || '',
    linkedinUrl: alumniRegistrationData.linkedinUrl || '',
    profilePicture: alumniRegistrationData.profilePicture || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      await registerAlumniStep2({
        current_job_title: formData.currentJobTitle,
        current_company: formData.currentCompany,
        industry: formData.industry,
        professional_bio: formData.professionalBio,
        linkedin_url: formData.linkedinUrl,
        profile_picture: formData.profilePicture,
      });
      navigate('/register/alumni/step-3');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col md:flex-row">
      <AlumniSidebar currentStep={2} />

      <section className="flex-1 bg-surface p-6 md:p-16 lg:p-24 overflow-y-auto">
        <div className="max-w-2xl mx-auto">
          {/* Progress Header */}
          <div className="mb-12 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-black tracking-tight text-on-surface">Professional Profile</h2>
              <p className="text-on-surface-variant mt-2">Help us understand your career path and expertise.</p>
            </div>
            <div className="text-right hidden sm:block">
              <span className="text-sm font-bold text-primary uppercase tracking-widest block">Step 02 of 03</span>
              <div className="mt-2 h-1.5 w-24 bg-surface-container-high rounded-full overflow-hidden flex">
                <div className="h-full bg-primary w-2/3"></div>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-10">
            {/* Photo Upload Section */}
            <div className="bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant/30 flex items-center gap-8">
              <div className="relative group">
                <div className="w-24 h-24 rounded-2xl bg-surface-container-low flex items-center justify-center overflow-hidden border-2 border-dashed border-outline-variant group-hover:border-primary transition-all">
                  <Camera className="w-8 h-8 text-outline" />
                </div>
                <button
                  className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                  type="button"
                >
                  <Pencil className="w-4 h-4" />
                </button>
              </div>
              <div>
                <p className="font-bold text-on-surface">Profile Photograph <span className="text-sm font-normal text-on-surface-variant ml-1">(Optional)</span></p>
                <p className="text-xs text-on-surface-variant mb-2">JPG, PNG or WEBP. Max 5MB.</p>
                <button className="text-xs text-primary font-bold hover:underline transition-all" type="button">Skip for now, add later</button>
              </div>
            </div>

            {/* Main Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Current Job Title</label>
                <input
                  className="w-full px-5 py-4 rounded-xl bg-surface-container-low border-none ghost-border focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-outline-variant outline-none"
                  placeholder="e.g. Senior Software Architect"
                  type="text"
                  value={formData.currentJobTitle}
                  onChange={(e) => setFormData({ ...formData, currentJobTitle: e.target.value })}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Current Company</label>
                <input
                  className="w-full px-5 py-4 rounded-xl bg-surface-container-low border-none ghost-border focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-outline-variant outline-none"
                  placeholder="e.g. Global Innovations Inc."
                  type="text"
                  value={formData.currentCompany}
                  onChange={(e) => setFormData({ ...formData, currentCompany: e.target.value })}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Industry</label>
              <select
                className="w-full px-5 py-4 rounded-xl bg-surface-container-low border-none ghost-border focus:ring-2 focus:ring-primary/20 transition-all text-on-surface outline-none"
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
              >
                <option disabled value="">Select your industry</option>
                <option>Technology & Software</option>
                <option>Healthcare & Biotech</option>
                <option>Finance & Banking</option>
                <option>Education & Research</option>
                <option>Manufacturing & Engineering</option>
                <option>Art & Design</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Professional Bio</label>
              <textarea
                className="w-full px-5 py-4 rounded-xl bg-surface-container-low border-none ghost-border focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-outline-variant min-h-[140px] outline-none"
                placeholder="Briefly describe your professional journey and areas of expertise..."
                value={formData.professionalBio}
                onChange={(e) => setFormData({ ...formData, professionalBio: e.target.value })}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                LinkedIn URL <span className="text-[10px] font-normal lowercase tracking-normal">(Optional)</span>
              </label>
              <div className="relative">
                <LinkIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-outline" />
                <input
                  className="w-full pl-14 pr-5 py-4 rounded-xl bg-surface-container-low border-none ghost-border focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-outline-variant outline-none"
                  placeholder="linkedin.com/in/username"
                  type="url"
                  value={formData.linkedinUrl}
                  onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                />
              </div>
            </div>

            {/* Navigation Actions */}
            <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-6">
              <Link
                to="/register/alumni"
                className="w-full sm:w-auto px-8 py-4 rounded-xl text-on-surface-variant font-bold hover:bg-surface-container-high transition-all flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-5 h-5" />
                Previous Step
              </Link>
              <button
                disabled={loading}
                className="w-full sm:w-auto px-12 py-4 rounded-xl signature-gradient text-white font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                type="submit"
              >
                {loading ? 'Saving...' : 'Continue'}
              </button>
            </div>
          </form>

          <p className="mt-12 text-center text-xs text-on-surface-variant opacity-60 max-w-sm mx-auto leading-relaxed">
            By continuing, you agree to our professional data processing policy.
          </p>
        </div>
      </section>
    </main>
  );
}
