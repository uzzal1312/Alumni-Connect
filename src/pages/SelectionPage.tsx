import { motion } from 'motion/react';
import { GraduationCap, Award, ArrowLeft, ArrowRight, Verified } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function SelectionPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 md:p-12 overflow-x-hidden relative">
      {/* Decorative Architectural Elements */}
      <div className="fixed top-0 left-0 w-full h-1 academic-gradient opacity-80 z-50"></div>
      <div className="fixed -top-24 -right-24 w-96 h-96 bg-primary-fixed opacity-10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="fixed -bottom-24 -left-24 w-96 h-96 bg-secondary-fixed opacity-10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Main Content Container */}
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-6xl z-10"
      >
        {/* Header Section */}
        <header className="text-center mb-16">
          <Link to="/" className="inline-flex items-center space-x-2 mb-6 group cursor-pointer no-underline">
            <GraduationCap className="text-primary w-8 h-8 group-hover:scale-110 transition-transform" />
            <span className="text-xl font-black tracking-tight text-primary group-hover:text-secondary transition-colors">AlumniConnect</span>
          </Link>
          <h1 className="text-4xl md:text-5xl font-headline font-extrabold text-on-surface tracking-tight mb-4">
            Choose your path
          </h1>
          <p className="text-on-surface-variant max-w-lg mx-auto text-lg">
            Join our exclusive academic network designed for high-velocity professional growth and mentorship.
          </p>
        </header>

        {/* Registration Cards Grid */}
        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          {/* Student Card */}
          <Link to="/register/student" className="group relative block h-full">
            <div className="absolute inset-0 academic-gradient opacity-0 group-hover:opacity-5 rounded-[2rem] transition-opacity duration-500 blur-xl"></div>
            <section className="relative h-full flex flex-col items-center text-center p-10 md:p-14 bg-surface-container-lowest rounded-[2rem] shadow-[0px_20px_40px_rgba(20,27,43,0.05)] transition-all duration-300 hover:shadow-[0px_30px_60px_rgba(2,36,72,0.1)]">
              <div className="w-20 h-20 rounded-2xl bg-primary-fixed flex items-center justify-center mb-10 group-hover:scale-110 transition-transform duration-300">
                <GraduationCap className="text-primary w-10 h-10" />
              </div>
              <h2 className="text-2xl font-headline font-bold text-on-surface mb-6">I'm a Student</h2>
              <p className="text-on-surface-variant text-body-lg mb-12 flex-grow leading-relaxed">
                Join to connect with alumni mentors, book sessions, and request referrals at top companies.
              </p>
              <button className="w-full py-4 px-8 academic-gradient text-on-primary font-bold rounded-xl shadow-lg transition-transform active:scale-95 duration-150 cursor-pointer">
                Register as Student
              </button>
              <div className="mt-8 flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-[0.75rem] font-bold uppercase tracking-widest text-primary">Access Dashboard</span>
                <ArrowRight className="text-primary w-4 h-4" />
              </div>
            </section>
          </Link>

          {/* Alumni Card */}
          <Link to="/register/alumni" className="group relative block h-full">
            <div className="absolute inset-0 bg-secondary-fixed opacity-0 group-hover:opacity-10 rounded-[2rem] transition-opacity duration-500 blur-xl"></div>
            <section className="relative h-full flex flex-col items-center text-center p-10 md:p-14 bg-surface-container-lowest rounded-[2rem] shadow-[0px_20px_40px_rgba(20,27,43,0.05)] transition-all duration-300 hover:shadow-[0px_30px_60px_rgba(2,36,72,0.1)] border border-outline-variant/20">
              <div className="w-20 h-20 rounded-2xl bg-surface-container-low flex items-center justify-center mb-10 group-hover:scale-110 transition-transform duration-300">
                <Award className="text-secondary w-10 h-10" />
              </div>
              <h2 className="text-2xl font-headline font-bold text-on-surface mb-6">I'm an Alumni</h2>
              <p className="text-on-surface-variant text-body-lg mb-12 flex-grow leading-relaxed">
                Join to mentor your university juniors, post job openings, and manage referral requests.
              </p>
              <button className="w-full py-4 px-8 border-2 border-primary text-primary font-bold rounded-xl transition-all hover:bg-primary/5 active:scale-95 duration-150 cursor-pointer">
                Register as Alumni
              </button>
              <div className="mt-8 flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-[0.75rem] font-bold uppercase tracking-widest text-secondary">Verified Profile</span>
                <Verified className="text-secondary w-4 h-4" />
              </div>
            </section>
          </Link>
        </div>

        {/* Footer / Back Link */}
        <footer className="mt-20 text-center">
          <Link className="inline-flex items-center space-x-3 text-on-surface-variant hover:text-primary transition-colors group" to="/signin">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-bold uppercase tracking-widest">Back to Login</span>
          </Link>
        </footer>
      </motion.main>

    </div>
  );
}
