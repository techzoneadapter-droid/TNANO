"use client";

import { FormEvent, useEffect, useState } from "react";
import { CheckCircle2, Loader2, Phone } from "lucide-react";
import { trackEvent } from "@/lib/tracking";
import { isVietnamPhone } from "@/lib/validation";

type FormKind = "color" | "dealer";

type LeadFormProps = {
  kind: FormKind;
  compact?: boolean;
  interest?: string;
};

type UtmData = {
  utm_source: string;
  utm_campaign: string;
  utm_content: string;
  landing_page: string;
};

const commonInput = "input bg-white/95 md:min-h-[52px]";
const errorMessage = "Có lỗi xảy ra. Vui lòng gọi hotline 0237 358 6999 hoặc 0974 780 678.";

function getStoredUtm(): UtmData {
  if (typeof window === "undefined") {
    return { utm_source: "", utm_campaign: "", utm_content: "", landing_page: "" };
  }

  const params = new URLSearchParams(window.location.search);
  const existing = sessionStorage.getItem("tnano-utm");
  const parsed = existing ? (JSON.parse(existing) as Partial<UtmData>) : {};
  const data: UtmData = {
    utm_source: params.get("utm_source") || parsed.utm_source || "",
    utm_campaign: params.get("utm_campaign") || parsed.utm_campaign || "",
    utm_content: params.get("utm_content") || parsed.utm_content || "",
    landing_page: window.location.href,
  };

  sessionStorage.setItem("tnano-utm", JSON.stringify(data));
  return data;
}

function trackLead(kind: FormKind) {
  if (typeof window === "undefined") return;
  window.fbq?.("track", "Lead");
  window.fbq?.("trackCustom", kind === "dealer" ? "DealerLead" : "ColorConsultLead");
  trackEvent("Lead", { form: kind });
  trackEvent(kind === "dealer" ? "DealerLead" : "ColorConsultLead", { form: kind });
}

export function LeadForm({ kind, compact = false, interest = "" }: LeadFormProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const [error, setError] = useState("");
  const [utm, setUtm] = useState<UtmData>({
    utm_source: "",
    utm_campaign: "",
    utm_content: "",
    landing_page: "",
  });

  useEffect(() => {
    setUtm(getStoredUtm());
  }, []);

  const isDealer = kind === "dealer";
  const title = isDealer ? "Đăng ký trở thành đại lý" : "Đăng ký tư vấn miễn phí";
  const submitText = isDealer ? "ĐĂNG KÝ TRỞ THÀNH ĐẠI LÝ" : "NHẬN TƯ VẤN";
  const description = isDealer
    ? "Để lại thông tin, bộ phận kinh doanh TNANO sẽ liên hệ tư vấn chính sách đại lý."
    : "Chỉ cần để lại thông tin cơ bản, đội ngũ TNANO sẽ liên hệ tư vấn màu sắc và giải pháp sơn phù hợp với công trình.";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (status === "loading") return;

    const form = event.currentTarget;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    if (String(data.companyWebsite || "")) return;

    if (!isVietnamPhone(String(data.phone || ""))) {
      setError("Số điện thoại chưa đúng định dạng Việt Nam.");
      return;
    }

    const webhookUrl = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_WEBHOOK_URL;
    if (!webhookUrl) {
      setError(errorMessage);
      return;
    }

    setStatus("loading");

    const payload = {
      type: isDealer ? "dealer" : "color-consult",
      name: String(data.name || ""),
      phone: String(data.phone || ""),
      ...(isDealer
        ? { province: String(data.province || "") }
        : { area: String(data.area || ""), interest }),
      utm_source: utm.utm_source,
      utm_campaign: utm.utm_campaign,
      utm_content: utm.utm_content,
      landing_page: utm.landing_page || window.location.href,
      created_at: new Date().toISOString(),
    };

    const body = new URLSearchParams();
    Object.entries(payload).forEach(([key, value]) => body.append(key, String(value || "")));

    try {
      await fetch(webhookUrl, {
        method: "POST",
        body,
        mode: "no-cors",
      });
    } catch {
      setError(errorMessage);
      setStatus("idle");
      return;
    }

    trackLead(kind);
    setStatus("success");
    form.reset();
  }

  if (status === "success") {
    return (
      <div className="rounded-lg border border-gold/40 bg-white p-6 text-navy shadow-premium">
        <CheckCircle2 className="mb-4 h-12 w-12 text-emerald-600" />
        <h3 className="text-2xl font-black uppercase">Cảm ơn bạn đã đăng ký!</h3>
        <p className="mt-3 text-slate-700">TNANO sẽ liên hệ trong thời gian sớm nhất.</p>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <a className="btn-primary" href="tel:02373586999" onClick={() => trackEvent("ClickPhone")}>
            <Phone className="h-4 w-4" /> Gọi ngay: 0237 3586 999
          </a>
          <button className="btn-secondary" type="button" onClick={() => setStatus("idle")}>
            Quay lại form
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`h-auto rounded-2xl border border-white/20 bg-white p-5 shadow-premium md:p-7 lg:p-8 ${isDealer ? "self-start lg:self-center" : ""}`}
    >
      <h3 className="text-xl font-black uppercase text-navy">{title}</h3>
      <p className="mt-1 text-sm text-slate-600">{description}</p>
      <input className="hidden" name="companyWebsite" tabIndex={-1} autoComplete="off" />

      <div className={`mt-5 grid gap-4 md:gap-5 ${compact ? "" : "sm:grid-cols-2"}`}>
        <label>
          <span className="label">Họ và tên *</span>
          <input className={commonInput} name="name" required placeholder="Nguyễn Văn A" />
        </label>
        <label>
          <span className="label">Số điện thoại *</span>
          <input className={commonInput} name="phone" required placeholder="0974 780 678" inputMode="tel" />
        </label>

        {isDealer ? (
          <label className={compact ? "" : "sm:col-span-2"}>
            <span className="label">Tỉnh / Thành phố *</span>
            <input className={commonInput} name="province" required placeholder="Thanh Hóa, Hà Nội..." />
          </label>
        ) : (
          <label className={compact ? "" : "sm:col-span-2"}>
            <span className="label">Diện tích dự kiến *</span>
            <input className={commonInput} name="area" required placeholder="Ví dụ: 120 m2" />
          </label>
        )}
      </div>

      {error ? <p className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">{error}</p> : null}
      <button className="btn-primary mt-5 w-full md:min-h-[54px]" type="submit" disabled={status === "loading"}>
        {status === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        {status === "loading" ? "Đang gửi..." : submitText}
      </button>
    </form>
  );
}
