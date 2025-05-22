import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import './App.css';

// Styles
import './styles/Home.css';
import './styles/Header.css';
import './styles/Auth.css';
import './styles/ResearchDesk.css';
import './styles/SubjectPage.css';

// Components
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import ResearchDesk from './components/pages/ResearchDesk';
import MathPage from './components/pages/MathPage';
import PhysicsPage from './components/pages/PhysicsPage';
import ChemistryPage from './components/pages/ChemistryPage';
import PrivateRoute from './components/PrivateRoute';

// Research Deck Components
import ResearchLayout from './components/research/ResearchLayout';
import ResearchHome from './components/research/ResearchHome';
import ThoughtsFeed from './components/research/ThoughtsFeed';
import CreateThought from './components/research/CreateThought';
import ChallengesHub from './components/research/ChallengesHub';
import VolunteerBoard from './components/research/VolunteerBoard';
import SearchResults from './components/research/SearchResults';
import UserProfile from './components/research/UserProfile';
import PostDetail from './components/research/PostDetail';
import ChallengeDetail from './components/research/ChallengeDetail';
import ChallengeReview from './components/research/ChallengeReview';
import VolunteerDetail from './components/research/VolunteerDetail';
import CreateChallenge from './components/research/CreateChallenge';
import CreateOpportunity from './components/research/CreateOpportunity';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Protected routes */}
          <Route element={<PrivateRoute />}>
            {/* Research Deck routes - wrapped in ThemeProvider */}
            <Route path="/research" element={
              <ThemeProvider>
                <ResearchLayout />
              </ThemeProvider>
            }>
              <Route index element={<ResearchHome />} />
              <Route path="thoughts" element={<ThoughtsFeed />} />
              <Route path="thoughts/new" element={<CreateThought />} />
              <Route path="thoughts/:id" element={<PostDetail />} />
              <Route path="challenges" element={<ChallengesHub />} />
              <Route path="challenges/new" element={<CreateChallenge />} />
              <Route path="challenges/:id" element={<ChallengeDetail />} />
              <Route path="challenges/:id/review" element={<ChallengeReview />} />
              <Route path="volunteer" element={<VolunteerBoard />} />
              <Route path="volunteer/new" element={<CreateOpportunity />} />
              <Route path="volunteer/:id" element={<VolunteerDetail />} />
              <Route path="search" element={<SearchResults />} />
              <Route path="profile" element={<UserProfile />} />
            </Route>

            {/* Other protected routes */}
            <Route path="/math" element={<MathPage />} />
            <Route path="/physics" element={<PhysicsPage />} />
            <Route path="/chemistry" element={<ChemistryPage />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
