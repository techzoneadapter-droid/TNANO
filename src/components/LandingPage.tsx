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
  Gauge,
  Headphones,
  MapPin,
  Menu,
  Palette,
  Phone,
  ShieldCheck,
  Sparkles,
  Waves,
  X,
} from "lucide-react";
import { LeadForm } from "@/components/LeadForm";
import { DESIGN_ASSETS, assetUrl, type ManagedAsset } from "@/config/designAssets";
import { PROJECTS } from "@/config/projects";
import { trackEvent } from "@/lib/tracking";

const hotlines = ["0237 3586 999", "0974 780 678"];

const nav = [
  ["Trang chủ", "#home"],
  ["Giới thiệu", "#about"],
  ["Sản phẩm", "#products"],
  ["Công nghệ", "#quality"],
  ["Nhà máy", "#factory"],
  ["Công trình", "#projects"],
  ["Chính sách đại lý", "#dealer"],
  ["Tin tức", "#faq"],
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

const solutionCards = [
  {
    title: "SƠN CHỐNG THẤM",
    image: DESIGN_ASSETS.solutions.waterproof,
    icon: Waves,
    description: "Giải pháp bảo vệ tường, mái và các khu vực thường xuyên chịu tác động của nước và thời tiết.",
    benefits: ["Hỗ trợ chống thấm", "Bảo vệ bề mặt", "Phù hợp nhiều khu vực công trình"],
    cta: "NHẬN TƯ VẤN CHỐNG THẤM",
    interest: "waterproof",
  },
  {
    title: "SƠN NGOẠI THẤT",
    image: DESIGN_ASSETS.solutions.exterior,
    icon: Building2,
    description: "Giải pháp hoàn thiện và bảo vệ bề mặt ngoài trời, phù hợp nhà phố, biệt thự và nhiều loại công trình.",
    benefits: ["Bền màu", "Bảo vệ bề mặt", "Phù hợp môi trường ngoài trời"],
    cta: "NHẬN TƯ VẤN SƠN NGOẠI THẤT",
    interest: "exterior",
  },
  {
    title: "SƠN NỘI THẤT",
    image: DESIGN_ASSETS.solutions.interior,
    icon: Palette,
    description: "Giải pháp hoàn thiện không gian bên trong với nhiều lựa chọn màu sắc và bề mặt.",
    benefits: ["Màu sắc đa dạng", "Không gian đẹp", "Dễ lựa chọn theo phong cách nhà"],
    cta: "NHẬN TƯ VẤN SƠN NỘI THẤT",
    interest: "interior",
  },
];

const usp = [
  ["Bảo vệ vượt trội", ShieldCheck],
  ["Độ bền vượt thời gian", BadgeCheck],
  ["Chống thấm tối ưu", Waves],
  ["An toàn - thân thiện", Sparkles],
  ["Công nghệ nano hiện đại", Gauge],
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
  ["Tôi muốn tư vấn màu sơn thì làm thế nào?", "Bạn để lại thông tin ở form tư vấn màu sơn hoặc gọi hotline. TNANO sẽ liên hệ để ghi nhận nhu cầu công trình."],
  ["TNANO có tư vấn số lượng sơn theo diện tích không?", "Có. Bạn cung cấp diện tích dự kiến và hạng mục cần sơn để đội tư vấn hỗ trợ tính toán phù hợp."],
  ["Tôi muốn nhận báo giá thì đăng ký ở đâu?", "Bạn có thể bấm Nhận báo giá tại khu sản phẩm hoặc gửi form tư vấn ở trang này."],
  ["Chính sách đại lý TNANO như thế nào?", "Chính sách phụ thuộc khu vực, mức nhập hàng và từng thời điểm. Vui lòng đăng ký đại lý để nhận bảng chính sách hiện hành."],
  ["Chương trình chiết khấu 75% áp dụng ra sao?", "Điều kiện áp dụng theo chính sách TNANO từng thời kỳ. Đăng ký hoặc gọi hotline để nhận thông tin chính xác."],
  ["Chương trình mua 20 triệu nhận 50 triệu tiền hàng áp dụng điều kiện gì?", "Cơ cấu hàng hóa và điều kiện nhận ưu đãi được tư vấn trực tiếp theo chính sách hiện hành."],
  ["TNANO có hỗ trợ nhà thầu và thợ sơn không?", "TNANO có định hướng đồng hành cùng nhà thầu, thợ sơn và hệ thống phân phối qua tư vấn sản phẩm, bán hàng và marketing."],
  ["Mất bao lâu để được bộ phận tư vấn liên hệ?", "TNANO sẽ liên hệ trong thời gian sớm nhất sau khi nhận thông tin đăng ký."],
];

function SectionTitle({ eyebrow, title, light = false }: { eyebrow: string; title: string; light?: boolean }) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <p className={`text-sm font-extrabold uppercase ${light ? "text-gold" : "text-royal"}`}>{eyebrow}</p>
      <h2 className={`mt-2 text-[clamp(32px,3vw,48px)] font-extrabold uppercase leading-[1.12] ${light ? "text-white" : "text-navy"}`}>{title}</h2>
    </div>
  );
}

function ManagedImage({ asset, ...props }: Omit<ImageProps, "src"> & { asset: ManagedAsset }) {
  return (
    <Image
      {...props}
      src={assetUrl(asset.src)}
    />
  );
}

function ProjectImage({ image, location }: { image: string; location: string }) {
  const [failed, setFailed] = useState(false);

  return (
    <article className="project-card relative shrink-0 overflow-hidden rounded-xl bg-navy shadow-premium">
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
    <div className="project-carousel mt-10 overflow-x-auto">
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
  const [popupOpen, setPopupOpen] = useState(false);
  const [selectedInterest, setSelectedInterest] = useState("");

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > window.innerHeight * 0.55 && !sessionStorage.getItem("tnano-popup")) {
        sessionStorage.setItem("tnano-popup", "1");
        setTimeout(() => setPopupOpen(true), 700);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const openSolutionForm = (interest: string) => {
    setSelectedInterest(interest);
    scrollToTarget("color-form");
    trackEvent("SelectPaintSolution", { interest });
  };

  const scrollToTarget = (targetId: string, event?: { preventDefault: () => void }) => {
    event?.preventDefault();
    const target = document.getElementById(targetId);
    if (!target) return;
    const header = document.querySelector("header");
    const offset = (header?.getBoundingClientRect().height || 86) + 14;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top: Math.max(top, 0), behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <main id="home" className="max-w-full overflow-hidden">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[rgba(5,24,65,0.96)] shadow-[0_14px_34px_rgba(0,0,0,.22)] backdrop-blur-[2px]">
        <div className="section-shell flex h-14 items-center justify-between gap-3 lg:h-20 lg:gap-4">
          <a href="#home" className="flex min-w-0 shrink-0 items-center gap-3 xl:min-w-[210px] 2xl:min-w-[245px]">
            <ManagedImage asset={DESIGN_ASSETS.logo} alt="Logo TNANO" width={58} height={58} className="h-11 w-11 rounded-full object-cover ring-1 ring-gold/55 lg:h-14 lg:w-14" priority />
            <div className="hidden min-w-0 text-white sm:block">
              <p className="whitespace-nowrap text-lg font-extrabold leading-tight">Sơn TNANO</p>
              <p className="max-w-[180px] text-[11px] font-semibold leading-tight text-gold 2xl:max-w-none 2xl:text-xs">Tập Đoàn Quốc Tế Vạn Xuân</p>
            </div>
          </a>
          <a className="min-w-0 flex-1 truncate text-center text-[13px] font-black text-gold min-[390px]:text-sm lg:hidden" href="tel:02373586999" onClick={() => trackEvent("ClickPhone")}>
            <span className="hidden text-white/70 min-[390px]:inline">Hotline: </span>0237 3586 999
          </a>
          <nav className="hidden items-center gap-3 text-[12px] font-bold uppercase text-white lg:flex 2xl:gap-5 2xl:text-[13px]">
            {nav.map(([label, href]) => (
              <a key={href} href={href} className="border-b-2 border-transparent py-2 transition hover:border-gold hover:text-gold">{label}</a>
            ))}
          </nav>
          <div className="hidden items-center gap-2 xl:flex 2xl:gap-3">
            <a className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white shadow-sm transition hover:border-gold/50" href="tel:02373586999" onClick={() => trackEvent("ClickPhone")}>
              <span className="grid h-9 w-9 place-items-center rounded-md bg-gold text-navy">
                <Phone className="h-4 w-4" />
              </span>
              <span className="leading-tight">
                <span className="block text-[10px] font-black uppercase tracking-wide text-white/70">Hotline</span>
                <span className="block whitespace-nowrap text-sm font-black text-gold">{hotlines[0]}</span>
              </span>
            </a>
            <a className="inline-flex h-12 items-center justify-center whitespace-nowrap rounded-lg bg-redcta px-5 text-[13px] font-black uppercase text-white shadow-lg shadow-redcta/25 transition hover:-translate-y-0.5 hover:bg-red-600" href="#color-form" onClick={(event) => scrollToTarget("color-form", event)}>Nhận tư vấn</a>
            <a className="inline-flex h-12 items-center justify-center whitespace-nowrap rounded-lg bg-gold px-5 text-[13px] font-black uppercase text-navy shadow-lg shadow-gold/20 transition hover:-translate-y-0.5 hover:bg-yellow-300" href="#dealer-form" onClick={(event) => scrollToTarget("dealer-form", event)}>Đăng ký đại lý</a>
          </div>
          <button className="grid h-10 w-10 place-items-center rounded-lg border border-gold/35 bg-navy text-gold shadow-sm lg:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label="Mở menu">
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
        {menuOpen ? (
          <div className="section-shell grid gap-3 border-t border-white/10 bg-[rgba(5,24,65,0.98)] pb-5 pt-4 text-sm font-bold text-white lg:hidden">
            {nav.map(([label, href]) => <a key={href} href={href} onClick={() => setMenuOpen(false)}>{label}</a>)}
            <a className="btn-primary" href="#color-form" onClick={(event) => scrollToTarget("color-form", event)}>Nhận tư vấn</a>
            <a className="btn-secondary" href="#dealer-form" onClick={(event) => scrollToTarget("dealer-form", event)}>Đăng ký đại lý</a>
          </div>
        ) : null}
      </header>

      <section className="blue-panel relative max-w-full overflow-hidden pt-[72px] text-white md:min-h-screen md:pt-28">
        <ManagedImage asset={DESIGN_ASSETS.hero.background} alt="MC giới thiệu nhà máy Sơn TNANO" fill priority className="object-cover opacity-34" />
        <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/86 to-navy/35" />
        <div className="section-shell relative grid min-w-0 items-center gap-5 px-3 py-4 sm:px-6 md:gap-10 md:py-12 lg:min-h-[calc(100vh-7rem)] lg:grid-cols-[1.05fr_.95fr]">
          <motion.div className="order-2 min-w-0 lg:order-1" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
            <p className="mb-4 inline-flex rounded-md border border-gold/60 bg-white/10 px-4 py-2 text-sm font-black uppercase text-gold backdrop-blur">Ưu đãi chiết khấu lên đến 75%</p>
            <h1 className="text-[clamp(42px,4vw,68px)] font-extrabold uppercase leading-[1.03]">Sơn <span className="gold-text">TNANO</span></h1>
            <p className="mt-5 text-2xl font-black uppercase sm:text-4xl">Nhà muốn đẹp thì sơn phải đẹp</p>
            <p className="mt-3 max-w-2xl text-lg font-bold text-gold">Công nghệ nano - bền vững vượt thời gian</p>
            <div className="mt-6 max-w-xl rounded-lg border border-gold/45 bg-navy/70 p-5 shadow-glow backdrop-blur">
              <p className="text-xl font-black uppercase text-white">Mua đơn 20 triệu</p>
              <p className="text-3xl font-black uppercase text-gold">Nhận đến 50 triệu tiền hàng</p>
              <p className="mt-2 text-xs text-white/75">Chương trình áp dụng theo chính sách và điều kiện từng thời kỳ. Liên hệ TNANO để nhận bảng chính sách chi tiết.</p>
            </div>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <a className="btn-primary" href="#color-form" onClick={(event) => scrollToTarget("color-form", event)}>Nhận tư vấn miễn phí</a>
              <a className="btn-secondary" href="#dealer-form" onClick={(event) => scrollToTarget("dealer-form", event)}>Đăng ký làm đại lý</a>
            </div>
            <div className="mt-6 flex flex-wrap gap-3 text-lg font-black">
              {hotlines.map((phone) => <a key={phone} href={`tel:${phone.replace(/\s/g, "")}`} onClick={() => trackEvent("ClickPhone")} className="rounded-md bg-white/10 px-4 py-2">{phone}</a>)}
            </div>
          </motion.div>
          <motion.div className="order-1 min-w-0 justify-self-center lg:order-2" style={{ width: "min(100%, calc(100vw - 24px))" }} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15 }}>
            <div className="relative mx-auto w-full max-w-full overflow-hidden rounded-lg border border-gold/35 bg-white/5 p-1.5 shadow-premium backdrop-blur md:p-3">
              <div className="relative aspect-square w-full rounded-md">
                <ManagedImage asset={DESIGN_ASSETS.hero.poster} alt="Ưu đãi Sơn TNANO chiết khấu lên đến 75%" fill sizes="(max-width: 1024px) 100vw, 46vw" className="object-contain" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="bg-white py-5 shadow-premium">
        <div className="section-shell grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {usp.map(([label, Icon]) => (
            <div key={label as string} className="flex items-center gap-3 rounded-md border border-slate-100 bg-slate-50 p-4">
              <Icon className="h-8 w-8 shrink-0 text-gold" />
              <span className="text-sm font-black uppercase text-navy">{label as string}</span>
            </div>
          ))}
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
                  <p className="font-black uppercase text-navy">{text}</p>
                </div>
              ))}
            </div>
            <a className="btn-secondary mt-7" href="#factory">Khám phá TNANO</a>
          </div>
          <ManagedImage asset={DESIGN_ASSETS.sections.aboutValue} alt="Sơn TNANO kiến tạo giá trị bền vững" width={900} height={600} className="h-auto w-full rounded-lg object-cover shadow-premium" />
        </div>
      </section>

      <section id="factory" className="blue-panel py-16 md:py-20">
        <div className="section-shell">
          <SectionTitle eyebrow="Nhà máy" title="Khám phá nhà máy Sơn TNANO" light />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {factoryImages.map((item) => (
              <button key={item.title} className="group relative aspect-[4/3] overflow-hidden rounded-xl text-left shadow-premium" onClick={() => setLightbox(item)}>
                <ManagedImage asset={item.image} alt={item.title} fill className="object-cover transition duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/45 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <p className="text-xs font-extrabold uppercase text-gold">{item.tag}</p>
                  <h3 className="text-xl font-extrabold leading-tight text-white drop-shadow">{item.title}</h3>
                </div>
              </button>
            ))}
          </div>
          <div className="mt-10 grid gap-3 md:grid-cols-7">
            {["Nguyên liệu", "Phối trộn", "Kiểm tra chất lượng", "Chiết rót", "Đóng gói", "Nhập kho", "Xuất hàng"].map((step, i) => (
              <div key={step} className="rounded-md border border-white/15 bg-white/10 p-4 text-white backdrop-blur">
                <p className="text-gold">0{i + 1}</p>
                <p className="font-bold">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16 md:py-20">
        <div className="section-shell grid items-center gap-10 lg:grid-cols-[.42fr_.58fr]">
          <div>
            <SectionTitle eyebrow="Video" title="Bên trong nhà máy TNANO" />
            <p className="mt-5 text-lg leading-8 text-slate-700">Một góc vận hành thực tế tại nhà máy TNANO, nơi sản phẩm được sản xuất, kiểm tra và sẵn sàng giao đến công trình.</p>
            <ul className="mt-5 grid gap-3 text-slate-700">
              <li className="flex gap-3"><BadgeCheck className="h-6 w-6 shrink-0 text-gold" /> Quy trình sản xuất được tổ chức rõ ràng.</li>
              <li className="flex gap-3"><BadgeCheck className="h-6 w-6 shrink-0 text-gold" /> Kiểm soát chất lượng trước khi xuất kho.</li>
              <li className="flex gap-3"><BadgeCheck className="h-6 w-6 shrink-0 text-gold" /> Năng lực cung ứng cho đại lý và công trình.</li>
            </ul>
          </div>
          <div className="aspect-video overflow-hidden rounded-2xl bg-black shadow-premium">
            <video className="h-full w-full object-cover" controls playsInline preload="metadata" poster={assetUrl(DESIGN_ASSETS.factory.qc1.src)}>
              <source src={assetUrl(DESIGN_ASSETS.factory.video.src)} type="video/mp4" />
            </video>
          </div>
        </div>
      </section>

      <section id="products" className="py-16 md:py-20">
        <div className="section-shell">
          <SectionTitle eyebrow="Sản phẩm" title="GIẢI PHÁP SƠN PHÙ HỢP CHO TỪNG NHU CẦU" />
          <p className="mx-auto mt-4 max-w-3xl text-center text-lg text-slate-700">
            Không cần phải tự chọn mã sản phẩm. TNANO sẽ tư vấn giải pháp phù hợp với từng hạng mục và công trình.
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {solutionCards.map((solution) => {
              const Icon = solution.icon;
              return (
              <article key={solution.title} className="flex h-full flex-col rounded-xl border border-slate-100 bg-white p-5 pb-6 shadow-premium">
                <div className="relative h-[210px] overflow-hidden rounded-xl bg-white p-1.5 lg:h-[225px]">
                  <ManagedImage asset={solution.image} alt={solution.title} fill className="object-contain" />
                </div>
                <div className="mt-5 flex items-center gap-3">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-md bg-navy text-gold">
                    <Icon className="h-6 w-6" />
                  </span>
                  <h3 className="text-[22px] font-extrabold leading-tight text-navy">{solution.title}</h3>
                </div>
                <p className="mt-3 text-slate-700">{solution.description}</p>
                <ul className="mt-4 space-y-2 pb-5">
                  {solution.benefits.map((benefit) => <li key={benefit} className="flex gap-2 text-sm text-slate-600"><BadgeCheck className="h-5 w-5 text-gold" />{benefit}</li>)}
                </ul>
                <button className="btn-primary mt-auto min-h-[52px] w-full px-6 py-3.5 leading-snug" type="button" onClick={() => openSolutionForm(solution.interest)}>
                  {solution.cta}
                </button>
              </article>
              );
            })}
          </div>
          <p className="mx-auto mt-8 max-w-2xl text-center text-lg font-black text-navy">
            Bạn chỉ cần cho TNANO biết nhu cầu - nhà máy sẽ tư vấn dòng sản phẩm phù hợp.
          </p>
        </div>
      </section>

      <section id="quality" className="bg-white py-16 md:py-20">
        <div className="section-shell">
          <SectionTitle eyebrow="Lý do chọn TNANO" title="Uy tín từ sản xuất - chất lượng từ sản phẩm" />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {reasons.map(([label, Icon]) => (
              <div key={label as string} className="rounded-lg border border-slate-100 bg-slate-50 p-5">
                <Icon className="h-9 w-9 text-gold" />
                <h3 className="mt-4 font-black uppercase text-navy">{label as string}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="color-consult" className="blue-panel py-16 md:py-20">
        <div className="section-shell grid items-center gap-10 lg:grid-cols-[.9fr_1.1fr]">
          <div className="text-white">
            <p className="text-sm font-black uppercase text-gold">Tư vấn màu sơn</p>
            <h2 className="mt-2 text-[clamp(32px,3vw,48px)] font-extrabold uppercase leading-[1.12]">Chưa biết chọn màu sơn nào cho ngôi nhà?</h2>
            <p className="mt-4 text-lg text-white/80">Gửi thông tin công trình - TNANO hỗ trợ tư vấn màu sắc và giải pháp sơn phù hợp.</p>
            <ManagedImage asset={DESIGN_ASSETS.colorConsult} alt="Bảng màu tư vấn sơn TNANO" width={760} height={760} className="mt-8 h-auto w-full rounded-xl object-contain shadow-premium" />
          </div>
          <div id="color-form">
            <LeadForm kind="color" interest={selectedInterest} />
          </div>
        </div>
      </section>

      <section className="bg-white py-16 md:py-20">
        <div className="section-shell grid items-center gap-8 lg:grid-cols-2">
          <ManagedImage asset={DESIGN_ASSETS.sections.promotion} alt="Chương trình ưu đãi TNANO" width={760} height={760} className="h-auto w-full rounded-lg object-contain shadow-premium" />
          <div>
            <p className="text-sm font-black uppercase text-redcta">Chương trình ưu đãi đặc biệt</p>
            <h2 className="mt-2 text-[clamp(32px,3vw,48px)] font-extrabold uppercase leading-[1.12] text-navy">Chiết khấu lên đến <span className="text-redcta">75%</span></h2>
            <div className="mt-6 rounded-lg border border-gold/40 bg-navy p-6 text-white shadow-glow">
              <p className="text-2xl font-black uppercase">Mua đơn 20 triệu</p>
              <p className="gold-text text-5xl font-black uppercase">Nhận đến 50 triệu</p>
              <p className="text-xl font-black uppercase">tiền hàng</p>
            </div>
            <p className="mt-4 text-sm text-slate-600">Giá trị ưu đãi, cơ cấu hàng hóa và điều kiện áp dụng theo chính sách TNANO tại từng thời điểm. Vui lòng đăng ký để nhận bảng chính sách hiện hành.</p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a className="btn-primary" href="#dealer-form" onClick={(event) => { scrollToTarget("dealer-form", event); trackEvent("ViewPromotion"); }}>Nhận chính sách ưu đãi</a>
              <a className="btn-secondary" href="tel:02373586999" onClick={() => trackEvent("ClickPhone")}>Gọi ngay 0237 358 6999</a>
            </div>
          </div>
        </div>
      </section>

      <section id="dealer" className="relative py-16 text-white md:py-20">
        <ManagedImage asset={DESIGN_ASSETS.sections.dealerBackground} alt="Kho hàng Sơn TNANO" fill className="object-cover" />
        <div className="absolute inset-0 bg-navy/85" />
        <div className="section-shell relative grid items-center gap-10 lg:grid-cols-[.95fr_1.05fr]">
          <div>
            <p className="text-sm font-black uppercase text-gold">Chính sách đại lý</p>
            <h2 className="mt-2 text-[clamp(32px,3vw,48px)] font-extrabold uppercase leading-[1.12]">Đồng hành cùng TNANO - gia tăng lợi nhuận</h2>
            <p className="mt-4 text-white/80">Cơ hội hợp tác dành cho đại lý vật liệu xây dựng, nhà phân phối, nhà thầu và đối tác kinh doanh trên toàn quốc.</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {["Chính sách chiết khấu hấp dẫn", "Chương trình nhập hàng ưu đãi", "Hỗ trợ hình ảnh marketing", "Hỗ trợ tư vấn bán hàng", "Hỗ trợ sản phẩm và kỹ thuật", "Nguồn hàng ổn định", "Đồng hành cùng đại lý", "Phát triển thị trường lâu dài"].map((benefit) => (
                <div key={benefit} className="rounded-md border border-white/15 bg-white/10 p-4 backdrop-blur">{benefit}</div>
              ))}
            </div>
            <div className="mt-6 rounded-lg border border-gold bg-gold p-5 text-navy shadow-glow">
              <p className="text-2xl font-black uppercase">Ưu đãi đại lý: chiết khấu lên đến 75%</p>
              <p className="font-bold">Mua đơn 20 triệu - nhận đến 50 triệu tiền hàng</p>
            </div>
          </div>
          <div id="dealer-form">
            <LeadForm kind="dealer" />
          </div>
        </div>
      </section>

      <section id="projects" className="py-16 md:py-20">
        <div className="section-shell">
          <SectionTitle eyebrow="Công trình" title="Công trình thực tế TNANO" />
          <p className="mx-auto mt-4 max-w-3xl text-center text-lg text-slate-700">
            TNANO đồng hành cùng hàng nghìn công trình trên toàn quốc
          </p>
          <ProjectsCarousel />
        </div>
      </section>

      <section className="bg-white py-16 md:py-20">
        <div className="section-shell grid items-center gap-10 lg:grid-cols-[.88fr_1.12fr]">
          <div>
            <p className="text-sm font-black uppercase text-royal">Giao hàng</p>
            <h2 className="mt-2 text-[clamp(32px,3vw,48px)] font-extrabold uppercase leading-[1.12] text-navy">Sẵn sàng đồng hành cùng mọi công trình</h2>
            <p className="mt-4 text-lg leading-8 text-slate-700">Kho hàng - sản xuất - vận chuyển được tổ chức nhằm đáp ứng nhu cầu của hệ thống đại lý, nhà thầu và khách hàng.</p>
            <p className="mt-4 text-xl font-black text-royal">Đi khắp Việt Nam - Tô điểm cuộc sống.</p>
          </div>
          <ManagedImage asset={DESIGN_ASSETS.sections.travelVietnam} alt="TNANO đi khắp Việt Nam" width={900} height={650} className="h-auto w-full rounded-xl object-cover shadow-premium" />
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
          <h2 className="text-4xl font-black uppercase">Nhà muốn đẹp thì sơn phải đẹp</h2>
          <p className="mt-3 text-xl text-white/80">Để TNANO đồng hành cùng công trình của bạn</p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <a className="btn-primary" href="#color-form" onClick={(event) => scrollToTarget("color-form", event)}>Nhận tư vấn miễn phí</a>
            <a className="btn-secondary" href="#dealer-form" onClick={(event) => scrollToTarget("dealer-form", event)}>Đăng ký đại lý</a>
          </div>
          <div className="mt-6 text-3xl font-black text-gold">{hotlines.join(" | ")}</div>
        </div>
      </section>

      <footer className="bg-navy py-12 text-white">
        <div className="section-shell grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <ManagedImage asset={DESIGN_ASSETS.logo} alt="Logo TNANO" width={80} height={80} className="rounded-full" />
            <h2 className="mt-4 text-2xl font-black">Sơn TNANO - Tập Đoàn Quốc Tế Vạn Xuân</h2>
            <div className="mt-5 grid gap-4 rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="flex gap-3">
                <Building2 className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                <div>
                  <p className="font-extrabold uppercase text-white">CÔNG TY CỔ PHẦN TẬP ĐOÀN QUỐC TẾ VẠN XUÂN</p>
                  <p className="mt-1 text-sm text-white/70">MST: 0109113869</p>
                </div>
              </div>
              <div className="flex gap-3">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                <p className="text-sm leading-6 text-white/70">Số nhà 75 Ngách 205/91/11 đường Xuân Đỉnh,<br />Thành phố Hà Nội, Việt Nam</p>
              </div>
              <div className="flex gap-3">
                <Phone className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                <div className="grid gap-1 text-sm font-semibold text-white/80">
                  <a href="tel:02373586999" onClick={() => trackEvent("ClickPhone")}>0237 3586 999</a>
                  <a href="tel:0974780678" onClick={() => trackEvent("ClickPhone")}>0974 780 678</a>
                </div>
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-black uppercase text-gold">Menu nhanh</h3>
            <div className="mt-3 grid gap-2 text-white/75">{nav.slice(0, 6).map(([label, href]) => <a key={href} href={href}>{label}</a>)}</div>
          </div>
          <div>
            <h3 className="font-black uppercase text-gold">Liên hệ</h3>
            <div className="mt-3 grid gap-2 text-white/75">
              <a href="#products">Sản phẩm</a>
              <a href="#dealer-form" onClick={(event) => scrollToTarget("dealer-form", event)}>Chính sách đại lý</a>
              <a href="#color-form" onClick={(event) => scrollToTarget("color-form", event)}>Đăng ký tư vấn</a>
            </div>
          </div>
        </div>
        <p className="section-shell mt-10 border-t border-white/10 pt-6 text-sm text-white/55">Copyright © 2026 Sơn TNANO. All rights reserved.</p>
      </footer>

      <div className="fixed right-4 top-1/2 z-40 hidden -translate-y-1/2 gap-3 md:grid">
        <a className="rounded-full bg-emerald-600 p-3 text-white shadow-premium" href="https://zalo.me/0974780678" onClick={() => trackEvent("ClickZalo")} aria-label="Zalo"><Headphones /></a>
        <a className="rounded-full bg-redcta p-3 text-white shadow-premium" href="tel:02373586999" onClick={() => trackEvent("ClickPhone")} aria-label="Gọi điện"><Phone /></a>
        <a className="rounded-full bg-gold p-3 text-navy shadow-premium" href="#color-form" onClick={(event) => scrollToTarget("color-form", event)} aria-label="Đăng ký tư vấn"><Palette /></a>
      </div>
      <div className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-[.9fr_1.05fr_1.35fr] gap-1.5 border-t border-white/20 bg-[rgba(5,24,65,0.98)] p-2 text-[10px] font-black uppercase text-white shadow-[0_-14px_34px_rgba(0,0,0,.24)] min-[390px]:text-[11px] md:hidden">
        <a className="flex h-12 items-center justify-center rounded-lg bg-navy px-2 text-center ring-1 ring-white/15" href="tel:02373586999" onClick={() => trackEvent("ClickPhone")}>Gọi ngay</a>
        <a className="flex h-12 items-center justify-center rounded-lg bg-redcta px-2 text-center shadow-lg shadow-redcta/25" href="#color-form" onClick={(event) => scrollToTarget("color-form", event)}>Nhận tư vấn</a>
        <a className="flex h-12 items-center justify-center rounded-lg bg-gold px-1.5 text-center text-navy shadow-lg shadow-gold/20" href="#dealer-form" onClick={(event) => scrollToTarget("dealer-form", event)}>Đăng ký đại lý</a>
      </div>

      {lightbox ? (
        <button className="fixed inset-0 z-[60] bg-black/85 p-4" onClick={() => setLightbox(null)} aria-label="Đóng ảnh">
          <ManagedImage asset={lightbox.image} alt={lightbox.title} width={1500} height={950} className="mx-auto max-h-[92vh] w-auto rounded-lg object-contain" />
        </button>
      ) : null}

      {popupOpen ? (
        <div className="fixed inset-0 z-[70] grid place-items-center bg-navy/70 p-4 backdrop-blur">
          <div className="relative w-full max-w-xl">
            <button className="absolute -right-2 -top-2 z-10 rounded-full bg-navy p-2 text-white" onClick={() => setPopupOpen(false)} aria-label="Đóng form"><X /></button>
            <LeadForm kind="color" compact interest={selectedInterest} />
          </div>
        </div>
      ) : null}
    </main>
  );
}
