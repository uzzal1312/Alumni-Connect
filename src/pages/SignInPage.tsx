import React, { useState } from 'react';
import { motion } from 'motion/react';
import { CheckCircle, Eye, LogIn, GraduationCap, Award, ShieldCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function SignInPage() {
  const navigate = useNavigate();
  const { login, user } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      await login(formData.email, formData.password);
      // Now check user role and redirect
      // We use setTimeout to make sure user is updated in context
      setTimeout(() => {
        // Check localStorage directly to make sure we have the latest user
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          const parsedUser = JSON.parse(savedUser);
          if (parsedUser.role === 'admin') {
            navigate('/dashboard/admin');
          } else if (parsedUser.role === 'alumni') {
            navigate('/dashboard/alumni');
          } else {
            navigate('/dashboard/student');
          }
        }
      }, 100);
    } catch (err: any) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col md:flex-row font-body text-on-surface antialiased">
      {/* Left Pane: Branding & Info */}
      <section className="w-full md:w-5/12 academic-gradient p-12 md:p-20 flex flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-container/20 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/10 rounded-full -ml-48 -mb-48 blur-3xl"></div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative z-10"
        >
          <Link to="/" className="flex items-center gap-3 mb-12 group cursor-pointer no-underline">
            <GraduationCap className="w-10 h-10 text-white group-hover:scale-110 transition-transform" />
            <span className="text-4xl font-black tracking-tighter text-white group-hover:text-primary-fixed-dim transition-colors">AlumniConnect</span>
          </Link>
          <h1 className="text-white text-5xl md:text-6xl font-headline font-extrabold leading-tight tracking-tighter mb-8">
            Your network is waiting. <span className="text-primary-fixed-dim">Sign in to continue.</span>
          </h1>

          <div className="space-y-8 mt-12">
            {[
              { title: "Exclusive Job Board", desc: "Access high-tier roles curated specifically for our alumni ecosystem." },
              { title: "Mentorship Marketplace", desc: "Connect with industry veterans or guide the next generation of leaders." },
              { title: "Professional Directories", desc: "Search by firm, industry, or graduation year with precision filters." }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + idx * 0.1 }}
                className="flex items-start gap-4"
              >
                <div className="bg-primary-container p-2 rounded-lg">
                  <CheckCircle className="text-primary-fixed w-5 h-5" />
                </div>
                <div>
                  <p className="text-white font-semibold text-lg">{item.title}</p>
                  <p className="text-primary-fixed/70 text-sm">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="relative z-10 mt-12">
          <div className="inline-flex items-center gap-4 py-3 px-6 rounded-full bg-white/5 backdrop-blur-md border border-white/10">
            <div className="flex -space-x-3">
              {[
                "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100&h=100",
                "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100&h=100",
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100&h=100"
              ].map((src, i) => (
                <img key={i} className="w-8 h-8 rounded-full border-2 border-primary ring-2 ring-primary/20 object-cover" src={src} alt="Alumni" />
              ))}
            </div>
            <span className="text-white/80 text-sm font-medium">Join 600+ active alumni</span>
          </div>
        </div>
      </section>

      {/* Right Pane: Sign In Form */}
      <section className="w-full md:w-7/12 bg-white flex items-center justify-center p-8 md:p-24 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="mb-12">
            <h2 className="text-4xl font-headline font-black text-on-surface tracking-tight mb-2">Welcome back</h2>
            <p className="text-on-surface-variant">Don't have an account? <Link className="text-secondary font-bold hover:underline" to="/selection">Register</Link></p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2 ml-1">Email Address</label>
              <input
                className="w-full px-6 py-4 rounded-xl bg-surface-container-low border-none focus:ring-2 focus:ring-primary/40 text-on-surface placeholder:text-outline-variant transition-all outline-none"
                placeholder="name@university.edu"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div className="relative">
              <div className="flex justify-between items-center mb-2 px-1">
                <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant">Password</label>
                <a className="text-xs font-bold text-secondary hover:text-primary transition-colors" href="#">Forgot password?</a>
              </div>
              <div className="relative">
                <input
                  className="w-full px-6 py-4 rounded-xl bg-surface-container-low border-none focus:ring-2 focus:ring-primary/40 text-on-surface placeholder:text-outline-variant transition-all outline-none"
                  placeholder="••••••••"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
                <button
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary p-2"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <Eye className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                disabled={loading}
                className="w-full academic-gradient text-white font-bold py-4 rounded-xl academic-shadow hover:opacity-95 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                type="submit"
              >
                {loading ? 'Signing in...' : 'Sign In'}
                <LogIn className="w-4 h-4" />
              </button>
            </div>
          </form>

          <div className="my-12 flex items-center gap-4">
            <div className="h-px bg-surface-container flex-1"></div>
            <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">or continue as</span>
            <div className="h-px bg-surface-container flex-1"></div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {[
              { name: "Student", icon: GraduationCap, path: "/dashboard/student" },
              { name: "Alumni", icon: Award, path: "/dashboard/alumni" },
              { name: "Admin", icon: ShieldCheck, path: "/dashboard/admin" }
            ].map((role, i) => {
              const content = (
                <>
                  <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center academic-shadow group-hover:scale-110 transition-transform">
                    <role.icon className="text-secondary w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">{role.name}</span>
                </>
              );

              return role.path ? (
                <Link
                  key={i}
                  to={role.path}
                  className="flex flex-col items-center gap-3 p-4 rounded-xl bg-surface-container-low hover:bg-surface-container-high transition-all group border border-transparent hover:border-outline-variant/20 cursor-pointer no-underline"
                >
                  {content}
                </Link>
              ) : (
                <button
                  key={i}
                  className="flex flex-col items-center gap-3 p-4 rounded-xl bg-surface-container-low hover:bg-surface-container-high transition-all group border border-transparent hover:border-outline-variant/20 cursor-pointer"
                >
                  {content}
                </button>
              );
            })}
          </div>

          <footer className="mt-16 pt-8 border-t border-surface-container text-center">
            <p className="text-xs text-on-surface-variant font-medium tracking-wide">
              © 2026 AlumniConnect Network. All Rights Reserved.
            </p>
            <div className="flex justify-center gap-6 mt-4">
              {["Privacy Policy", "Terms of Service", "Support"].map((link) => (
                <a key={link} className="text-[10px] uppercase font-bold text-outline hover:text-secondary tracking-widest" href="#">{link}</a>
              ))}
            </div>
          </footer>
        </motion.div>
      </section>
    </main>
  );
}
