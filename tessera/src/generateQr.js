// import { createQR } from '@solana/pay';
// import { useState } from 'react';
// import axios from 'axios';

// async function generateQrCode() {
//   //   const [qrCode, setQrCode] = useState('');
//   //   const [reference, setReference] = useState('');
//   // 1 - Send a POST request to our backend and log the response URL
//   const res = await fetch('/api/pay', { method: 'POST' });
//   const { url, ref } = await res.json();
//   console.log(url);
//   // 2 - Generate a QR Code from the URL and generate a blob
//   const qr = createQR(url);
//   const qrBlob = await qr.getRawData('png');
//   if (!qrBlob) return;
//   // 3 - Convert the blob to a base64 string (using FileReader) and set the QR code state
//   const reader = new FileReader();
//   reader.onload = (event) => {
//     if (typeof event.target?.result === 'string') {
//       setQrCode(event.target.result);
//     }
//   };
//   reader.readAsDataURL(qrBlob);
//   // 4 - Set the reference state
//   setReference(ref);
// }
// export default generateQrCode;
