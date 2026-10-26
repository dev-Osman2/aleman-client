"use client";
import { CATEGORIES } from "@/src/constants/categories";
import { BookOpen, Hash, User, Bookmark } from "lucide-react";

interface ProductBasicInfoProps {
  code: string;
  setCode: (val: string) => void;
  title: string;
  setTitle: (val: string) => void;
  author: string;
  setAuthor: (val: string) => void;
  category: string;
  setCategory: (val: string) => void;
}

export default function ProductBasicInfo({
  code,
  setCode,
  title,
  setTitle,
  author,
  setAuthor,
  category,
  setCategory,
}: ProductBasicInfoProps) {
  return (
    <div className="flex flex-col gap-4" dir="rtl">
      <div className="flex flex-wrap gap-4">
        <div className="w-full sm:w-[calc(33.333%-0.75rem)]">
          <label className="block text-xs font-extrabold text-heading mb-1.5">
            كود الكتاب <span className="text-danger">*</span>
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none text-muted-light">
              <Hash className="w-4 h-4" />
            </span>
            <input
              type="text"
              required
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="مثال: 1005"
              className="w-full pr-10 pl-4 py-3 bg-white border border-border rounded-xl text-sm font-bold text-body focus:outline-none focus:border-primary transition"
            />
          </div>
        </div>

        <div className="w-full sm:w-[calc(66.666%-0.75rem)]">
          <label className="block text-xs font-extrabold text-heading mb-1.5">
            عنوان الكتاب <span className="text-danger">*</span>
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none text-muted-light">
              <BookOpen className="w-4 h-4" />
            </span>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثال: كتاب التوحيد وإثبات صفات الرب"
              className="w-full pr-10 pl-4 py-3 bg-white border border-border rounded-xl text-sm font-bold text-body focus:outline-none focus:border-primary transition"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        <div className="w-full sm:w-[calc(50%-0.5rem)]">
          <label className="block text-xs font-extrabold text-heading mb-1.5">
            المؤلف / الكاتب
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none text-muted-light">
              <User className="w-4 h-4" />
            </span>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="مثال: الإمام ابن خزيمة"
              className="w-full pr-10 pl-4 py-3 bg-white border border-border rounded-xl text-sm font-bold text-body focus:outline-none focus:border-primary transition"
            />
          </div>
        </div>

        <div className="w-full sm:w-[calc(50%-0.5rem)]">
          <label className="block text-xs font-extrabold text-heading mb-1.5">
            القسم والتصنيف <span className="text-danger">*</span>
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none text-muted-light">
              <Bookmark className="w-4 h-4" />
            </span>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full pr-10 pl-4 py-3 bg-white border border-border rounded-xl text-sm font-bold text-body focus:outline-none focus:border-primary transition cursor-pointer appearance-none"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
