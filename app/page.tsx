"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [footerVisible, setFooterVisible] = useState(true);

  // Check if footer should be visible (not overlapping content)
  useEffect(() => {
    const checkFooterVisibility = () => {
      const footer = document.querySelector('footer');
      const mainContent = document.querySelector('main');
      if (footer && mainContent) {
        const mainBottom = mainContent.getBoundingClientRect().bottom;
        const viewportHeight = window.innerHeight;
        setFooterVisible(mainBottom > viewportHeight - 100);
      }
    };
    
    checkFooterVisibility();
    window.addEventListener('resize', checkFooterVisibility);
    window.addEventListener('scroll', checkFooterVisibility);
    
    return () => {
      window.removeEventListener('resize', checkFooterVisibility);
      window.removeEventListener('scroll', checkFooterVisibility);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-r from-blue-200/30 to-purple-200/30 blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-gradient-to-r from-purple-200/30 to-pink-200/30 blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-r from-blue-100/20 to-purple-100/20 blur-3xl animate-ping-slow"></div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(2deg); }
        }
        
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 5px rgba(59,130,246,0.3), 0 0 10px rgba(139,92,246,0.2); }
          50% { box-shadow: 0 0 20px rgba(59,130,246,0.5), 0 0 30px rgba(139,92,246,0.3); }
        }
        
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        
        .float-animation {
          animation: float 6s ease-in-out infinite;
        }
        
        .glow-animation {
          animation: glow 3s ease-in-out infinite;
        }
        
        .shimmer-bg {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          background-size: 200% 100%;
        }
        
        .hover-glow:hover {
          animation: glow 1.5s ease-in-out infinite;
        }
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .slide-in {
          animation: slideIn 0.8s ease-out;
        }
      `}</style>

      {/* Navigation Bar */}
      <nav className="relative z-20 backdrop-blur-xl bg-white/30 border-b border-white/40 sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            {/* Logo with Animation */}
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg sm:rounded-xl flex items-center justify-center transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.102m3.172-3.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.102" />
                </svg>
              </div>
              <span className="text-base sm:text-xl font-bold bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent group-hover:from-blue-600 group-hover:to-purple-600 transition-all">
                SecureLink Network
              </span>
            </Link>

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center space-x-3 lg:space-x-4">
              <button
                onClick={() => router.push("/login")}
                className="px-4 lg:px-5 py-2 lg:py-2.5 text-blue-600 font-semibold hover:text-blue-700 transition-all duration-300 relative group text-sm lg:text-base"
              >
                <span>Login</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-300"></span>
              </button>
              <button
                onClick={() => router.push("/register")}
                className="px-5 lg:px-6 py-2 lg:py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg lg:rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 relative overflow-hidden group text-sm lg:text-base"
              >
                <span className="relative z-10">Sign Up</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute inset-0 shimmer-bg opacity-0 group-hover:opacity-100 animate-shimmer"></div>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-white/50 backdrop-blur-sm hover:bg-white/70 transition-all duration-300"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden mt-3 pt-3 border-t border-white/40 slide-in">
              <div className="flex flex-col space-y-2">
                <button
                  onClick={() => {
                    router.push("/login");
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full px-4 py-3 text-blue-600 font-semibold hover:bg-white/50 rounded-xl transition-all text-left"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    router.push("/register");
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all text-center"
                >
                  Sign Up
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-20">
          <div className="text-center max-w-5xl mx-auto">
            {/* Glass Card with Enhanced Animations */}
            <div className="relative backdrop-blur-xl bg-white/40 rounded-2xl sm:rounded-3xl border border-white/60 shadow-2xl p-6 sm:p-8 lg:p-12 xl:p-16 mb-8 sm:mb-12 float-animation hover:scale-[1.02] transition-all duration-500">
              {/* Decorative Elements */}
              <div className="absolute top-0 left-0 w-32 h-32 sm:w-40 sm:h-40 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-2xl animate-pulse"></div>
              <div className="absolute bottom-0 right-0 w-36 h-36 sm:w-48 sm:h-48 bg-gradient-to-tl from-purple-400/20 to-pink-400/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
              
              {/* Main Content */}
              <div className="relative">
                {/* Premium Badge with Animation */}
                <div className="inline-flex items-center px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-gradient-to-r from-blue-500/15 to-purple-500/15 border border-blue-200/50 mb-6 sm:mb-8 hover-glow cursor-pointer group">
                  <span className="relative">
                    <span className="absolute inset-0 animate-ping rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative text-[10px] sm:text-xs font-medium text-blue-700 group-hover:text-purple-700 transition-colors">
                      ✨ Premium Link Management
                    </span>
                  </span>
                </div>

                {/* Animated Title */}
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-7xl font-extrabold bg-gradient-to-r from-blue-700 via-purple-700 to-blue-700 bg-clip-text text-transparent mb-4 sm:mb-6 hover:from-blue-600 hover:via-purple-600 hover:to-blue-600 transition-all duration-500">
                  SecureLink Network
                </h1>

                {/* Description */}
                <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-gray-700 max-w-3xl mx-auto mb-8 sm:mb-10 leading-relaxed px-2">
                  The ultimate layer for your monetized links. Securely wrap external providers, bypass restrictions, and manage your traffic with a modern, glass-styled interface.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-5 justify-center items-center mb-8 sm:mb-10">
                  <button
                    onClick={() => router.push("/login")}
                    className="group relative w-full sm:w-auto px-6 sm:px-8 lg:px-10 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg sm:rounded-xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 active:translate-y-0 overflow-hidden text-sm sm:text-base"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      Login Now
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute inset-0 shimmer-bg opacity-0 group-hover:opacity-100 animate-shimmer"></div>
                  </button>
                  
                  <button
                    onClick={() => router.push("/register")}
                    className="group relative w-full sm:w-auto px-6 sm:px-8 lg:px-10 py-3 sm:py-4 bg-white/90 backdrop-blur-sm text-gray-700 rounded-lg sm:rounded-xl font-semibold border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 active:translate-y-0 hover:border-blue-300 hover:bg-white text-sm sm:text-base"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      Create Account
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </span>
                  </button>
                </div>

                {/* Owner Portal Link */}
                <div className="relative">
                  <div className="absolute inset-x-0 -bottom-2 h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent"></div>
                  <Link
                    href="/owner"
                    className="inline-flex items-center gap-2 text-xs sm:text-sm text-gray-600 hover:text-blue-600 transition-all duration-300 group relative"
                  >
                    <span className="relative">
                      <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                      Owner Portal
                    </span>
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-all duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Glass Floating Footer - Responsive for all devices */}
      <footer className="relative z-10 bg-white/80 backdrop-blur-xl border-t border-white/40 shadow-2xl mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5 lg:py-6">
          <div className="flex flex-col gap-4 sm:gap-0">
            {/* Main Footer Content */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
              {/* Copyright */}
              <div className="flex items-center space-x-2 group order-2 sm:order-1">
                <span className="font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent group-hover:from-blue-500 group-hover:to-purple-500 transition-all text-xs sm:text-sm">
                  © 2024
                </span>
                <span className="text-xs sm:text-sm text-gray-600 group-hover:text-blue-600 transition-colors">SecureLink Network</span>
              </div>

              {/* Links */}
              <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 order-1 sm:order-2">
                <Link href="/about" className="text-xs sm:text-sm text-gray-600 hover:text-blue-600 transition-all duration-200 hover:underline underline-offset-2 hover:scale-105 inline-block">
                  About
                </Link>
                <Link href="/privacy" className="text-xs sm:text-sm text-gray-600 hover:text-blue-600 transition-all duration-200 hover:underline underline-offset-2 hover:scale-105 inline-block">
                  Privacy
                </Link>
                <Link href="/terms" className="text-xs sm:text-sm text-gray-600 hover:text-blue-600 transition-all duration-200 hover:underline underline-offset-2 hover:scale-105 inline-block">
                  Terms
                </Link>
                <Link href="/contact" className="text-xs sm:text-sm text-gray-600 hover:text-blue-600 transition-all duration-200 hover:underline underline-offset-2 hover:scale-105 inline-block">
                  Contact
                </Link>
              </div>

              {/* Social Icons / Version */}
              <div className="flex items-center space-x-3 order-3">
                <span className="text-gray-400 text-[10px] sm:text-xs">v2.0.1</span>
                <div className="flex space-x-2">
                  <a href="#" className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/60 backdrop-blur-sm flex items-center justify-center hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 hover:text-white transition-all duration-300 hover:scale-110 group">
                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-600 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </a>
                  <a href="#" className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/60 backdrop-blur-sm flex items-center justify-center hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 hover:text-white transition-all duration-300 hover:scale-110 group">
                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-600 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
            
            {/* Mobile Divider Line */}
            <div className="block sm:hidden h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
          </div>
        </div>
      </footer>
    </div>
  );
}