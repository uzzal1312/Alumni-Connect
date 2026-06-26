import React, { useState, useEffect } from "react";
import { 
  Calendar, 
  Clock, 
  Video, 
  Edit2, 
  Trash2, 
  Plus, 
  Users, 
  Link as LinkIcon,
  Star,
  Info,
  ChevronRight
} from "lucide-react";
import AlumniNavbar from "../components/AlumniNavbar";
import Footer from "../components/Footer";
import { useAuth } from "../contexts/AuthContext";

export default function AlumniSlotManagerPage() {
  const { user, API_BASE } = useAuth();
  const [activeTab, setActiveTab] = useState("Upcoming");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<any>(null);
  const [slots, setSlots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSlots = async () => {
    if (!user) return;
    try {
      const response = await fetch(`${API_BASE}/slots/alumni/${user.id}?showAll=true`);
      const data = await response.json();
      if (response.ok) {
        setSlots(data.slots);
      }
    } catch (error) {
      console.error('Error fetching slots:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlots();
  }, [user?.id]);

  const openEditModal = (slot: any) => {
    setSelectedSlot(slot);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedSlot(null);
  };

  const handleCreateSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const formData = new FormData(e.target as HTMLFormElement);
    const title = formData.get("title") as string;
    const date = formData.get("date") as string;
    const startTime = formData.get("startTime") as string;
    const duration = parseInt(formData.get("duration") as string);
    const maxSeats = parseInt(formData.get("maxSeats") as string);
    const meetingUrl = formData.get("meetingUrl") as string;
    
    console.log('Creating slot with:', { title, date, startTime, duration, maxSeats, meetingUrl });
    
    // Calculate end time from start time and duration
    const [hours, minutes] = startTime.split(":").map(Number);
    const startDate = new Date(date); // Use selected date instead of today!
    startDate.setHours(hours, minutes, 0, 0);
    const endDate = new Date(startDate.getTime() + duration * 60000);
    const endTime = `${endDate.getHours().toString().padStart(2, "0")}:${endDate.getMinutes().toString().padStart(2, "0")}`;

    try {
      const response = await fetch(`${API_BASE}/slots`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          alumni_id: user.id,
          title,
          date,
          start_time: startTime,
          end_time: endTime,
          max_seats: maxSeats,
          meeting_url: meetingUrl
        })
      });

      if (response.ok) {
        fetchSlots();
        (e.target as HTMLFormElement).reset();
      } else {
        console.error('Failed to create slot:', response.statusText);
      }
    } catch (error) {
      console.error('Error creating slot:', error);
    }
  };

  const handleDeleteSlot = async (slotId: number) => {
    try {
      const response = await fetch(`${API_BASE}/slots/${slotId}`, {
        method: "DELETE"
      });
      if (response.ok) {
        fetchSlots();
      }
    } catch (error) {
      console.error('Error deleting slot:', error);
    }
  };

  const filteredSlots = activeTab === "Upcoming" 
    ? slots.filter(slot => new Date(slot.date) >= new Date())
    : activeTab === "Past"
    ? slots.filter(slot => new Date(slot.date) < new Date())
    : slots;

  if (loading) {
    return (
      <div className="bg-[#f9f9ff] min-h-screen font-sans text-[#141b2b] antialiased flex items-center justify-center">
        <div className="text-gray-500 text-lg">Loading slots...</div>
      </div>
    );
  }

  return (
    <div className="bg-[#f9f9ff] min-h-screen font-sans text-[#141b2b] antialiased">
      <AlumniNavbar activePage="slots" />

      <main className="pt-24 pb-20 px-12 max-w-[1600px] mx-auto">
        {/* Page Header */}
        <div className="mb-12">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#0b61a1] mb-2 block">Management Portal</span>
          <h1 className="text-[3.5rem] font-black tracking-tight text-[#022448] mb-4">Slot Manager</h1>
          <p className="text-gray-500 max-w-2xl text-lg font-medium">
            Define your availability and coordinate sessions with alumni and students. Your architecture for mentorship starts here.
          </p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-12 gap-12">
          {/* Left Panel: Your Mentorship Slots */}
          <div className="lg:col-span-7 space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <h2 className="text-2xl font-black text-[#022448]">Your Mentorship Slots</h2>
              {/* Tabs */}
              <div className="flex p-1 bg-[#f1f3ff] rounded-2xl border border-gray-100 shadow-inner">
                {["Upcoming", "Past", "All"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                      activeTab === tab 
                      ? "bg-white text-[#022448] shadow-md" 
                      : "text-gray-400 hover:text-[#022448]"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              {filteredSlots.map((slot, i) => (
                <div key={slot.id} className="bg-white rounded-[2.5rem] p-8 border border-gray-100 hover:shadow-2xl hover:border-[#022448]/5 transition-all group relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#022448]/5 rounded-bl-full -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  
                  <div className="flex flex-col md:flex-row gap-8 relative z-10">
                    <div className="flex-grow">
                      <div className="flex items-center gap-4 mb-4">
                        <span className={`${(slot.booked_seats >= slot.max_seats) ? "bg-[#d5e3ff] text-[#022448]" : "bg-[#f1f3ff] text-gray-500"} px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.1em] border border-black/5`}>
                          {(slot.booked_seats >= slot.max_seats) ? "Booked" : "Available"}
                        </span>
                        <span className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Ref: AC-{slot.id}</span>
                      </div>
                      <h3 className="text-2xl font-black text-[#022448] mb-4">{slot.title || "Mentorship Session"}</h3>
                      <div className="flex flex-wrap gap-x-8 gap-y-4">
                        <div className="flex items-center gap-2 text-gray-500 font-bold text-sm">
                          <Calendar className="w-4 h-4 text-[#0b61a1]" />
                          {new Date(slot.date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                        </div>
                        <div className="flex items-center gap-2 text-gray-500 font-bold text-sm">
                          <Clock className="w-4 h-4 text-[#0b61a1]" />
                          {slot.start_time} - {slot.end_time}
                        </div>
                        <div className="flex items-center gap-2 text-gray-500 font-bold text-sm">
                          <Video className="w-4 h-4 text-[#0b61a1]" />
                          Video Call
                        </div>
                        <div className="flex items-center gap-2 text-gray-500 font-bold text-sm">
                          <Users className="w-4 h-4 text-[#0b61a1]" />
                          Seats: {slot.booked_seats}/{slot.max_seats || 1}
                        </div>
                        {slot.meeting_url && (
                          <a 
                            href={slot.meeting_url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="flex items-center gap-2 text-[#0b61a1] font-bold text-sm hover:underline"
                          >
                            <LinkIcon className="w-4 h-4" />
                            Join Meeting
                          </a>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-row md:flex-col justify-end gap-3 shrink-0">
                      <button 
                        onClick={() => openEditModal(slot)}
                        className="p-3 text-gray-400 hover:text-[#022448] hover:bg-[#f1f3ff] rounded-2xl transition-all"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => handleDeleteSlot(slot.id)}
                        className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Panel: Create New Slot Form */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-[3rem] p-10 sticky top-24 shadow-sm border border-gray-100">
              <div className="mb-10 text-center">
                <h2 className="text-2xl font-black text-[#022448] mb-2">Create New Slot</h2>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-tight">Set your availability parameters</p>
              </div>
              <form className="space-y-8" onSubmit={handleCreateSlot}>
                {/* Session Title */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Session Title</label>
                  <input 
                    className="w-full bg-[#f1f3ff] border-none rounded-2xl px-6 py-4 text-sm font-bold text-[#022448] focus:ring-4 focus:ring-[#022448]/5 transition-all" 
                    type="text" 
                    name="title"
                    placeholder="e.g., Resume Building Workshop"
                  />
                </div>

                {/* Date & Time Grid */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Date</label>
                    <input 
                      className="w-full bg-[#f1f3ff] border-none rounded-2xl px-6 py-4 text-sm font-bold text-[#022448] focus:ring-4 focus:ring-[#022448]/5 transition-all" 
                      type="date" 
                      name="date"
                      required
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Start Time</label>
                    <input 
                      className="w-full bg-[#f1f3ff] border-none rounded-2xl px-6 py-4 text-sm font-bold text-[#022448] focus:ring-4 focus:ring-[#022448]/5 transition-all" 
                      type="time" 
                      name="startTime"
                      required
                    />
                  </div>
                </div>

                {/* Duration & Max Seats Grid */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Duration (Mins)</label>
                    <select 
                      className="w-full appearance-none bg-[#f1f3ff] border-none rounded-2xl px-6 py-4 text-sm font-bold text-[#022448] focus:ring-4 focus:ring-[#022448]/5 transition-all cursor-pointer" 
                      name="duration"
                    >
                      <option value="15">15</option>
                      <option value="30" selected>30</option>
                      <option value="45">45</option>
                      <option value="60">60</option>
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Max Seats</label>
                    <input 
                      className="w-full bg-[#f1f3ff] border-none rounded-2xl px-6 py-4 text-sm font-bold text-[#022448] focus:ring-4 focus:ring-[#022448]/5 transition-all" 
                      type="number" 
                      name="maxSeats"
                      min="1"
                      defaultValue="1"
                      required
                    />
                  </div>
                </div>

                {/* Meeting URL */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Meeting URL</label>
                  <input 
                    className="w-full bg-[#f1f3ff] border-none rounded-2xl px-6 py-4 text-sm font-bold text-[#022448] focus:ring-4 focus:ring-[#022448]/5 transition-all" 
                    type="url" 
                    name="meetingUrl"
                    placeholder="https://zoom.us/..."
                  />
                </div>

                {/* Meeting Type (Only Video) */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Meeting Type</label>
                  <div className="p-6 rounded-[2rem] border-2 border-[#022448] bg-[#f1f3ff] flex flex-col items-center gap-2 relative shadow-lg shadow-[#022448]/5">
                    <Video className="text-[#022448] w-8 h-8" />
                    <span className="text-xs font-black uppercase tracking-widest text-[#022448]">Video Call Only</span>
                    <div className="absolute top-4 right-4 w-3 h-3 rounded-full bg-[#022448]"></div>
                  </div>
                </div>

                {/* Submit Button */}
                <button className="w-full bg-[#022448] text-white py-5 rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-2xl shadow-[#022448]/30 hover:opacity-90 active:scale-[0.98] transition-all mt-6" type="submit">
                  Create Availability Slot
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Edit Modal */}
        {isEditModalOpen && selectedSlot && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 md:p-12">
            <div className="absolute inset-0 bg-[#022448]/40 backdrop-blur-md" onClick={closeEditModal}></div>
            
            <div className="relative w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl p-12 overflow-hidden animate-in zoom-in-95 fade-in duration-300">
              {/* Header */}
              <div className="flex justify-between items-start mb-10">
                <div>
                  <div className="flex items-center gap-3 text-[#0b61a1] mb-2">
                    <Edit2 className="w-5 h-5" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em]">Reschedule Slot</span>
                  </div>
                  <h2 className="text-4xl font-black text-[#022448] tracking-tight">Edit Mentorship Slot</h2>
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-2">Ref: AC-{selectedSlot.id}</p>
                </div>
                <button 
                  onClick={closeEditModal}
                  className="p-3 hover:bg-[#f1f3ff] rounded-2xl transition-all text-gray-400 hover:text-[#022448]"
                >
                  <Plus className="w-6 h-6 rotate-45" />
                </button>
              </div>

              {/* Form */}
              <form className="space-y-8" onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                const title = formData.get("title") as string;
                const date = formData.get("date") as string;
                const startTime = formData.get("startTime") as string;
                const duration = parseInt(formData.get("duration") as string);
                const maxSeats = parseInt(formData.get("maxSeats") as string);
                const meetingUrl = formData.get("meetingUrl") as string;
                
                console.log('Updating slot with:', { title, date, startTime, duration, maxSeats, meetingUrl });
                
                // Calculate end time from start time and duration using selected date
                const [hours, minutes] = startTime.split(":").map(Number);
                const startDate = new Date(date);
                startDate.setHours(hours, minutes, 0, 0);
                const endDate = new Date(startDate.getTime() + duration * 60000);
                const endTime = `${endDate.getHours().toString().padStart(2, "0")}:${endDate.getMinutes().toString().padStart(2, "0")}`;

                try {
                  const response = await fetch(`${API_BASE}/slots/${selectedSlot.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ title, date, start_time: startTime, end_time: endTime, max_seats: maxSeats, meeting_url: meetingUrl })
                  });
                  if (response.ok) {
                    fetchSlots();
                    closeEditModal();
                  } else {
                    console.error('Failed to update slot:', response.statusText);
                  }
                } catch (error) {
                  console.error('Error updating slot:', error);
                }
              }}>
                {/* Session Title */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Session Title</label>
                  <input 
                    className="w-full bg-[#f1f3ff] border-none rounded-2xl px-6 py-4 text-sm font-bold text-[#022448] focus:ring-4 focus:ring-[#022448]/5 transition-all" 
                    type="text" 
                    name="title" 
                    defaultValue={selectedSlot.title || ""}
                    placeholder="e.g., Resume Building Workshop"
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">New Date</label>
                    <input 
                      className="w-full bg-[#f1f3ff] border-none rounded-2xl px-6 py-4 text-sm font-bold text-[#022448] focus:ring-4 focus:ring-[#022448]/5 transition-all" 
                      type="date" 
                      name="date" 
                      defaultValue={selectedSlot.date}
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">New Start Time</label>
                    <input 
                      className="w-full bg-[#f1f3ff] border-none rounded-2xl px-6 py-4 text-sm font-bold text-[#022448] focus:ring-4 focus:ring-[#022448]/5 transition-all" 
                      type="time" 
                      name="startTime" 
                      defaultValue={selectedSlot.start_time}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Duration (Mins)</label>
                    <select 
                      className="w-full appearance-none bg-[#f1f3ff] border-none rounded-2xl px-6 py-4 text-sm font-bold text-[#022448] focus:ring-4 focus:ring-[#022448]/5 transition-all cursor-pointer" 
                      name="duration"
                    >
                      <option value="15">15</option>
                      <option value="30" selected>30</option>
                      <option value="45">45</option>
                      <option value="60">60</option>
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Max Seats</label>
                    <input 
                      className="w-full bg-[#f1f3ff] border-none rounded-2xl px-6 py-4 text-sm font-bold text-[#022448] focus:ring-4 focus:ring-[#022448]/5 transition-all" 
                      type="number" 
                      name="maxSeats" 
                      min="1"
                      defaultValue={selectedSlot.max_seats || 1}
                    />
                  </div>
                </div>

                {/* Meeting URL */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Meeting URL</label>
                  <input 
                    className="w-full bg-[#f1f3ff] border-none rounded-2xl px-6 py-4 text-sm font-bold text-[#022448] focus:ring-4 focus:ring-[#022448]/5 transition-all" 
                    type="url" 
                    name="meetingUrl" 
                    defaultValue={selectedSlot.meeting_url || ""}
                    placeholder="https://zoom.us/..."
                  />
                </div>

                {/* Reschedule Reason */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Reschedule Reason</label>
                  <textarea 
                    className="w-full bg-[#f1f3ff] border-none rounded-2xl px-6 py-4 text-sm font-medium text-gray-600 resize-none focus:ring-4 focus:ring-[#022448]/5 transition-all" 
                    name="rescheduleReason"
                    rows={3}
                    placeholder="Optional: Explain why you're rescheduling..."
                  />
                </div>

                <div className="pt-6 flex justify-end items-center gap-10">
                  <button 
                    type="button"
                    onClick={closeEditModal}
                    className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-[#022448] transition-colors"
                  >
                    Discard Changes
                  </button>
                  <button className="bg-[#022448] text-white px-12 py-5 rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-2xl shadow-[#022448]/30 hover:opacity-90 active:scale-[0.98] transition-all">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
