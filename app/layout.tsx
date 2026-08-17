import type { Metadata } from "next";
import type { ReactNode } from "react";
import { cookies } from "next/headers";
import { Nunito, Outfit } from "next/font/google";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import ChatProvider from "@/components/chat/ChatProvider";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Paws Safe | Connecting Pets with Loving Homes",
  description:
    "Adopt, foster, or rehome pets safely. Paws Safe makes pet rehoming, adoption, and fostering simple and trusted.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const cookieStore = await cookies();
  const themeCookie = cookieStore.get("paws-theme")?.value;
  const theme = themeCookie === "dark" || themeCookie === "light" ? themeCookie : "light";

  return (
    <html
      lang="en"
      className={`${nunito.variable} ${outfit.variable} h-full antialiased${theme === "dark" ? " dark" : ""}`}
      style={{ colorScheme: theme }}
      suppressHydrationWarning
      data-scroll-behavior="smooth"
    >
      <body className="flex min-h-full flex-col">
        <ThemeProvider initialTheme={theme}>
          <ChatProvider>{children}</ChatProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
