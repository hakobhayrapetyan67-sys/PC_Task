import { Component } from 'react';

class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) { return { error }; }

  componentDidCatch(error, info) { console.error('[ErrorBoundary]', error, info); }

  handleReset = () => {
    localStorage.removeItem('workx.token');
    localStorage.removeItem('workx.user');
    window.location.replace('/login');
  };

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <div className="auth-container">
        <div className="auth-shell">
          <div className="auth-card" style={{ textAlign: 'center' }}>
            <h2 className="auth-title">Something went wrong</h2>
            <p className="auth-subtitle">{this.state.error?.message || 'Unexpected error'}</p>
            <button className="btn btn--primary auth-submit" onClick={this.handleReset}>
              Reset and sign in again
            </button>
          </div>
        </div>
      </div>
    );
  }
}
export default ErrorBoundary;
