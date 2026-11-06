import React from "react";

// Catches render errors below it so one broken page shows a friendly message instead of a blank screen.
class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // keep a trace in the console; plug an error tracker (Sentry, etc.) in here if you use one
    console.error("UI error:", error, info.componentStack);
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <div
        role="alert"
        className="mx-auto flex min-h-[50vh] max-w-md flex-col items-center justify-center text-center"
      >
        <p className="text-5xl">🩺</p>
        <h1 className="mt-4 text-2xl font-bold">Something went wrong</h1>
        <p className="mt-2 text-ink-soft">
          This page hit an unexpected error. Please reload, or go back to the home page.
        </p>
        <div className="mt-6 flex gap-3">
          <button onClick={() => window.location.reload()} className="btn-primary">
            Reload page
          </button>
          <a href="/" className="btn-outline !px-6 !py-3">
            Go home
          </a>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;
