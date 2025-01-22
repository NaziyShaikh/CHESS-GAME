import React from 'react';
import Game from './components/chess/Game';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>React Chess Game</h1>
      </header>
      <main>
        <Game />
      </main>
    </div>
  );
}

export default App;
