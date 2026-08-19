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
    TNANOReplay?: {
      markConversion?: () => Promise<void>;
    };
  }
}

export function markReplayConversion() {
  if (typeof window === "undefined") return;
  void window.TNANOReplay?.markConversion?.();
}

export function trackEvent(event: TrackingEvent, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  window.dataLayer?.push({ event, ...params });
  window.fbq?.("trackCustom", event, params);
  window.gtag?.("event", event, params);
}
