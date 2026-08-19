"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";

const defaultMetaPixelId = "2112262986353013";
const defaultGaId = "G-YNKR6EDF5D";
const replayEndpoint = "https://tnano-session-replay.baovan-tnano.workers.dev";
const basePath = (process.env.NEXT_PUBLIC_BASE_PATH || "").replace(/\/+$/g, "");

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
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID || defaultMetaPixelId;
  const gaId = process.env.NEXT_PUBLIC_GA_ID || defaultGaId;
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;

  return (
    <>
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
      <Script src={`${basePath}/tnano-replay.js`} strategy="afterInteractive" />
      <Script id="tnano-replay-init" strategy="afterInteractive">
        {`(function(){var endpoint='${replayEndpoint}';var tries=0;function start(){if(window.__TNANOReplayStarted)return;if(window.TNANOReplay&&window.TNANOReplay.initReplay){window.__TNANOReplayStarted=true;window.TNANOReplay.initReplay({endpoint:endpoint}).catch(function(){window.__TNANOReplayStarted=false;});return;}if(++tries<120)setTimeout(start,250);}start();})();`}
      </Script>
      <MetaPageViewTracker enabled={Boolean(pixelId)} />
      <GaPageViewTracker enabled={Boolean(gaId)} />
    </>
  );
}
