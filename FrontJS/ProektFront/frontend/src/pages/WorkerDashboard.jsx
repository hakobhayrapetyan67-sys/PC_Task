import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import useJobStore from '../store/jobStore';
import './Dashboard.css';

const WorkerDashboard = () => {
  const { user, logout } = useAuthStore();
  const { jobs, fetchJobs } = useJobStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  return (
    <div className="dashboard-layout">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-brand">
          💼 Workx.am Clone
        </div>
        <div className="navbar-user">
          <span>👤 {user?.name} (Worker)</span>
          <button className="logout-btn" onClick={() => { logout(); navigate('/login'); }}>
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="main-content">
        {/* Sidebar */}
        <aside className="sidebar">
          <h3>Filters</h3>
          <div className="filter-group">
            <label>Search</label>
            <input type="text" placeholder="Job title..." />
          </div>
          <div className="filter-group">
            <label>Category</label>
            <select>
              <option>All Categories</option>
              <option>IT / Software</option>
              <option>Design</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Salary</label>
            <select>
              <option>Any</option>
              <option>$500 - $1000</option>
              <option>$1000+</option>
            </select>
          </div>
        </aside>

        {/* Jobs Area */}
        <main className="content-area">
          <h2>Available Jobs ({jobs.length})</h2>
          <div className="job-grid">
            {jobs.map(job => (
              <div key={job.id} className="job-card">
                <div className="job-card-header">
                  <div>
                    <h3 className="job-title">{job.title}</h3>
                    <div className="job-company">{job.provider.name} • Remote</div>
                  </div>
                  <div className="job-price">${job.price}</div>
                </div>
                <p style={{ color: '#9CA3AF', fontSize: '14px', marginBottom: '15px' }}>
                  {job.description}
                </p>
                <div className="job-tags">
                  <span className="tag">Full-time</span>
                  <span className="tag">English</span>
                  <span className="tag">Junior</span>
                </div>
                <button className="apply-btn">Apply Now</button>
              </div>
            ))}
            {jobs.length === 0 && <p style={{ color: '#9CA3AF' }}>No jobs available right now.</p>}
          </div>
        </main>
      </div>
    </div>
  );
};
export default WorkerDashboard;