import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './store/auth.store';
import Navbar from './components/Navbar';
import AuthGate from './components/AuthGate';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

const App = () => {
  const [currentView, setCurrentView] = useState('home');
  const navigate = useCallback(view => setCurrentView(view), []);

  let Content;
  switch (currentView) {
    case 'auth_gate':   Content = <AuthGate navigate={navigate} />; break;
  case 'login':      Content = <LoginPage navigate={navigate} />; break;
  case 'signup':     Content = <SignupPage navigate={navigate} />; break;
    case 'home':
    default:           Content = <HomePage navigate={navigate} />; break;
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <LoginPage />} />
            <Route path="/signup" element={user ? <Navigate to="/dashboard" /> : <SignupPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
            <Route path="/retrieve" element={<RetrievePage />} />

            {/* Protected Routes */}
            <Route path="/dashboard" element={<AuthGate><DashboardPage /></AuthGate>} />
            <Route path="/profile" element={<AuthGate><ProfilePage /></AuthGate>} />

            {/* Research Routes */}
            <Route path="/research" element={<AuthGate><ResearchProjectsPage /></AuthGate>} />
            <Route path="/research/new" element={<AuthGate><AddResearchProjectPage /></AuthGate>} />

            {/* Publications Routes */}
            <Route path="/publications" element={<AuthGate><PublicationsPage /></AuthGate>} />
            <Route path="/publications/new" element={<AuthGate><AddPublicationPage /></AuthGate>} />

            {/* Patents Routes */}
            <Route path="/patents" element={<AuthGate><PatentsPage /></AuthGate>} />
            <Route path="/patents/new" element={<AuthGate><AddPatentPage /></AuthGate>} />

            {/* Teaching Routes */}
            <Route path="/teaching" element={<AuthGate><TeachingExperiencePage /></AuthGate>} />
            <Route path="/teaching/experience/new" element={<AuthGate><AddTeachingExperiencePage /></AuthGate>} />
            <Route path="/teaching/subject/new" element={<AuthGate><AddSubjectPage /></AuthGate>} />

            {/* Awards Routes */}
            <Route path="/awards" element={<AuthGate><AwardsPage /></AuthGate>} />
            <Route path="/awards/new" element={<AuthGate><AddAwardPage /></AuthGate>} />

            {/* Outreach Routes */}
            <Route path="/outreach" element={<AuthGate><OutreachActivitiesPage /></AuthGate>} />
            <Route path="/outreach/new" element={<AuthGate><AddOutreachActivityPage /></AuthGate>} />

            {/* Events Routes */}
            <Route path="/events" element={<AuthGate><EventsPage /></AuthGate>} />
            <Route path="/events/new" element={<AuthGate><AddEventPage /></AuthGate>} />

            {/* Qualifications Routes */}
            <Route path="/qualifications" element={<AuthGate><QualificationsPage /></AuthGate>} />
            <Route path="/qualifications/new" element={<AuthGate><AddQualificationPage /></AuthGate>} />

            {/* Citations Routes */}
            <Route path="/citations" element={<AuthGate><CitationMetricsPage /></AuthGate>} />
            <Route path="/citations/new" element={<AuthGate><AddCitationMetricsPage /></AuthGate>} />

            {/* Admin Routes */}
            <Route path="/admin" element={<AuthGate requireAdmin><AdminDashboard /></AuthGate>} />

            {/* 404 */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
