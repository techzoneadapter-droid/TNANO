"use client";

import Image from "next/image";
import type { ImageProps } from "next/image";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  BadgeCheck,
  Brush,
  Building2,
  ChevronDown,
  ClipboardCheck,
  Factory,
  Gauge,
  Hammer,
  Headphones,
  Home,
  MapPin,
  Megaphone,
  Menu,
  PackageCheck,
  Palette,
  Phone,
  ShieldCheck,
  Sparkles,
  Store,
  Truck,
  Users,
  Waves,
  X,
} from "lucide-react";
import { LeadForm } from "@/components/LeadForm";
import { DESIGN_ASSETS, assetUrl, type ManagedAsset } from "@/config/designAssets";
import { PROJECTS } from "@/config/projects";
import { trackEvent, type TrackingEvent } from "@/lib/tracking";

const hotlines = ["0237 3586 999", "0974 780 678"];
const primaryPhoneHref = "tel:02373586999";
const zaloHref = "https://zalo.me/0974780678";
const formAnchorClass = "scroll-mt-20 lg:scroll-mt-28";
const factoryAddress = "266 Bà Triệu, Phường Hàm Rồng, Thanh Hóa";
const factoryMapHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(factoryAddress)}`;
const factoryMapEmbedSrc = `https://www.google.com/maps?q=${encodeURIComponent(factoryAddress)}&output=embed`;

const nav = [
  ["Trang chủ", "#home"],
  ["Đối tác", "#partner-fit"],
  ["Quyền lợi", "#dealer-benefits"],
  ["Nhà máy", "#factory"],
  ["Sản phẩm", "#products"],
  ["Công trình", "#projects"],
  ["Liên hệ", "#contact"],
];

const factoryImages = [
  { image: DESIGN_ASSETS.factory.gate, title: "Cổng nhà máy", tag: "Nhà máy" },
  { image: DESIGN_ASSETS.factory.overview, title: "Toàn cảnh nhà máy", tag: "Toàn cảnh" },
  { image: DESIGN_ASSETS.factory.warehouse, title: "Kho thành phẩm", tag: "Kho hàng" },
  { image: DESIGN_ASSETS.factory.mixing, title: "Máy trộn nguyên liệu", tag: "Sản xuất" },
  { image: DESIGN_ASSETS.factory.packing, title: "Đóng gói sản phẩm", tag: "Đóng gói" },
  { image: DESIGN_ASSETS.factory.qc1, title: "Kiểm tra chất lượng", tag: "QC" },
  { image: DESIGN_ASSETS.factory.shipping, title: "Xuất hàng", tag: "Giao hàng" },
];

const certificateImages = DESIGN_ASSETS.certificates.map((image, index) => ({
  image,
  title: "Giấy phép & chứng nhận TNANO",
  label: index === 0 ? "Giấy phép" : "Chứng nhận",
}));

const solutionCards = [
  {
    title: "Sơn chống thấm",
    image: DESIGN_ASSETS.solutions.waterproof,
    icon: Waves,
    description: "Giải pháp bảo vệ tường, mái và các khu vực thường xuyên chịu tác động của nước và thời tiết.",
    benefits: ["Hỗ trợ chống thấm", "Bảo vệ bề mặt", "Phù hợp nhiều khu vực công trình"],
    cta: "Nhận tư vấn chống thấm",
    interest: "waterproof",
  },
  {
    title: "Sơn ngoại thất",
    image: DESIGN_ASSETS.solutions.exterior,
    icon: Building2,
    description: "Giải pháp hoàn thiện và bảo vệ bề mặt ngoài trời, phù hợp nhà phố, biệt thự và nhiều loại công trình.",
    benefits: ["Bền màu", "Bảo vệ bề mặt", "Phù hợp môi trường ngoài trời"],
    cta: "Nhận tư vấn sơn ngoại thất",
    interest: "exterior",
  },
  {
    title: "Sơn nội thất",
    image: DESIGN_ASSETS.solutions.interior,
    icon: Palette,
    description: "Giải pháp hoàn thiện không gian bên trong với nhiều lựa chọn màu sắc và bề mặt.",
    benefits: ["Màu sắc đa dạng", "Không gian đẹp", "Dễ lựa chọn theo phong cách nhà"],
    cta: "Nhận tư vấn sơn nội thất",
    interest: "interior",
  },
];

const partnerFit = [
  ["Chủ cửa hàng vật liệu xây dựng", Store],
  ["Đại lý sơn muốn nhập thêm thương hiệu", Brush],
  ["Nhà phân phối khu vực", Truck],
  ["Chủ cửa hàng điện nước/nội thất", Home],
  ["Nhà thầu xây dựng", Hammer],
  ["Đội thợ sơn", Users],
  ["Người có mặt bằng muốn kinh doanh sơn", Building2],
  ["Đơn vị thi công/công trình mua số lượng lớn", ClipboardCheck],
];

const dealerBenefits = [
  ["Chiết khấu hấp dẫn", BadgeCheck],
  ["Chính sách nhập hàng ưu đãi", PackageCheck],
  ["Hỗ trợ marketing", Megaphone],
  ["Hỗ trợ bán hàng", Headphones],
  ["Hỗ trợ kỹ thuật", Gauge],
  ["Nguồn hàng ổn định", Factory],
  ["Đồng hành phát triển thị trường", Users],
];

const trustPoints = [
  ["Hình ảnh nhà máy, kho hàng và quy trình sản xuất thực tế", Factory],
  ["Kiểm soát chất lượng trước khi đóng gói và xuất kho", ShieldCheck],
  ["Năng lực cung ứng cho hệ thống đại lý, nhà thầu và công trình", Truck],
  ["Sản phẩm sơn nội thất, ngoại thất, chống thấm cho nhiều nhu cầu", Palette],
];

const reasons = [
  ["Công nghệ nano", Sparkles],
  ["Độ bền cao", ShieldCheck],
  ["Chống thấm", Waves],
  ["Chống rêu mốc", BadgeCheck],
  ["Bền màu", Palette],
  ["Dễ thi công", Brush],
  ["Đa dạng màu sắc", Palette],
  ["Đồng hành cùng nhà thầu & thợ sơn", Headphones],
];

const faq = [
  ["TNANO đang tuyển những nhóm đối tác nào?", "TNANO tiếp nhận đăng ký từ đại lý sơn, nhà phân phối, cửa hàng vật liệu xây dựng, nhà thầu, đội thợ sơn và đơn vị công trình cần mua sơn số lượng lớn."],
  ["Chính sách đại lý TNANO như thế nào?", "Chính sách phụ thuộc khu vực, mức nhập hàng và từng thời điểm. Vui lòng đăng ký để nhận bảng chính sách hiện hành từ bộ phận kinh doanh TNANO."],
  ["Chương trình chiết khấu 75% áp dụng ra sao?", "Điều kiện áp dụng theo chính sách TNANO từng thời kỳ. Đăng ký hoặc gọi hotline để nhận thông tin chính xác."],
  ["Chương trình mua 20 triệu nhận đến 50 triệu tiền hàng áp dụng điều kiện gì?", "Cơ cấu hàng hóa và điều kiện nhận ưu đãi được tư vấn trực tiếp theo chính sách hiện hành."],
  ["Nhà thầu muốn báo giá sơn công trình thì đăng ký ở đâu?", "Bạn chọn mục Nhà thầu/Công trình hoặc điền form báo giá công trình, TNANO sẽ liên hệ để ghi nhận hạng mục, khối lượng và thời gian cần hàng."],
  ["Mất bao lâu để được tư vấn liên hệ?", "TNANO sẽ liên hệ trong thời gian sớm nhất sau khi nhận thông tin đăng ký."],
];

function SectionTitle({ eyebrow, title, light = false }: { eyebrow: string; title: string; light?: boolean }) {
  return (
    <div className="mx-auto max-w-3xl px-1 text-center sm:px-0">
      <p className={`text-sm font-extrabold uppercase ${light ? "text-gold" : "text-royal"}`}>{eyebrow}</p>
      <h2 className={`mt-2 text-[26px] font-extrabold uppercase leading-[1.24] sm:text-[34px] md:text-[40px] lg:text-[46px] lg:leading-[1.16] ${light ? "text-white" : "text-navy"}`}>{title}</h2>
    </div>
  );
}

function ManagedImage({ asset, ...props }: Omit<ImageProps, "src"> & { asset: ManagedAsset }) {
  return <Image {...props} src={assetUrl(asset.src)} />;
}

function ProjectImage({ image, location }: { image: string; location: string }) {
  const [failed, setFailed] = useState(false);

  return (
    <article className="project-card relative shrink-0 overflow-hidden rounded-lg bg-navy shadow-premium">
      {failed ? (
        <div className="grid h-full min-h-[260px] place-items-center bg-[linear-gradient(135deg,#07183f,#0d3d91)] text-center text-gold">
          <div>
            <p className="text-3xl font-black">TNANO</p>
            <p className="mt-2 text-xs font-bold uppercase text-white/70">Ảnh công trình</p>
          </div>
        </div>
      ) : (
        <Image
          src={assetUrl(image)}
          alt={`Công trình thực tế TNANO tại ${location}`}
          fill
          sizes="(max-width: 768px) 82vw, (max-width: 1280px) 34vw, 25vw"
          className="object-cover"
          onError={() => setFailed(true)}
        />
      )}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy/95 via-navy/65 to-transparent px-5 pb-5 pt-16 text-white">
        <p className="text-[13px] font-extrabold uppercase text-gold drop-shadow md:text-sm">Công trình thực tế</p>
        <p className="mt-1 text-xl font-extrabold leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,.65)] md:text-2xl">{location}</p>
      </div>
    </article>
  );
}

function ProjectsCarousel() {
  const items = [...PROJECTS, ...PROJECTS];

  return (
    <div className="project-carousel mt-10 w-full max-w-full overflow-x-auto">
      <div className="project-track flex w-max gap-4 pr-4">
        {items.map((project, index) => (
          <ProjectImage key={`${project.image}-${index}`} image={project.image} location={project.location} />
        ))}
      </div>
    </div>
  );
}

export function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [lightbox, setLightbox] = useState<(typeof factoryImages)[number] | null>(null);
  const [certificateLightbox, setCertificateLightbox] = useState<(typeof certificateImages)[number] | null>(null);
  const [selectedInterest, setSelectedInterest] = useState("");

  useEffect(() => {
    if (!certificateLightbox) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setCertificateLightbox(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [certificateLightbox]);

  const scrollToTarget = (targetId: string, eventName?: TrackingEvent, event?: { preventDefault: () => void }) => {
    event?.preventDefault();
    const target = document.getElementById(targetId);
    if (!target) return;
    const alignTarget = (behavior: ScrollBehavior) => {
      const header = document.querySelector("header");
      const offset = (header?.getBoundingClientRect().height || 86) + 14;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: Math.max(top, 0), behavior });
    };
    alignTarget("smooth");
    window.setTimeout(() => alignTarget("auto"), 700);
    window.setTimeout(() => alignTarget("auto"), 1200);
    if (eventName) trackEvent(eventName, { target: targetId });
    setMenuOpen(false);
  };

  const openSolutionForm = (interest: string) => {
    setSelectedInterest(interest);
    scrollToTarget("consultation-form");
    trackEvent("SelectPaintSolution", { interest });
  };

  return (
    <main id="home" className="max-w-full overflow-hidden pb-24 md:pb-0">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[rgba(5,24,65,0.96)] shadow-[0_14px_34px_rgba(0,0,0,.22)] backdrop-blur-[2px]">
        <div className="section-shell flex h-14 items-center justify-between gap-3 lg:h-20 lg:gap-3 xl:gap-4">
          <a href="#home" className="flex min-w-0 shrink-0 items-center gap-3 lg:max-w-[190px] xl:max-w-none xl:min-w-[185px]">
            <ManagedImage asset={DESIGN_ASSETS.logo} alt="Logo Sơn TNANO" width={58} height={58} className="h-11 w-11 rounded-full object-cover ring-1 ring-gold/55 lg:h-14 lg:w-14" priority />
            <div className="hidden min-w-0 text-white sm:block">
              <p className="whitespace-nowrap text-lg font-extrabold leading-tight">Sơn TNANO</p>
              <p className="max-w-[180px] text-[11px] font-semibold leading-tight text-gold 2xl:max-w-none 2xl:text-xs">Tập Đoàn Quốc Tế Vạn Xuân</p>
            </div>
          </a>
          <a className="min-w-0 flex-1 truncate text-center text-[13px] font-black text-gold min-[390px]:text-sm lg:hidden" href={primaryPhoneHref} onClick={() => trackEvent("phone_click")}>
            <span className="hidden text-white/70 min-[390px]:inline">Hotline: </span>{hotlines[0]}
          </a>
          <nav className="hidden min-w-0 items-center gap-2 text-[11px] font-bold uppercase leading-none text-white lg:flex xl:gap-3 2xl:gap-5 2xl:text-[13px]">
            {nav.map(([label, href]) => (
              <a key={href} href={href} className="whitespace-nowrap border-b-2 border-transparent py-2 transition hover:border-gold hover:text-gold">{label}</a>
            ))}
          </nav>
          <div className="hidden shrink-0 items-center gap-2 lg:flex 2xl:gap-3">
            <a className="inline-flex h-11 min-w-[150px] items-center justify-center whitespace-nowrap rounded-lg bg-redcta px-3 text-[11px] font-black uppercase leading-none text-white shadow-lg shadow-redcta/25 transition hover:-translate-y-0.5 xl:h-12 xl:min-w-[174px] xl:px-4 xl:text-[13px]" href="#dealer-form" onClick={(event) => scrollToTarget("dealer-form", "dealer_cta_click", event)}>Đăng ký mở đại lý</a>
            <a className="inline-flex h-11 min-w-[142px] items-center justify-center whitespace-nowrap rounded-lg bg-gold px-3 text-[11px] font-black uppercase leading-none text-navy shadow-lg shadow-gold/20 transition hover:-translate-y-0.5 xl:h-12 xl:min-w-[162px] xl:px-4 xl:text-[13px]" href="#contractor-form" onClick={(event) => scrollToTarget("contractor-form", "contractor_cta_click", event)}>Báo giá công trình</a>
          </div>
          <button className="grid h-10 w-10 place-items-center rounded-lg border border-gold/35 bg-navy text-gold shadow-sm lg:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label="Mở menu">
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
        {menuOpen ? (
          <div className="section-shell grid gap-3 border-t border-white/10 bg-[rgba(5,24,65,0.98)] pb-5 pt-4 text-sm font-bold text-white lg:hidden">
            {nav.map(([label, href]) => <a key={href} href={href} onClick={() => setMenuOpen(false)}>{label}</a>)}
            <a className="btn-primary" href="#dealer-form" onClick={(event) => scrollToTarget("dealer-form", "dealer_cta_click", event)}>Đăng ký mở đại lý</a>
            <a className="btn-secondary" href="#contractor-form" onClick={(event) => scrollToTarget("contractor-form", "contractor_cta_click", event)}>Tôi là nhà thầu</a>
          </div>
        ) : null}
      </header>

      <section className="blue-panel relative max-w-full overflow-hidden pt-[72px] text-white md:pt-28">
        <ManagedImage asset={DESIGN_ASSETS.hero.background} alt="Toàn cảnh nhà máy Sơn TNANO" fill sizes="100vw" className="object-cover opacity-45" />
        <div className="absolute inset-0 bg-navy/72 md:bg-gradient-to-r md:from-navy md:via-navy/88 md:to-navy/32" />
        <div className="section-shell relative grid min-w-0 items-center gap-8 px-4 py-8 sm:px-6 md:gap-10 md:py-12 lg:min-h-[calc(100vh-7rem)] lg:grid-cols-[1.05fr_.95fr]">
          <motion.div className="min-w-0" initial={false} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
            <p className="hero-eyebrow mb-4 max-w-full text-[12px] font-extrabold uppercase leading-6 tracking-[0.08em] text-gold drop-shadow-[0_2px_8px_rgba(0,0,0,.65)] sm:flex sm:items-center sm:gap-3 sm:text-sm">
              <span className="mb-2 block h-px w-8 bg-gold sm:mb-0 sm:shrink-0" />
              <span className="block min-w-0">Nhà máy sơn tuyển đối tác kinh doanh toàn quốc</span>
            </p>
            <h1 className="hero-heading max-w-full break-words text-[clamp(27px,7.2vw,72px)] font-extrabold uppercase leading-[1.2] sm:text-[clamp(38px,4.6vw,72px)] lg:leading-[1.16]">
              Nhà máy Sơn <span className="gold-text">TNANO</span><br />
              tuyển đại lý &<br className="md:hidden" /> nhà phân phối toàn quốc
            </h1>
            <p className="hero-copy mt-5 max-w-3xl text-base font-bold leading-7 text-white/90 md:text-xl md:leading-8">
              Chính sách chiết khấu hấp dẫn - hỗ trợ kinh doanh - nguồn hàng ổn định - đồng hành phát triển thị trường.
            </p>
            <div className="mt-6 grid max-w-2xl gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-gold/45 bg-navy/70 p-4 shadow-glow backdrop-blur">
                <p className="text-sm font-black uppercase text-white/85">Ưu đãi hiện có</p>
                <p className="mt-1 text-[clamp(20px,5vw,24px)] font-black uppercase leading-tight text-gold">Chiết khấu lên đến 75%</p>
              </div>
              <div className="rounded-lg border border-gold/45 bg-navy/70 p-4 shadow-glow backdrop-blur">
                <p className="text-sm font-black uppercase text-white/85">Chính sách nhập hàng</p>
                <p className="hero-policy-offer mt-1 text-[clamp(20px,5vw,24px)] font-black uppercase leading-tight">
                  <span className="hero-policy-offer-line text-white">Mua đơn 20 triệu</span>{" "}
                  <span className="hero-policy-offer-line text-gold">Nhận đến 50 triệu</span>{" "}
                  <span className="hero-policy-offer-line text-white">Tiền hàng</span>
                </p>
              </div>
            </div>
            <p className="mt-3 max-w-2xl text-sm font-semibold leading-6 text-white/86">Ưu đãi áp dụng theo chính sách và điều kiện từng thời kỳ. Liên hệ TNANO để nhận bảng chính sách chi tiết.</p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <a className="btn-primary" href="#dealer-form" onClick={(event) => scrollToTarget("dealer-form", "dealer_cta_click", event)}>Đăng ký mở đại lý</a>
              <a className="btn-secondary" href="#contractor-form" onClick={(event) => scrollToTarget("contractor-form", "contractor_cta_click", event)}>Báo giá công trình</a>
            </div>
            <div className="mt-6 flex flex-wrap gap-3 text-lg font-black">
              {hotlines.map((phone) => <a key={phone} href={`tel:${phone.replace(/\s/g, "")}`} onClick={() => trackEvent("phone_click")} className="rounded-md bg-white/10 px-4 py-2">{phone}</a>)}
            </div>
          </motion.div>
          <motion.div className="min-w-0 justify-self-center" style={{ width: "min(100%, calc(100vw - 24px))" }} initial={false} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15 }}>
            <div className="relative mx-auto w-full max-w-full overflow-hidden rounded-lg border border-gold/35 bg-white/5 p-1.5 shadow-premium backdrop-blur md:p-3">
              <div className="relative aspect-square w-full rounded-md">
                <ManagedImage asset={DESIGN_ASSETS.hero.poster} alt="Ưu đãi Sơn TNANO chiết khấu lên đến 75%" fill sizes="(max-width: 1024px) 100vw, 46vw" className="object-contain" priority />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="bg-white py-5 shadow-premium">
        <div className="section-shell grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {trustPoints.map(([label, Icon]) => (
            <div key={label as string} className="flex items-center gap-3 rounded-md border border-slate-100 bg-slate-50 p-4">
              <Icon className="h-8 w-8 shrink-0 text-gold" />
              <span className="text-sm font-black uppercase leading-snug text-navy">{label as string}</span>
            </div>
          ))}
        </div>
      </section>

      <section id="partner-fit" className="py-16 md:py-20">
        <div className="section-shell">
          <SectionTitle eyebrow="Đối tác TNANO" title="Ai phù hợp trở thành đối tác TNANO?" />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {partnerFit.map(([label, Icon]) => (
              <article key={label as string} className="rounded-lg border border-slate-100 bg-white p-5 shadow-premium">
                <Icon className="h-9 w-9 text-gold" />
                <h3 className="mt-4 text-base font-black uppercase leading-snug text-navy">{label as string}</h3>
              </article>
            ))}
          </div>
          <div className="mt-8 text-center">
            <a className="btn-primary" href="#dealer-form" onClick={(event) => scrollToTarget("dealer-form", "dealer_cta_click", event)}>Đăng ký mở đại lý</a>
          </div>
        </div>
      </section>

      <section id="dealer-benefits" className="bg-white py-16 md:py-20">
        <div className="section-shell">
          <SectionTitle eyebrow="Quyền lợi đại lý/NPP" title="Trở thành đại lý TNANO - bạn được gì?" />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {dealerBenefits.map(([label, Icon]) => (
              <div key={label as string} className="rounded-lg border border-slate-100 bg-slate-50 p-5">
                <Icon className="h-9 w-9 text-gold" />
                <p className="mt-4 font-black uppercase leading-snug text-navy">{label as string}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="blue-panel py-16 text-white md:py-20">
        <div className="section-shell">
          <SectionTitle eyebrow="Chọn đúng nhu cầu" title="Bạn muốn hợp tác theo hướng nào?" light />
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <article className="rounded-lg border border-white/15 bg-white/10 p-6 shadow-premium backdrop-blur">
              <Store className="h-11 w-11 text-gold" />
              <h3 className="mt-5 text-[clamp(22px,4.5vw,24px)] font-black uppercase leading-tight text-white">Đại lý / Nhà phân phối</h3>
              <p className="mt-3 leading-7 text-white/95">Dành cho cá nhân, cửa hàng và doanh nghiệp muốn kinh doanh sản phẩm sơn TNANO.</p>
              <a className="btn-primary mt-6" href="#dealer-form" onClick={(event) => scrollToTarget("dealer-form", "dealer_cta_click", event)}>Đăng ký mở đại lý</a>
            </article>
            <article className="rounded-lg border border-white/15 bg-white/10 p-6 shadow-premium backdrop-blur">
              <Hammer className="h-11 w-11 text-gold" />
              <h3 className="mt-5 text-[clamp(22px,4.5vw,24px)] font-black uppercase leading-tight text-white">Nhà thầu / Công trình</h3>
              <p className="mt-3 leading-7 text-white/95">Dành cho nhà thầu, đội thi công và doanh nghiệp cần báo giá sơn số lượng lớn cho công trình.</p>
              <a className="btn-secondary mt-6" href="#contractor-form" onClick={(event) => scrollToTarget("contractor-form", "contractor_cta_click", event)}>Nhận báo giá công trình</a>
            </article>
          </div>
        </div>
      </section>

      <section id="about" className="py-16 md:py-20">
        <div className="section-shell grid gap-10 lg:grid-cols-2">
          <div>
            <SectionTitle eyebrow="Giới thiệu" title="Sơn TNANO - kiến tạo giá trị bền vững" />
            <p className="mt-6 text-lg leading-8 text-slate-700">
              Sơn TNANO thuộc Tập Đoàn Quốc Tế Vạn Xuân, tập trung phát triển các dòng sơn nước và giải pháp hoàn thiện bề mặt dành cho nhà ở, công trình, nhà thầu và hệ thống phân phối.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {["Đi khắp Việt Nam - Tô điểm cuộc sống", "Kết nối sản xuất - Chia sẻ lợi nhuận"].map((text) => (
                <div key={text} className="rounded-lg border border-gold/30 bg-white p-5 shadow-premium">
                  <p className="font-black uppercase leading-snug text-navy">{text}</p>
                </div>
              ))}
            </div>
          </div>
          <ManagedImage asset={DESIGN_ASSETS.sections.aboutValue} alt="Sơn TNANO kiến tạo giá trị bền vững" width={900} height={600} className="h-auto w-full rounded-lg object-cover shadow-premium" />
        </div>
      </section>

      <section id="factory" className="blue-panel py-16 md:py-20">
        <div className="section-shell">
          <SectionTitle eyebrow="Nhà máy" title="Năng lực sản xuất TNANO" light />
          <p className="mx-auto mt-4 max-w-3xl text-center text-base font-semibold leading-7 text-white md:text-lg md:leading-8">
            Hệ thống hình ảnh thực tế về nhà máy, kho hàng, đóng gói và xuất hàng giúp đối tác nhìn rõ năng lực cung ứng của TNANO.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {factoryImages.map((item) => (
              <button key={item.title} className="group relative aspect-[4/3] overflow-hidden rounded-lg text-left shadow-premium" onClick={() => setLightbox(item)}>
                <ManagedImage asset={item.image} alt={item.title} fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover transition duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/45 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <p className="text-xs font-extrabold uppercase text-gold">{item.tag}</p>
                  <h3 className="text-[clamp(18px,4.8vw,20px)] font-extrabold leading-tight text-white drop-shadow">{item.title}</h3>
                </div>
              </button>
            ))}
          </div>
          <div className="mt-10 grid gap-3 md:grid-cols-7">
            {["Nguyên liệu", "Phối trộn", "Kiểm tra chất lượng", "Chiết rót", "Đóng gói", "Nhập kho", "Xuất hàng"].map((step, i) => (
              <div key={step} className="rounded-md border border-white/20 bg-white/12 p-4 text-white backdrop-blur">
                <p className="font-black text-gold">0{i + 1}</p>
                <p className="text-sm font-bold leading-snug text-white md:text-[13px] xl:text-sm">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="certificates" className="bg-white py-16 md:py-20">
        <div className="section-shell">
          <SectionTitle eyebrow="Pháp lý & chất lượng" title="Giấy phép & chứng nhận" />
          <p className="mx-auto mt-4 max-w-3xl text-center text-base leading-7 text-slate-700 md:text-lg md:leading-8">
            Minh bạch pháp lý – khẳng định năng lực sản xuất và chất lượng thương hiệu TNANO.
          </p>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {certificateImages.map((item, index) => (
              <article key={item.image.src} className="rounded-lg border border-slate-200 bg-white p-4 shadow-premium">
                <button
                  type="button"
                  className="group block w-full text-left"
                  onClick={() => setCertificateLightbox(item)}
                  aria-label={`Xem lớn ${item.title} ${index + 1}`}
                >
                  <div className="relative aspect-[3/4] w-full overflow-hidden rounded-md bg-slate-50">
                    <ManagedImage
                      asset={item.image}
                      alt={`${item.title} ${index + 1}`}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-contain p-2 transition duration-300 group-hover:scale-[1.02]"
                    />
                  </div>
                  <div className="mt-4 flex items-center justify-between gap-3">
                    <p className="text-xs font-black uppercase tracking-wide text-royal">{item.label}</p>
                    <p className="text-sm font-extrabold uppercase leading-snug text-navy">{item.title}</p>
                  </div>
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16 md:py-20">
        <div className="section-shell grid items-center gap-10 lg:grid-cols-[.42fr_.58fr]">
          <div>
            <SectionTitle eyebrow="Video" title="Bên trong nhà máy TNANO" />
            <p className="mt-5 text-lg leading-8 text-slate-700">Một góc vận hành thực tế tại nhà máy TNANO, nơi sản phẩm được sản xuất, kiểm tra và sẵn sàng giao đến đại lý, nhà thầu và công trình.</p>
            <ul className="mt-5 grid gap-3 text-slate-700">
              <li className="flex gap-3"><BadgeCheck className="h-6 w-6 shrink-0 text-gold" /> Quy trình sản xuất được tổ chức rõ ràng.</li>
              <li className="flex gap-3"><BadgeCheck className="h-6 w-6 shrink-0 text-gold" /> Kiểm soát chất lượng trước khi xuất kho.</li>
              <li className="flex gap-3"><BadgeCheck className="h-6 w-6 shrink-0 text-gold" /> Năng lực cung ứng cho đại lý và công trình.</li>
            </ul>
          </div>
          <div className="aspect-video overflow-hidden rounded-lg bg-black shadow-premium">
            <video className="h-full w-full object-cover" controls playsInline preload="metadata" poster={assetUrl(DESIGN_ASSETS.factory.qc1.src)}>
              <source src={assetUrl(DESIGN_ASSETS.factory.video.src)} type="video/mp4" />
            </video>
          </div>
        </div>
      </section>

      <section id="products" className="py-16 md:py-20">
        <div className="section-shell">
          <SectionTitle eyebrow="Sản phẩm" title="Giải pháp sơn phù hợp cho từng nhu cầu" />
          <p className="mx-auto mt-4 max-w-3xl text-center text-lg text-slate-700">
            TNANO tư vấn giải pháp sơn cho cửa hàng vật liệu xây dựng, đại lý, nhà thầu và công trình cần nguồn sơn giá nhà máy.
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {solutionCards.map((solution) => {
              const Icon = solution.icon;
              return (
                <article key={solution.title} className="flex h-full flex-col rounded-lg border border-slate-100 bg-white p-5 pb-6 shadow-premium">
                  <div className="relative h-[210px] overflow-hidden rounded-lg bg-white p-1.5 lg:h-[225px]">
                    <ManagedImage asset={solution.image} alt={`${solution.title} TNANO`} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-contain" />
                  </div>
                  <div className="mt-5 flex items-center gap-3">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-md bg-navy text-gold">
                      <Icon className="h-6 w-6" />
                    </span>
                    <h3 className="text-[clamp(20px,4.8vw,22px)] font-extrabold uppercase leading-tight text-navy">{solution.title}</h3>
                  </div>
                  <p className="mt-3 leading-7 text-slate-700">{solution.description}</p>
                  <ul className="mt-4 space-y-2 pb-5">
                    {solution.benefits.map((benefit) => <li key={benefit} className="flex gap-2 text-sm leading-6 text-slate-600"><BadgeCheck className="h-5 w-5 shrink-0 text-gold" />{benefit}</li>)}
                  </ul>
                  <button className="btn-primary mt-auto min-h-[52px] w-full px-4 py-3.5 text-[13px] leading-snug sm:px-5 xl:text-sm" type="button" onClick={() => openSolutionForm(solution.interest)}>
                    {solution.cta}
                  </button>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="quality" className="bg-white py-16 md:py-20">
        <div className="section-shell">
          <SectionTitle eyebrow="Lý do chọn TNANO" title="Uy tín từ sản xuất - chất lượng từ sản phẩm" />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {reasons.map(([label, Icon]) => (
              <div key={label as string} className="rounded-lg border border-slate-100 bg-slate-50 p-5">
                <Icon className="h-9 w-9 text-gold" />
                <h3 className="mt-4 font-black uppercase leading-snug text-navy">{label as string}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="dealer" className="relative py-16 text-white md:py-20">
        <ManagedImage asset={DESIGN_ASSETS.sections.dealerBackground} alt="Kho hàng Sơn TNANO" fill className="object-cover" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,24,63,.65),rgba(2,8,23,.62))] md:bg-[linear-gradient(90deg,rgba(2,8,23,.68)_0%,rgba(7,24,63,.64)_42%,rgba(7,24,63,.54)_100%)]" />
        <div className="section-shell relative grid items-center gap-10 lg:grid-cols-[.9fr_1.1fr]">
          <div className="drop-shadow-[0_2px_12px_rgba(0,0,0,.55)]">
            <p className="text-sm font-black uppercase text-gold">Mở đại lý/NPP</p>
            <h2 className="mt-2 text-[clamp(26px,4.4vw,46px)] font-extrabold uppercase leading-[1.18] text-white">Đăng ký mở đại lý Sơn TNANO</h2>
            <p className="mt-4 font-semibold leading-7 text-white/95">Form được bổ sung thông tin kinh doanh, mặt bằng, mức vốn và thời gian nhập hàng để TNANO tư vấn đúng nhu cầu hơn.</p>
          </div>
          <div id="dealer-form" className={formAnchorClass}>
            <LeadForm kind="dealer" />
          </div>
        </div>
      </section>

      <section id="contractor" className="bg-white py-16 md:py-20">
        <div className="section-shell grid items-center gap-10 lg:grid-cols-[.85fr_1.15fr]">
          <div>
            <p className="text-sm font-black uppercase text-royal">Nhà thầu / công trình</p>
            <h2 className="mt-2 text-[clamp(26px,4.4vw,46px)] font-extrabold uppercase leading-[1.16] text-navy">Cần sơn số lượng lớn cho công trình?</h2>
            <p className="mt-4 text-lg leading-8 text-slate-700">Gửi thông tin công trình, quy mô, khối lượng sơn dự kiến và thời gian cần hàng để TNANO hỗ trợ báo giá phù hợp.</p>
            <ManagedImage asset={DESIGN_ASSETS.sections.delivery} alt="TNANO xuất hàng sơn cho đại lý và công trình" width={760} height={560} className="mt-8 h-auto w-full rounded-lg object-cover shadow-premium" />
          </div>
          <div id="contractor-form" className={formAnchorClass}>
            <LeadForm kind="contractor" />
          </div>
        </div>
      </section>

      <section id="color-consult" className="blue-panel py-16 md:py-20">
        <div className="section-shell grid items-center gap-10 lg:grid-cols-[.9fr_1.1fr]">
          <div className="text-white">
            <p className="text-sm font-black uppercase text-gold">Nhận tư vấn</p>
            <h2 className="mt-2 text-[clamp(26px,4.4vw,46px)] font-extrabold uppercase leading-[1.16]">Bạn cần tư vấn về sản phẩm Sơn TNANO?</h2>
            <p className="mt-4 text-base leading-7 text-white/92 md:text-lg md:leading-8">Để lại thông tin, đội ngũ TNANO sẽ liên hệ tư vấn sản phẩm, chính sách và giải pháp phù hợp với nhu cầu của bạn.</p>
            <ManagedImage asset={DESIGN_ASSETS.colorConsult} alt="Tư vấn sản phẩm Sơn TNANO" width={760} height={760} className="mt-8 h-auto w-full rounded-lg object-contain shadow-premium" />
          </div>
          <div id="consultation-form" className={formAnchorClass}>
            <LeadForm kind="color" interest={selectedInterest} />
          </div>
        </div>
      </section>

      <section className="bg-white py-16 md:py-20">
        <div className="section-shell grid items-center gap-8 lg:grid-cols-[.96fr_1.04fr] xl:gap-12">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-slate-50 shadow-premium sm:aspect-[16/11] lg:aspect-[1/1] xl:aspect-[16/15]">
            <ManagedImage asset={{ src: "/design/h%E1%BB%A3p%20t%C3%A1c.png" }} alt="Hợp tác kinh doanh cùng Sơn TNANO" fill sizes="(max-width: 1024px) 100vw, 48vw" className="object-contain object-center" unoptimized />
          </div>
          <div className="min-w-0">
            <p className="text-[13px] font-black uppercase leading-6 text-redcta sm:text-sm">ĐỒNG HÀNH • HỢP TÁC • PHÁT TRIỂN</p>
            <h2 className="mt-2 text-[clamp(28px,3.4vw,46px)] font-extrabold uppercase leading-[1.16] text-navy">
              HỢP TÁC KINH DOANH<br />CÙNG TNANO
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-700 md:text-lg md:leading-8">
              TNANO tìm kiếm đại lý, nhà phân phối và đối tác kinh doanh trên toàn quốc, cùng xây dựng thị trường, phát triển hệ thống phân phối và hướng tới hợp tác lâu dài.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-redcta/25 bg-red-50 p-4 shadow-sm md:p-5">
                <p className="text-xs font-black uppercase leading-5 text-redcta">CHÍNH SÁCH CHIẾT KHẤU</p>
                <p className="mt-2 text-[clamp(24px,7vw,40px)] font-black uppercase leading-[1.1] text-redcta">LÊN ĐẾN <span className="text-[1.18em]">75%</span></p>
                <p className="mt-3 text-sm leading-6 text-slate-700">Chính sách chiết khấu hấp dẫn dành cho đại lý và nhà phân phối theo từng chương trình áp dụng.</p>
              </div>
              <div className="rounded-lg border border-gold/45 bg-navy p-4 text-white shadow-glow md:p-5">
                <p className="text-xs font-black uppercase leading-5 text-gold">ƯU ĐÃI NHẬP HÀNG</p>
                <p className="mt-2 text-[clamp(19px,5.2vw,30px)] font-black uppercase leading-[1.24]">
                  MUA ĐƠN <span className="text-[1.1em] text-gold">20 TRIỆU</span><br />
                  NHẬN ĐẾN <span className="text-[1.1em] text-gold">50 TRIỆU</span><br />
                  TIỀN HÀNG
                </p>
                <p className="mt-3 text-sm leading-6 text-white/82">Chương trình hỗ trợ nhập hàng dành cho đối tác theo chính sách TNANO tại từng thời điểm.</p>
              </div>
            </div>
            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              {[
                ["HỢP TÁC BỀN VỮNG", BadgeCheck],
                ["LỢI NHUẬN HẤP DẪN", Gauge],
                ["HỖ TRỢ KINH DOANH", Headphones],
                ["ĐỒNG HÀNH DÀI LÂU", Users],
              ].map(([label, Icon]) => (
                <div key={label as string} className="flex min-h-11 items-center gap-2 rounded-md bg-slate-50 px-3 py-2 text-xs font-black uppercase leading-5 text-navy ring-1 ring-slate-100">
                  <Icon className="h-4 w-4 shrink-0 text-gold" />
                  <span>{label as string}</span>
                </div>
              ))}
            </div>
            <p className="mt-6 text-sm font-semibold leading-6 text-slate-600">Bạn đang kinh doanh VLXD, sơn hoặc muốn mở đại lý? Đăng ký để nhận chính sách hợp tác từ TNANO.</p>
            <a className="btn-primary mt-4 w-full sm:w-auto" href="#dealer-form" onClick={(event) => { scrollToTarget("dealer-form", "dealer_cta_click", event); window.history.replaceState(null, "", "#dealer-form"); trackEvent("ViewPromotion"); }}>ĐĂNG KÝ MỞ ĐẠI LÝ</a>
          </div>
        </div>
      </section>

      <section id="projects" className="py-16 md:py-20">
        <div className="section-shell">
          <SectionTitle eyebrow="Social proof" title="Đối tác & công trình thực tế" />
          <p className="mx-auto mt-4 max-w-3xl text-center text-lg text-slate-700">
            Hình ảnh công trình thực tế đang có trên website TNANO, ưu tiên ảnh thật thay vì testimonial tự tạo.
          </p>
          <ProjectsCarousel />
        </div>
      </section>

      <section className="bg-white py-16 md:py-20">
        <div className="section-shell grid items-center gap-10 lg:grid-cols-[.88fr_1.12fr]">
          <div>
            <p className="text-sm font-black uppercase text-royal">Giao hàng</p>
            <h2 className="mt-2 text-[clamp(30px,3vw,46px)] font-extrabold uppercase leading-[1.12] text-navy">Sẵn sàng đồng hành cùng mọi công trình</h2>
            <p className="mt-4 text-lg leading-8 text-slate-700">Kho hàng - sản xuất - vận chuyển được tổ chức nhằm đáp ứng nhu cầu của hệ thống đại lý, nhà thầu và khách hàng.</p>
            <p className="mt-4 text-xl font-black text-royal">Đi khắp Việt Nam - Tô điểm cuộc sống.</p>
          </div>
          <ManagedImage asset={DESIGN_ASSETS.sections.travelVietnam} alt="TNANO đi khắp Việt Nam" width={900} height={650} className="h-auto w-full rounded-lg object-cover shadow-premium" />
        </div>
      </section>

      <section id="faq" className="bg-white py-16 md:py-20">
        <div className="section-shell">
          <SectionTitle eyebrow="FAQ" title="Câu hỏi thường gặp" />
          <div className="mx-auto mt-10 max-w-4xl divide-y divide-slate-200 rounded-lg border border-slate-200 bg-white shadow-premium">
            {faq.map(([question, answer]) => (
              <details key={question} className="group p-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-black text-navy">
                  {question}<ChevronDown className="h-5 w-5 transition group-open:rotate-180" />
                </summary>
                <p className="mt-3 text-slate-600">{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="blue-panel py-16 text-white md:py-20">
        <div className="section-shell text-center">
          <h2 className="text-[26px] font-black uppercase leading-[1.24] sm:text-[34px] md:text-[40px] lg:text-[44px] lg:leading-[1.16]">Nhà máy Sơn TNANO tuyển đối tác toàn quốc</h2>
          <p className="mx-auto mt-3 max-w-3xl text-base leading-7 text-white/90 md:text-xl md:leading-8">Đăng ký mở đại lý/NPP hoặc nhận báo giá sơn công trình từ đội ngũ TNANO.</p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <a className="btn-primary" href="#dealer-form" onClick={(event) => scrollToTarget("dealer-form", "dealer_cta_click", event)}>Đăng ký mở đại lý</a>
            <a className="btn-secondary" href="#contractor-form" onClick={(event) => scrollToTarget("contractor-form", "contractor_cta_click", event)}>Nhận báo giá công trình</a>
          </div>
          <div className="mt-6 text-center font-black leading-tight text-gold">
            <p className="text-sm uppercase tracking-wide text-white/85 sm:hidden">Hotline</p>
            <div className="mt-2 grid gap-2 text-[24px] sm:block sm:text-[30px]">
              <a className="whitespace-nowrap" href={primaryPhoneHref} onClick={() => trackEvent("phone_click")}>{hotlines[0]}</a>
              <span className="hidden sm:inline"> | </span>
              <a className="whitespace-nowrap" href="tel:0974780678" onClick={() => trackEvent("phone_click")}>{hotlines[1]}</a>
            </div>
          </div>
        </div>
      </section>

      <section id="factory-map" className="bg-white py-16 md:py-20">
        <div className="section-shell">
          <SectionTitle eyebrow="Bản đồ" title="Địa chỉ nhà máy TNANO" />
          <div className="mt-10 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-premium">
            <iframe
              title="Địa chỉ nhà máy TNANO"
              src={factoryMapEmbedSrc}
              className="h-[320px] w-full border-0 md:h-[430px]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
          <div className="mt-5 flex flex-col gap-4 rounded-lg border border-slate-100 bg-slate-50 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="text-sm font-black uppercase text-royal">Địa chỉ nhà máy</p>
              <p className="mt-1 text-base font-bold leading-7 text-navy md:text-lg">{factoryAddress}</p>
            </div>
            <a className="btn-secondary shrink-0" href={factoryMapHref} target="_blank" rel="noreferrer">
              <MapPin className="h-4 w-4" /> Xem trên Google Maps
            </a>
          </div>
        </div>
      </section>

      <footer className="bg-navy py-12 text-white">
        <div className="section-shell grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <ManagedImage asset={DESIGN_ASSETS.logo} alt="Logo Sơn TNANO" width={80} height={80} className="rounded-full" />
            <h2 className="mt-4 text-2xl font-black">Sơn TNANO - Tập Đoàn Quốc Tế Vạn Xuân</h2>
            <div className="mt-5 grid gap-4 rounded-lg border border-white/10 bg-white/5 p-5">
              <div className="flex gap-3">
                <Building2 className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                <div>
                  <p className="font-extrabold uppercase text-white">Công ty Cổ phần Tập đoàn Quốc tế Vạn Xuân</p>
                  <p className="mt-1 text-sm text-white/70">MST: 0109113869</p>
                </div>
              </div>
              <div className="flex gap-3">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                <div>
                  <p className="text-xs font-extrabold uppercase text-white">Địa chỉ công ty/pháp nhân</p>
                  <p className="mt-1 text-sm leading-6 text-white/75">Số nhà 75 Ngách 205/91/11 đường Xuân Đỉnh,<br />Thành phố Hà Nội, Việt Nam</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Factory className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                <div>
                  <p className="text-xs font-extrabold uppercase text-white">Địa chỉ nhà máy</p>
                  <p className="mt-1 text-sm leading-6 text-white/75">{factoryAddress}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Phone className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                <div className="grid gap-1 text-sm font-semibold text-white/80">
                  <a href={primaryPhoneHref} onClick={() => trackEvent("phone_click")}>0237 3586 999</a>
                  <a href="tel:0974780678" onClick={() => trackEvent("phone_click")}>0974 780 678</a>
                </div>
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-black uppercase text-gold">Menu nhanh</h3>
            <div className="mt-3 grid gap-2 text-white/75">{nav.map(([label, href]) => <a key={href} href={href}>{label}</a>)}</div>
          </div>
          <div>
            <h3 className="font-black uppercase text-gold">Liên hệ</h3>
            <div className="mt-3 grid gap-2 text-white/75">
              <a href="#dealer-form" onClick={(event) => scrollToTarget("dealer-form", "dealer_cta_click", event)}>Đăng ký mở đại lý</a>
              <a href="#contractor-form" onClick={(event) => scrollToTarget("contractor-form", "contractor_cta_click", event)}>Báo giá công trình</a>
              <a href="#consultation-form" onClick={(event) => scrollToTarget("consultation-form", undefined, event)}>Nhận tư vấn</a>
            </div>
          </div>
        </div>
        <p className="section-shell mt-10 border-t border-white/10 pt-6 text-sm text-white/70">Copyright © 2026 Sơn TNANO. All rights reserved.</p>
      </footer>

      <div className="fixed right-4 top-1/2 z-40 hidden -translate-y-1/2 gap-3 md:grid">
        <a className="grid h-14 w-14 place-items-center rounded-full bg-white p-2 shadow-premium ring-1 ring-slate-200" href={zaloHref} onClick={() => trackEvent("zalo_click")} aria-label="Zalo">
          <ManagedImage asset={DESIGN_ASSETS.zaloLogo} alt="Zalo" width={44} height={44} className="rounded-full object-contain" />
        </a>
        <a className="rounded-full bg-redcta p-3 text-white shadow-premium" href={primaryPhoneHref} onClick={() => trackEvent("phone_click")} aria-label="Gọi điện"><Phone /></a>
        <a className="rounded-full bg-gold p-3 text-navy shadow-premium" href="#dealer-form" onClick={(event) => scrollToTarget("dealer-form", "dealer_cta_click", event)} aria-label="Đăng ký đại lý"><Store /></a>
      </div>
      <a className="fixed bottom-24 right-4 z-50 grid h-14 w-14 place-items-center rounded-full bg-white p-2 shadow-premium ring-1 ring-slate-200 md:hidden" href={zaloHref} onClick={() => trackEvent("zalo_click")} aria-label="Zalo">
        <ManagedImage asset={DESIGN_ASSETS.zaloLogo} alt="Zalo" width={44} height={44} className="rounded-full object-contain" />
      </a>
      <div className="fixed inset-x-0 bottom-0 z-50 grid w-full max-w-full grid-cols-3 gap-1.5 border-t border-white/20 bg-[rgba(5,24,65,0.98)] p-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] text-[11px] font-black uppercase leading-none text-white shadow-[0_-14px_34px_rgba(0,0,0,.24)] min-[390px]:text-xs md:hidden">
        <a className="flex h-14 items-center justify-center whitespace-nowrap rounded-lg bg-navy px-1.5 text-center ring-1 ring-white/15" href={primaryPhoneHref} onClick={() => trackEvent("phone_click")}>Gọi ngay</a>
        <a className="flex h-14 items-center justify-center whitespace-nowrap rounded-lg bg-redcta px-1.5 text-center text-white shadow-lg shadow-redcta/25" href="#contractor-form" onClick={(event) => scrollToTarget("contractor-form", "contractor_cta_click", event)}>Nhà thầu</a>
        <a className="flex h-14 items-center justify-center whitespace-nowrap rounded-lg bg-gold px-1.5 text-center text-navy shadow-lg shadow-gold/20" href="#dealer-form" onClick={(event) => scrollToTarget("dealer-form", "dealer_cta_click", event)}>Đại lý</a>
      </div>

      {lightbox ? (
        <button className="fixed inset-0 z-[60] bg-black/85 p-4" onClick={() => setLightbox(null)} aria-label="Đóng ảnh">
          <ManagedImage asset={lightbox.image} alt={lightbox.title} width={1500} height={950} className="mx-auto max-h-[92vh] w-auto rounded-lg object-contain" />
        </button>
      ) : null}

      {certificateLightbox ? (
        <div
          className="fixed inset-0 z-[65] grid place-items-center bg-black/86 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Xem giấy phép & chứng nhận TNANO"
          onClick={() => setCertificateLightbox(null)}
        >
          <div className="relative max-h-[92vh] w-full max-w-5xl" onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              className="absolute right-2 top-2 z-10 grid h-11 w-11 place-items-center rounded-full bg-navy text-white shadow-premium ring-1 ring-white/20"
              onClick={() => setCertificateLightbox(null)}
              aria-label="Đóng giấy phép & chứng nhận"
            >
              <X className="h-6 w-6" />
            </button>
            <ManagedImage
              asset={certificateLightbox.image}
              alt={certificateLightbox.title}
              width={1400}
              height={1900}
              className="mx-auto max-h-[92vh] w-auto rounded-lg bg-white object-contain p-2"
            />
          </div>
        </div>
      ) : null}

    </main>
  );
}
