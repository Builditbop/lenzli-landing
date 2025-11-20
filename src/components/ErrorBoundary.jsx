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
        <div className="min-h-screen bg-gradient-vibrant text-white flex items-center justify-center p-6">
          <div className="max-w-2xl w-full rounded-3xl border-2 border-red-400/30 bg-gradient-to-br from-red-500/20 via-purple-500/20 to-pink-500/20 backdrop-blur-md p-8 glow-pink">
            <h1 className="text-3xl font-bold mb-4 text-red-300">⚠️ Something went wrong</h1>
            <p className="text-white/80 mb-4">
              The application encountered an error. Please check the browser console for details.
            </p>
            {this.state.error && (
              <div className="mt-4 p-4 rounded-2xl bg-black/30 border border-red-400/30">
                <p className="text-sm text-red-200 font-mono break-all">
                  {this.state.error.toString()}
                </p>
              </div>
            )}
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="mt-6 rounded-2xl bg-gradient-primary text-white px-6 py-3 font-semibold hover:opacity-90 transition-all shadow-lg glow-purple"
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

