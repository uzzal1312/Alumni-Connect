import React, { useState, useEffect } from "react";
import { 
  Calendar, 
  Clock, 
  Video, 
  MessageSquare, 
  MoreVertical, 
  Star,
  CheckCircle2,
  Clock3,
  CheckCircle,
  VideoIcon,
  Plus,
  X,
  FileText
} from "lucide-react";
import StudentNavbar from "../components/StudentNavbar";
import Footer from "../components/Footer";
import { useAuth } from "../contexts/AuthContext";
import { getDefaultAvatar } from "../utils/avatars";

interface BookingWithReview {
  id: number;
  status: string;
  date: string;
  start_time: string;
  end_time: string;
  meeting_url?: string;
  alumni_name: string;
  alumni_picture?: string;
  alumni_role: string;
  alumni_id: number;
  slot_title?: string;
  review?: any;
}

export default function MyBookingsPage() {
  const { user, API_BASE } = useAuth();
  const [activeTab, setActiveTab] = useState<"upcoming" | "pending" | "past">("upcoming");
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [bookings, setBookings] = useState<BookingWithReview[]>([]);
  const [loading, setLoading] = useState(true);

  // Helper to get review for booking
  const fetchReviewForBooking = async (bookingId: number) => {
    try {
      const response = await fetch(`${API_BASE}/reviews/booking/${bookingId}`);
      const data = await response.json();
      return data.review;
    } catch (error) {
      console.error("Failed to fetch review:", error);
      return null;
    }
  };

  // Fetch bookings
  const fetchBookings = async () => {
    if (!user) return;
    try {
      const response = await fetch(`${API_BASE}/bookings/student/${user.id}`);
      const data = await response.json();
      if (response.ok) {
        // Fetch reviews for each booking
        const bookingsWithReviews = await Promise.all(
          data.bookings.map(async (booking: any) => {
            const review = await fetchReviewForBooking(booking.id);
            return { ...booking, review };
          })
        );
        setBookings(bookingsWithReviews);
      }
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [API_BASE, user]);

  // Filter bookings based on tab
  const filteredBookings = bookings.filter(booking => {
    if (activeTab === "upcoming") {
      return booking.status === "Upcoming";
    } else if (activeTab === "pending") {
      return booking.status === "Pending";
    } else {
      return booking.status === "Completed";
    }
  });

  const handleSubmitFeedback = async () => {
    if (!selectedBooking || !user) return;
    try {
      const response = await fetch(`${API_BASE}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          booking_id: selectedBooking.id,
          alumni_id: selectedBooking.alumni_id,
          student_id: user.id,
          rating: rating,
          comment: feedback
        })
      });
      if (response.ok) {
        setShowFeedbackModal(false);
        setShowSuccessToast(true);
        setTimeout(() => setShowSuccessToast(false), 3000);
        setRating(0);
        setFeedback("");
        fetchBookings();
      }
    } catch (error) {
      console.error("Failed to submit feedback:", error);
    }
  };
  
  // Helper to get media URL
  const getMediaUrl = (path: string | null | undefined) => {
    if (!path) return null;
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    const base = API_BASE.replace('/api', '');
    return `${base}${path}`;
  };

  return (
    <div className="bg-[#f9f9ff] min-h-screen font-sans text-[#141b2b] antialiased">
      <StudentNavbar activePage="bookings" />

      {/* Success Toast */}
      {showSuccessToast && (
        <div className="fixed top-20 right-6 z-[110] animate-in slide-in-from-right-full duration-500">
          <div className="bg-[#022448] text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <span className="font-bold text-sm">Feedback submitted successfully!</span>
          </div>
        </div>
      )}

      <main className="max-w-6xl mx-auto px-6 py-12">
        <header className="mb-12 text-center md:text-left">
          <span className="text-[0.75rem] font-bold uppercase tracking-[0.05em] text-[#0b61a1] mb-2 block">Management</span>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[#022448] leading-tight">Mentorship Bookings</h1>
        </header>

        {/* Tabs */}
        <div className="flex justify-center md:justify-start gap-10 mb-12 border-b border-gray-100">
          <button 
            onClick={() => setActiveTab("upcoming")}
            className={`group relative pb-4 transition-all ${activeTab === "upcoming" ? "text-[#022448]" : "text-gray-400 hover:text-[#022448]"}`}
          >
            <span className="text-lg font-bold">Upcoming</span>
            {activeTab === "upcoming" && <div className="absolute bottom-0 left-0 w-full h-1 bg-[#022448] rounded-full animate-in fade-in zoom-in duration-300"></div>}
          </button>
          <button 
            onClick={() => setActiveTab("pending")}
            className={`group relative pb-4 transition-all ${activeTab === "pending" ? "text-[#022448]" : "text-gray-400 hover:text-[#022448]"}`}
          >
            <span className="text-lg font-bold">Pending</span>
            {activeTab === "pending" && <div className="absolute bottom-0 left-0 w-full h-1 bg-[#022448] rounded-full animate-in fade-in zoom-in duration-300"></div>}
          </button>
          <button 
            onClick={() => setActiveTab("past")}
            className={`group relative pb-4 transition-all ${activeTab === "past" ? "text-[#022448]" : "text-gray-400 hover:text-[#022448]"}`}
          >
            <span className="text-lg font-bold">Past</span>
            {activeTab === "past" && <div className="absolute bottom-0 left-0 w-full h-1 bg-[#022448] rounded-full animate-in fade-in zoom-in duration-300"></div>}
          </button>
        </div>

        {/* Content Section */}
        <div className="space-y-8 min-h-[400px]">
          {loading && (
            <div className="flex justify-center items-center py-20">
              <div className="text-gray-500 text-lg">Loading bookings...</div>
            </div>
          )}

          {!loading && activeTab === "upcoming" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              {filteredBookings.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-8">
                    <Calendar className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-bold text-[#022448] mb-2">No upcoming bookings</h3>
                  <p className="text-gray-500">Book a mentorship session to get started!</p>
                </div>
              ) : (
                filteredBookings.map((booking) => (
                  <div key={booking.id} className="bg-white rounded-[2.5rem] p-8 shadow-[0px_20px_40px_rgba(20,27,43,0.05)] border border-gray-50 flex flex-col md:flex-row gap-10">
                    <div className="w-full md:w-48 h-48 rounded-3xl overflow-hidden shadow-lg border border-gray-100 flex-shrink-0">
                      <img 
                        alt={booking.alumni_name} 
                        className="w-full h-full object-cover" 
                        src={getMediaUrl(booking.alumni_picture) || getDefaultAvatar(booking.alumni_name)} 
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="text-xl font-bold text-[#022448] mb-1">{booking.slot_title || "Mentorship Session"}</h4>
                            <h3 className="text-3xl font-bold text-[#022448] mb-1">{booking.alumni_name}</h3>
                            <p className="text-gray-500 text-sm font-medium">{booking.alumni_role}</p>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <span className="bg-[#eef2ff] text-[#0b61a1] px-4 py-1.5 rounded-full text-[0.7rem] font-bold uppercase tracking-wider flex items-center gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              {booking.status}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-8 my-6 text-gray-500">
                          <div className="flex items-center gap-2.5">
                            <Calendar className="w-4.5 h-4.5 text-[#0b61a1]" />
                            <span className="text-sm font-semibold">{booking.date}</span>
                          </div>
                          <div className="flex items-center gap-2.5">
                            <Clock className="w-4.5 h-4.5 text-[#0b61a1]" />
                            <span className="text-sm font-semibold">{booking.start_time} - {booking.end_time}</span>
                          </div>
                          <div className="flex items-center gap-2.5">
                            <Video className="w-4.5 h-4.5 text-[#0b61a1]" />
                            <span className="text-sm font-semibold">Video Call</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-4 pt-4 border-t border-gray-50">
                        <button 
                          onClick={() => {
                            if (booking.meeting_url) {
                              window.open(booking.meeting_url, '_blank', 'noopener,noreferrer');
                            }
                          }}
                          className="bg-gradient-to-br from-[#022448] to-[#1e3a5f] text-white px-10 py-4 rounded-2xl font-bold text-sm shadow-xl hover:opacity-90 active:scale-95 transition-all flex items-center gap-2.5"
                        >
                          <VideoIcon className="w-4.5 h-4.5" />
                          Join Meeting
                        </button>
                        <button className="bg-[#f0f4ff] text-[#022448] px-8 py-4 rounded-2xl font-bold text-sm hover:bg-blue-100 transition-all flex items-center gap-2.5">
                          <MessageSquare className="w-4.5 h-4.5" />
                          Send Message
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {!loading && activeTab === "pending" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              {filteredBookings.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-8">
                    <Clock3 className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-bold text-[#022448]">No pending requests</h3>
                  <p className="text-gray-500 mt-2">When you book a session, it will appear here.</p>
                </div>
              ) : (
                filteredBookings.map((booking) => (
                  <div key={booking.id} className="bg-white rounded-[2.5rem] p-8 shadow-[0px_20px_40px_rgba(20,27,43,0.05)] border border-gray-50 flex flex-col md:flex-row gap-10">
                    <div className="w-full md:w-48 h-48 rounded-3xl overflow-hidden shadow-lg border border-gray-100 flex-shrink-0">
                      <img 
                        alt={booking.alumni_name} 
                        className="w-full h-full object-cover" 
                        src={getMediaUrl(booking.alumni_picture) || getDefaultAvatar(booking.alumni_name)} 
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-3xl font-bold text-[#022448] mb-1">{booking.alumni_name}</h3>
                            <p className="text-gray-500 text-sm font-medium">{booking.alumni_role}</p>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <span className="bg-orange-50 text-orange-600 px-4 py-1.5 rounded-full text-[0.7rem] font-bold uppercase tracking-wider flex items-center gap-1.5">
                              <Clock3 className="w-3.5 h-3.5" />
                              {booking.status}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-8 my-6 text-gray-500">
                          <div className="flex items-center gap-2.5">
                            <Calendar className="w-4.5 h-4.5 text-[#0b61a1]" />
                            <span className="text-sm font-semibold">{booking.date}</span>
                          </div>
                          <div className="flex items-center gap-2.5">
                            <Clock className="w-4.5 h-4.5 text-[#0b61a1]" />
                            <span className="text-sm font-semibold">{booking.start_time} - {booking.end_time}</span>
                          </div>
                          <div className="flex items-center gap-2.5">
                            <Video className="w-4.5 h-4.5 text-[#0b61a1]" />
                            <span className="text-sm font-semibold">Video Call</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {!loading && activeTab === "past" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              {filteredBookings.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-8">
                    <CheckCircle className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-bold text-[#022448]">No past bookings</h3>
                  <p className="text-gray-500 mt-2">Your completed sessions will appear here.</p>
                </div>
              ) : (
                filteredBookings.map((booking) => (
                  <div key={booking.id} className="bg-white rounded-[2.5rem] p-8 shadow-[0px_20px_40px_rgba(20,27,43,0.05)] border border-gray-50 flex flex-col md:flex-row gap-10">
                    <div className="w-full md:w-48 h-48 rounded-3xl overflow-hidden shadow-lg border border-gray-100 flex-shrink-0">
                      <img 
                        alt={booking.alumni_name} 
                        className="w-full h-full object-cover" 
                        src={getMediaUrl(booking.alumni_picture) || getDefaultAvatar(booking.alumni_name)} 
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-3xl font-bold text-[#022448] mb-1">{booking.alumni_name}</h3>
                            <p className="text-gray-500 text-sm font-medium">{booking.alumni_role}</p>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <span className="bg-gray-100 text-gray-500 px-4 py-1.5 rounded-full text-[0.7rem] font-bold uppercase tracking-wider flex items-center gap-1.5">
                              <CheckCircle className="w-3.5 h-3.5" />
                              {booking.status}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-8 my-6 text-gray-500">
                          <div className="flex items-center gap-2.5">
                            <Calendar className="w-4.5 h-4.5 text-[#0b61a1]" />
                            <span className="text-sm font-semibold">{booking.date}</span>
                          </div>
                          <div className="flex items-center gap-2.5">
                            <Clock className="w-4.5 h-4.5 text-[#0b61a1]" />
                            <span className="text-sm font-semibold">{booking.start_time} - {booking.end_time}</span>
                          </div>
                        </div>
                        {booking.review && (
                          <div className="mt-4 p-4 bg-gray-50 rounded-2xl">
                            <div className="flex items-center gap-2 mb-2">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star 
                                  key={star}
                                  className={`w-4 h-4 ${booking.review.rating >= star ? 'fill-[#c69b5f] text-[#c69b5f]' : 'text-gray-200'}`}
                                />
                              ))}
                            </div>
                            {booking.review.comment && (
                              <p className="text-gray-600 text-sm">{booking.review.comment}</p>
                            )}
                          </div>
                        )}
                      </div>
                      {!booking.review && (
                        <div className="pt-4 border-t border-gray-50">
                          <button 
                            onClick={() => {
                              setSelectedBooking(booking);
                              setShowFeedbackModal(true);
                            }}
                            className="bg-gradient-to-br from-[#022448] to-[#1e3a5f] text-white px-10 py-4 rounded-2xl font-bold text-sm shadow-xl hover:opacity-90 active:scale-95 transition-all flex items-center gap-2.5"
                          >
                            <Star className="w-4.5 h-4.5 fill-current" />
                            Rate this Session
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </main>

      {/* Feedback Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-[#022448]/20 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[2rem] w-full max-w-lg shadow-2xl p-10 relative animate-in zoom-in-95 duration-300">
            <button 
              onClick={() => setShowFeedbackModal(false)}
              className="absolute top-8 right-8 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <Plus className="w-6 h-6 rotate-45" />
            </button>

            <div className="text-center mb-8">
              <span className="text-[10px] font-bold text-[#0b61a1] uppercase tracking-[0.2em] block mb-3">Post-Session Feedback</span>
              <h2 className="text-3xl font-bold text-[#022448] mb-4">How was your session?</h2>
              <p className="text-gray-500 text-sm leading-relaxed px-4">
                Your feedback helps us match you with the best mentors and improves our community.
              </p>
            </div>

            <div className="bg-[#f8faff] rounded-2xl p-6 flex items-center gap-4 mb-10 border border-[#eef2ff]">
              <div className="w-14 h-14 rounded-xl overflow-hidden shadow-sm flex-shrink-0">
                <img 
                  alt={selectedBooking?.alumni_name || "Alumni"} 
                  className="w-full h-full object-cover" 
                  src={getMediaUrl(selectedBooking?.alumni_picture) || (selectedBooking?.alumni_name ? getDefaultAvatar(selectedBooking.alumni_name) : getDefaultAvatar("Alumni"))} 
                />
              </div>
              <div>
                <h4 className="text-base font-bold text-[#022448]">{selectedBooking?.alumni_name || "Alumni Name"}</h4>
                <p className="text-[11px] text-gray-500 font-medium">{selectedBooking?.alumni_role || "Alumni"}</p>
              </div>
            </div>

            <div className="flex flex-col items-center mb-10">
              <div className="flex gap-2 mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button 
                    key={star}
                    onClick={() => setRating(star)}
                    className="transition-transform hover:scale-110 active:scale-95"
                  >
                    <Star 
                      className={`w-8 h-8 ${rating >= star ? 'fill-[#c69b5f] text-[#c69b5f]' : 'text-gray-200'}`} 
                    />
                  </button>
                ))}
              </div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tap to rate your experience</span>
            </div>

            <div className="mb-10">
              <label className="text-[10px] font-bold text-[#022448] uppercase tracking-widest block mb-3">What was valuable about this session?</label>
              <textarea 
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Share your thoughts on the insights shared, mentoring style, or next steps..."
                className="w-full border-gray-100 bg-gray-50 rounded-2xl p-5 text-sm text-gray-600 focus:ring-[#022448] focus:border-[#022448] min-h-[120px] resize-none transition-all placeholder:text-gray-300"
              ></textarea>
            </div>

            <div className="space-y-4">
              <button 
                onClick={handleSubmitFeedback}
                className="w-full bg-[#022448] text-white py-4 rounded-2xl font-bold text-sm shadow-xl hover:opacity-90 active:scale-95 transition-all"
              >
                Submit Feedback
              </button>
              <button 
                onClick={() => setShowFeedbackModal(false)}
                className="w-full text-gray-400 font-bold text-sm hover:text-gray-600 transition-colors"
              >
                Skip for now
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
