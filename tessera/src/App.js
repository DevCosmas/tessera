import logo from './logo.svg';
import './App.css';
import { useState } from 'react';
import { createQR } from '@solana/pay';
import ticketDb from './db';

function App() {
  return (
    <div className="appConatiner">
      <DisplayLIst />
      <DisplayTicket />
    </div>
  );
}

function DisplayLIst() {
  return (
    <div className="list--container">
      <span className="intro-span">
        <h1>purchase your ticket here 🎁</h1>
        <p>buy cheap ticket in less than in a minute</p>
      </span>
      <div>
        <h2>available ticket</h2>
      </div>
    </div>
  );
}
function DisplayTicket() {}
export default App;
