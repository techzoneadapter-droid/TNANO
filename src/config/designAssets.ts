const BASE_PATH = (process.env.NEXT_PUBLIC_BASE_PATH || "").replace(/\/+$/g, "");

export type ManagedAsset = {
  src: string;
};

export function assetUrl(path: string) {
  if (!path) return path;
  if (/^(https?:)?\/\//.test(path)) return path;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  if (BASE_PATH && (normalizedPath === BASE_PATH || normalizedPath.startsWith(`${BASE_PATH}/`))) {
    return normalizedPath;
  }
  return `${BASE_PATH}${normalizedPath}`;
}

export const DESIGN_ASSETS = {
  logo: { src: "/design/logo.jpg" },
  hero: {
    background: { src: "/design/toàn cảnh nhà máy 2.png" },
    poster: { src: "/design/chiết khấu.png" },
  },
  colorConsult: { src: "/design/bảng màu.png" },
  solutions: {
    waterproof: { src: "/design/chống thấm.png" },
    exterior: { src: "/design/ngoại thất.png" },
    interior: { src: "/design/nội thất.png" },
  },
  factory: {
    gate: { src: "/design/cổng.png" },
    overview: { src: "/design/toàn cảnh nhà máy 2.png" },
    mixing: { src: "/design/máy trộn.png" },
    packing: { src: "/design/đóng gói.png" },
    warehouse: { src: "/design/kho.png" },
    qc1: { src: "/design/kiểm tra 1.png" },
    qc2: { src: "/design/kiểm tra 2.png" },
    shipping: { src: "/design/xuất hàng.png" },
    video: { src: "/design/bên trong nhà máy.mp4" },
  },
  sections: {
    aboutValue: { src: "/design/kiến tạo giá trị bền vững.png" },
    aboutDelivery: { src: "/design/xuất hàng.png" },
    promotion: { src: "/design/chiết khấu.png" },
    dealerBackground: { src: "/design/kho.png" },
    delivery: { src: "/design/xuất hàng.png" },
    travelVietnam: { src: "/design/đi khắp việt nam.png" },
  },
} satisfies Record<string, unknown>;
