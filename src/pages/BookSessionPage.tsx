import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { 
  ArrowLeft, 
  Briefcase, 
  Calendar, 
  Clock, 
  GraduationCap, 
  Brain, 
  Users, 
  ShieldCheck, 
  ArrowRight,
  ChevronRight,
  Star,
  FileText,
  CheckCircle
} from "lucide-react";
import StudentNavbar from "../components/StudentNavbar";
import Footer from "../components/Footer";
import { useAuth } from "../contexts/AuthContext";
import { getDefaultAvatar } from "../utils/avatars";

export default function BookSessionPage() {
  const [step, setStep] = useState(1);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [alumni, setAlumni] = useState<any>(null);
  const [slots, setSlots] = useState<any[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<any>(null);
  const [agenda, setAgenda] = useState('');
  const [loading, setLoading] = useState(true);
  const [studentBookings, setStudentBookings] = useState<any[]>([]);
  const { user, API_BASE } = useAuth();
  const { alumniId } = useParams<{ alumniId: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (!alumniId || !user) return;
      try {
        const [alumniRes, slotsRes, bookingsRes] = await Promise.all([
          fetch(`${API_BASE}/users/${alumniId}`),
          fetch(`${API_BASE}/slots/alumni/${alumniId}`),
          fetch(`${API_BASE}/bookings/student/${user.id}`)
        ]);
        
        if (alumniRes.ok) {
          const alumniData = await alumniRes.json();
          setAlumni(alumniData.user);
        }
        
        if (slotsRes.ok) {
          const slotsData = await slotsRes.json();
          setSlots(slotsData.slots || []);
        }
        
        if (bookingsRes.ok) {
          const bookingsData = await bookingsRes.json();
          setStudentBookings(bookingsData.bookings || []);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [alumniId, API_BASE, user]);

  const getIconComponent = (topic: string) => {
    switch(topic?.toLowerCase()) {
      case 'tech career advice':
      case 'career advice':
        return Briefcase;
      case 'post-grad strategies':
      case 'post-grad':
        return GraduationCap;
      case 'interview prep':
      case 'interview':
        return Brain;
      case 'networking 101':
      case 'networking':
        return Users;
      default:
        return Briefcase;
    }
  };

  const handleConfirmBooking = async () => {
    if (!selectedSlot || !user) return;

    try {
      const response = await fetch(`${API_BASE}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_id: user.id,
          alumni_id: alumniId,
          time_slot_id: selectedSlot.id,
          session_agenda: agenda
        })
      });

      if (response.ok) {
        setShowSuccessModal(true);
      }
    } catch (error) {
      console.error("Error booking session:", error);
    }
  };

  if (loading) {
    return (
      <div className="bg-surface text-on-surface min-h-screen font-body antialiased flex items-center justify-center">
        <div className="text-slate-500">Loading...</div>
      </div>
    );
  }

  if (!alumni) {
    return (
      <div className="bg-surface text-on-surface min-h-screen font-body antialiased flex items-center justify-center">
        <div className="text-slate-500">Alumni not found</div>
      </div>
    );
  }

  const formatDateTime = (date: string, time: string) => {
    const dateObj = new Date(date);
    const dateStr = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    return `${dateStr} • ${time}`;
  };

  return (
    <div className="bg-surface text-on-surface min-h-screen font-body antialiased">
      <StudentNavbar activePage="none" />
      
      <main className="pt-12 pb-20 px-8 w-full">
        {/* Wizard Header */}
        <header className="mb-12 max-w-6xl">
          <div className="flex items-center gap-4 mb-6">
            <button 
              onClick={() => step > 1 ? setStep(step - 1) : navigate(-1)}
              className="flex items-center justify-center w-10 h-10 rounded-xl bg-surface-container-low text-primary hover:bg-surface-container-high transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-3xl font-extrabold tracking-tight text-on-surface">Book a Session</h1>
          </div>

          {/* Progress Stepper */}
          <div className="flex items-center gap-4 max-w-md">
            <div className={`flex-1 h-1.5 rounded-full ${step >= 1 ? 'bg-primary' : 'bg-surface-container-highest'}`}></div>
            <div className={`flex-1 h-1.5 rounded-full ${step >= 2 ? 'bg-primary' : 'bg-surface-container-highest'}`}></div>
            <div className={`flex-1 h-1.5 rounded-full ${step >= 3 ? 'bg-primary' : 'bg-surface-container-highest'}`}></div>
          </div>
          <div className="flex justify-between max-w-md mt-3">
            <span className={`text-[0.7rem] uppercase tracking-wider font-bold ${step === 1 ? 'text-primary' : 'text-on-surface-variant'}`}>Select Slot</span>
            <span className={`text-[0.7rem] uppercase tracking-wider font-bold ${step === 2 ? 'text-primary' : 'text-on-surface-variant'}`}>Agenda</span>
            <span className={`text-[0.7rem] uppercase tracking-wider font-bold ${step === 3 ? 'text-primary' : 'text-on-surface-variant'}`}>Confirm</span>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start max-w-[1600px]">
          {/* Main Content Area */}
          <div className="lg:col-span-8">
            {step === 1 && (
              <section className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex flex-col gap-2">
                  <h2 className="text-xl font-bold text-on-surface">Available Time Slots</h2>
                  <p className="text-on-surface-variant">Choose a session that fits your schedule. All times are in your local timezone.</p>
                </div>

                {slots.length === 0 ? (
                  <div className="text-center py-12 text-slate-500">No available slots at the moment</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {slots.map((slot) => {
                      const IconComponent = getIconComponent(slot.topic);
                      const isSelected = selectedSlot?.id === slot.id;
                      const isAlreadyBooked = studentBookings.some(booking => booking.slot_id === slot.id);
                      return (
                        <button 
                          key={slot.id}
                          onClick={() => !isAlreadyBooked && setSelectedSlot(slot)}
                          disabled={isAlreadyBooked}
                          className={`group relative text-left p-6 rounded-xl transition-all border-2 ${isAlreadyBooked ? 'bg-gray-100 border-gray-200 cursor-not-allowed opacity-70' : isSelected ? 'bg-surface-container-lowest border-primary shadow-sm' : 'bg-surface-container-low border-transparent hover:border-primary/20 hover:bg-surface-container-high'}`}
                        >
                          <div className="flex justify-between items-start mb-4">
                          <IconComponent className={`p-2 rounded-lg w-10 h-10 ${isAlreadyBooked ? 'text-gray-400 bg-gray-200' : isSelected ? 'text-primary bg-primary-fixed fill-primary/10' : 'text-on-surface-variant bg-surface-container-highest'}`} />
                          <div className="flex flex-col items-end gap-1">
                            {isAlreadyBooked ? (
                              <span className="text-[0.6rem] font-bold text-gray-500 px-2 py-1 bg-gray-200 rounded border border-gray-300">
                                Already Booked
                              </span>
                            ) : (
                              <span className="text-[0.6rem] font-bold text-primary px-2 py-1 bg-primary/5 rounded border border-primary/10">
                                {(slot.max_seats || 1) - (slot.booked_seats || 0)} {((slot.max_seats || 1) - (slot.booked_seats || 0)) === 1 ? "seat" : "seats"} available
                              </span>
                            )}
                          </div>
                        </div>
                          <h3 className="text-lg font-bold text-on-surface mb-1">{slot.topic}</h3>
                          <p className="text-sm text-on-surface-variant flex items-center gap-2 mb-4">
                            <Calendar className="w-3.5 h-3.5" />
                            {formatDateTime(slot.date, slot.start_time)}
                          </p>
                          <div className={`flex items-center gap-2 font-semibold text-sm ${isSelected ? 'text-primary' : 'text-on-surface-variant'}`}>
                            <Clock className="w-3.5 h-3.5" />
                            {slot.duration} mins
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </section>
            )}

            {step === 2 && (
              <section className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-primary">Tell {alumni.full_name} what's on your mind.</h2>
                  <p className="text-on-surface-variant leading-relaxed max-w-2xl">
                    Sharing a clear agenda helps <span className="font-semibold text-on-surface">{alumni.full_name}</span> prepare specific insights and resources for your session.
                  </p>
                </div>

                <div className="space-y-4">
                  <label className="block text-[11px] font-bold uppercase tracking-widest text-primary">Session Agenda</label>
                  <div className="bg-white rounded-xl border border-outline-variant/30 p-6 shadow-sm">
                    <textarea 
                      value={agenda}
                      onChange={(e) => setAgenda(e.target.value)}
                      className="w-full border-none focus:ring-0 p-0 text-on-surface placeholder:text-outline-variant/60 min-h-[200px] resize-none"
                      placeholder="E.g., I'd love to discuss my transition from UI design to Product thinking, and get your feedback on my latest portfolio piece..."
                      maxLength={500}
                    ></textarea>
                    <div className="flex justify-end mt-4">
                      <span className="text-[10px] font-bold tracking-widest text-on-surface-variant"><span className="text-primary">{agenda.length}</span> / 500 CHARACTERS</span>
                    </div>
                  </div>
                </div>

                {/* Writing Tips */}
                <div className="bg-[#EEF4FF] rounded-xl p-8 space-y-4">
                  <div className="flex items-center gap-2 text-secondary">
                    <Star className="w-4 h-4 fill-current" />
                    <h3 className="font-bold uppercase tracking-widest text-[11px]">Writing Tips</h3>
                  </div>
                  <ul className="space-y-3">
                    <li className="flex gap-3 text-sm text-on-surface-variant leading-relaxed">
                      <span className="text-secondary font-bold">•</span>
                      <span>Be specific about 2-3 key questions you want to ask.</span>
                    </li>
                    <li className="flex gap-3 text-sm text-on-surface-variant leading-relaxed">
                      <span className="text-secondary font-bold">•</span>
                      <span>Briefly mention your current career stage or specific challenges.</span>
                    </li>
                  </ul>
                </div>
              </section>
            )}

            {step === 3 && (
              <section className="space-y-12 animate-in fade-in zoom-in-95 duration-500 pb-20">
                <div className="text-center mb-10">
                  <h1 className="text-4xl font-extrabold text-[#111827] mb-4">Review Your Booking</h1>
                  <p className="text-gray-500 max-w-lg mx-auto text-sm leading-relaxed">
                    Finalize your mentorship session with {alumni.full_name}. Please ensure all details are correct before confirming.
                  </p>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 max-w-2xl mx-auto">
                  {/* Mentor Profile Info */}
                  <div className="flex items-start mb-10">
                    <div className="relative">
                      {/* Main Avatar with Corner Accents */}
                      <div className="relative">
                        <img 
                          alt={alumni.full_name} 
                          className="h-20 w-20 rounded-lg object-cover border-2 border-white shadow-sm" 
                          src={alumni.profile_picture || getDefaultAvatar(alumni.full_name)}
                        />
                        <div className="absolute -top-1.5 -left-1.5 w-4 h-4 border-t-2 border-l-2 border-primary"></div>
                        <div className="absolute -top-1.5 -right-1.5 w-4 h-4 border-t-2 border-r-2 border-primary"></div>
                        <div className="absolute -bottom-1.5 -left-1.5 w-4 h-4 border-b-2 border-l-2 border-primary"></div>
                        <div className="absolute -bottom-1.5 -right-1.5 bg-blue-600 rounded-full p-0.5 border border-white">
                          <ShieldCheck className="h-3 w-3 text-white fill-current" />
                        </div>
                      </div>
                    </div>
                    <div className="ml-6">
                      <span className="text-[10px] font-bold text-secondary uppercase tracking-[0.2em] mb-1 block">Your Mentor</span>
                      <h2 className="text-2xl font-bold text-gray-900">{alumni.full_name}</h2>
                      <p className="text-sm text-gray-500 font-medium">{alumni.current_job_title ? `${alumni.current_job_title} ${alumni.current_company ? `at ${alumni.current_company}` : ''}` : 'Alumni'}</p>
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 gap-8 mb-10">
                    <div>
                      <div className="flex items-center text-[10px] font-bold text-primary uppercase tracking-widest mb-2">
                        <Briefcase className="w-4 h-4 mr-2" />
                        Session Topic
                      </div>
                      <p className="text-base font-semibold text-gray-900">{selectedSlot?.topic}</p>
                    </div>
                    <div>
                      <div className="flex items-center text-[10px] font-bold text-primary uppercase tracking-widest mb-2">
                        <Clock className="w-4 h-4 mr-2" />
                        Date & Time
                      </div>
                      <p className="text-base font-semibold text-gray-900">{selectedSlot ? formatDateTime(selectedSlot.date, selectedSlot.start_time) : ''}</p>
                    </div>
                  </div>

                  {/* Agenda Block */}
                  <div className="mb-10">
                    <div className="flex items-center text-[10px] font-bold text-primary uppercase tracking-widest mb-3">
                      <FileText className="w-4 h-4 mr-2" />
                      Your Agenda
                    </div>
                    <div className="bg-[#F5F7FF] rounded-xl p-6 italic text-gray-600 text-sm leading-relaxed border border-slate-100">
                      "{agenda || 'No agenda provided'}"
                    </div>
                  </div>

                  {/* Final Actions */}
                  <div className="flex flex-col items-center space-y-4 pt-6">
                    <button 
                      onClick={handleConfirmBooking}
                      className="w-full bg-primary text-white py-4 px-6 rounded-xl font-bold text-sm flex items-center justify-center hover:opacity-90 transition-all shadow-lg shadow-primary/20"
                    >
                      Confirm & Book Session
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </button>
                    <button 
                      onClick={() => setStep(2)}
                      className="text-sm font-bold text-primary hover:underline transition-all"
                    >
                      Back to Agenda
                    </button>
                  </div>
                </div>
              </section>
            )}
          </div>

          {/* Sidebar Context */}
          <aside className="lg:col-span-4 space-y-6 sticky top-24">
            <div className="p-8 rounded-2xl bg-[#EEF4FF]/50 border border-outline-variant/10">
              <div className="flex flex-col items-start">
                <img 
                  src={alumni.profile_picture || getDefaultAvatar(alumni.full_name)}
                  alt={alumni.full_name} 
                  className="w-20 h-20 rounded-xl object-cover mb-4 shadow-sm border border-white"
                />
                <span className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-1">Your Mentor</span>
                <h3 className="text-2xl font-extrabold text-primary mb-1">{alumni.full_name}</h3>
                <p className="text-sm font-medium text-on-surface-variant mb-4">{alumni.current_job_title ? `${alumni.current_job_title} ${alumni.current_company ? `@ ${alumni.current_company}` : ''}` : 'Alumni'}</p>
                <p className="text-sm text-on-surface-variant italic leading-relaxed">
                  {alumni.bio || "Happy to help with career advice and guidance!"}
                </p>
              </div>
            </div>
            <div className="p-6 rounded-xl bg-surface-container-highest border border-slate-200/50">
              <h4 className="font-bold text-primary text-sm mb-2 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                Verified Alumni
              </h4>
              <p className="text-[11px] text-on-surface-variant font-medium uppercase tracking-tight">{alumni.graduation_year ? `Class of ${alumni.graduation_year}` : 'Alumni'}</p>
            </div>
          </aside>
        </div>

        {/* Footer Actions */}
        {step < 3 && (
          <div className="mt-16 flex justify-end items-center gap-4 border-t border-slate-100 pt-8">
            <button 
              onClick={() => navigate(-1)}
              className="text-primary font-bold px-8 py-3 rounded-xl hover:bg-surface-container-high transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={() => step === 1 && !selectedSlot ? null : setStep(step + 1)}
              disabled={step === 1 && !selectedSlot}
              className="bg-primary text-white font-bold px-10 py-3 rounded-xl shadow-lg hover:opacity-90 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {step === 1 && "Continue to Agenda"}
              {step === 2 && "Review Session"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </main>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-primary/20 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] p-12 w-full max-w-md shadow-2xl text-center animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-8">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                <CheckCircle className="text-white w-6 h-6" />
              </div>
            </div>
            <h2 className="text-4xl font-extrabold text-on-surface mb-3">Request Sent!</h2>
            <p className="text-on-surface-variant text-sm mb-10">
              Please wait for approval from the Alumni
            </p>
            <button 
              onClick={() => navigate('/dashboard/alumni-network')}
              className="w-full bg-[#0a2540] text-white py-4 rounded-xl font-bold text-sm shadow-xl hover:opacity-90 transition-all active:scale-95"
            >
              Back to Alumni Network
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
