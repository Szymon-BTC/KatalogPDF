import React, { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  declare props: Readonly<Props>;

  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 text-center">
          <div className="p-4 rounded-3xl bg-amber-500/10 border border-amber-500/20 text-amber-400 mb-4 shadow-lg">
            <AlertTriangle className="w-10 h-10" />
          </div>
          <h1 className="text-xl font-bold text-white mb-2 tracking-tight">Coś poszło nie tak</h1>
          <p className="text-xs text-slate-400 max-w-md mb-6 leading-relaxed">
            Wystąpił nieoczekiwany błąd aplikacji. Możesz odświeżyć widok, aby powrócić do przeglądania katalogu.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="apple-press-effect px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-2xl shadow-lg shadow-amber-500/20 flex items-center gap-2 transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Odśwież Aplikację</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
