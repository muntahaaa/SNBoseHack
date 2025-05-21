import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
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
import ResearchDesk from './components/ResearchDesk';
import MathPage from './components/MathPage';
import PhysicsPage from './components/PhysicsPage';
import ChemistryPage from './components/ChemistryPage';
import PrivateRoute from './components/PrivateRoute';

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
            <Route path="/research-desk" element={<ResearchDesk />} />
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
