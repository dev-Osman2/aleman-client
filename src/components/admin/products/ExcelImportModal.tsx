"use client";

import {
  X,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  PlusCircle,
  Loader2,
  FileText,
} from "lucide-react";
import { ExcelPreviewData } from "./hooks/useExcelBooks";

interface ExcelImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedFile: File | null;
  loading: boolean;
  isImporting: boolean;
  previewData: ExcelPreviewData | null;
  onConfirm: () => void;
}

export default function ExcelImportModal({
  isOpen,
  onClose,
  selectedFile,
  loading,
  isImporting,
  previewData,
  onConfirm,
}: ExcelImportModalProps) {
  if (!isOpen) return null;

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto"
      dir="rtl"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isImporting) onClose();
      }}
    >
      <div className="bg-white rounded-3xl border border-border/80 shadow-2xl w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-border-subtle flex items-center justify-between shrink-0 bg-surface-soft/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary text-white flex items-center justify-center shadow-xs">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-heading">
                معاينة واستيراد الكتب من Excel
              </h2>
              <p className="text-xs text-muted font-medium mt-0.5">
                مراجعة بيانات الكتب وإحصائيات الإضافة والتحديث قبل الحفظ
              </p>
            </div>
          </div>

          <button
            type="button"
            disabled={isImporting}
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-surface hover:bg-surface-hover text-muted hover:text-heading flex items-center justify-center transition disabled:opacity-50 cursor-pointer"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 custom-scrollbar flex-1">
          {/* File Information Card */}
          {selectedFile && (
            <div className="p-3.5 bg-surface-soft rounded-2xl border border-border/70 flex items-center justify-between gap-3 text-xs sm:text-sm">
              <div className="flex items-center gap-2.5 min-w-0">
                <FileText className="w-5 h-5 text-primary shrink-0" />
                <span className="font-extrabold text-heading truncate">
                  {selectedFile.name}
                </span>
                <span className="text-muted text-xs">
                  ({formatFileSize(selectedFile.size)})
                </span>
              </div>
              <span className="bg-primary/10 text-primary font-bold text-xs px-2.5 py-1 rounded-full shrink-0">
                ملف Excel (.xlsx)
              </span>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="py-16 flex flex-col items-center justify-center gap-3 text-center">
              <Loader2 className="w-9 h-9 animate-spin text-primary" />
              <p className="text-sm font-bold text-heading">
                جاري قراءة الملف وتدقيق البيانات ومطابقتها مع قاعدة البيانات...
              </p>
              <span className="text-xs text-muted">
                يرجى الانتظار بضع لحظات لفحص الأكواد والأسعار والكميات
              </span>
            </div>
          )}

          {/* Preview Content */}
          {!loading && previewData && (
            <>
              {/* Statistics Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-slate-50 border border-slate-200/80 p-3.5 rounded-2xl text-center">
                  <span className="text-xs text-slate-500 font-bold block mb-1">
                    إجمالي الكتب بالملف
                  </span>
                  <span className="text-xl sm:text-2xl font-black text-slate-800">
                    {previewData.totalRows}
                  </span>
                </div>

                <div className="bg-emerald-50 border border-emerald-200/80 p-3.5 rounded-2xl text-center">
                  <div className="flex items-center justify-center gap-1 text-emerald-600 mb-1">
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span className="text-xs font-bold">كتب جديدة</span>
                  </div>
                  <span className="text-xl sm:text-2xl font-black text-emerald-700">
                    {previewData.newCount}
                  </span>
                </div>

                <div className="bg-teal-50 border border-teal-200/80 p-3.5 rounded-2xl text-center">
                  <div className="flex items-center justify-center gap-1 text-teal-600 mb-1">
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span className="text-xs font-bold">تحديث موجود</span>
                  </div>
                  <span className="text-xl sm:text-2xl font-black text-teal-700">
                    {previewData.updateCount}
                  </span>
                </div>

                <div
                  className={`p-3.5 rounded-2xl text-center border ${
                    previewData.invalidCount > 0
                      ? "bg-rose-50 border-rose-200/80 text-rose-700"
                      : "bg-gray-50 border-gray-200/80 text-gray-400"
                  }`}
                >
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span className="text-xs font-bold">صفوف بها أخطاء</span>
                  </div>
                  <span className="text-xl sm:text-2xl font-black">
                    {previewData.invalidCount}
                  </span>
                </div>
              </div>

              {/* Error Details Section (If Any) */}
              {previewData.invalidCount > 0 && (
                <div className="bg-rose-50/70 border border-rose-200 rounded-2xl p-4">
                  <div className="flex items-center gap-2 text-rose-800 font-extrabold text-sm mb-2.5">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>
                      تنبيه: يوجد ({previewData.invalidCount}) صف يحتوي على
                      أخطاء ولن يتم استيرادها:
                    </span>
                  </div>
                  <div className="max-h-40 overflow-y-auto custom-scrollbar space-y-1.5 pr-1">
                    {previewData.errors.map((err, i) => (
                      <div
                        key={i}
                        className="bg-white/90 p-2 rounded-xl text-xs text-rose-950 border border-rose-100 flex items-start gap-2"
                      >
                        <span className="bg-rose-100 text-rose-800 font-black px-1.5 py-0.5 rounded text-[10px] shrink-0">
                          السطر {err.row}
                        </span>
                        {err.code && (
                          <span className="bg-slate-100 text-slate-700 font-bold px-1.5 py-0.5 rounded text-[10px] shrink-0">
                            كود: {err.code}
                          </span>
                        )}
                        <span className="font-semibold text-rose-900">
                          {err.message}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sample Preview Table */}
              {previewData.previewItems.length > 0 && (
                <div className="border border-border/70 rounded-2xl overflow-hidden">
                  <div className="bg-surface-soft px-4 py-2.5 border-b border-border/70 flex items-center justify-between">
                    <span className="text-xs font-extrabold text-heading">
                      عينة من الكتب الجاهزة للاستيراد (
                      {previewData.previewItems.length} من{" "}
                      {previewData.validCount})
                    </span>
                    <span className="text-[11px] text-muted font-medium">
                      المطابقة تتم تلقائياً عبر كود الكتاب (Code)
                    </span>
                  </div>

                  <div className="overflow-x-auto max-h-56 custom-scrollbar">
                    <table className="w-full text-right text-xs">
                      <thead className="bg-gray-50 text-muted border-b border-border/60 sticky top-0">
                        <tr>
                          <th className="py-2.5 px-3 font-bold">الكود</th>
                          <th className="py-2.5 px-3 font-bold">اسم الكتاب</th>
                          <th className="py-2.5 px-3 font-bold">القسم</th>
                          <th className="py-2.5 px-3 font-bold text-center">
                            السعر
                          </th>
                          <th className="py-2.5 px-3 font-bold text-center">
                            المخزون
                          </th>
                          <th className="py-2.5 px-3 font-bold text-center">
                            نوع الإجراء
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/50 text-sub">
                        {previewData.previewItems.map((item) => (
                          <tr
                            key={item.code}
                            className="hover:bg-primary-subtle/30"
                          >
                            <td className="py-2 px-3 font-black text-primary text-[11px]">
                              #{item.code}
                            </td>
                            <td className="py-2 px-3 font-bold text-heading max-w-[200px] truncate">
                              {item.title}
                            </td>
                            <td className="py-2 px-3 text-muted text-[11px]">
                              {item.category}
                            </td>
                            <td className="py-2 px-3 text-center font-bold">
                              {item.price} ج
                            </td>
                            <td className="py-2 px-3 text-center font-medium">
                              {item.quantity}
                            </td>
                            <td className="py-2 px-3 text-center">
                              {item.action === "update" ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-teal-50 text-teal-700 border border-teal-200">
                                  <RefreshCw className="w-2.5 h-2.5" />
                                  تحديث
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                  <PlusCircle className="w-2.5 h-2.5" />
                                  جديد
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-border-subtle bg-surface-soft/60 flex items-center justify-end gap-3 shrink-0">
          <button
            type="button"
            disabled={isImporting}
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-border text-sub hover:text-heading hover:bg-surface font-extrabold text-xs sm:text-sm transition disabled:opacity-50 cursor-pointer"
          >
            إلغاء
          </button>

          <button
            type="button"
            disabled={
              loading ||
              isImporting ||
              !previewData ||
              previewData.validCount === 0
            }
            onClick={onConfirm}
            className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-extrabold text-xs sm:text-sm shadow-md shadow-primary/20 flex items-center gap-2 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isImporting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>جاري الحفظ في قاعدة البيانات...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  تأكيد الاستيراد
                  {previewData && previewData.validCount > 0
                    ? ` (${previewData.validCount} كتاب)`
                    : ""}
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
