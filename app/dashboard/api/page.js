"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ApiPage() {
  const [user, setUser] = useState(null);
  const [siteUrl, setSiteUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [copiedField, setCopiedField] = useState(null);

  const router = useRouter();

  useEffect(() => {
    // ✅ check login
    const stored = localStorage.getItem("user");

    if (!stored) {
      router.push("/login"); // 🔒 redirect if not logged in
      return;
    }

    const parsedUser = JSON.parse(stored);

    // ✅ set domain
    if (typeof window !== "undefined") {
      setSiteUrl(window.location.origin);
    }

    // 🔥 fetch real user data
    fetch(`/api/user?username=${parsedUser.username}`)
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
        setLoading(false);
      })
      .catch(() => {
        localStorage.removeItem("user");
        router.push("/login");
      });
  }, []);

  const copyText = (text, field) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // 🚪 Logout
  const logout = async () => {
    await fetch("/api/logout", { method: "POST" });
    localStorage.removeItem("user");
    router.push("/login");
  };

  // 🔄 loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-gray-600">Loading API details...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const apiEndpoint = `${siteUrl}/api/public/shorten?api=${user.apiKey}&url=YOUR_URL`;

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
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 font-medium text-sm"
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
                className="block px-4 py-3 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 font-medium"
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

      {/* Main Content */}
      <main className="flex-1 relative z-10 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="w-full max-w-3xl">
          {/* Page Header */}
          <div className="text-center mb-8 sm:mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl shadow-lg mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent">
              API Documentation
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-2">
              Integrate our link shortening service into your applications
            </p>
          </div>

          {/* API Details Card */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl border border-white/60 p-6 sm:p-8">
            <div className="space-y-6">
              {/* API Key Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Your API Key
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    value={user.apiKey || ""}
                    readOnly
                    className="flex-1 p-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 font-mono text-sm outline-none"
                  />
                  <button
                    onClick={() => copyText(user.apiKey, 'apiKey')}
                    className="px-5 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-medium transition-all duration-200 hover:scale-105 active:scale-100 whitespace-nowrap"
                  >
                    {copiedField === 'apiKey' ? (
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
                <p className="text-xs text-gray-500 mt-2">
                  Keep your API key secure. Do not share it publicly.
                </p>
              </div>

              {/* Site Domain Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Your Site Domain
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    value={siteUrl}
                    readOnly
                    className="flex-1 p-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 font-mono text-sm outline-none"
                  />
                  <button
                    onClick={() => copyText(siteUrl, 'domain')}
                    className="px-5 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl font-medium transition-all duration-200 hover:scale-105 active:scale-100 whitespace-nowrap"
                  >
                    {copiedField === 'domain' ? (
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

              {/* API Endpoint Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  API Endpoint
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    value={apiEndpoint}
                    readOnly
                    className="flex-1 p-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 font-mono text-xs sm:text-sm outline-none break-all"
                  />
                  <button
                    onClick={() => copyText(apiEndpoint, 'endpoint')}
                    className="px-5 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl font-medium transition-all duration-200 hover:scale-105 active:scale-100 whitespace-nowrap"
                  >
                    {copiedField === 'endpoint' ? (
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
                <p className="text-xs text-gray-500 mt-2">
                  Replace YOUR_URL with the actual URL you want to shorten
                </p>
              </div>

              {/* Usage Example */}
              <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800 mb-2">Example Usage</p>
                    <code className="block text-xs bg-white p-3 rounded-lg border border-gray-200 font-mono text-gray-700 break-all">
                      curl "{apiEndpoint.replace('YOUR_URL', 'https://example.com')}"
                    </code>
                    <p className="text-xs text-gray-600 mt-2">
                      This will return a JSON response with your shortened URL
                    </p>
                  </div>
                </div>
              </div>

              {/* Info Box */}
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-sm font-semibold text-gray-800 mb-1">API Usage Notes</p>
                    <ul className="text-xs text-gray-600 space-y-1 list-disc list-inside">
                      <li>Use this API to shorten links programmatically from your applications</li>
                      <li>All requests must include your valid API key</li>
                      <li>Rate limit: 100 requests per minute for premium users</li>
                      <li>Response format: JSON with status and shortened URL</li>
                    </ul>
                  </div>
                </div>
              </div>
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