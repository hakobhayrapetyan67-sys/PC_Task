import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import './Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'WORKER' });
  const { register } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData);
      navigate('/dashboard');
    } catch (err) {
      alert("Registration failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Create Account</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <input 
            type="text" 
            name="name" 
            placeholder="Full Name" 
            onChange={(e) => setFormData({...formData, name: e.target.value})} 
            required 
            className="auth-input"
          />
          <input 
            type="email" 
            name="email" 
            placeholder="Email" 
            onChange={(e) => setFormData({...formData, email: e.target.value})} 
            required 
            className="auth-input"
          />
          <input 
            type="password" 
            name="password" 
            placeholder="Password" 
            onChange={(e) => setFormData({...formData, password: e.target.value})} 
            required 
            className="auth-input"
          />
          <select 
            name="role" 
            onChange={(e) => setFormData({...formData, role: e.target.value})} 
            className="auth-input"
          >
            <option value="WORKER">Worker (Job Seeker)</option>
            <option value="PROVIDER">Provider (Employer)</option>
          </select>
          <button type="submit" className="auth-button">Sign Up</button>
        </form>
        <p className="auth-link-text">
          Have an account? <Link to="/login">Sign In</Link>
        </p>
      </div>
    </div>
  );
};
export default Register;