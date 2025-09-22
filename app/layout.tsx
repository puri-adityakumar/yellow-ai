import { Metadata } from "next";
import { Toaster } from "sonner";

import { Navbar } from "@/components/custom/navbar";
import { ProjectProvider } from "@/components/custom/project-context";
import { ThemeProvider } from "@/components/custom/theme-provider";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://gemini.vercel.ai"),
  title: "Yellow AI Chat",
  description: "AI-powered chat application with project management capabilities.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ProjectProvider>
            <Toaster position="top-center" />
            <Navbar />
            {children}
          </ProjectProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
