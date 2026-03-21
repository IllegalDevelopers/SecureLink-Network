"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function VerifyPage() {
  const { id } = useParams();

  const [timer, setTimer] = useState(5);
  const [canGo, setCanGo] = useState(false);
  const [token] = useState(Math.random().toString(36));
  const [startTime] = useState(Date.now());

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
    try {
      const res = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, timestamp: startTime, id })
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
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "radial-gradient(circle at 30% 20%, #f8fafc, #e2e8f0)",
        padding: "16px",
        position: "relative",
        overflow: "hidden"
      }}
    >
      {/* Animated Background Elements */}
      <div
        style={{
          position: "absolute",
          top: "-20%",
          right: "-10%",
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(79,172,254,0.1), transparent)",
          animation: "float 20s infinite ease-in-out"
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-20%",
          left: "-10%",
          width: "350px",
          height: "350px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0,198,255,0.08), transparent)",
          animation: "float 15s infinite ease-in-out reverse"
        }}
      />

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(20px, -20px) rotate(5deg); }
          66% { transform: translate(-15px, 15px) rotate(-3deg); }
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.05); opacity: 1; }
        }
        
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .card-animation {
          animation: fadeInUp 0.6s ease-out;
        }
        
        .icon-pulse {
          animation: pulse 2s ease-in-out infinite;
        }
        
        .shimmer-text {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          background-size: 200% 100%;
          animation: shimmer 2s infinite;
        }
      `}</style>

      <div
        className="card-animation"
        style={{
          width: "100%",
          maxWidth: "500px",
          borderRadius: "28px",
          background: "linear-gradient(145deg, rgba(255,255,255,0.95), rgba(248,250,252,0.98))",
          boxShadow: "0 30px 70px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.8), 0 0 0 1px rgba(79,172,254,0.1)",
          overflow: "hidden",
          textAlign: "center",
          backdropFilter: "blur(2px)",
          transition: "transform 0.3s ease, box-shadow 0.3s ease"
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-5px)";
          e.currentTarget.style.boxShadow = "0 35px 80px rgba(0,0,0,0.25)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 30px 70px rgba(0,0,0,0.2)";
        }}
      >
        <div style={{ padding: "44px 32px" }}>
          {/* Animated Icon Container */}
          <div
            style={{
              position: "relative",
              display: "inline-block",
              marginBottom: "8px"
            }}
          >
            <div
              className="icon-pulse"
              style={{
                position: "absolute",
                inset: "-12px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #4facfe20, #00c6ff20)",
                filter: "blur(12px)"
              }}
            />
            <div
              style={{
                width: "90px",
                height: "90px",
                margin: "0 auto",
                borderRadius: "50%",
                background: "linear-gradient(145deg, #ffffff, #eef2f6)",
                boxShadow: "inset 4px 4px 12px rgba(0,0,0,0.08), inset -4px -4px 12px rgba(255,255,255,0.8), 0 8px 20px rgba(0,0,0,0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "36px",
                position: "relative",
                zIndex: 1
              }}
            >
              🔐
            </div>
          </div>

          {/* Title */}
          <h2
            style={{
              marginTop: "20px",
              fontSize: "clamp(20px, 5vw, 26px)",
              fontWeight: "700",
              color: "#1e293b",
              letterSpacing: "-0.3px",
              background: "linear-gradient(135deg, #1e293b, #2d3748)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}
          >
            Security Verification
          </h2>

          {/* Description */}
          <p
            style={{
              marginTop: "14px",
              fontSize: "clamp(13px, 4vw, 15px)",
              color: "#5b6e8c",
              lineHeight: "1.6",
              padding: "0 12px",
              maxWidth: "380px",
              marginLeft: "auto",
              marginRight: "auto"
            }}
          >
            To protect against automated bots, we need to verify your
            browser session using cookies.
          </p>

          {/* Progress Bar */}
          {!canGo && (
            <div
              style={{
                marginTop: "28px",
                width: "100%",
                height: "4px",
                background: "#e2e8f0",
                borderRadius: "4px",
                overflow: "hidden"
              }}
            >
              <div
                style={{
                  width: `${((5 - timer) / 5) * 100}%`,
                  height: "100%",
                  background: "linear-gradient(90deg, #4facfe, #00c6ff)",
                  borderRadius: "4px",
                  transition: "width 1s linear"
                }}
              />
            </div>
          )}

          {/* Button */}
          <button
            disabled={!canGo}
            onClick={handleContinue}
            style={{
              marginTop: "32px",
              width: "100%",
              padding: "clamp(12px, 4vw, 16px)",
              borderRadius: "18px",
              border: "none",
              fontSize: "clamp(14px, 4vw, 16px)",
              fontWeight: "600",
              cursor: canGo ? "pointer" : "not-allowed",
              color: "#fff",
              background: canGo
                ? "linear-gradient(135deg, #4facfe, #00c6ff)"
                : "#cbd5e1",
              boxShadow: canGo
                ? "0 12px 28px rgba(79,172,254,0.35)"
                : "none",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              transform: canGo ? "scale(1)" : "scale(0.98)",
              position: "relative",
              overflow: "hidden"
            }}
            onMouseEnter={(e) => {
              if (canGo) {
                e.currentTarget.style.transform = "scale(1.02)";
                e.currentTarget.style.boxShadow = "0 16px 32px rgba(79,172,254,0.45)";
              }
            }}
            onMouseLeave={(e) => {
              if (canGo) {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "0 12px 28px rgba(79,172,254,0.35)";
              }
            }}
          >
            {canGo ? (
              <>
                Accept & Continue
                <span style={{ marginLeft: "8px", display: "inline-block", transition: "transform 0.3s" }}>
                  →
                </span>
              </>
            ) : (
              `Please wait ${timer} second${timer !== 1 ? "s" : ""}`
            )}
            {canGo && (
              <div
                className="shimmer-text"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  pointerEvents: "none"
                }}
              />
            )}
          </button>
        </div>

        {/* Footer */}
        <div
          style={{
            borderTop: "1px solid rgba(79,172,254,0.15)",
            padding: "16px 20px",
            fontSize: "clamp(9px, 3vw, 11px)",
            fontWeight: "600",
            color: "#6c86a3",
            letterSpacing: "1.4px",
            background: "linear-gradient(135deg, rgba(79,172,254,0.03), rgba(0,198,255,0.03))",
            textTransform: "uppercase"
          }}
        >
          PROTECTED BY UNIVERSAL SHORTENER
        </div>
      </div>

      {/* Security Badge */}
      <div
        style={{
          position: "fixed",
          bottom: "16px",
          right: "16px",
          background: "rgba(0,0,0,0.6)",
          backdropFilter: "blur(8px)",
          padding: "6px 12px",
          borderRadius: "20px",
          fontSize: "10px",
          color: "white",
          display: "flex",
          alignItems: "center",
          gap: "6px",
          fontFamily: "monospace"
        }}
      >
        <span>🔒</span>
        <span>Secure Connection</span>
      </div>
    </div>
  );
}
