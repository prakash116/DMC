import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { ThemeProvider } from "@/providers/theme-provider";
import { Header } from "@/components/layout/header";
import { TopTicker } from "@/components/layout/top-ticker";
import { Footer } from "@/components/layout/footer";
import { Preloader } from "@/components/preloader/preloader";
import { CarCursor } from "@/components/preloader/car-cursor";
import "./globals.css";

const display = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const sans = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Car Detailing & Ceramic Coating in Rohini, Delhi | The Detailing Monk",
  description:
    "Car detailing studio in Sector 11, Rohini: foam wash, interior dry cleaning, polishing, ceramic coating & PPF. Open Tue–Sun 10 AM–8 PM.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${display.variable} ${sans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <Preloader />
          <CarCursor />
          <TopTicker />
          <Header />
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
