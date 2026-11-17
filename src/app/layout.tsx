import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { MotionProvider } from "@/providers/motion-provider";
import { Header } from "@/components/layout/header";
import { TopTicker } from "@/components/layout/top-ticker";
import { Footer } from "@/components/layout/footer";
import { FloatingContact } from "@/components/layout/floating-contact";
import { IntroGate } from "@/components/preloader/intro-gate";
import "./globals.css";
import { RICH_QUERY } from "@/lib/rich-query";
import { business } from "@/lib/business";
import { localBusinessSchema } from "@/lib/schema";
import { OG_IMAGE, PAGE_META } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { Analytics } from "@/components/seo/analytics";

// decide before first paint whether the intro overlay is shown (desktop, first visit of the session)
const introScript = `try{if(sessionStorage.getItem("tdm-preloader-seen")!=="1"&&matchMedia(${JSON.stringify(RICH_QUERY)}).matches&&!(navigator.connection&&navigator.connection.saveData))document.documentElement.classList.add("tdm-intro")}catch(e){}`;

// capture the browser's install prompt as early as possible (it can fire before React hydrates); see install-app.tsx
const installScript = `addEventListener("beforeinstallprompt",function(e){e.preventDefault();window.__tdmInstallPrompt=e;dispatchEvent(new Event("tdm-installprompt"))});addEventListener("appinstalled",function(){window.__tdmInstallPrompt=null;window.__tdmInstalled=true;try{localStorage.setItem("tdm-app-installed","1")}catch(e){}dispatchEvent(new Event("tdm-installprompt"))})`;

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
  metadataBase: new URL(business.siteUrl),
  // defaults only; every page sets its own title, description, canonical and social tags via src/lib/seo.ts
  title: PAGE_META["/"].title,
  description: PAGE_META["/"].description,
  openGraph: { type: "website", siteName: business.name, locale: "en_IN", images: [OG_IMAGE] },
  // Google Search Console ownership (set GOOGLE_SITE_VERIFICATION in the environment)
  verification: { google: process.env.GOOGLE_SITE_VERIFICATION },
  applicationName: business.name,
  appleWebApp: { capable: true, title: "Detailing Monk", statusBarStyle: "default" },
};

export const viewport: Viewport = {
  themeColor: "#722f37",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${display.variable} ${sans.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: introScript }} suppressHydrationWarning />
        <script dangerouslySetInnerHTML={{ __html: installScript }} suppressHydrationWarning />
      </head>
      <body className="min-h-full flex flex-col">
        <MotionProvider>
          {/* static cover for a desktop first visit (CSS-gated by html.tdm-intro) until the intro code mounts */}
          <div className="tdm-cover fixed inset-0 z-100 bg-background" aria-hidden="true" />
          <IntroGate />
          <TopTicker />
          <Header />
          {children}
          <Footer />
          <FloatingContact />
          <JsonLd data={localBusinessSchema()} />
          <Analytics />
        </MotionProvider>
      </body>
    </html>
  );
}
