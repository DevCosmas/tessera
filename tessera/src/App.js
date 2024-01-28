import './App.css';

import { useState } from 'react';
import { createQR } from '@solana/pay';
import axios from 'axios';

import ticketDb from './db';
// import verifyTx from './verifyTx.js';

// import generateQrCode from './generateQr.js';

function App() {
  return (
    <div className="appConatiner">
      <DisplayLIst />
    </div>
  );
}

function DisplayLIst() {
  const [ticket, setTicket] = useState(null);
  function selectTicket(ticketObj) {
    setTicket(ticketObj);
  }
  return (
    <div className="list--container">
      <span className="intro-span">
        <h1 className="heading">purchase your ticket here 🎁</h1>
        <p className="sub-heading">buy cheap ticket in less than in a minute</p>
      </span>
      <div className="list--wrapper">
        <h2>available ticket</h2>
        <ul>
          {ticketDb.map((el, i) => (
            <div className="list">
              <div className="img_wrapper">
                <img
                  src={el.image}
                  alt={`${el.name} profile`}
                  className="ticket_img"
                />
              </div>
              <div className="name_price_wrapper">
                <span className="ticket-name">{el.name}</span>
                <p className="price">{`$${el.price}`}</p>
                <button
                  onClick={() => selectTicket(el)}
                  className="btn">
                  buy ticket
                </button>
              </div>
            </div>
          ))}
        </ul>
      </div>
      {ticket !== null && (
        <DisplayTicket
          ticket={ticket}
          setTicket={setTicket}
        />
      )}
    </div>
  );
}
function DisplayTicket({ ticket, setTicket }) {
  function handleCancelBtn() {
    setTicket(null);
  }
  const [qty, setQty] = useState(1);
  const [qrCode, setQrCode] = useState('');
  const [ref, setRef] = useState('');
  const [confrimMsg, setMsg] = useState('');
  // console.log('refer', ref);
  async function generateQrCode(name, label, price, quantity, wallet, message) {
    try {
      const response = await axios.post(
        'https://solanapay-task-ii.onrender.com/api/generateQR',
        { name, label, price, quantity, wallet, message }
      );
      const { newURl, ref } = response.data;
      const qr = createQR(newURl);
      const qrBlob = await qr.getRawData('png');
      if (!qrBlob) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        if (typeof event.target?.result === 'string') {
          setQrCode(event.target.result);
          // console.log(qrCode);
        }
      };
      reader.readAsDataURL(qrBlob);
      setRef(ref);
    } catch (error) {
      console.error('Error making POST request:', error);
    }
  }
  async function verifyTx(reference) {
    console.log(reference);

    try {
      const response = await axios.get(
        `https://solanapay-task-ii.onrender.com/api/verifyTx?reference=${ref}`
      );

      const { status, message } = response.data;

      if (status === 'success') {
        console.log(message);
        setRef('');
        setQrCode('');
        setMsg(message);
      }
    } catch (error) {
      console.error('Error making GET request:', error);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    await generateQrCode(
      ticket.name,
      ticket.label,
      ticket.price,
      qty,
      ticket.wallet,
      ticket.message
    );
  };
  async function handleVerifyTx() {
    try {
      await verifyTx(ref);
      console.log('transaction verified');
    } catch (err) {
      console.log('verification failed', err.message);
    }
  }
  return (
    <div className="form--overlay">
      <form
        className="generateQrCode"
        onSubmit={(e) => handleSubmit(e)}>
        <span
          className="close--btn"
          onClick={handleCancelBtn}>
          X
        </span>
        <h1 className="dsc-name">{ticket.name}</h1>
        <div
          className={`generatQr-container ${
            qrCode !== '' ? 'setDisplayNone' : ''
          }`}>
          <span className="summaryDetails">
            <b>Wallet Address</b>
            <p className="summary-child">{ticket.wallet}</p>
          </span>
          <span className="summaryDetails">
            <b>Price per one</b>
            <p className="summary-child">${ticket.price}</p>
          </span>
          <span className="summaryDetails">
            <b>Total</b>
            <p className="summary-child">
              ${qty > 1 ? ticket.price * qty : ticket.price}
            </p>
          </span>

          <label>
            how many ticket do you want
            <input
              type="number"
              value={qty}
              onChange={(e) => setQty(e.target.value)}
            />
          </label>

          <button className="btn">generate QR code</button>
        </div>
        {qrCode && (
          <div
            className={`qrcode-wrapper" ${
              confrimMsg !== '' ? 'dispNone' : ''
            }`}>
            <img
              src={qrCode}
              style={{
                position: 'relative',
                background: 'white',
                display: 'block',
                marginBottom: '1rem',
              }}
              alt="QR Code"
              width={250}
              height={250}
              priority
            />
            <button
              className="btn verify"
              onClick={() => handleVerifyTx()}>
              Confirm payment
            </button>
          </div>
        )}
        {confrimMsg && (
          <span>
            <h1 className="confirm">Transaction Succesfull ✔ </h1>
            <p className="done"> {confrimMsg}</p>
          </span>
        )}
      </form>
    </div>
  );
}
export default App;
