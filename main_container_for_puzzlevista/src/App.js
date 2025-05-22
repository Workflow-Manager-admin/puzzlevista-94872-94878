import React from 'react';
import './App.css';
import PuzzleContainer from './components/PuzzleContainer';

function App() {
  return (
    <div className="app ancient-theme">
      <nav className="navbar">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <div className="logo">
              <span className="logo-symbol">🧩</span> PuzzleVista
            </div>
            <div className="nav-links">
              <button className="ancient-nav-button">Gallery</button>
              <button className="ancient-nav-button">About</button>
            </div>
          </div>
        </div>
      </nav>

      <main className="puzzle-main">
        <div className="container">
          <div className="puzzle-header">
            <h1 className="ancient-title">PuzzleVista</h1>
            <div className="ancient-subtitle">Ancient Puzzles Await Your Wisdom</div>
          </div>
          
          <PuzzleContainer />
          
          <div className="ancient-footer">
            <p>"The puzzle of life becomes clearer with every piece connected."</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;