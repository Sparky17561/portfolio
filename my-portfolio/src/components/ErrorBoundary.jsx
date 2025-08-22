import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      errorId: null 
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { 
      hasError: true,
      errorId: Date.now() // Unique ID for this error
    };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error details
    console.group('🚨 Error Boundary Caught Error');
    console.error('Error:', error);
    console.error('Error Info:', errorInfo);
    console.error('Component Stack:', errorInfo.componentStack);
    console.groupEnd();
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // Optional: Send error to error reporting service
    // this.logErrorToService(error, errorInfo);
  }

  logErrorToService = (error, errorInfo) => {
    // You can integrate with services like Sentry, LogRocket, etc.
    console.log('Logging error to service:', { error, errorInfo });
  };

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null
    });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      const isDevelopment = process.env.NODE_ENV === 'development';
      
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#000',
          color: '#fff',
          padding: '20px',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
          <div style={{
            maxWidth: '600px',
            textAlign: 'center',
            background: 'linear-gradient(145deg, #1a1a1a, #2d2d2d)',
            padding: '40px',
            borderRadius: '12px',
            border: '1px solid #333'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>⚠️</div>
            
            <h1 style={{ 
              margin: '0 0 16px 0', 
              fontSize: '24px',
              color: '#ff6b6b'
            }}>
              Something went wrong
            </h1>
            
            <p style={{ 
              margin: '0 0 24px 0', 
              color: '#ccc',
              fontSize: '16px',
              lineHeight: '1.5'
            }}>
              We encountered an unexpected error. This might be due to a screen size change or animation conflict.
            </p>

            {/* Action buttons */}
            <div style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'center',
              flexWrap: 'wrap',
              marginBottom: '24px'
            }}>
              <button 
                onClick={this.handleRetry}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#007acc',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#0056b3'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#007acc'}
              >
                Try Again
              </button>
              
              <button 
                onClick={this.handleReload}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#5a6268'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#6c757d'}
              >
                Reload Page
              </button>
            </div>

            {/* Development error details */}
            {isDevelopment && this.state.error && (
              <details style={{
                textAlign: 'left',
                backgroundColor: '#1a1a1a',
                padding: '16px',
                borderRadius: '6px',
                border: '1px solid #333',
                marginTop: '20px'
              }}>
                <summary style={{ 
                  cursor: 'pointer', 
                  fontWeight: 'bold',
                  marginBottom: '12px',
                  color: '#ff6b6b'
                }}>
                  🐛 Development Error Details
                </summary>
                
                <div style={{ fontSize: '12px', fontFamily: 'monospace' }}>
                  <div style={{ marginBottom: '12px' }}>
                    <strong style={{ color: '#ffd93d' }}>Error:</strong>
                    <pre style={{ 
                      color: '#ff6b6b', 
                      whiteSpace: 'pre-wrap',
                      margin: '4px 0 0 0'
                    }}>
                      {this.state.error.toString()}
                    </pre>
                  </div>
                  
                  {this.state.errorInfo?.componentStack && (
                    <div>
                      <strong style={{ color: '#ffd93d' }}>Component Stack:</strong>
                      <pre style={{ 
                        color: '#51cf66',
                        whiteSpace: 'pre-wrap',
                        fontSize: '11px',
                        lineHeight: '1.4',
                        margin: '4px 0 0 0',
                        maxHeight: '200px',
                        overflow: 'auto'
                      }}>
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </div>
                  )}
                </div>
              </details>
            )}

            {/* Error ID for support */}
            <div style={{
              marginTop: '20px',
              padding: '12px',
              backgroundColor: '#2d2d2d',
              borderRadius: '6px',
              fontSize: '12px',
              color: '#888'
            }}>
              Error ID: {this.state.errorId}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;