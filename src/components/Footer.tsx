import { GraduationCap, Globe, Linkedin, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#022448] text-white py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <GraduationCap className="w-8 h-8 text-white" />
              <span className="text-2xl font-bold">AlumniConnect</span>
            </div>
            <p className="text-blue-100/60 max-w-xs text-sm leading-relaxed mb-8">
              The professional architect for university ecosystems. Secure mentorship, referrals, and growth.
            </p>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer">
                <Globe size={14} />
              </div>
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer">
                <Linkedin size={14} />
              </div>
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer">
                <Twitter size={14} />
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-sm">PLATFORM</h4>
            <ul className="space-y-4 text-sm text-blue-100/60">
              <li><a href="#" className="hover:text-white transition-colors">Find Mentors</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Job Board</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Success Stories</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-sm">UNIVERSITY</h4>
            <ul className="space-y-4 text-sm text-blue-100/60">
              <li><a href="#" className="hover:text-white transition-colors">Career Offices</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Integration</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-sm">SUPPORT</h4>
            <ul className="space-y-4 text-sm text-blue-100/60">
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] font-extrabold text-blue-100/30 uppercase tracking-[0.2em]">
          <div>© 2026 ALUMNICONNECT GLOBAL. ALL RIGHTS RESERVED.</div>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">COOKIES</a>
            <a href="#" className="hover:text-white transition-colors">ACCESSIBILITY</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
