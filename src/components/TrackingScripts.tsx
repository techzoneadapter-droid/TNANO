"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";

function MetaPageViewTracker({ enabled }: { enabled: boolean }) {
  const pathname = usePathname();
  const isInitialPageView = useRef(true);

  useEffect(() => {
    if (!enabled) return;

    if (isInitialPageView.current) {
      isInitialPageView.current = false;
      return;
    }

    window.fbq?.("track", "PageView");
  }, [enabled, pathname]);

  return null;
}

function GaPageViewTracker({ enabled }: { enabled: boolean }) {
  const pathname = usePathname();
  const isInitialPageView = useRef(true);

  useEffect(() => {
    if (!enabled) return;

    if (isInitialPageView.current) {
      isInitialPageView.current = false;
      return;
    }

    window.gtag?.("event", "page_view", {
      page_path: window.location.pathname + window.location.search,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [enabled, pathname]);

  return null;
}

export function TrackingScripts() {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;

  return (
    <>
      <Script id="data-layer-init" strategy="beforeInteractive">
        {`window.dataLayer=window.dataLayer||[];`}
      </Script>
      {gtmId ? (
        <Script id="gtm-init" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');`}
        </Script>
      ) : null}
      {gaId ? (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
          <Script id="ga-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${gaId}');`}
          </Script>
        </>
      ) : null}
      {pixelId ? (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${pixelId}');fbq('track','PageView');`}
        </Script>
      ) : null}
      <MetaPageViewTracker enabled={Boolean(pixelId)} />
      <GaPageViewTracker enabled={Boolean(gaId)} />
    </>
  );
}
