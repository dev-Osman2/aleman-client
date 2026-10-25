import {
  BookOpen,
  BookMarked,
  Scroll,
  Compass,
  Heart,
  Library,
  Feather,
  Baby,
  Globe,
  LucideIcon,
} from "lucide-react";

export const CATEGORIES: string[] = [
  "العقيدة",
  "علوم القرآن والتفسير",
  "السيرة والحديث النبوي",
  "الفقه وأصوله",
  "التاريخ والتراجم",
  "الرقائق والتربية الإيمانية",
  "الأدب والروايات الهادفة",
  "كتب الأطفال والناشئة",
  "ثقافة وفكر إسلامي",
];

export const CATEGORY_LABELS: Record<string, string> = {
  "العقيدة": "العقيدة والتوحيد",
  "علوم القرآن والتفسير": "علوم القرآن والتفسير",
  "السيرة والحديث النبوي": "السيرة والحديث النبوي",
  "الفقه وأصوله": "الفقه الإسلامي وأصوله",
  "التاريخ والتراجم": "التاريخ الإسلامي والتراجم",
  "الرقائق والتربية الإيمانية": "الرقائق والتربية الإيمانية",
  "الأدب والروايات الهادفة": "الأدب والروايات الهادفة",
  "كتب الأطفال والناشئة": "كتب الأطفال والناشئة",
  "ثقافة وفكر إسلامي": "ثقافة وفكر إسلامي",
};

export function getCategoryLabel(slug: string): string {
  return CATEGORY_LABELS[slug] || slug;
}

export interface CategoryTabItem {
  id: string;
  label: string;
  icon: LucideIcon | null;
}

export const CATEGORY_TABS: CategoryTabItem[] = [
  { id: "all", label: "جميع الكتب", icon: BookOpen },
  { id: "العقيدة", label: "العقيدة", icon: Compass },
  { id: "علوم القرآن والتفسير", label: "علوم القرآن", icon: BookMarked },
  { id: "السيرة والحديث النبوي", label: "السيرة والحديث", icon: Scroll },
  { id: "الفقه وأصوله", label: "الفقه وأصوله", icon: Library },
  { id: "التاريخ والتراجم", label: "التاريخ والتراجم", icon: Globe },
  { id: "الرقائق والتربية الإيمانية", label: "الرقائق والتربية", icon: Heart },
  { id: "الأدب والروايات الهادفة", label: "الأدب والروايات", icon: Feather },
  { id: "كتب الأطفال والناشئة", label: "الأطفال والناشئة", icon: Baby },
  { id: "ثقافة وفكر إسلامي", label: "ثقافة وفكر", icon: BookOpen },
];