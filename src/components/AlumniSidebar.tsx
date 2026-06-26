import { GraduationCap, Check, Network } from "lucide-react";
import { Link } from "react-router-dom";

interface SidebarProps {
  currentStep: number;
}

export default function AlumniSidebar({ currentStep }: SidebarProps) {
  const steps = [
    { number: 1, label: "Account Details", status: currentStep > 1 ? "completed" : currentStep === 1 ? "active" : "pending" },
    { number: 2, label: "Professional Profile", status: currentStep > 2 ? "completed" : currentStep === 2 ? "active" : "pending" },
    { number: 3, label: "Work History", status: currentStep > 3 ? "completed" : currentStep === 3 ? "active" : "pending" },
  ];

  return (
    <section className="md:w-[35%] lg:w-[30%] signature-gradient p-12 flex flex-col justify-between text-on-primary relative overflow-hidden shrink-0 min-h-screen">
      <div className="relative z-10">
        <Link to="/" className="flex items-center gap-3 mb-16">
          <GraduationCap className="w-10 h-10 text-white" />
          <span className="text-xl font-black tracking-tighter uppercase text-white">AlumniConnect</span>
        </Link>

        <div className="max-w-md">
          <h1 className="text-5xl font-black tracking-tight leading-tight mb-6 text-white">
            Join as an <br /><span className="text-primary-fixed-dim">Alumni</span>
          </h1>
          <p className="text-lg text-primary-fixed/80 leading-relaxed">
            Reconnect with your alma mater, mentor the next generation of talent, and access exclusive professional opportunities.
          </p>
        </div>

        {/* Step Indicator Sidebar */}
        <nav className="mt-16 space-y-8">
          {steps.map((step) => (
            <div key={step.number} className={`flex items-center gap-4 ${step.status === "pending" ? "opacity-40" : step.status === "completed" ? "opacity-60" : ""}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                step.status === "active"
                  ? "border-2 border-primary-fixed-dim text-primary-fixed-dim"
                  : "bg-primary-fixed-dim text-primary"
              }`}>
                {step.status === "completed" ? <Check className="w-5 h-5" /> : step.number}
              </div>
              <div className="flex flex-col">
                <span className={`text-xs uppercase tracking-widest font-bold ${step.status === "active" ? "text-primary-fixed-dim" : "text-white/80"}`}>
                  Step 0{step.number}
                </span>
                <span className="font-bold text-white">{step.label}</span>
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* Testimonial */}
      <div className="relative z-10 mt-12 bg-white/5 backdrop-blur-lg p-6 rounded-2xl border border-white/10">
        <p className="text-xl font-bold mb-4 italic leading-snug text-white">"The strength of the pack is the wolf, and the strength of the wolf is the pack."</p>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-surface-container-highest overflow-hidden">
            <img
              alt="Profile"
              className="w-full h-full object-cover"
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100&h=100"
            />
          </div>
          <div>
            <p className="text-sm font-bold text-white">Dr. Aris Thorne</p>
            <p className="text-[10px] text-primary-fixed/60 uppercase tracking-tighter">Class of '08 • VP at TechFlow</p>
          </div>
        </div>
      </div>

      {/* Background Decorative Pattern */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 opacity-10 pointer-events-none text-white">
        <Network className="w-[40rem] h-[40rem]" />
      </div>
    </section>
  );
}
