import { cleanText, isVietnamPhone } from "@/lib/validation";

export type LeadFormKind = "dealer" | "contractor" | "consultation";

export type UtmData = {
  utm_source: string;
  utm_campaign: string;
  utm_content: string;
  utm_medium: string;
  utm_term: string;
  landing_page: string;
};

export type LeadPayload = {
  type: "dealer" | "contractor" | "consultation";
  name: string;
  phone: string;
  province?: string;
  district?: string;
  current_business?: string;
  has_store?: string;
  capital?: string;
  partnership_type?: string;
  purchase_timeline?: string;
  project_type?: string;
  project_scale?: string;
  paint_volume?: string;
  required_time?: string;
  note?: string;
  interest?: string;
  utm_source: string;
  utm_campaign: string;
  utm_content: string;
  utm_medium: string;
  utm_term: string;
  landing_page: string;
  created_at: string;
};

const utmKeys = ["utm_source", "utm_campaign", "utm_content", "utm_medium", "utm_term"] as const;

export const googleAppsScriptEndpoint =
  process.env.NEXT_PUBLIC_GOOGLE_SHEETS_WEBHOOK_URL ||
  "https://script.google.com/macros/s/AKfycbxthWCWce8QTfGk2Z-HnEqotnrbAhpzvkxodmVg6xCFAeiUy5m2i_ZiyVo-75KGLBg/exec";

export function getStoredUtm(): UtmData {
  if (typeof window === "undefined") {
    return {
      utm_source: "",
      utm_campaign: "",
      utm_content: "",
      utm_medium: "",
      utm_term: "",
      landing_page: "",
    };
  }

  const params = new URLSearchParams(window.location.search);
  const stored = sessionStorage.getItem("tnano-utm");
  let parsed: Partial<UtmData> = {};
  try {
    parsed = stored ? (JSON.parse(stored) as Partial<UtmData>) : {};
  } catch {
    sessionStorage.removeItem("tnano-utm");
  }
  const data: UtmData = {
    utm_source: "",
    utm_campaign: "",
    utm_content: "",
    utm_medium: "",
    utm_term: "",
    landing_page: window.location.href,
  };

  utmKeys.forEach((key) => {
    data[key] = params.get(key) || parsed[key] || "";
  });

  sessionStorage.setItem("tnano-utm", JSON.stringify(data));
  return data;
}

export function buildLeadPayload(kind: LeadFormKind, formData: FormData, utm: UtmData, interest = ""): LeadPayload {
  const payloadBase = {
    name: cleanText(formData.get("name"), 120),
    phone: cleanText(formData.get("phone"), 40),
    utm_source: utm.utm_source,
    utm_campaign: utm.utm_campaign,
    utm_content: utm.utm_content,
    utm_medium: utm.utm_medium,
    utm_term: utm.utm_term,
    landing_page: typeof window === "undefined" ? utm.landing_page : window.location.href,
    created_at: new Date().toISOString(),
  };

  if (kind === "dealer") {
    return {
      ...payloadBase,
      type: "dealer",
      province: cleanText(formData.get("province"), 120),
      district: cleanText(formData.get("district"), 120),
      current_business: cleanText(formData.get("current_business"), 160),
      has_store: cleanText(formData.get("has_store"), 80),
      capital: cleanText(formData.get("capital"), 80),
      partnership_type: cleanText(formData.get("partnership_type"), 120),
      purchase_timeline: cleanText(formData.get("purchase_timeline"), 120),
    };
  }

  if (kind === "contractor") {
    return {
      ...payloadBase,
      type: "contractor",
      province: cleanText(formData.get("province"), 120),
      project_type: cleanText(formData.get("project_type"), 120),
      project_scale: cleanText(formData.get("project_scale"), 120),
      paint_volume: cleanText(formData.get("paint_volume"), 120),
      required_time: cleanText(formData.get("required_time"), 120),
      note: cleanText(formData.get("note"), 700),
    };
  }

  return {
    ...payloadBase,
    type: "consultation",
    interest: cleanText(formData.get("interest") || interest, 160),
  };
}

export function validateLeadPayload(payload: LeadPayload) {
  if (!payload.name) return "Vui lòng nhập họ và tên.";
  if (!payload.phone) return "Vui lòng nhập số điện thoại/Zalo.";
  if (!isVietnamPhone(payload.phone)) return "Số điện thoại/Zalo chưa đúng định dạng Việt Nam.";
  return "";
}

export async function submitLead(payload: LeadPayload) {
  const response = await fetch(googleAppsScriptEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "text/plain;charset=utf-8",
    },
    body: JSON.stringify(payload),
  });

  const responseText = await response.text();
  const result = responseText ? (JSON.parse(responseText) as { ok?: boolean; error?: string }) : {};
  if (!response.ok || result.ok !== true) {
    throw new Error(result.error || `Submit failed with HTTP ${response.status}`);
  }

  return result;
}
