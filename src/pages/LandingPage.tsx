import { motion } from "motion/react";
import {
  Users,
  Calendar,
  Briefcase,
  Search,
  FileText,
  Star,
  GraduationCap,
  Sparkles,
  Layers,
  CheckCircle2
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Hero = () => {
  return (
    <section className="relative pt-44 pb-32 overflow-hidden bg-[#022448]">
      {/* Background Glows */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-[120px] -z-10" />

      <div className="max-w-5xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/5 border border-white/5 backdrop-blur-sm mb-10"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-[10px] font-bold tracking-[0.2em] text-white uppercase opacity-80"> A Platrform for university of x</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-10xl md:text-7xl font-bold text-white leading-[1] tracking-tight mb-10"
        >
          Bridge the Gap Between <br />
          Campus and Career
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg text-blue-100 opacity-70 max-w-3xl mx-auto mb-12 leading-relaxed font-medium"
        >
          The premium professional network exclusively for university ecosystems.
          Secure mentorship, job referrals, and career guidance from people
          who walked your path.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-24"
        >
          <button className="w-full sm:w-auto px-10 py-4 bg-white text-[#022448] font-bold rounded-lg shadow-xl hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
            Find a Mentor
          </button>
          <button className="w-full sm:w-auto px-10 py-4 bg-transparent text-white font-bold rounded-lg border border-white/20 hover:bg-white/10 transition-all">
            Offer Mentorship
          </button>
        </motion.div>

        {/* Featured Mentor Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="relative max-w-3xl mx-auto bg-white rounded-xl p-8 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] flex flex-col md:flex-row items-center gap-8 text-left border border-white/5"
        >
          <div className="relative shrink-0">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&h=200"
              alt="David Chen"
              className="w-20 h-20 rounded-full object-cover ring-4 ring-blue-50"
            />
          </div>

          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
              <div>
                <h3 className="text-xl font-bold text-[#022448]">David Chen</h3>
                <p className="text-sm font-semibold text-blue-600">Senior Product Designer @ Google • Class of '18</p>
              </div>
              <div className="text-left sm:text-right border-l border-gray-100 pl-6 shrink-0">
                <div className="text-2xl font-bold text-[#022448]">4.9/5</div>
                <div className="text-[10px] font-extrabold text-gray-400 tracking-widest uppercase">Rating</div>
              </div>
            </div>
            <p className="text-gray-500 italic text-sm leading-relaxed max-w-xl">
              "Helping students navigate the transition to tech is the most rewarding way to give back."
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const Stats = () => {
  const stats = [
    { label: "VERIFIED ALUMNI", value: "600+" },
    { label: "MENTORSHIP SESSIONS", value: "2,900+" },
    { label: "CAREER REFERRALS", value: "1,200+" },
    { label: "SUCCESS SATISFACTION", value: "90%" },
  ];

  return (
    <section className="bg-white py-16 border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, i) => (
          <div key={i} className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-[#022448] mb-1">{stat.value}</div>
            <div className="text-[10px] font-extrabold text-gray-400 tracking-[0.2em] uppercase">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

const Journey = () => {
  const steps = [
    {
      number: "01",
      icon: <Search className="w-6 h-6 text-blue-600" />,
      title: "Discover Your Match",
      desc: "Search for alumni by industry, company, or degree. Our algorithm suggests mentors who align with your specific ambitions."
    },
    {
      number: "02",
      icon: <Calendar className="w-6 h-6 text-blue-600" />,
      title: "Book a Session",
      desc: "View availability and schedule virtual 1-on-1 coffee chats or resume reviews instantly through our integrated booking system."
    },
    {
      number: "03",
      icon: <Briefcase className="w-6 h-6 text-blue-600" />,
      title: "Request Referrals",
      desc: "Built rapport? Unlock the ability to request internal referrals for open positions at your mentor's current organization."
    }
  ];

  return (
    <section id="how-it-works" className="py-24 bg-[#F9F9FF]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <span className="text-[10px] font-extrabold tracking-[0.2em] text-blue-600 uppercase">THE JOURNEY</span>
          <h2 className="text-4xl font-bold text-[#022448] mt-4">Simple Steps to Success</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -5 }}
              className="relative p-8 bg-white rounded-2xl shadow-sm border border-gray-50"
            >
              <div className="absolute -top-6 -left-2 text-8xl font-black text-[#022448]/5 pointer-events-none select-none italic">
                {step.number}
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6 relative z-10">
                {step.icon}
              </div>
              <h3 className="text-xl font-bold text-[#022448] mb-4 relative z-10">{step.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed relative z-10">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Features = () => {
  const tools = [
    { icon: <Users size={20} />, title: "Smart Discovery", desc: "Filter by 'Worked at FAANG', 'Startup Founder', or 'Graduate School' to find the exact perspective you need." },
    { icon: <Calendar size={20} />, title: "Dynamic Slots", desc: "Alumni set their own hours. No back-and-forth emails—just pick a time that works and start the conversation." },
    { icon: <Layers size={20} />, title: "Referral System", desc: "A structured, professional way to request and track internal referrals. High visibility for your applications." },
    { icon: <Briefcase size={20} />, title: "Internal Job Feed", desc: "Access a curated board of positions posted exclusively by alumni looking to hire from their own school." },
    { icon: <FileText size={20} />, title: "Resume-First Profiles", desc: "Highlight your trajectory, not just your current title. Deep integration with academic history and projects." },
    { icon: <Star size={20} />, title: "Verified Ratings", desc: "Quality control through mutual feedback. Ensuring every mentorship session is professional and valuable." },
  ];

  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="max-w-xl">
            <span className="text-[10px] font-extrabold tracking-[0.2em] text-blue-600 uppercase">POWERFUL TOOLS</span>
            <h2 className="text-4xl font-bold text-[#022448] mt-4">Everything you need to network like a pro.</h2>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {tools.map((tool, i) => (
            <div key={i} className="p-8 rounded-2xl bg-[#F9F9FF] border border-gray-100/50 hover:bg-white hover:shadow-xl hover:shadow-blue-900/5 transition-all group">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform">
                {tool.icon}
              </div>
              <h3 className="text-lg font-bold text-[#022448] mb-3">{tool.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{tool.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const RegistrationCta = () => {
  return (
    <section className="py-24 bg-[#F9F9FF]">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-10">
        {/* For Students */}
        <div className="bg-[#022448] text-white p-12 rounded-[2rem] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
            <GraduationCap size={160} />
          </div>
          <h2 className="text-4xl font-bold mb-6">For Students</h2>
          <p className="text-blue-100 mb-10 text-lg leading-relaxed">
            Fast-track your career with insights you won't find on any public job board or LinkedIn profile.
          </p>
          <ul className="space-y-4 mb-12">
            <li className="flex items-center gap-3 text-sm font-medium">
              <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0" />
              Access 1:1 mentorship from verified alumni
            </li>
            <li className="flex items-center gap-3 text-sm font-medium">
              <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0" />
              Get inside track referrals to top companies
            </li>
            <li className="flex items-center gap-3 text-sm font-medium">
              <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0" />
              Resume reviews by industry professionals
            </li>
          </ul>
          <button className="w-full py-4 bg-white text-[#022448] font-bold rounded-xl hover:bg-blue-50 transition-colors shadow-lg">
            Register as a Student
          </button>
        </div>

        {/* For Alumni */}
        <div className="bg-blue-100 text-[#022448] p-12 rounded-[2rem] relative overflow-hidden group border border-blue-200">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
            <Briefcase size={160} />
          </div>
          <h2 className="text-4xl font-bold mb-6">For Alumni</h2>
          <p className="text-gray-600 mb-10 text-lg leading-relaxed">
            Give back to your alma mater and discover the next generation of talent for your team.
          </p>
          <ul className="space-y-4 mb-12">
            <li className="flex items-center gap-3 text-sm font-bold opacity-80">
              <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />
              Shape the future careers of bright students
            </li>
            <li className="flex items-center gap-3 text-sm font-bold opacity-80">
              <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />
              Build a diverse talent pipeline for your org
            </li>
            <li className="flex items-center gap-3 text-sm font-bold opacity-80">
              <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />
              Network with other senior-level alumni
            </li>
          </ul>
          <button className="w-full py-4 bg-[#022448] text-white font-bold rounded-xl hover:bg-[#033060] transition-colors shadow-lg">
            Register as an Alumnus
          </button>
        </div>
      </div>
    </section>
  );
};

const Testimonials = () => {
  const reviews = [
    {
      name: "Sarah Jenkins",
      role: "CLASS OF '23, ENGINEERING",
      img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100&h=100",
      content: "\"The referral I got through AlumniConnect was the deciding factor in getting my dream job at Tesla. My mentor walked me through the entire interview process.\""
    },
    {
      name: "Mark Thompson",
      role: "CLASS OF '05, FINANCE",
      img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100&h=100",
      content: "\"As a busy exec, I appreciate the structured scheduling. I can dedicate two hours a month and know I'm making a tangible difference for students from my university.\""
    },
    {
      name: "Kevin Zhao",
      role: "CLASS OF '24, MARKETING",
      img: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=100&h=100",
      content: "\"Searching for mentors by specific niche companies was a game-changer. I found someone in my exact sub-field who gave me insights I hadn't even considered.\""
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <span className="text-[10px] font-extrabold tracking-[0.2em] text-blue-600 uppercase">SUCCESS STORIES</span>
          <h2 className="text-4xl font-bold text-[#022448] mt-4">Voices of the Network</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {reviews.map((review, i) => (
            <div key={i} className="p-10 rounded-2xl bg-[#F9F9FF] border border-gray-50 flex flex-col items-start gap-8">
              <div className="flex gap-1">
                {[...Array(5)].map((_, j) => <Star key={j} size={14} className="fill-amber-400 text-amber-400" />)}
              </div>
              <p className="text-gray-600 italic leading-relaxed flex-1">
                {review.content}
              </p>
              <div className="flex items-center gap-4">
                <img src={review.img} alt={review.name} className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <div className="font-bold text-[#022448]">{review.name}</div>
                  <div className="text-[10px] font-extrabold text-blue-600 uppercase tracking-wider">{review.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const LandingPage = () => {
  return (
    <div className="font-sans antialiased bg-white selection:bg-blue-100 selection:text-[#022448]">
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <Journey />
        <Features />
        <RegistrationCta />
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
