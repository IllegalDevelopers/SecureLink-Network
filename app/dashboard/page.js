"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";

export default function Dashboard() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [longUrl, setLongUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // 🔐 Check login
  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      router.push("/login");
    } else {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // 🔥 Generate random ID (better than Date.now)
  const generateId = () => {
    return Math.random().toString(36).substring(2, 8);
  };

  // 🔗 Shorten Link
  const shortenLink = async () => {
    if (!longUrl) {
      alert("Enter URL");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/shorten", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          longUrl,
          domain: user.domain,
          apiToken: user.apiToken
        })
      });

      const data = await res.json();

      if (data.status === "success") {
        let externalShort = data.shortenedUrl || data.short;
        externalShort = externalShort.replace(/\\\//g, "/");

        const uniqueId = generateId();
        const customLink = `${window.location.origin}/start/${uniqueId}`;

        setShortUrl(customLink);

        await addDoc(collection(db, "links"), {
          userId: user.id,
          longUrl,
          externalLink: externalShort,
          customId: uniqueId,
          clicks: 0,
          createdAt: new Date()
        });

      } else {
        throw new Error(data.error || "Shortening failed");
      }

    } catch (err) {
      alert(err.message);
    }

    setLoading(false);
  };

  // 🚪 Logout
  const logout = async () => {
    await fetch("/api/logout", { method: "POST" });
    localStorage.removeItem("user");
    router.push("/login");
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-r from-blue-200/30 to-purple-200/30 blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-gradient-to-r from-purple-200/30 to-pink-200/30 blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Header Navigation */}
      <nav className="relative z-20 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <Link href="/dashboard" className="flex items-center space-x-3 group cursor-pointer">
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg transform transition-transform group-hover:scale-105">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.102m3.172-3.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.102" />
                </svg>
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent">
                  SecureLink Network
                </h1>
                <p className="text-xs text-gray-500 hidden sm:block">Premium Link Manager</p>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-1">
              <Link
                href="/dashboard"
                className="px-4 py-2 rounded-xl text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 font-medium text-sm"
              >
                Dashboard
              </Link>

              <Link
                href="/dashboard/my-links"
                className="px-4 py-2 rounded-xl text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 font-medium text-sm"
              >
                My Links
              </Link>
              <Link
                href="/dashboard/api"
                className="px-4 py-2 rounded-xl text-gray-600 hover:text-purple-600 hover:bg-purple-50 transition-all duration-200 font-medium text-sm"
              >
                API
              </Link>
              <Link
                href="/dashboard/settings"
                className="px-4 py-2 rounded-xl text-gray-600 hover:text-purple-600 hover:bg-purple-50 transition-all duration-200 font-medium text-sm"
              >
                Settings
              </Link>
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">
                    {user.username?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-gray-800">{user.username}</p>
                  <p className="text-xs text-gray-500">Premium</p>
                </div>
              </div>
              <button
                onClick={logout}
                className="p-2 rounded-xl hover:bg-red-50 text-gray-600 hover:text-red-600 transition-all duration-200"
                title="Logout"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-xl hover:bg-gray-100 transition-all"
              >
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200/50 animate-in slide-in-from-top-2 duration-200">
              <Link
                href="/dashboard/my-links"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 rounded-xl text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 font-medium"
              >
                My Links
              </Link>
              <Link
                href="/dashboard/api"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 rounded-xl text-gray-600 hover:text-purple-600 hover:bg-purple-50 transition-all duration-200 font-medium"
              >
                API
              </Link>
              <Link
                href="/dashboard/settings"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 rounded-xl text-gray-600 hover:text-purple-600 hover:bg-purple-50 transition-all duration-200 font-medium"
              >
                Settings
              </Link>
              <div className="px-4 pt-3 mt-2 border-t border-gray-200/50">
                <div className="flex items-center gap-3 py-2">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">{user.username?.charAt(0).toUpperCase()}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{user.username}</p>
                    <p className="text-xs text-gray-500">Premium Account</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content - Link Shortener */}
      <main className="flex-1 relative z-10 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="w-full max-w-3xl">
          {/* Welcome Message */}
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
              Welcome back, {user.username}! 👋
            </h2>
            <p className="text-sm sm:text-base text-gray-600">
              Shorten your long URLs instantly with our premium service
            </p>
          </div>

          {/* Shortener Card */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl border border-white/60 p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.102m3.172-3.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.102" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800">Shorten Your Link</h3>
                <p className="text-sm text-gray-500">Paste your long URL below</p>
              </div>
            </div>

            <div className="space-y-4">
              <input
                value={longUrl}
                onChange={(e) => setLongUrl(e.target.value)}
                placeholder="https://example.com/your-long-url-here"
                className="w-full p-3 sm:p-4 rounded-xl bg-white border-2 border-gray-200 text-gray-800 placeholder-gray-400 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all duration-300 text-sm sm:text-base"
                onKeyPress={(e) => e.key === 'Enter' && shortenLink()}
              />

              <button
                onClick={shortenLink}
                disabled={loading}
                className="relative w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 sm:py-4 rounded-xl shadow-lg hover:shadow-xl transform transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
              >
                <span className="flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.102m3.172-3.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.102" />
                      </svg>
                      Generate Short Link
                    </>
                  )}
                </span>
                <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
              </button>

              {/* Result */}
              {shortUrl && (
                <div className="mt-6 p-4 sm:p-5 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200 animate-in slide-in-from-bottom-2 duration-300">
                  <p className="text-sm font-semibold text-gray-700 mb-3">✨ Your shortened link is ready!</p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      readOnly
                      value={shortUrl}
                      className="flex-1 p-2.5 sm:p-3 rounded-lg bg-white border border-gray-200 text-gray-800 text-sm font-mono outline-none focus:ring-2 focus:ring-blue-200"
                    />
                    <button
                      onClick={copyToClipboard}
                      className="px-5 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-lg font-medium transition-all duration-200 hover:scale-105 active:scale-100 whitespace-nowrap text-sm"
                    >
                      {copied ? (
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Copied!
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          Copy
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 bg-white/80 backdrop-blur-xl border-t border-gray-200/50 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
            {/* Copyright */}
            <div className="flex items-center space-x-2">
              <span className="text-xs sm:text-sm text-gray-500">© 2024</span>
              <span className="text-xs sm:text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                SecureLink Network
              </span>
              <span className="text-xs text-gray-400">| Premium Link Management</span>
            </div>

            {/* Footer Links */}
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
              <Link href="/about" className="text-xs sm:text-sm text-gray-500 hover:text-blue-600 transition-colors duration-200">
                About
              </Link>
              <Link href="/privacy" className="text-xs sm:text-sm text-gray-500 hover:text-blue-600 transition-colors duration-200">
                Privacy
              </Link>
              <Link href="/terms" className="text-xs sm:text-sm text-gray-500 hover:text-blue-600 transition-colors duration-200">
                Terms
              </Link>
              <Link href="/contact" className="text-xs sm:text-sm text-gray-500 hover:text-blue-600 transition-colors duration-200">
                Contact
              </Link>
            </div>

            {/* Version */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">v2.0.1</span>
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-xs text-gray-400">Active</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}