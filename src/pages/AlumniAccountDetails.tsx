import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import AlumniSidebar from '../components/AlumniSidebar';
import { useAuth } from '../contexts/AuthContext';

export default function AlumniAccountDetails() {
  const navigate = useNavigate();
  const { registerAlumniStep1, alumniRegistrationData } = useAuth();
  const [formData, setFormData] = useState({
    fullName: alumniRegistrationData.fullName || '',
    email: alumniRegistrationData.email || '',
    password: '',
    confirmPassword: '',
    graduationYear: alumniRegistrationData.graduationYear || '',
    fieldOfStudy: alumniRegistrationData.fieldOfStudy || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    try {
      setLoading(true);
      setError('');
      await registerAlumniStep1({
        full_name: formData.fullName,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        graduation_year: formData.graduationYear,
        field_of_study: formData.fieldOfStudy,
      });
      navigate('/register/alumni/step-2');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col md:flex-row">
      <AlumniSidebar currentStep={1} />

      <section className="flex-1 bg-surface p-6 md:p-20 overflow-y-auto">
        <div className="max-w-2xl mx-auto">
          {/* Progress Indicator */}
          <nav className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-bold text-primary uppercase tracking-widest">Step 01 of 03</span>
              <span className="text-sm font-medium text-on-surface-variant uppercase tracking-widest">Account Setup</span>
            </div>
            <div className="h-1 w-full bg-surface-container-high rounded-full overflow-hidden flex">
              <div className="h-full bg-primary w-1/3"></div>
              <div className="h-full w-1/3"></div>
              <div className="h-full w-1/3"></div>
            </div>
          </nav>

          {/* Form Container */}
          <div className="bg-surface-container-lowest p-10 rounded-2xl shadow-[0px_20px_40px_rgba(20,27,43,0.05)]">
            <div className="flex items-center gap-4 mb-10">
              <span className="w-10 h-10 rounded-full signature-gradient flex items-center justify-center text-white font-bold">1</span>
              <h2 className="text-2xl font-black tracking-tight text-on-surface">Personal Information</h2>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Full Name</label>
                  <input
                    className="w-full px-5 py-4 rounded-xl bg-surface-container-low border-none ghost-border focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-outline-variant outline-none"
                    placeholder="John Doe"
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    required
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Email Address</label>
                  <input
                    className="w-full px-5 py-4 rounded-xl bg-surface-container-low border-none ghost-border focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-outline-variant outline-none"
                    placeholder="john.doe@example.com"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Password</label>
                    <input
                      className="w-full px-5 py-4 rounded-xl bg-surface-container-low border-none ghost-border focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-outline-variant outline-none"
                      placeholder="••••••••"
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Confirm Password</label>
                    <input
                      className="w-full px-5 py-4 rounded-xl bg-surface-container-low border-none ghost-border focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-outline-variant outline-none"
                      placeholder="••••••••"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Graduation Year</label>
                    <select
                      className="w-full px-5 py-4 rounded-xl bg-surface-container-low border-none ghost-border focus:ring-2 focus:ring-primary/20 transition-all text-on-surface outline-none"
                      value={formData.graduationYear}
                      onChange={(e) => setFormData({ ...formData, graduationYear: e.target.value })}
                    >
                      <option disabled value="">Select Year</option>
                      <option>2024</option>
                      <option>2023</option>
                      <option>2022</option>
                      <option>2021</option>
                      <option>2020</option>
                      <option>2019</option>
                      <option>Earlier</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Field of Study</label>
                    <input
                      className="w-full px-5 py-4 rounded-xl bg-surface-container-low border-none ghost-border focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-outline-variant outline-none"
                      placeholder="e.g. Computer Science"
                      type="text"
                      value={formData.fieldOfStudy}
                      onChange={(e) => setFormData({ ...formData, fieldOfStudy: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-8 flex flex-col items-center gap-6">
                <button
                  disabled={loading}
                  className="w-full py-4 rounded-2xl signature-gradient text-white font-bold shadow-xl hover:shadow-2xl hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  type="submit"
                >
                  {loading ? 'Saving...' : 'Continue'}
                  <ArrowRight className="w-4 h-4" />
                </button>
                <p className="text-center text-sm text-on-surface-variant">
                  Already have an account?{' '}
                  <Link className="text-primary font-bold hover:underline" to="/signin">Sign In</Link>
                </p>
              </div>
            </form>
          </div>

          <p className="text-center text-xs text-on-surface-variant opacity-60 max-w-sm mx-auto mt-12">
            By creating an account, you agree to the AlumniConnect Terms of Service and Privacy Policy.
          </p>
        </div>
      </section>
    </main>
  );
}
