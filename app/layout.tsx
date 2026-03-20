import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

// ✅ Use Poppins (better for SaaS UI)
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap", // ⚡ performance boost
});

export const metadata: Metadata = {
  title: "SecureLink Network",
  description: "Secure and manage your monetized links with ease",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <body
        className={`${poppins.className} min-h-full flex flex-col bg-[#f6f8fc] text-gray-900 antialiased`}
      >
        {children}
      </body>
    </html>
  );
}