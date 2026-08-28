import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { TrackingScripts } from "@/components/TrackingScripts";
import { DESIGN_ASSETS } from "@/config/designAssets";

const inter = Inter({ subsets: ["latin", "vietnamese"], variable: "--font-inter" });

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://son-tnano.vn").replace(/\/+$/g, "");
const basePath = (process.env.NEXT_PUBLIC_BASE_PATH || "").replace(/\/+$/g, "");
const replayEndpoint = "https://tnano-session-replay.baovan-tnano.workers.dev";
const absoluteAssetUrl = (path: string) => `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Nhà Máy Sơn TNANO | Tuyển Đại Lý, Nhà Phân Phối & Báo Giá Công Trình",
  description:
    "Nhà máy Sơn TNANO tuyển đại lý và nhà phân phối trên toàn quốc. Chính sách hợp tác hấp dẫn, hỗ trợ kinh doanh và cung cấp sơn số lượng lớn cho nhà thầu, công trình.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Nhà Máy Sơn TNANO | Tuyển Đại Lý, Nhà Phân Phối & Báo Giá Công Trình",
    description:
      "Sơn TNANO tuyển đại lý, nhà phân phối và nhận báo giá sơn số lượng lớn cho nhà thầu, công trình.",
    url: siteUrl,
    siteName: "Sơn TNANO",
    images: [{ url: absoluteAssetUrl(DESIGN_ASSETS.sections.promotion.src), width: 1536, height: 1536 }],
    locale: "vi_VN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nhà Máy Sơn TNANO | Tuyển Đại Lý & Báo Giá Công Trình",
    description: "Tuyển đại lý, nhà phân phối và báo giá sơn công trình TNANO.",
    images: [absoluteAssetUrl(DESIGN_ASSETS.sections.promotion.src)],
  },
  robots: { index: true, follow: true },
  icons: {
    icon: DESIGN_ASSETS.logo.src,
    apple: DESIGN_ASSETS.logo.src,
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Sơn TNANO - Tập Đoàn Quốc Tế Vạn Xuân",
    url: siteUrl,
    logo: absoluteAssetUrl(DESIGN_ASSETS.logo.src),
    contactPoint: [
      { "@type": "ContactPoint", telephone: "02373586999", contactType: "sales", areaServed: "VN" },
      { "@type": "ContactPoint", telephone: "0974780678", contactType: "sales", areaServed: "VN" },
    ],
    sameAs: ["https://www.facebook.com/profile.php?id=61568411768631"],
  };

  return (
    <html lang="vi" className={inter.variable}>
      <body className="font-sans antialiased">
        <TrackingScripts />
        <script src={`${basePath}/tnano-replay.js`}></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var endpoint='${replayEndpoint}';var tries=0;function start(){if(window.__TNANOReplayStarted)return;if(window.TNANOReplay&&window.TNANOReplay.initReplay){window.__TNANOReplayStarted=true;window.TNANOReplay.initReplay({endpoint:endpoint}).catch(function(){window.__TNANOReplayStarted=false;});return;}if(++tries<120)setTimeout(start,250);}start();})();`,
          }}
        />
        <Script id="schema-organization" type="application/ld+json">
          {JSON.stringify(schema)}
        </Script>
        {children}
      </body>
    </html>
  );
}
