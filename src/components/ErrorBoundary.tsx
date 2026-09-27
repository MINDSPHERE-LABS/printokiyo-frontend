import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught Error Boundary exception:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center select-none">
          <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mb-4 text-2xl font-bold border border-red-200">
            ⚠️
          </div>
          <h2 className="text-xl font-display font-black text-gray-900 mb-2">
            Something went wrong
          </h2>
          <p className="text-xs text-gray-500 max-w-sm mb-4 font-medium">
            We encountered a cached data mismatch. Click below to clear your storage & reload cleanly.
          </p>

          {this.state.error?.message && (
            <div className="bg-red-50 text-red-700 text-[10px] font-mono p-2.5 rounded-xl border border-red-200 max-w-xs mb-5 break-words">
              {this.state.error.message}
            </div>
          )}

          <button
            onClick={() => {
              try {
                localStorage.clear();
                sessionStorage.clear();
              } catch (e) {}
              window.location.href = '/';
            }}
            className="px-6 py-3.5 bg-[#041E42] text-white rounded-2xl text-xs font-bold shadow-md hover:bg-[#082a56] transition-colors cursor-pointer"
          >
            Clear Data & Reset App Cleanly
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
