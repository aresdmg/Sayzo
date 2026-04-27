import type { Metadata } from "next";
import type { CSSProperties } from "react";
import "./globals.css";
import { Provider } from "./provider";
import { cn } from "@/lib/utils";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Sayzo | The Modern Feedback Engine for Growing Brands",
  description: "Grow your business with Sayzo. Easily collect authentic customer reviews, prevent spam, and gain actionable insights from our powerful analytics dashboard.",
  keywords: ["customer feedback", "reviews", "saas", "business analytics", "reputation management"],
  openGraph: {
    title: "Sayzo | The Modern Feedback Engine",
    description: "Easily collect authentic customer reviews and gain actionable insights.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sayzo | The Modern Feedback Engine",
    description: "Easily collect authentic customer reviews and gain actionable insights.",
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const fontVars = {
    "--font-sans": "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    "--font-heading": "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  } as CSSProperties;

  return (
    <html lang="en" className={cn("h-full", "antialiased", "font-sans")} style={fontVars}>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <Provider>
          {children}
          <Toaster richColors position="bottom-left" />
        </Provider>
      </body>
    </html>
  );
}
