import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="en" suppressHydrationWarning className="dark">
      <body className="antialiased bg-[#121214] text-[#cccccc] min-h-screen">
        {children}
      </body>
    </html>
  );
}
