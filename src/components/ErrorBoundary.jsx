import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-white text-gray-900 flex items-center justify-center p-6">
          <div className="max-w-2xl w-full rounded-2xl border border-gray-200 bg-white p-8 shadow-card">
            <h1 className="text-3xl font-bold mb-4 text-black">⚠️ Something went wrong</h1>
            <p className="text-gray-600 mb-4">
              The application encountered an error. Please check the browser console for details.
            </p>
            {this.state.error && (
              <div className="mt-4 p-4 rounded-xl bg-red-50 border border-red-200">
                <p className="text-sm text-red-600 font-mono break-all">
                  {this.state.error.toString()}
                </p>
              </div>
            )}
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="mt-6 rounded-xl bg-black text-white px-6 py-3 font-semibold hover:bg-gray-800 transition-all shadow-subtle"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
