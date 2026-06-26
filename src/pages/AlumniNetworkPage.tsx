import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { 
  Search, 
  Bell, 
  MessageSquare, 
  Star, 
  CheckCircle, 
  ArrowRight, 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight,
  Circle,
  Calendar,
  ExternalLink,
  Clock,
  ShieldCheck,
  Globe,
  Info,
  Users
} from "lucide-react";
import StudentNavbar from "../components/StudentNavbar";
import Footer from "../components/Footer";
import { useAuth } from "../contexts/AuthContext";
import { getDefaultAvatar } from "../utils/avatars";

export default function AlumniNetworkPage() {
  const [alumni, setAlumni] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [isMentorOnly, setIsMentorOnly] = useState(false);
  const [graduationYearRange, setGraduationYearRange] = useState({ min: 2000, max: new Date().getFullYear() });
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState("DESC");
  const { API_BASE } = useAuth();

  const fetchAlumni = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append("role", "alumni");
      params.append("page", currentPage.toString());
      params.append("limit", "9");
      params.append("sort_by", sortBy);
      params.append("sort_order", sortOrder);

      if (isMentorOnly) {
        params.append("is_mentor", "true");
      }

      if (selectedIndustries.length > 0) {
        selectedIndustries.forEach(industry => params.append("industry", industry));
      }

      params.append("graduation_year_start", graduationYearRange.min.toString());
      params.append("graduation_year_end", graduationYearRange.max.toString());

      const response = await fetch(`${API_BASE}/users?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        console.log('Alumni data from API:', data);
        setAlumni(data.users || []);
        setTotal(data.total || 0);
        setTotalPages(data.totalPages || 0);
      }
    } catch (error) {
      console.error('Error fetching alumni:', error);
    } finally {
      setLoading(false);
    }
  }, [API_BASE, currentPage, selectedIndustries, isMentorOnly, graduationYearRange, sortBy, sortOrder]);

  useEffect(() => {
    fetchAlumni();
  }, [fetchAlumni]);

  const handleIndustryChange = (industry: string) => {
    setSelectedIndustries(prev => 
      prev.includes(industry) 
        ? prev.filter(i => i !== industry) 
        : [...prev, industry]
    );
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="bg-surface text-on-surface min-h-screen font-body antialiased">
      <StudentNavbar activePage="network" />
      
      <div className="flex min-h-[calc(100vh-76px)] w-full">
        {/* Sidebar Filter System */}
        <aside className="w-80 flex-shrink-0 bg-surface-container-low p-8 hidden xl:flex flex-col gap-10 border-r border-slate-100">
          <div>
            <h3 className="text-[0.75rem] font-bold uppercase tracking-widest text-slate-500 mb-6">Directory Filters</h3>
            
            {/* Availability Toggle */}
            <div className="flex items-center justify-between bg-surface-container-lowest p-4 rounded-xl shadow-sm mb-8">
              <span className="text-sm font-semibold">Available to Mentor</span>
              <button 
                onClick={() => {
                  setIsMentorOnly(!isMentorOnly);
                  setCurrentPage(1);
                }}
                className={`w-12 h-6 rounded-full relative transition-colors ${isMentorOnly ? 'bg-primary' : 'bg-slate-300'}`}
              >
                <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isMentorOnly ? 'right-1' : 'left-1'}`}></span>
              </button>
            </div>

            <div className="space-y-10">
              {/* Industry Section */}
              <section>
                <h4 className="text-xs font-bold uppercase tracking-widest text-primary mb-4">Industry</h4>
                <div className="space-y-3">
                  {["Technology", "Finance & Fintech", "Healthcare", "Architecture", "Education", "Other"].map((industry) => (
                    <label key={industry} className="flex items-center gap-3 cursor-pointer group">
                      <input 
                        className="rounded-lg text-primary focus:ring-primary/20 h-5 w-5 border-outline-variant/30" 
                        type="checkbox" 
                        checked={selectedIndustries.includes(industry)}
                        onChange={() => handleIndustryChange(industry)}
                      />
                      <span className="text-sm text-on-surface-variant group-hover:text-primary transition-colors">{industry}</span>
                    </label>
                  ))}
                </div>
              </section>

              {/* Grad Year Range */}
              <section>
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-primary">Graduation Year</h4>
                  <span className="text-[0.65rem] font-bold text-primary px-2 py-1 bg-primary-fixed rounded">{graduationYearRange.min} - {graduationYearRange.max}</span>
                </div>
                <div className="space-y-2">
                  <input 
                    className="w-full accent-primary h-1 bg-outline-variant/30 rounded-full appearance-none cursor-pointer" 
                    min="2000" 
                    max={new Date().getFullYear()} 
                    value={graduationYearRange.min}
                    onChange={(e) => {
                      setGraduationYearRange(prev => ({ ...prev, min: Number(e.target.value) }));
                      setCurrentPage(1);
                    }}
                    type="range" 
                  />
                  <input 
                    className="w-full accent-primary h-1 bg-outline-variant/30 rounded-full appearance-none cursor-pointer" 
                    min="2000" 
                    max={new Date().getFullYear()} 
                    value={graduationYearRange.max}
                    onChange={(e) => {
                      setGraduationYearRange(prev => ({ ...prev, max: Number(e.target.value) }));
                      setCurrentPage(1);
                    }}
                    type="range" 
                  />
                </div>
              </section>
            </div>
          </div>

          <div className="mt-auto">
            <button 
              onClick={() => {
                setSelectedIndustries([]);
                setIsMentorOnly(false);
                setGraduationYearRange({ min: 2000, max: new Date().getFullYear() });
                setCurrentPage(1);
              }}
              className="w-full bg-primary text-white py-4 rounded-xl font-bold text-sm tracking-tight shadow-lg shadow-primary/20 active:scale-95 transition-all"
            >
              Reset Filters
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-8 lg:p-12">
          {/* Grid Header */}
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <h1 className="text-4xl font-headline font-extrabold tracking-tight text-on-surface mb-2">Alumni Network</h1>
              <p className="text-slate-500">Showing {total} alumni across all departments</p>
            </div>
            <div className="flex items-center gap-6">
              <Link 
                to="/dashboard/my-network" 
                className="flex items-center gap-3 px-6 py-2.5 bg-[#f1f3ff] text-[#022448] rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#022448] hover:text-white transition-all shadow-sm group"
              >
                <Users className="w-4 h-4 group-hover:scale-110 transition-transform" />
                View My Network
              </Link>
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Sort by:</span>
                <div className="relative">
                  <select 
                    className="bg-surface-container-low border-none rounded-xl text-sm font-bold py-2.5 pl-4 pr-10 focus:ring-0 appearance-none cursor-pointer"
                    value={`${sortBy}-${sortOrder}`}
                    onChange={(e) => {
                      const [newSortBy, newSortOrder] = e.target.value.split('-');
                      setSortBy(newSortBy);
                      setSortOrder(newSortOrder);
                      setCurrentPage(1);
                    }}
                  >
                    <option value="created_at-DESC">Most Recent</option>
                    <option value="created_at-ASC">Oldest</option>
                    <option value="rating-DESC">Highest Rated</option>
                    <option value="rating-ASC">Lowest Rated</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-2.5 text-slate-400 pointer-events-none w-4 h-4" />
                </div>
              </div>
            </div>
          </header>

          {/* Alumni Grid */}
          {loading ? (
            <div className="text-center py-12">Loading alumni...</div>
          ) : alumni.length === 0 ? (
            <div className="text-center py-12 text-slate-500">No alumni available at the moment</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-8">
              {alumni.map((person) => (
                <article key={person.user_id} className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-slate-100 hover:bg-surface-container-high transition-colors group cursor-pointer relative">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="relative">
                      <img alt={person.full_name} className="w-16 h-16 rounded-xl object-cover" src={person.profile_picture || getDefaultAvatar(person.full_name)} />
                      {person.mentoring_mode === 'on' && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full" title="Active Now"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="font-bold text-lg text-on-surface">{person.full_name}</h3>
                        <div className="flex items-center gap-1 bg-surface-container-low px-2 py-1 rounded-lg">
                          <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                          <span className="text-xs font-bold">{(person.average_rating ? parseFloat(person.average_rating).toFixed(1) : '5.0')}</span>
                        </div>
                      </div>
                      <p className="text-sm text-slate-500 font-medium">{person.current_job_title ? `${person.current_job_title} ${person.current_company ? `@ ${person.current_company}` : ''}` : 'Alumni'}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-8">
                    <span className="px-3 py-1 bg-surface-container-low text-secondary text-[0.65rem] font-bold uppercase tracking-wider rounded-lg">{person.industry || 'General'}</span>
                    {person.graduation_year && <span className="px-3 py-1 bg-surface-container-low text-slate-500 text-[0.65rem] font-bold uppercase tracking-wider rounded-lg">Class of {person.graduation_year}</span>}
                  </div>

                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100/50">
                    <div className="flex items-center gap-2">
                      {person.mentoring_mode === 'on' ? (
                        <>
                          <CheckCircle className="text-green-600 w-4 h-4 fill-green-600/10" />
                          <span className="text-xs font-bold text-green-700 uppercase tracking-tighter">Open to Mentor</span>
                        </>
                      ) : (
                        <>
                          <Circle className="text-slate-400 w-4 h-4" />
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Unavailable</span>
                        </>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      {person.mentoring_mode === 'on' && (
                        <Link 
                          to={`/dashboard/book-session/${person.user_id}`}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/5 text-primary text-[11px] font-bold uppercase tracking-tight hover:bg-primary hover:text-white transition-all"
                        >
                          <Calendar className="w-3 h-3" />
                          Book Session
                        </Link>
                      )}
                      <Link 
                        to={`/dashboard/alumni-profile/${person.user_id}`}
                        className="text-primary font-bold text-xs flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                      >
                        View Profile <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 0 && (
            <footer className="mt-16 flex items-center justify-center gap-4">
              <button 
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 bg-surface-container-low rounded-xl text-slate-400 hover:bg-primary-fixed hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="flex gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(page => 
                    page === 1 || 
                    page === totalPages || 
                    (page >= currentPage - 2 && page <= currentPage + 2)
                  )
                  .map((page, index, array) => {
                    if (index > 0 && array[index - 1] !== page - 1) {
                      return (
                        <span key={`ellipsis-${page}`} className="w-10 h-10 flex items-center justify-center text-slate-400">
                          ...
                        </span>
                      );
                    }
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`w-10 h-10 rounded-xl font-bold text-sm transition-colors ${
                          currentPage === page 
                            ? 'bg-primary text-white' 
                            : 'bg-surface-container-low text-on-surface hover:bg-slate-200'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
              </div>
              <button 
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 bg-surface-container-low rounded-xl text-slate-400 hover:bg-primary-fixed hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </footer>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
}
