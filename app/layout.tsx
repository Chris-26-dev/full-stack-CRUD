import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import AuthProvider from "./sesssionProviders";
import { ThemeProvider } from "./theme-provider";
import {
  Lato,
  Montserrat,
  Open_Sans,
  Playfair,
  Poppins,
  Raleway,
  Roboto,
} from "next/font/google";
import { UserDialogForm } from "./user-dialog/user-dialog-form";

import ConvexProviderClient from "../components/convex-provider";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-poppins",
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-roboto",
});

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

const lato = Lato({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-lato",
});

const raleway = Raleway({
  subsets: ["latin"],
  variable: "--font-raleway",
});

const playfairDisplay = Playfair({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "Full-Stack CRUD User Management App",
  description: "Full Stack User Manager User App With React, Typescript, and Next Js", // Placeholder for description
  icons: {
    icon: "/logo-crud.svg",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${poppins.variable}
         ${roboto.variable} ${openSans.variable} 
         ${montserrat.variable} ${raleway.variable} 
         ${lato.variable} ${playfairDisplay.variable} 
          antialiased relative`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <ConvexProviderClient>
            {children}
            <UserDialogForm />
            <Toaster />
          </ConvexProviderClient>
        </ThemeProvider>
      </body>
    </html>
  );
}
