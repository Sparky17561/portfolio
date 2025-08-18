import React from "react";

/**
 * Simple error boundary to catch Spline / runtime errors.
 * Renders the fallback UI (a small decorative placeholder).
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, err: null };
  }

  static getDerivedStateFromError(err) {
    return { hasError: true, err };
  }

  componentDidCatch(err, info) {
    // console log for debugging
    console.warn("ErrorBoundary caught:", err, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "grid",
            placeItems: "center",
            color: "#ff9b9b",
            padding: 20,
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 14, opacity: 0.9, marginBottom: 8 }}>
              3D preview unavailable
            </div>
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" aria-hidden>
              <rect x="2" y="2" width="20" height="20" rx="4" stroke="#ff6b6b" strokeWidth="1.2" />
              <path d="M7 12 L10 15 L17 8" stroke="#ff6b6b" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
