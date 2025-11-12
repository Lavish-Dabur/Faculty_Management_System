import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './store/auth.store';
import Navbar from './components/Navbar';
import AuthGate from './components/AuthGate.jsx';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import FacultyProfile from './pages/FacultyProfile';
import AdminDashboard from './pages/AdminDashboard';
import RetrievePage from './pages/RetrievePage';

import ResearchProjectsPage from './pages/Research/ResearchProjectsPage';
import AddResearchProjectPage from './pages/Research/AddResearchProjectPage';

import PublicationsPage from './pages/Publications/PublicationsPage';
import AddPublicationPage from './pages/Publications/AddPublicationPage';

import PatentsPage from './pages/Patents/PatentsPage';
import AddPatentPage from './pages/Patents/AddPatentPage';

// Teaching
import TeachingExperiencePage from './pages/Teaching/TeachingExperiencePage';
import AddTeachingExperiencePage from './pages/Teaching/AddTeachingExperiencePage';
import AddSubjectPage from './pages/Teaching/AddSubjectPage';

import AwardsPage from './pages/Awards/AwardsPage';
import AddAwardPage from './pages/Awards/AddAwardPage';

import OutreachActivitiesPage from './pages/Outreach/OutreachActivitiesPage';
import AddOutreachActivityPage from './pages/Outreach/AddOutreachActivityPage';

import EventsPage from './pages/Events/EventsPage';
import AddEventPage from './pages/Events/AddEventPage';

import QualificationsPage from './pages/Qualifications/QualificationsPage';
import AddQualificationPage from './pages/Qualifications/AddQualificationPage';

import CitationMetricsPage from './pages/Citations/CitationMetricsPage';
import AddCitationMetricsPage from './pages/Citations/AddCitationMetricsPage';

const App = () => {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
            <Route path="/retrieve" element={<RetrievePage />} />

            <Route path="/dashboard" element={<AuthGate><DashboardPage /></AuthGate>} />
            <Route path="/profile" element={<AuthGate><ProfilePage /></AuthGate>} />
            <Route path="/faculty-profile" element={<FacultyProfile />} />

            <Route path="/research" element={<AuthGate><ResearchProjectsPage /></AuthGate>} />
            <Route path="/research/new" element={<AuthGate><AddResearchProjectPage /></AuthGate>} />
            <Route path="/research/edit/:id" element={<AuthGate><AddResearchProjectPage /></AuthGate>} />

            <Route path="/publications" element={<AuthGate><PublicationsPage /></AuthGate>} />
            <Route path="/publications/new" element={<AuthGate><AddPublicationPage /></AuthGate>} />
            <Route path="/publications/edit/:id" element={<AuthGate><AddPublicationPage /></AuthGate>} />

            <Route path="/patents" element={<AuthGate><PatentsPage /></AuthGate>} />
            <Route path="/patents/new" element={<AuthGate><AddPatentPage /></AuthGate>} />
            <Route path="/patents/edit/:id" element={<AuthGate><AddPatentPage /></AuthGate>} />

            <Route path="/teaching" element={<AuthGate><TeachingExperiencePage /></AuthGate>} />
            <Route path="/teaching/experience/new" element={<AuthGate><AddTeachingExperiencePage /></AuthGate>} />
            <Route path="/teaching/experience/edit/:id" element={<AuthGate><AddTeachingExperiencePage /></AuthGate>} />
            <Route path="/teaching/subject/new" element={<AuthGate><AddSubjectPage /></AuthGate>} />
            <Route path="/teaching/subject/edit/:id" element={<AuthGate><AddSubjectPage /></AuthGate>} />

            <Route path="/awards" element={<AuthGate><AwardsPage /></AuthGate>} />
            <Route path="/awards/new" element={<AuthGate><AddAwardPage /></AuthGate>} />
            <Route path="/awards/edit/:id" element={<AuthGate><AddAwardPage /></AuthGate>} />

            <Route path="/outreach" element={<AuthGate><OutreachActivitiesPage /></AuthGate>} />
            <Route path="/outreach/new" element={<AuthGate><AddOutreachActivityPage /></AuthGate>} />
            <Route path="/outreach/edit/:id" element={<AuthGate><AddOutreachActivityPage /></AuthGate>} />

            <Route path="/events" element={<AuthGate><EventsPage /></AuthGate>} />
            <Route path="/events/new" element={<AuthGate><AddEventPage /></AuthGate>} />
            <Route path="/events/edit/:id" element={<AuthGate><AddEventPage /></AuthGate>} />

            <Route path="/qualifications" element={<AuthGate><QualificationsPage /></AuthGate>} />
            <Route path="/qualifications/new" element={<AuthGate><AddQualificationPage /></AuthGate>} />
            <Route path="/qualifications/edit/:id" element={<AuthGate><AddQualificationPage /></AuthGate>} />

            <Route path="/citations" element={<AuthGate><CitationMetricsPage /></AuthGate>} />
            <Route path="/citations/new" element={<AuthGate><AddCitationMetricsPage /></AuthGate>} />
            <Route path="/citations/edit/:id" element={<AuthGate><AddCitationMetricsPage /></AuthGate>} />

            <Route path="/admin" element={<AuthGate requireAdmin><AdminDashboard /></AuthGate>} />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
