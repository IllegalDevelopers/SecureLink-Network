"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function VerifyPage() {
  const { id } = useParams();

  const [timer, setTimer] = useState(5);
  const [canGo, setCanGo] = useState(false);
  const [token, setToken] = useState(null);
  const [startTime] = useState(Date.now());

  // 🔥 get token from server
  useEffect(() => {
    const fetchToken = async () => {
      const res = await fetch("/api/init");
      const data = await res.json();
      setToken(data.token);
    };

    fetchToken();
  }, []);

  // ⏳ timer
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCanGo(true);
    }
  }, [timer]);

  const handleContinue = async () => {
    if (!token) {
      alert("Loading... please wait");
      return;
    }

    try {
      const res = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          timestamp: startTime,
          id
        })
      });

      const data = await res.json();

      if (data.success) {
        window.location.href = `/api/go?id=${id}&key=${data.accessKey}`;
      } else {
        alert(data.error);
      }
    } catch {
      alert("Verification failed");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>Security Verification</h2>
      <p>Please wait {timer}s...</p>

      <button disabled={!canGo} onClick={handleContinue}>
        Continue
      </button>
    </div>
  );
}
