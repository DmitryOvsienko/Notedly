import React from 'react';

import Sparkle from './Sparkle';// Импортируем компонент Sparkle

import './App.css';

function App() {
  const name = 'Adam'
  const now = String(new Date())
  return (
    <div className="App">
      <p>Hello { name }!</p>
      <p>The current time is { now }!</p>
      <p>Two plus two is { 2 + 2 }!</p>
      <Sparkle />
    </div>
  );
}

export default App;
