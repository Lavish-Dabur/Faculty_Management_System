import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './store/auth.store';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import PublicationsPage from './pages/Publications/PublicationsPage';
import AddPublicationPage from './pages/Publications/AddPublicationPage';
import ResearchProjectsPage from './pages/Research/ResearchProjectsPage';
import AddResearchProjectPage from './pages/Research/AddResearchProjectPage';
import PatentsPage from './pages/Patents/PatentsPage';
import AddPatentPage from './pages/Patents/AddPatentPage';
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
import { useAuth } from './store/auth';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/publications" element={<ProtectedRoute><PublicationsPage /></ProtectedRoute>} />
          <Route path="/publications/new" element={<ProtectedRoute><AddPublicationPage /></ProtectedRoute>} />
          <Route path="/research" element={<ProtectedRoute><ResearchProjectsPage /></ProtectedRoute>} />
          <Route path="/research/new" element={<ProtectedRoute><AddResearchProjectPage /></ProtectedRoute>} />
          <Route path="/patents" element={<ProtectedRoute><PatentsPage /></ProtectedRoute>} />
          <Route path="/patents/new" element={<ProtectedRoute><AddPatentPage /></ProtectedRoute>} />
          <Route path="/teaching" element={<ProtectedRoute><TeachingExperiencePage /></ProtectedRoute>} />
          <Route path="/teaching/new" element={<ProtectedRoute><AddTeachingExperiencePage /></ProtectedRoute>} />
          <Route path="/teaching/subjects/new" element={<ProtectedRoute><AddSubjectPage /></ProtectedRoute>} />
          <Route path="/awards" element={<ProtectedRoute><AwardsPage /></ProtectedRoute>} />
          <Route path="/awards/new" element={<ProtectedRoute><AddAwardPage /></ProtectedRoute>} />
          <Route path="/outreach" element={<ProtectedRoute><OutreachActivitiesPage /></ProtectedRoute>} />
          <Route path="/outreach/new" element={<ProtectedRoute><AddOutreachActivityPage /></ProtectedRoute>} />
          <Route path="/events" element={<ProtectedRoute><EventsPage /></ProtectedRoute>} />
          <Route path="/events/new" element={<ProtectedRoute><AddEventPage /></ProtectedRoute>} />
          <Route path="/qualifications" element={<ProtectedRoute><QualificationsPage /></ProtectedRoute>} />
          <Route path="/qualifications/new" element={<ProtectedRoute><AddQualificationPage /></ProtectedRoute>} />
          <Route path="/citations" element={<ProtectedRoute><CitationMetricsPage /></ProtectedRoute>} />
          <Route path="/citations/new" element={<ProtectedRoute><AddCitationMetricsPage /></ProtectedRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
