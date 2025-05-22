import { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import '../styles/Header.css';

const Header = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);

  return (
    <header className="header">      <div className="logo">
        <Link to="/">
          <img 
            src={process.env.PUBLIC_URL + "/images/logo.svg"} 
            alt="SNBoseHack Logo" 
            className="logo-image" 
          />
        </Link>
      </div>
      <nav className="nav">
        {isAuthenticated ? (
          <>
            <Link to="/research-desk" className="btn">Research Desk</Link>
            <button onClick={logout} className="btn">Logout</button>
          </>
        ) : (
          <>
            <Link to="/signup" className="btn">Sign Up</Link>
            <Link to="/login" className="btn">Login</Link>
            <Link to="/research-desk" className="btn">Research Desk</Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
