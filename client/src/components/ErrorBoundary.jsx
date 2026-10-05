import React from 'react';
import { Link } from 'react-router-dom';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
          <div className="text-center max-w-md">
            <div className="w-20 h-20 bg-rose-50 border border-rose-100 rounded-2xl flex items-center justify-center mx-auto mb-6 text-3xl">
              ⚠️
            </div>
            <h1 className="text-2xl font-extrabold text-slate-800 mb-2">Something went wrong</h1>
            <p className="text-sm text-slate-500 leading-relaxed mb-6">
              An unexpected error occurred. Please try refreshing the page or navigating back to the homepage.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={() => {
                  this.handleReset();
                  window.location.reload();
                }}
                className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2.5 px-5 rounded-lg text-sm transition cursor-pointer shadow-sm"
              >
                Refresh Page
              </button>
              <a
                href="/"
                className="bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200 font-bold py-2.5 px-5 rounded-lg text-sm transition"
              >
                Go to Homepage
              </a>
            </div>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 text-left bg-slate-100 border border-slate-200 rounded-lg p-4">
                <summary className="text-xs font-bold text-slate-500 cursor-pointer">Error Details</summary>
                <pre className="text-xs text-rose-600 mt-2 overflow-auto max-h-40 whitespace-pre-wrap">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
