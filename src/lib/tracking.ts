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
  | "ViewPromotion"
  | "agency_form_submit"
  | "contractor_form_submit"
  | "consultation_form_submit"
  | "color_consult_form_submit"
  | "phone_click"
  | "zalo_click"
  | "dealer_cta_click"
  | "contractor_cta_click";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    gtag?: (...args: unknown[]) => void;
    dataLayer?: Record<string, unknown>[];
    TNANOReplay?: {
      markConversion?: () => Promise<void>;
    };
    __TNANOReplayStarted?: boolean;
  }
}

export function markReplayConversion() {
  if (typeof window === "undefined") return;
  void window.TNANOReplay?.markConversion?.();
}

export function trackEvent(event: TrackingEvent, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...params });
  window.fbq?.("trackCustom", event, params);
  window.gtag?.("event", event, params);
}
