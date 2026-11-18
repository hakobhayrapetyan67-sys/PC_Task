import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import useJobStore from '../store/jobStore';
import './Dashboard.css';

const ProviderDashboard = () => {
  const { user, logout } = useAuthStore();
  const { jobs, fetchJobs, createJob } = useJobStore();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', description: '', price: '' });

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createJob(form);
    setForm({ title: '', description: '', price: '' });
  };

  return (
    <div className="dashboard-layout">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-brand">
          💼 Workx.am Clone
        </div>
        <div className="navbar-user">
          <span>👤 {user?.name} (Provider)</span>
          <button className="logout-btn" onClick={() => { logout(); navigate('/login'); }}>
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="main-content">
        {/* Sidebar - Create Job Form */}
        <aside className="sidebar" style={{ width: '350px' }}>
          <h3>Post a New Job</h3>
          <form onSubmit={handleSubmit} className="create-job-form" style={{ border: 'none', padding: 0 }}>
            <input 
              type="text" 
              placeholder="Job Title (e.g. React Dev)" 
              value={form.title} 
              onChange={e => setForm({...form, title: e.target.value})} 
              required 
            />
            <textarea 
              placeholder="Job Description" 
              rows="4"
              value={form.description} 
              onChange={e => setForm({...form, description: e.target.value})} 
              required 
            />
            <input 
              type="number" 
              placeholder="Price ($)" 
              value={form.price} 
              onChange={e => setForm({...form, price: e.target.value})} 
              required 
            />
            <button type="submit">Publish Job</button>
          </form>
        </aside>

        {/* Jobs Area */}
        <main className="content-area">
          <h2>My Posted Jobs</h2>
          <div className="job-grid">
            {jobs.filter(j => j.providerId === user.id).map(job => (
              <div key={job.id} className="job-card">
                <div className="job-card-header">
                  <div>
                    <h3 className="job-title">{job.title}</h3>
                    <div className="job-company">Posted by You</div>
                  </div>
                  <div className="job-price">${job.price}</div>
                </div>
                <p style={{ color: '#9CA3AF', fontSize: '14px', marginBottom: '15px' }}>
                  {job.description}
                </p>
                <div className="job-tags">
                  <span className="tag" style={{ backgroundColor: '#064E3B', color: '#34D399', borderColor: '#065F46' }}>Active</span>
                </div>
              </div>
            ))}
            {jobs.filter(j => j.providerId === user.id).length === 0 && (
              <p style={{ color: '#9CA3AF' }}>You haven't posted any jobs yet.</p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};
export default ProviderDashboard;