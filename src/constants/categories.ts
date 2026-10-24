import {
  Flame,
  Pizza,
  Utensils,
  CookingPot,
  UtensilsCrossed,
  Sandwich,
  Fish,
  Soup,
  Salad,
  Croissant,
  IceCream,
  CupSoda,
  LucideIcon,
} from "lucide-react";



export const CATEGORIES: string[] = [
  "aqeedah",
  "quran-sciences",
  "seerat-al-rasool",
  "islamic-fiqh",
  "thaqafa-amma",
  "novels",
];

export const CATEGORY_LABELS: Record<string, string> = {
  "aqeedah": "العقيدة الإسلامية",
  "quran-sciences": "علوم القرآن والتفسير",
  "seerat-al-rasool": "السيرة النبوية والشمائل",
  "islamic-fiqh": "الفقه وأصوله",
  "thaqafa-amma": "ثقافة عامة",
  "novels": "الأدب والروايات",
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
  { id: "all", label: "الكل", icon: null },
  { id: "المشويات على الفحم", label: "المشويات على الفحم", icon: Flame },
  { id: "البيتزا", label: "البيتزا", icon: Pizza },
  { id: "الأكل الإيطالي", label: "الأكل الإيطالي", icon: Utensils },
  { id: "الطواجن والأطباق الشرقية", label: "الطواجن والأطباق الشرقية", icon: CookingPot },
  { id: "الوجبات والصواني", label: "الوجبات والصواني", icon: UtensilsCrossed },
  { id: "السندوتشات والبرجر", label: "السندوتشات والبرجر", icon: Sandwich },
  { id: "المأكولات البحرية (سي فود)", label: "المأكولات البحرية (سي فود)", icon: Fish },
  { id: "الشوربة", label: "الشوربة", icon: Soup },
  { id: "السلطات والمقبلات الباردة", label: "السلطات والمقبلات الباردة", icon: Salad },
  { id: "المقبلات الساخنة والأطباق الجانبية", label: "المقبلات الساخنة والأطباق الجانبية", icon: Croissant },
  { id: "الحلويات", label: "الحلويات", icon: IceCream },
  { id: "المشروبات", label: "المشروبات", icon: CupSoda },
];