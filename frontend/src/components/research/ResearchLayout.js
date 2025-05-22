import React, { useContext } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import Header from '../Header';

const ResearchLayout = () => {
  const { user } = useContext(AuthContext);
  const isResearcher = user?.role === 'researcher';

  return (
    <div className="research-layout" data-user-role={user?.role}>
      <Header />
      <div className="research-container">
        <aside className="research-sidebar">
          <nav>
            <NavLink to="/research" end>Overview</NavLink>
            <NavLink to="/research/thoughts">Thoughts Feed</NavLink>
            <NavLink to="/research/challenges">Challenges Hub</NavLink>
            <NavLink to="/research/volunteer">Volunteer Board</NavLink>
            <NavLink to="/research/search">Search</NavLink>
            <NavLink to="/research/profile">Profile</NavLink>
          </nav>
        </aside>
        <main className="research-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ResearchLayout;