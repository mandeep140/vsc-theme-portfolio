import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mandeep Nagar — Full Stack Developer | Portfolio",
  icons: {
    icon: '/images/white_logo.png',
  },
  description: "A VS Code themed developer portfolio showcasing full-stack development projects, skills, and experience.",
  keywords: ["developer portfolio", "full stack developer", "VS Code theme", "Next.js", "TypeScript", "React"],
  authors: [{ name: "Mandeep Nagar" }],
  openGraph: {
    title: "Mandeep Nagar — Full Stack Developer",
    description: "VS Code themed developer portfolio",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${jetbrainsMono.variable} antialiased overflow-hidden`}
      >
        {children}
      </body>
    </html>
  );
}
