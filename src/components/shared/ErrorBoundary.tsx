'use client';

import { Component, type ReactNode } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

type Props = { children: ReactNode };
type State = { hasError: boolean; error?: Error };

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-full p-8 text-center">
          <AlertTriangle className="w-10 h-10 text-yellow-400 mb-4" />
          <h2 className="text-lg font-bold text-white mb-2">Something went wrong</h2>
          <p className="text-white/40 text-sm mb-4 max-w-md">
            {this.state.error?.message || 'An unexpected error occurred.'}
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false });
              window.location.reload();
            }}
            className="btn-primary font-medium px-5 py-2.5 rounded-xl text-sm flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" /> Reload
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
