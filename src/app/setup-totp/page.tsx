"use client";
import { useEffect, useState } from "react";

export default function SetupTOTP() {
  const [qr, setQr] = useState("");

  useEffect(() => {
    fetch("/api/setup-totp")
      .then(res => res.json())
      .then(data => {
        setQr(data.qrCode);
      });
  }, []);

  return (
    <div className="flex flex-col items-center justify-center mt-20">
      <h1>Scan This QR</h1>
      {qr && <img src={qr} alt="TOTP QR Code" />}
    </div>
  );
}