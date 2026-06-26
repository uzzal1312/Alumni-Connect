import { useState, useEffect } from "react";
import { GraduationCap } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/90 backdrop-blur-md shadow-sm py-4" : "bg-white py-6"}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <GraduationCap className="w-8 h-8 text-[#022448]" />
          <span className="text-xl font-bold tracking-tight text-[#022448]">AlumniConnect</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <a href="#how-it-works" className="text-[10px] font-extrabold text-gray-500 hover:text-[#022448] transition-colors tracking-[0.2em]">HOW IT WORKS</a>
          <a href="#features" className="text-[10px] font-extrabold text-gray-500 hover:text-[#022448] transition-colors tracking-[0.2em]">FEATURES</a>
        </div>

        <div className="flex items-center gap-4">
          <Link to="/signin" className="text-xs font-bold text-gray-500 px-4 py-2 hover:text-[#022448] transition-colors tracking-widest">SIGN IN</Link>
          <Link to="/selection" className="bg-[#022448] text-white text-xs font-extrabold px-6 py-2.5 rounded-lg shadow-lg shadow-blue-900/20 hover:scale-105 active:scale-95 transition-all tracking-widest uppercase">
            GET STARTED
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
