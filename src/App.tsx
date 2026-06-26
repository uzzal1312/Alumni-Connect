import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "motion/react";
import { AuthProvider } from "./contexts/AuthContext";

// Landing
import LandingPage from "./pages/LandingPage";

// Auth
import SignInPage from "./pages/SignInPage";

// Role Selection
import SelectionPage from "./pages/SelectionPage";

// Student Registration
import StudentRegistrationPage from "./pages/StudentRegistrationPage";

// Alumni Registration (3-step wizard)
import AlumniAccountDetails from "./pages/AlumniAccountDetails";
import AlumniProfessionalProfile from "./pages/AlumniProfessionalProfile";
import AlumniWorkHistory from "./pages/AlumniWorkHistory";

// Dashboards
import StudentDashboard from "./pages/StudentDashboard";
import AlumniNetworkPage from "./pages/AlumniNetworkPage";
import AlumniProfilePage from "./pages/AlumniProfilePage";
import BookSessionPage from "./pages/BookSessionPage";
import StudentProfilePage from "./pages/StudentProfilePage";
import EditStudentProfilePage from "./pages/EditStudentProfilePage";
import MyBookingsPage from "./pages/MyBookingsPage";
import MessagesPage from "./pages/MessagesPage";
import JobsPage from "./pages/JobsPage";
import MyReferralsPage from "./pages/MyReferralsPage";
import AlumniDashboard from "./pages/AlumniDashboard";
import AlumniOwnProfilePage from "./pages/AlumniOwnProfilePage";
import AlumniEditProfilePage from "./pages/AlumniEditProfilePage";
import AlumniEditProfessionalPage from "./pages/AlumniEditProfessionalPage";
import AlumniEditResourcesPage from "./pages/AlumniEditResourcesPage";
import AlumniSlotManagerPage from "./pages/AlumniSlotManagerPage";
import AlumniBookingsPage from "./pages/AlumniBookingsPage";
import AlumniReferralInboxPage from "./pages/AlumniReferralInboxPage";
import AlumniMyNetworkPage from "./pages/AlumniMyNetworkPage";
import AlumniJobPostsPage from "./pages/AlumniJobPostsPage";
import AlumniManageApplicationsPage from "./pages/AlumniManageApplicationsPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import MyNetworkPage from "./pages/MyNetworkPage";
import AdminUserManagementPage from "./pages/AdminUserManagementPage";
import AdminVerificationQueuePage from "./pages/AdminVerificationQueuePage";
import AdminAlumniManagementPage from "./pages/AdminAlumniManagementPage";

function App() {
  return (
    <AuthProvider>
      <Router>
        <AnimatePresence mode="wait">
          <Routes>
            {/* Landing */}
            <Route path="/" element={<LandingPage />} />

            {/* Auth */}
            <Route path="/signin" element={<SignInPage />} />

            {/* Role Selection */}
            <Route path="/selection" element={<SelectionPage />} />

            {/* Student Registration */}
            <Route path="/register/student" element={<StudentRegistrationPage />} />

            {/* Alumni Registration (multi-step) */}
            <Route path="/register/alumni" element={<AlumniAccountDetails />} />
            <Route path="/register/alumni/step-2" element={<AlumniProfessionalProfile />} />
            <Route path="/register/alumni/step-3" element={<AlumniWorkHistory />} />

            {/* Dashboards */}
            <Route path="/dashboard/student" element={<StudentDashboard />} />
            <Route path="/dashboard/alumni-network" element={<AlumniNetworkPage />} />
            <Route path="/dashboard/alumni-profile/:userId" element={<AlumniProfilePage />} />
            <Route path="/dashboard/book-session" element={<BookSessionPage />} />
            <Route path="/dashboard/book-session/:alumniId" element={<BookSessionPage />} />
            <Route path="/dashboard/student-profile" element={<StudentProfilePage />} />
            <Route path="/dashboard/edit-profile" element={<EditStudentProfilePage />} />
            <Route path="/dashboard/my-bookings" element={<MyBookingsPage />} />
            <Route path="/dashboard/my-network" element={<MyNetworkPage />} />
            <Route path="/dashboard/messages" element={<MessagesPage />} />
            <Route path="/dashboard/jobs" element={<JobsPage />} />
            <Route path="/dashboard/my-referrals" element={<MyReferralsPage />} />
            <Route path="/dashboard/alumni" element={<AlumniDashboard />} />
            <Route path="/dashboard/alumni/jobs" element={<AlumniJobPostsPage />} />
            <Route path="/dashboard/alumni/network" element={<AlumniMyNetworkPage />} />
            <Route path="/dashboard/alumni/profile" element={<AlumniOwnProfilePage />} />
            <Route path="/dashboard/alumni/profile/edit" element={<AlumniEditProfilePage />} />
            <Route path="/dashboard/alumni/profile/edit/professional" element={<AlumniEditProfessionalPage />} />
            <Route path="/dashboard/alumni/profile/edit/resources" element={<AlumniEditResourcesPage />} />
            <Route path="/dashboard/alumni/slots" element={<AlumniSlotManagerPage />} />
            <Route path="/dashboard/alumni/bookings" element={<AlumniBookingsPage />} />
            <Route path="/dashboard/alumni/referrals" element={<AlumniReferralInboxPage />} />
            <Route path="/dashboard/alumni/jobs/manage/:jobId" element={<AlumniManageApplicationsPage />} />
            <Route path="/dashboard/admin" element={<AdminDashboardPage />} />
            <Route path="/dashboard/admin/users" element={<AdminUserManagementPage />} />
            <Route path="/dashboard/admin/verifications" element={<AdminVerificationQueuePage />} />
            <Route path="/dashboard/admin/alumni" element={<AdminAlumniManagementPage />} />
          </Routes>
        </AnimatePresence>
      </Router>
    </AuthProvider>
  );
}

export default App;
