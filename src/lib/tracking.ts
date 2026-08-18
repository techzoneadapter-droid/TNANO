export type TrackingEvent =
  | "PageView"
  | "ViewContent"
  | "Contact"
  | "Lead"
  | "ColorConsultLead"
  | "DealerLead"
  | "ClickPhone"
  | "ClickZalo"
  | "SelectPaintSolution"
  | "ViewPromotion";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export function trackEvent(event: TrackingEvent, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  window.dataLayer?.push({ event, ...params });
  window.fbq?.("trackCustom", event, params);
  window.gtag?.("event", event, params);
}
