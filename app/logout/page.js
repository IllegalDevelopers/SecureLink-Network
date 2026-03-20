"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Logout() {
  const router = useRouter();

  useEffect(() => {
    // 🔒 Clear user data
    localStorage.removeItem("user");

    // Optional: clear everything
    // localStorage.clear();

    // Redirect to login
    setTimeout(() => {
      router.push("/login");
    }, 1500);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-blue-50">
      <div className="bg-white p-8 rounded-2xl shadow-xl text-center">
        <h2 className="text-xl font-semibold text-gray-800">
          Logging you out... 👋
        </h2>
        <p className="text-gray-500 mt-2">
          Please wait...
        </p>
      </div>
    </div>
  );
}