import { Component } from 'react';
import { logError } from '../utils/validation';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    logError(error, 'ErrorBoundary');
    if (import.meta.env.DEV) {
      console.error('Error details:', errorInfo);
      if (error && error.stack) {
        console.error('Error stack:', error.stack);
      }
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#181c24] via-[#232946] to-[#181c24] text-[#e9e9f0]">
          <div className="text-center px-6 max-w-md">
            <h1 className="text-4xl font-bold mb-4 text-[#3be8b0]" role="alert">Something went wrong</h1>
            <p className="text-[#a5a6f6] mb-6">We're sorry, but something unexpected happened.</p>
            {!import.meta.env.PROD && this.state.error && (
              <details className="mb-6 text-left bg-[#232946]/50 p-4 rounded-lg">
                <summary className="cursor-pointer text-[#a5a6f6] mb-2">Error Details (Development Only)</summary>
                <pre className="text-sm text-red-400 overflow-auto mt-2">
                  {this.state.error.toString()}
                  {this.state.error.stack && `\n${this.state.error.stack}`}
                </pre>
              </details>
            )}
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
              }}
              className="px-6 py-3 bg-[#3be8b0] text-black rounded-lg hover:bg-opacity-80 transition-all duration-300 font-semibold focus:outline-none focus:ring-2 focus:ring-[#3be8b0] focus:ring-offset-2 focus:ring-offset-[#232946]"
              aria-label="Try to recover from the error"
            >
              Try Again
            </button>
            <button
              onClick={() => {
                window.location.reload();
              }}
              className="ml-4 px-6 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all duration-300 font-semibold focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-[#232946]"
              aria-label="Reload the page"
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
