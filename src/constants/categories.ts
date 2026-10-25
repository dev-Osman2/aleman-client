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
  "الفقه وأصوله",
  "علوم القرآن",
  "السنة والحديث",
  "السيرة النبوية",
  "سير الصحابة",
  "البلاغة والأدب",
  "الشعر والدواوين",
  "قضايا الفكر والإصلاح",
  "ثقافة عامة",
];

export const CATEGORY_LABELS: Record<string, string> = {
  "aqeedah": "العقيدة",
  "العقيدة": "العقيدة",
  "fiqh-usul": "الفقه وأصوله",
  "الفقه وأصوله": "الفقه وأصوله",
  "quran-sciences": "علوم القرآن",
  "علوم القرآن": "علوم القرآن",
  "علوم القرآن والتفسير": "علوم القرآن",
  "sunnah-hadith": "السنة والحديث",
  "السنة والحديث": "السنة والحديث",
  "السيرة والحديث النبوي": "السنة والحديث",
  "seerat-al-rasool": "السيرة النبوية",
  "السيرة النبوية": "السيرة النبوية",
  "seerat-al-sahaba": "سير الصحابة",
  "سير الصحابة": "سير الصحابة",
  "balagha-wa-adab": "البلاغة والأدب",
  "البلاغة والأدب": "البلاغة والأدب",
  "poetry": "الشعر والدواوين",
  "الشعر والدواوين": "الشعر والدواوين",
  "qadaya-al-islah": "قضايا الفكر والإصلاح",
  "قضايا الفكر والإصلاح": "قضايا الفكر والإصلاح",
  "thaqafa-amma": "ثقافة عامة",
  "ثقافة عامة": "ثقافة عامة",
  "ثقافة وفكر إسلامي": "ثقافة عامة",
};

export function getCategoryLabel(slug: string): string {
  if (!slug) return "";
  return CATEGORY_LABELS[slug] || CATEGORY_LABELS[slug.trim()] || slug;
}

export interface CategoryTabItem {
  id: string;
  label: string;
  icon: LucideIcon | null;
}

export const CATEGORY_TABS: CategoryTabItem[] = [
  { id: "all", label: "جميع الكتب", icon: BookOpen },
  { id: "العقيدة", label: "العقيدة", icon: Compass },
  { id: "الفقه وأصوله", label: "الفقه وأصوله", icon: Library },
  { id: "علوم القرآن", label: "علوم القرآن", icon: BookMarked },
  { id: "السنة والحديث", label: "السنة والحديث", icon: Scroll },
  { id: "السيرة النبوية", label: "السيرة النبوية", icon: BookOpen },
  { id: "سير الصحابة", label: "سير الصحابة", icon: Globe },
  { id: "البلاغة والأدب", label: "البلاغة والأدب", icon: Feather },
  { id: "الشعر والدواوين", label: "الشعر والدواوين", icon: Feather },
  { id: "قضايا الفكر والإصلاح", label: "قضايا الفكر والإصلاح", icon: Heart },
  { id: "ثقافة عامة", label: "ثقافة عامة", icon: BookOpen },
];