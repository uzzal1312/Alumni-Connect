import React, { useState } from 'react';
import { motion } from 'motion/react';
import { GraduationCap, ArrowRight, Landmark } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function StudentRegistrationPage() {
  const navigate = useNavigate();
  const { registerStudent } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    university: '',
    department: 'Computer Science',
    currentYear: 'First Year',
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
      await registerStudent({
        full_name: formData.fullName,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        university: formData.university,
        department: formData.department,
        current_year: formData.currentYear,
      });
      navigate('/dashboard/student');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col md:flex-row font-body text-on-surface antialiased overflow-x-hidden">
      {/* Left Section: Branding */}
      <section className="md:w-5/12 academic-gradient p-12 flex flex-col justify-between text-on-primary relative overflow-hidden min-h-[400px] md:min-h-screen">
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-primary-container rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute bottom-[-5%] left-[-5%] w-64 h-64 bg-secondary rounded-full opacity-10 blur-2xl"></div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative z-10"
        >
          <Link to="/" className="flex items-center gap-2 mb-20">
            <GraduationCap className="w-10 h-10 text-primary-fixed" />
            <span className="text-3xl font-black tracking-tighter text-white">AlumniConnect</span>
          </Link>
          <div className="max-w-md">
            <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[0.9] mb-8">
              Join as a Student
            </h1>
            <p className="text-lg text-primary-fixed/80 font-medium max-w-sm leading-relaxed">
              Bridge the gap between campus life and professional mastery. Connect with mentors who have walked your path.
            </p>
          </div>
        </motion.div>

        <div className="relative z-10 mt-auto pt-12">
          <div className="flex items-center gap-4 p-6 bg-primary-container/30 rounded-2xl border border-outline-variant/10 backdrop-blur-sm">
            <div className="flex -space-x-3">
              {[
                "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100&h=100",
                "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=100&h=100"
              ].map((src, i) => (
                <img key={i} className="w-10 h-10 rounded-full border-2 border-primary object-cover" src={src} alt="Student" />
              ))}
              <div className="w-10 h-10 rounded-full border-2 border-primary bg-primary-fixed text-on-primary-fixed flex items-center justify-center text-xs font-bold text-primary">
                +2k
              </div>
            </div>
            <p className="text-sm font-medium">Join 2,400+ students already building their future.</p>
          </div>
        </div>
      </section>

      {/* Right Section: Form */}
      <section className="md:w-7/12 bg-surface p-6 md:p-12 lg:p-20 flex flex-col justify-center relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl mx-auto w-full"
        >
          {/* Progress Indicator */}
          <nav aria-label="Progress" className="mb-16">
            <ol className="flex items-center justify-between space-x-8" role="list">
              <li className="flex-1">
                <div className="group flex flex-col border-primary border-t-4 pt-4 transition-colors">

                  <span className="text-sm font-semibold text-on-surface">Account Details</span>
                </div>
              </li>

            </ol>
          </nav>

          {/* Form Content */}
          <div className="space-y-10">
            <div>
              <h2 className="text-3xl font-black text-on-surface tracking-tight mb-2">Create your account</h2>
              <p className="text-on-surface-variant">Tell us who you are and where you study.</p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            <form className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6" onSubmit={handleSubmit}>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2 ml-1">Full Name</label>
                <input
                  className="w-full bg-surface-container-lowest border-0 ring-1 ring-outline-variant/20 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/40 transition-all outline-none"
                  placeholder="e.g. Alexander Sterling"
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2 ml-1">University Email</label>
                <input
                  className="w-full bg-surface-container-lowest border-0 ring-1 ring-outline-variant/20 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/40 transition-all outline-none"
                  placeholder="alex.s@university.edu"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2 ml-1">Password</label>
                <input
                  className="w-full bg-surface-container-lowest border-0 ring-1 ring-outline-variant/20 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/40 transition-all outline-none"
                  placeholder="••••••••"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2 ml-1">Confirm Password</label>
                <input
                  className="w-full bg-surface-container-lowest border-0 ring-1 ring-outline-variant/20 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/40 transition-all outline-none"
                  placeholder="••••••••"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2 ml-1">Educational Institution</label>
                <div className="relative">
                  <input
                    className="w-full bg-surface-container-lowest border-0 ring-1 ring-outline-variant/20 rounded-xl pl-12 pr-4 py-3 focus:ring-2 focus:ring-primary/40 transition-all outline-none"
                    placeholder="Search your university"
                    type="text"
                    value={formData.university}
                    onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                    required
                  />
                  <Landmark className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50 w-5 h-5" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2 ml-1">Department</label>
                <select
                  className="w-full bg-surface-container-lowest border-0 ring-1 ring-outline-variant/20 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/40 transition-all outline-none"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                >
                  <option>Computer Science</option>
                  <option>Business Administration</option>
                  <option>Mechanical Engineering</option>
                  <option>Law & Humanities</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2 ml-1">Current Year</label>
                <select
                  className="w-full bg-surface-container-lowest border-0 ring-1 ring-outline-variant/20 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/40 transition-all outline-none"
                  value={formData.currentYear}
                  onChange={(e) => setFormData({ ...formData, currentYear: e.target.value })}
                >
                  <option>First Year</option>
                  <option>Second Year</option>
                  <option>Third Year</option>
                  <option>Final Year</option>
                </select>
              </div>

              <div className="md:col-span-2 pt-8 flex items-center justify-between">
                <Link className="text-sm font-semibold text-primary hover:text-secondary transition-colors" to="/signin">Already have an account?</Link>
                <button
                  disabled={loading}
                  className="academic-gradient text-on-primary px-10 py-4 rounded-xl font-bold text-sm uppercase tracking-widest shadow-xl shadow-primary/10 flex items-center gap-2 group cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </section>

      {/* Background floating elements */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[20%] right-[10%] w-[30rem] h-[30rem] bg-primary-fixed/30 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[10%] left-[40%] w-[20rem] h-[20rem] bg-secondary-fixed/20 rounded-full blur-[100px]"></div>
      </div>
    </main>
  );
}
