import { Theme } from '@carbon/react';
import './App.css';

function App() {
  return (
    <Theme theme="g100">
      <div className="app-container">
        <header className="app-header">
          <h1>EthosEngine - AI Integrity Sentinel</h1>
          <p>Powered by IBM Carbon Design System</p>
        </header>
        <main className="app-main">
          <div className="welcome-message">
            <h2>Welcome to EthosEngine</h2>
            <p>Your AI accountability and regulatory compliance platform</p>
            <p className="status-message">
              ✅ Vite + React setup complete<br />
              ✅ IBM Carbon Design System integrated<br />
              ✅ Ready for dashboard development
            </p>
          </div>
        </main>
      </div>
    </Theme>
  );
}

export default App;

// Made with Bob
