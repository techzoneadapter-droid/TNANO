import { assetUrl } from "./designAssets";

export type ProjectItem = {
  image: string;
  location: string;
};

export const PROJECTS: ProjectItem[] = [
  { image: assetUrl("/design/công trình thực tế 1.png"), location: "Thanh Hóa" },
  { image: assetUrl("/design/công trình thực tế 2.png"), location: "Hà Nội" },
  { image: assetUrl("/design/công trình thực tế 3.png"), location: "Nghệ An" },
  { image: assetUrl("/design/công trình thực tế 4.png"), location: "Ninh Bình" },
  { image: assetUrl("/design/công trình thực tế 5.png"), location: "Hải Phòng" },
  { image: assetUrl("/design/công trình thực tế 6.png"), location: "Quảng Ninh" },
  { image: assetUrl("/design/công trình thực tế 7.png"), location: "Đà Nẵng" },
  { image: assetUrl("/design/công trình thực tế 8.png"), location: "TP. Hồ Chí Minh" },
];
