import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { ThemeProvider } from "@/providers/theme-provider";
import { MotionProvider } from "@/providers/motion-provider";
import { Header } from "@/components/layout/header";
import { TopTicker } from "@/components/layout/top-ticker";
import { Footer } from "@/components/layout/footer";
import { IntroGate } from "@/components/preloader/intro-gate";
import "./globals.css";
import { RICH_QUERY } from "@/lib/rich-query";

// decide before first paint whether the intro overlay is shown (desktop, first visit of the session)
const introScript = `try{if(sessionStorage.getItem("tdm-preloader-seen")!=="1"&&matchMedia(${JSON.stringify(RICH_QUERY)}).matches&&!(navigator.connection&&navigator.connection.saveData))document.documentElement.classList.add("tdm-intro")}catch(e){}`;

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
      <head>
        <script dangerouslySetInnerHTML={{ __html: introScript }} />
      </head>
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <MotionProvider>
          {/* static cover for a desktop first visit (CSS-gated by html.tdm-intro) until the intro code mounts */}
          <div className="tdm-cover fixed inset-0 z-100 bg-background" aria-hidden="true" />
          <IntroGate />
          <TopTicker />
          <Header />
          {children}
          <Footer />
          </MotionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
