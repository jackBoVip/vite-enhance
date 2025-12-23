import React, { useState } from 'react';
import './App.css';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="app">
      <header>
        <h1>React App Example</h1>
        <p>Powered by Vite Enhance Kit</p>
      </header>
      
      <main>
        <div className="card">
          <h2>Features Enabled</h2>
          <ul>
            <li>✅ React 18 with Fast Refresh</li>
            <li>✅ TypeScript support</li>
            <li>✅ Build caching enabled</li>
            <li>✅ Hot Module Replacement</li>
          </ul>
        </div>
        
        <div className="card">
          <h2>Counter Example</h2>
          <button onClick={() => setCount(count + 1)}>
            Count: {count}
          </button>
        </div>
      </main>
    </div>
  );
}

export default App;