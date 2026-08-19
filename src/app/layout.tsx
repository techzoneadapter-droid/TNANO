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
  title: "Sơn TNANO | Sơn Nội Ngoại Thất Cao Cấp - Tập Đoàn Quốc Tế Vạn Xuân",
  description:
    "Khám phá Sơn TNANO - giải pháp sơn nội ngoại thất, tư vấn màu sơn, dự toán công trình và cơ hội trở thành đại lý TNANO với nhiều chính sách hỗ trợ hấp dẫn.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Sơn TNANO | Sơn Nội Ngoại Thất Cao Cấp",
    description:
      "Sơn TNANO - Tập Đoàn Quốc Tế Vạn Xuân, tư vấn màu sơn, báo giá và chính sách đại lý.",
    url: siteUrl,
    siteName: "Sơn TNANO",
    images: [{ url: absoluteAssetUrl(DESIGN_ASSETS.sections.promotion.src), width: 1536, height: 1536 }],
    locale: "vi_VN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sơn TNANO | Sơn Nội Ngoại Thất Cao Cấp",
    description: "Tư vấn màu sơn, báo giá và đăng ký đại lý TNANO.",
    images: [absoluteAssetUrl(DESIGN_ASSETS.sections.promotion.src)],
  },
  robots: { index: true, follow: true },
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
