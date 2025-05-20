import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import '../styles/Auth.css';

const Signup = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'student'
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const { register } = useContext(AuthContext);

  const { email, password, role } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password || !role) {
      setError('Please fill all fields');
      return;
    }

    const result = await register(formData);
    
    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form-container">
        <h1>Sign Up</h1>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              value={email}
              onChange={onChange}
              required
              placeholder="Enter your email"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              value={password}
              onChange={onChange}
              required
              placeholder="Enter your password"
              minLength="6"
            />
          </div>
          <div className="form-group">
            <label htmlFor="role">Role</label>
            <select
              name="role"
              id="role"
              value={role}
              onChange={onChange}
              required
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
              <option value="researcher">Researcher</option>
              <option value="volunteer">Volunteer</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary">Sign Up</button>
        </form>
        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
