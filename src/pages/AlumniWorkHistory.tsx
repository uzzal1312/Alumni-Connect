import React, { useState } from 'react';
import { ArrowLeft, Building2, ChevronRight, Pencil, PlusCircle, ShieldCheck, Trash2 } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import AlumniSidebar from '../components/AlumniSidebar';
import { useAuth } from '../contexts/AuthContext';

export default function AlumniWorkHistory() {
  const navigate = useNavigate();
  const { registerAlumniStep3, alumniRegistrationData } = useAuth();
  const [workHistory, setWorkHistory] = useState<any[]>(alumniRegistrationData.workHistory || []);
  const [newWork, setNewWork] = useState({
    jobTitle: '',
    company: '',
    startYear: '',
    endYear: '',
    isCurrent: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAddWork = () => {
    if (newWork.jobTitle && newWork.company) {
      setWorkHistory([...workHistory, { ...newWork, id: Date.now() }]);
      setNewWork({
        jobTitle: '',
        company: '',
        startYear: '',
        endYear: '',
        isCurrent: false,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      await registerAlumniStep3({ work_history: workHistory });
      alert('Registration submitted for verification!');
      navigate('/signin');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col md:flex-row">
      <AlumniSidebar currentStep={3} />

      <section className="flex-1 bg-surface p-6 md:p-16 lg:p-24 overflow-y-auto">
        <div className="max-w-2xl mx-auto">
          {/* Progress Header */}
          <div className="mb-12 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-black tracking-tight text-on-surface">Tell us where you've worked</h2>
              <p className="text-on-surface-variant mt-2">Showcase your professional journey to help us connect you with relevant opportunities.</p>
            </div>
            <div className="text-right hidden sm:block">
              <span className="text-sm font-bold text-primary uppercase tracking-widest block">Step 03 of 03</span>
              <div className="mt-2 h-1.5 w-24 bg-surface-container-high rounded-full overflow-hidden flex">
                <div className="h-full bg-primary w-full"></div>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">
              {error}
            </div>
          )}

          {/* Existing History */}
          <div className="space-y-4 mb-10">
            {workHistory.map((item) => (
              <div key={item.id} className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/30 flex items-center justify-between group hover:shadow-md transition-all">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-xl bg-surface-container-low flex items-center justify-center border border-outline-variant/20">
                    <Building2 className="w-6 h-6 text-outline" />
                  </div>
                  <div>
                    <h4 className="font-bold text-on-surface">{item.company}</h4>
                    <p className="text-primary text-sm font-medium">{item.jobTitle}</p>
                    <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mt-1">
                      {item.startYear} — {item.isCurrent ? 'Present' : item.endYear}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 text-outline hover:text-primary transition-colors"><Pencil className="w-5 h-5" /></button>
                  <button
                    className="p-2 text-outline hover:text-error transition-colors"
                    onClick={() => setWorkHistory(workHistory.filter(w => w.id !== item.id))}
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add Position Form */}
          <div className="bg-surface-container-lowest p-8 rounded-2xl border-2 border-dashed border-outline-variant/40 mb-10">
            <div className="flex items-center gap-2 mb-8">
              <PlusCircle className="w-6 h-6 text-primary" />
              <span className="text-sm font-bold uppercase tracking-widest text-on-surface">Add New Position</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Company Name</label>
                <input
                  className="w-full px-5 py-4 rounded-xl bg-surface-container-low border-none ghost-border focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-outline-variant outline-none"
                  placeholder="e.g. JPMorgan Chase"
                  type="text"
                  value={newWork.company}
                  onChange={(e) => setNewWork({ ...newWork, company: e.target.value })}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Role Title</label>
                <input
                  className="w-full px-5 py-4 rounded-xl bg-surface-container-low border-none ghost-border focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-outline-variant outline-none"
                  placeholder="e.g. Product Manager"
                  type="text"
                  value={newWork.jobTitle}
                  onChange={(e) => setNewWork({ ...newWork, jobTitle: e.target.value })}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Start Year</label>
                <select
                  className="w-full px-5 py-4 rounded-xl bg-surface-container-low border-none ghost-border focus:ring-2 focus:ring-primary/20 transition-all text-on-surface outline-none"
                  value={newWork.startYear}
                  onChange={(e) => setNewWork({ ...newWork, startYear: e.target.value })}
                >
                  <option value="">Select Year</option>
                  {Array.from({ length: 30 }, (_, i) => 2024 - i).map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">End Year</label>
                <div className="flex items-center gap-4">
                  <select
                    className="flex-1 px-5 py-4 rounded-xl bg-surface-container-low border-none ghost-border focus:ring-2 focus:ring-primary/20 transition-all text-on-surface outline-none"
                    disabled={newWork.isCurrent}
                    value={newWork.endYear}
                    onChange={(e) => setNewWork({ ...newWork, endYear: e.target.value })}
                  >
                    <option value="">Select Year</option>
                    {Array.from({ length: 30 }, (_, i) => 2024 - i).map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                    <option value="present">Present</option>
                  </select>
                  <div className="flex items-center gap-2 shrink-0">
                    <input
                      className="rounded text-primary border-outline-variant focus:ring-primary/20 h-5 w-5"
                      id="current"
                      type="checkbox"
                      checked={newWork.isCurrent}
                      onChange={(e) => setNewWork({ ...newWork, isCurrent: e.target.checked })}
                    />
                    <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider cursor-pointer" htmlFor="current">Current</label>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end items-center gap-6">
              <button className="text-sm font-bold uppercase tracking-widest text-on-surface-variant hover:text-on-surface transition-colors" type="button">
                Cancel
              </button>
              <button
                className="px-8 py-3 rounded-xl signature-gradient text-white font-bold shadow hover:shadow-lg transition-all"
                type="button"
                onClick={handleAddWork}
              >
                Save Position
              </button>
            </div>
          </div>

          {/* Verification Note */}
          <div className="py-10 border-t border-outline-variant/20">
            <div className="flex justify-center mb-4">
              <ShieldCheck className="w-10 h-10 text-outline-variant" />
            </div>
            <p className="text-center text-[11px] text-on-surface-variant/70 max-w-sm mx-auto leading-relaxed">
              Our verification engine will cross-reference your history with LinkedIn and institutional databases to ensure profile authenticity.
            </p>
          </div>

          {/* Navigation Actions */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-6">
            <Link
              to="/register/alumni/step-2"
              className="w-full sm:w-auto px-8 py-4 rounded-xl text-on-surface-variant font-bold hover:bg-surface-container-high transition-all flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Previous Step
            </Link>
            <button
              disabled={loading}
              onClick={handleSubmit}
              className="w-full sm:w-auto px-12 py-4 rounded-xl signature-gradient text-white font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Submitting...' : 'Submit for Verification'}
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <p className="mt-12 text-center text-xs text-on-surface-variant opacity-60 max-w-sm mx-auto leading-relaxed">
            By continuing, you agree to our professional data processing policy.
          </p>
        </div>
      </section>
    </main>
  );
}
