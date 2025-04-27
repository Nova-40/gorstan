import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [isIframe, setIsIframe] = useState(false);
  const [showPortalMessage, setShowPortalMessage] = useState(true);

  useEffect(() => {
    // Detect if running inside an iframe
    if (window.self !== window.top) {
      setIsIframe(true);
    }
    // After 3 seconds, hide the portal message
    const timer = setTimeout(() => {
      setShowPortalMessage(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (isIframe && showPortalMessage) {
    return (
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <h2>🌀 External Portal Detected</h2>
        <p>You are accessing Gorstan through an unstable gateway.</p>
        <p>Stability uncertain. Proceed carefully...</p>
      </div>
    );
  }

  return (
    <>
      <h1>Welcome to Gorstan</h1>
      <div className="card">
        <p>Simulated reality engaged. Choose your next move wisely.</p>
      </div>
    </>
  )
}

export default App

