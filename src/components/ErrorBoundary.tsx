"use client";

import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error?: Error; resetError: () => void }>;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Si es un error de custom elements, intentar limpiar
    if (error.message.includes('CustomElementRegistry') || 
        error.message.includes('wcm-button') ||
        error.message.includes('already been used with this registry')) {
      console.warn('Custom element error detected, attempting cleanup...');
      // Recargar la página como último recurso para errores de custom elements
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error} resetError={this.resetError} />;
      }

      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          background: '#040200',
          color: 'white',
          padding: '2rem',
          textAlign: 'center'
        }}>
          <h2>Algo salió mal</h2>
          <p>Se produjo un error inesperado. La página se recargará automáticamente.</p>
          <button 
            onClick={this.resetError}
            style={{
              marginTop: '1rem',
              padding: '0.5rem 1rem',
              background: '#f5a602',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Intentar de nuevo
          </button>
          {this.state.error && (
            <details style={{ marginTop: '1rem', fontSize: '0.8rem', opacity: 0.7 }}>
              <summary>Detalles del error</summary>
              <pre style={{ textAlign: 'left', overflow: 'auto', maxWidth: '100%' }}>
                {this.state.error.message}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
} 