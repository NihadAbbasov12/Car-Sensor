import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CarSensor MVP",
  description: "CarSensor scraping MVP with auth, API, and responsive car browser",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
