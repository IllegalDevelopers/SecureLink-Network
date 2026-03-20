"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Register() {
  const router = useRouter();

  const [form, setForm] = useState({
    username: "",
    password: "",
    inviteCode: "",
    apiToken: "",
    domain: ""
  });

  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showInvitePopup, setShowInvitePopup] = useState(false);

  // Disable right click and copy functionality
  useEffect(() => {
    // Disable context menu (right click)
    const disableContextMenu = (e) => {
      e.preventDefault();
      return false;
    };

    // Disable copy, cut, paste
    const disableCopyCutPaste = (e) => {
      e.preventDefault();
      return false;
    };

    // Disable drag and drop
    const disableDrag = (e) => {
      e.preventDefault();
      return false;
    };

    // Disable keyboard shortcuts for copy, cut, paste
    const disableKeyboardShortcuts = (e) => {
      // Check for Ctrl+C, Ctrl+X, Ctrl+V, Ctrl+U, F12, Ctrl+Shift+I, etc.
      if (
        (e.ctrlKey && (e.key === 'c' || e.key === 'C' || e.key === 'x' || e.key === 'X' || e.key === 'v' || e.key === 'V' || e.key === 'u' || e.key === 'U')) ||
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i')) ||
        e.key === 'F12' ||
        (e.ctrlKey && e.key === 's' || e.key === 'S')
      ) {
        e.preventDefault();
        return false;
      }
    };

    // Disable selection
    const disableSelection = (e) => {
      if (e.target.closest('input') || e.target.closest('textarea') || e.target.closest('button')) {
        // Allow selection in input fields, textareas, and buttons
        return;
      }
      e.preventDefault();
      return false;
    };

    // Add event listeners
    document.addEventListener('contextmenu', disableContextMenu);
    document.addEventListener('copy', disableCopyCutPaste);
    document.addEventListener('cut', disableCopyCutPaste);
    document.addEventListener('paste', disableCopyCutPaste);
    document.addEventListener('dragstart', disableDrag);
    document.addEventListener('selectstart', disableSelection);
    document.addEventListener('keydown', disableKeyboardShortcuts);

    // Cleanup event listeners on component unmount
    return () => {
      document.removeEventListener('contextmenu', disableContextMenu);
      document.removeEventListener('copy', disableCopyCutPaste);
      document.removeEventListener('cut', disableCopyCutPaste);
      document.removeEventListener('paste', disableCopyCutPaste);
      document.removeEventListener('dragstart', disableDrag);
      document.removeEventListener('selectstart', disableSelection);
      document.removeEventListener('keydown', disableKeyboardShortcuts);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🔒 Basic validation
    if (!form.username || !form.password || !form.inviteCode || !form.apiToken || !form.domain) {
      return alert("All fields are required");
    }

    setLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (data.message) {
        alert("✅ " + data.message);
        router.push("/login"); // 🔥 auto redirect
      } else if (data.error && data.error.toLowerCase().includes("invite")) {
        // Show custom popup for invalid invite code
        setShowInvitePopup(true);
      } else {
        alert("❌ " + data.error);
      }

    } catch (err) {
      alert("Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div 
      className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-3 sm:p-4 relative"
      onContextMenu={(e) => e.preventDefault()}
      onCopy={(e) => e.preventDefault()}
      onCut={(e) => e.preventDefault()}
      onPaste={(e) => e.preventDefault()}
      onDragStart={(e) => e.preventDefault()}
    >
      {/* subtle animated background ornament */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-gradient-to-r from-blue-200/30 to-purple-200/30 blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-gradient-to-r from-purple-200/30 to-pink-200/30 blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Security Watermark (Optional) */}
      <div className="fixed top-4 right-4 z-50 opacity-20 pointer-events-none">
        <div className="text-xs text-gray-500 font-mono">🔒 SECURE</div>
      </div>

      {/* Invite Code Popup Modal */}
      {showInvitePopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative max-w-md w-full bg-white rounded-2xl shadow-2xl transform transition-all animate-in zoom-in-95 duration-200">
            {/* Decorative gradient header */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 pointer-events-none"></div>
            
            <div className="relative p-6">
              {/* Icon */}
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
              </div>
              
              {/* Title */}
              <h3 className="text-xl font-bold text-center text-gray-800 mb-2">
                Invalid Invite Code
              </h3>
              
              {/* Message */}
              <p className="text-center text-gray-600 mb-6">
                The invite code you entered is invalid or has expired.
              </p>
              
              {/* Contact Info */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 mb-6 border border-blue-100">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <p className="text-sm font-semibold text-gray-800 mb-1">
                      Need a valid invite code?
                    </p>
                    <p className="text-sm text-gray-600">
                      Please contact the owner to get your unique invite code and start using our platform.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Contact Button */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowInvitePopup(false)}
                  className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all duration-200"
                >
                  Close
                </button>
                <a
                  href="https://t.me/thekunalsiingh?text=Hello%20bro%20🔥%20I%20want%20invite%20code%20please"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-medium transition-all duration-200 text-center"
                >
                  Contact Owner
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Register Form */}
      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-[90%] sm:max-w-md bg-white/80 backdrop-blur-xl p-5 sm:p-8 rounded-2xl sm:rounded-3xl shadow-2xl border border-white/40 space-y-4 sm:space-y-5 transform transition-all duration-300 hover:scale-[1.01] hover:shadow-3xl mb-8 sm:mb-12"
      >
        {/* subtle glass shine */}
        <div className="absolute inset-0 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-white/40 to-transparent pointer-events-none"></div>

        <div className="relative text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent">
            Create Account 🚀
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2">join us to get started</p>
        </div>

        <div className="relative space-y-4">
          {/* Username */}
          <div className="group">
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 ml-1">
              Username
            </label>
            <input
              placeholder="Username"
              className="w-full p-3 sm:p-3.5 text-sm sm:text-base rounded-xl sm:rounded-2xl bg-white/70 border border-gray-200 text-gray-800 placeholder-gray-400 outline-none focus:ring-4 focus:ring-blue-200/50 transition-all duration-300 group-hover:border-blue-300"
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              value={form.username}
            />
          </div>

          {/* Password with Show/Hide */}
          <div className="group">
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 ml-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                placeholder="••••••••"
                className="w-full p-3 sm:p-3.5 text-sm sm:text-base rounded-xl sm:rounded-2xl bg-white/70 border border-gray-200 text-gray-800 placeholder-gray-400 outline-none focus:ring-4 focus:ring-purple-200/50 transition-all duration-300 group-hover:border-purple-300 pr-16"
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                value={form.password}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs sm:text-sm font-medium text-purple-600 hover:text-purple-800 bg-white/60 px-2 py-1 rounded-lg backdrop-blur-sm transition-all duration-200 hover:bg-white/80"
              >
                {showPass ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Invite Code with Info Tooltip */}
          <div className="group">
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 ml-1">
              Invite Code
              <span className="ml-2 inline-block group/tooltip relative">
                <svg className="w-3.5 h-3.5 text-gray-400 hover:text-blue-500 cursor-help transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all duration-200 pointer-events-none">
                  Contact owner if you don't have one
                </span>
              </span>
            </label>
            <input
              placeholder="Enter your invite code"
              className="w-full p-3 sm:p-3.5 text-sm sm:text-base rounded-xl sm:rounded-2xl bg-white/70 border border-gray-200 text-gray-800 placeholder-gray-400 outline-none focus:ring-4 focus:ring-blue-200/50 transition-all duration-300 group-hover:border-blue-300"
              onChange={(e) => setForm({ ...form, inviteCode: e.target.value })}
              value={form.inviteCode}
            />
          </div>

          {/* API Token */}
          <div className="group">
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 ml-1">
              Shortener API Token
            </label>
            <input
              placeholder="Your API token"
              className="w-full p-3 sm:p-3.5 text-sm sm:text-base rounded-xl sm:rounded-2xl bg-white/70 border border-gray-200 text-gray-800 placeholder-gray-400 outline-none focus:ring-4 focus:ring-purple-200/50 transition-all duration-300 group-hover:border-purple-300"
              onChange={(e) => setForm({ ...form, apiToken: e.target.value })}
              value={form.apiToken}
            />
          </div>

          {/* Domain */}
          <div className="group">
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 ml-1">
              Domain
            </label>
            <input
              placeholder="https://SecureLinkNetwork.com"
              className="w-full p-3 sm:p-3.5 text-sm sm:text-base rounded-xl sm:rounded-2xl bg-white/70 border border-gray-200 text-gray-800 placeholder-gray-400 outline-none focus:ring-4 focus:ring-blue-200/50 transition-all duration-300 group-hover:border-blue-300"
              onChange={(e) => setForm({ ...form, domain: e.target.value })}
              value={form.domain}
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="relative w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold p-3 sm:p-3.5 text-sm sm:text-base rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transform transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 focus:ring-4 focus:ring-purple-300/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
        >
          <span className="relative z-10">
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Account...
              </span>
            ) : (
              "Register"
            )}
          </span>
          <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-white/20 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
        </button>

        {/* Login redirect */}
        <div className="relative text-center pt-2 border-t border-gray-200/50">
          <p className="text-xs sm:text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-blue-600 hover:text-blue-800 font-semibold transition-all duration-200 hover:underline hover:underline-offset-2"
            >
              Login
            </Link>
          </p>
        </div>

        {/* Security note */}
        <p className="text-[10px] sm:text-xs text-center text-gray-500">
          🔐 all information is encrypted & secure
        </p>
      </form>

      {/* Glass Floating Footer */}
      <footer className="fixed bottom-0 left-0 right-0 mx-auto w-full max-w-7xl px-3 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="backdrop-blur-xl bg-white/30 border border-white/40 rounded-2xl sm:rounded-3xl shadow-2xl px-4 sm:px-8 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4 text-xs sm:text-sm text-gray-700">
            {/* Copyright */}
            <div className="flex items-center space-x-2">
              <span className="font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                © 2024
              </span>
              <span>YourAppName</span>
            </div>

            {/* Links */}
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6">
              <Link 
                href="/about" 
                className="hover:text-blue-600 transition-colors duration-200 hover:underline underline-offset-2"
              >
                About
              </Link>
              <Link 
                href="/privacy" 
                className="hover:text-blue-600 transition-colors duration-200 hover:underline underline-offset-2"
              >
                Privacy
              </Link>
              <Link 
                href="/terms" 
                className="hover:text-blue-600 transition-colors duration-200 hover:underline underline-offset-2"
              >
                Terms
              </Link>
              <Link 
                href="/contact" 
                className="hover:text-blue-600 transition-colors duration-200 hover:underline underline-offset-2"
              >
                Contact
              </Link>
            </div>

            {/* Social Icons / Version */}
            <div className="flex items-center space-x-3">
              <span className="text-gray-500">v2.0.1</span>
              <div className="flex space-x-2">
                <a 
                  href="#" 
                  className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white/40 backdrop-blur-sm flex items-center justify-center hover:bg-white/60 transition-all duration-200 hover:scale-110"
                  aria-label="Twitter"
                >
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a 
                  href="#" 
                  className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white/40 backdrop-blur-sm flex items-center justify-center hover:bg-white/60 transition-all duration-200 hover:scale-110"
                  aria-label="GitHub"
                >
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}