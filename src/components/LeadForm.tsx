"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { CheckCircle2, Loader2, Phone } from "lucide-react";
import { buildLeadPayload, getStoredUtm, submitLead, validateLeadPayload, type LeadPayload, type UtmData } from "@/lib/leadSubmit";
import { markReplayConversion, trackEvent } from "@/lib/tracking";

type FormKind = "color" | "dealer" | "contractor";

type LeadFormProps = {
  kind: FormKind;
  compact?: boolean;
  interest?: string;
};

const fieldClass = "input lead-form-control bg-white/95 md:min-h-[52px]";
const errorMessage = "Gửi thông tin chưa thành công. Vui lòng thử lại hoặc liên hệ hotline.";

const currentBusinessOptions = [
  "Cửa hàng vật liệu xây dựng",
  "Đại lý sơn",
  "Nhà thầu xây dựng",
  "Đội thợ sơn",
  "Nội thất/điện nước",
  "Chưa kinh doanh ngành này",
  "Khác",
];

const premisesOptions = ["Đã có", "Chưa có", "Đang chuẩn bị"];
const capitalOptions = ["Dưới 20 triệu", "20 - 50 triệu", "50 - 100 triệu", "Trên 100 triệu"];
const cooperationOptions = ["Đại lý", "Nhà phân phối", "Nhà thầu", "Mua số lượng lớn", "Chưa xác định"];
const orderTimingOptions = ["Ngay trong 7 ngày", "Trong 1 tháng", "Trong 1-3 tháng", "Chỉ đang tìm hiểu"];
const projectTypeOptions = ["Nhà dân/biệt thự", "Chung cư/nhà phố", "Nhà xưởng/kho", "Công trình thương mại", "Công trình khác"];
const projectScaleOptions = ["Dưới 500 m2", "500 - 1.000 m2", "1.000 - 3.000 m2", "Trên 3.000 m2", "Chưa xác định"];
const paintVolumeOptions = ["Dưới 20 thùng", "20 - 50 thùng", "50 - 100 thùng", "Trên 100 thùng", "Cần tư vấn"];
const deliveryTimingOptions = ["Trong 7 ngày", "Trong 1 tháng", "Theo tiến độ công trình", "Chỉ đang lấy báo giá"];
const consultationOptions = ["Mở đại lý/Nhà phân phối", "Sơn cho công trình", "Mua sơn", "Tư vấn sản phẩm", "Khác"];

function SelectField({ label, name, options, required = false }: { label: string; name: string; options: string[]; required?: boolean }) {
  return (
    <label>
      <span className="label">{label}{required ? " *" : ""}</span>
      <select className={fieldClass} name={name} required={required} defaultValue="">
        <option value="" disabled>Chọn thông tin</option>
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}

function trackLead(kind: FormKind) {
  if (typeof window === "undefined") return;
  const conversionEvent =
    kind === "dealer" ? "agency_form_submit" : kind === "contractor" ? "contractor_form_submit" : "consultation_form_submit";

  trackEvent(conversionEvent, { form_kind: kind === "color" ? "consultation" : kind });
  window.fbq?.("track", "Lead");
  window.gtag?.("event", "generate_lead", { form_kind: kind === "color" ? "consultation" : kind });
  window.gtag?.("event", "conversion", {
    send_to: "AW-18292573511/bwNMCIHv5-kcEMeKypJE",
    value: 1.0,
    currency: "VND",
  });
}

function validateRequiredFields(form: HTMLFormElement, payload: LeadPayload) {
  const nativeValid = form.reportValidity();
  if (!nativeValid) return "Vui lòng nhập đầy đủ các trường bắt buộc.";
  return validateLeadPayload(payload);
}

export function LeadForm({ kind, compact = false, interest = "" }: LeadFormProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const [error, setError] = useState("");
  const [utm, setUtm] = useState<UtmData>({
    utm_source: "",
    utm_campaign: "",
    utm_content: "",
    utm_medium: "",
    utm_term: "",
    landing_page: "",
  });
  const isSubmitting = useRef(false);

  useEffect(() => {
    setUtm(getStoredUtm());
  }, []);

  const isDealer = kind === "dealer";
  const isContractor = kind === "contractor";
  const gridClass = compact ? "grid gap-4" : "grid gap-4 sm:grid-cols-2 md:gap-5";
  const title = isDealer
    ? "Đăng ký mở đại lý"
    : isContractor
      ? "Nhận báo giá sơn công trình"
      : "Đăng ký nhận tư vấn";
  const submitText = isDealer
    ? "ĐĂNG KÝ MỞ ĐẠI LÝ"
    : isContractor
      ? "NHẬN BÁO GIÁ CÔNG TRÌNH"
      : "NHẬN TƯ VẤN";
  const description = isDealer
    ? "Điền thông tin kinh doanh để bộ phận phát triển thị trường TNANO tư vấn chính sách phù hợp."
    : isContractor
      ? "Gửi nhu cầu công trình để TNANO tư vấn dòng sơn, khối lượng và báo giá số lượng lớn."
      : "Để lại thông tin, đội ngũ TNANO sẽ liên hệ tư vấn sản phẩm, chính sách và giải pháp phù hợp với nhu cầu của bạn.";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (status === "loading" || isSubmitting.current) return;

    const form = event.currentTarget;
    const formData = new FormData(form);

    if (String(formData.get("companyWebsite") || "")) return;

    const freshUtm = getStoredUtm();
    setUtm(freshUtm);
    const payloadKind = kind === "color" ? "consultation" : kind;
    const payload = buildLeadPayload(payloadKind, formData, freshUtm, interest);
    const validationError = validateRequiredFields(form, payload);

    if (validationError) {
      setError(validationError);
      return;
    }

    setStatus("loading");
    isSubmitting.current = true;

    try {
      await submitLead(payload);
    } catch {
      setError(errorMessage);
      setStatus("idle");
      isSubmitting.current = false;
      return;
    }

    trackLead(kind);
    markReplayConversion();
    setStatus("success");
    isSubmitting.current = false;
    form.reset();
  }

  if (status === "success") {
    return (
      <div className="rounded-lg border border-gold/40 bg-white p-6 text-navy shadow-premium">
        <CheckCircle2 className="mb-4 h-12 w-12 text-emerald-600" />
        <h3 className="text-2xl font-black uppercase">Gửi thông tin thành công!</h3>
        <p className="mt-3 text-slate-700">TNANO sẽ liên hệ với bạn sớm.</p>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <a className="btn-primary" href="tel:02373586999" onClick={() => trackEvent("phone_click")}>
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
      data-tnano-lead-form={kind}
      className={`h-auto rounded-lg border border-white/20 bg-white p-5 text-navy shadow-premium md:p-7 ${isDealer || isContractor ? "self-start lg:self-center" : ""}`}
    >
      <h3 className="text-[clamp(18px,2.5vw,22px)] font-black uppercase leading-tight text-navy">{title}</h3>
      <p className="mt-1 text-sm leading-6 text-slate-600">{description}</p>
      <input className="hidden" name="companyWebsite" tabIndex={-1} autoComplete="off" />

      <div className={`mt-5 ${gridClass}`}>
        <label>
          <span className="label">Họ và tên *</span>
          <input className={fieldClass} type="text" name="name" required placeholder="Nguyễn Văn A" />
        </label>
        <label>
          <span className="label">Số điện thoại/Zalo *</span>
          <input className={fieldClass} type="tel" name="phone" required placeholder="0974 780 678" inputMode="tel" />
        </label>

        {isDealer ? (
          <>
            <label>
              <span className="label">Tỉnh/Thành phố *</span>
              <input className={fieldClass} type="text" name="province" required placeholder="Thanh Hóa, Hà Nội..." />
            </label>
            <label>
              <span className="label">Quận/Huyện</span>
              <input className={fieldClass} type="text" name="district" placeholder="Nhập quận/huyện" />
            </label>
            <SelectField label="Bạn hiện đang kinh doanh gì?" name="current_business" options={currentBusinessOptions} required />
            <SelectField label="Đã có cửa hàng/mặt bằng chưa?" name="has_store" options={premisesOptions} required />
            <SelectField label="Mức vốn dự kiến" name="capital" options={capitalOptions} required />
            <SelectField label="Hình thức hợp tác mong muốn" name="partnership_type" options={cooperationOptions} required />
            <div className={compact ? "" : "sm:col-span-2"}>
              <SelectField label="Thời gian dự kiến nhập hàng" name="purchase_timeline" options={orderTimingOptions} required />
            </div>
          </>
        ) : isContractor ? (
          <>
            <label>
              <span className="label">Tỉnh/Thành phố *</span>
              <input className={fieldClass} type="text" name="province" required placeholder="Địa điểm công trình" />
            </label>
            <SelectField label="Loại công trình" name="project_type" options={projectTypeOptions} />
            <SelectField label="Quy mô công trình" name="project_scale" options={projectScaleOptions} />
            <SelectField label="Khối lượng sơn dự kiến" name="paint_volume" options={paintVolumeOptions} />
            <SelectField label="Thời gian cần hàng" name="required_time" options={deliveryTimingOptions} />
            <label className={compact ? "" : "sm:col-span-2"}>
              <span className="label">Ghi chú</span>
              <textarea className={`${fieldClass} min-h-[110px] resize-y`} name="note" placeholder="Hạng mục cần sơn, diện tích, yêu cầu báo giá..." />
            </label>
          </>
        ) : (
          <>
            <div className={compact ? "" : "sm:col-span-2"}>
              <SelectField label="Nhu cầu cần tư vấn" name="interest" options={consultationOptions} required />
            </div>
            <label className={compact ? "" : "sm:col-span-2"}>
              <span className="label">Ghi chú</span>
              <textarea className={`${fieldClass} min-h-[110px] resize-y`} name="note" placeholder="Khu vực, sản phẩm quan tâm hoặc nhu cầu cụ thể..." />
            </label>
          </>
        )}
      </div>

      {error ? <p className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">{error}</p> : null}
      <button className="btn-primary mt-5 w-full md:min-h-[54px]" type="submit" disabled={status === "loading"}>
        {status === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        {status === "loading" ? "ĐANG GỬI..." : submitText}
      </button>
    </form>
  );
}
