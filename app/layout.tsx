import type { Metadata } from "next";
<<<<<<< HEAD
import type { ReactNode } from "react";
import { cookies } from "next/headers";
import { Nunito, Outfit } from "next/font/google";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import ChatProvider from "@/components/chat/ChatProvider";
=======
import { Nunito, Outfit } from "next/font/google";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
>>>>>>> 9fbe6272ae14926655cd6155816221b0eb2ae799
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
  icons: {
    icon: "/favicon.ico",
  },
};

<<<<<<< HEAD
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
=======
const themeInitScript = `(function(){try{var t=localStorage.getItem('paws-theme');var d=window.matchMedia('(prefers-color-scheme: dark)').matches;if(t==='dark'||(t!=='light'&&d)){document.documentElement.classList.add('dark');document.documentElement.style.colorScheme='dark'}else{document.documentElement.style.colorScheme='light'}}catch(e){}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${nunito.variable} ${outfit.variable} h-full antialiased`}
      suppressHydrationWarning
      data-scroll-behavior="smooth"
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="flex min-h-full flex-col">
        <ThemeProvider>{children}</ThemeProvider>
>>>>>>> 9fbe6272ae14926655cd6155816221b0eb2ae799
      </body>
    </html>
  );
}
