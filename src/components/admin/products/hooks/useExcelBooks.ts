import { useState } from "react";
import { toast } from "sonner";
import {
  exportBooksExcelApi,
  previewBooksImportApi,
  importBooksExcelApi,
} from "./adminProductsApi";

export interface PreviewErrorItem {
  row: number;
  code?: string;
  field: string;
  message: string;
}

export interface PreviewBookItem {
  code: string;
  title: string;
  author: string | null;
  price: number;
  oldPrice: number | null;
  quantity: number;
  category: string;
  action: "create" | "update";
}

export interface ExcelPreviewData {
  fileName: string;
  fileSize: number;
  totalRows: number;
  validCount: number;
  newCount: number;
  updateCount: number;
  invalidCount: number;
  errors: PreviewErrorItem[];
  previewItems: PreviewBookItem[];
}

export function useExcelBooks() {
  const [isExporting, setIsExporting] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [previewData, setPreviewData] = useState<ExcelPreviewData | null>(null);

  // 1. تصدير الكتب إلى Excel وتنزيل الملف تلقائياً
  const handleExportExcel = async () => {
    if (isExporting) return;
    setIsExporting(true);

    const loadingToast = toast.loading("جاري إعداد وتصدير ملف Excel لجميع الكتب...");
    try {
      const blob = await exportBooksExcelApi();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Books.xlsx";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      toast.dismiss(loadingToast);
      toast.success("تم تنزيل ملف الكتب بنجاح (aleman-books.xlsx)");
    } catch (err: any) {
      console.error("Export error:", err);
      toast.dismiss(loadingToast);
      toast.error(err.message || "حدث خطأ أثناء تصدير ملف الكتب");
    } finally {
      setIsExporting(false);
    }
  };

  // 2. اختيار ملف وفحصه وعرض المعاينة
  const handleSelectFile = async (file: File) => {
    if (!file.name.toLowerCase().endsWith(".xlsx")) {
      toast.error("يرجى اختيار ملف بصيغة .xlsx فقط");
      return;
    }

    setSelectedFile(file);
    setIsImportModalOpen(true);
    setPreviewLoading(true);
    setPreviewData(null);

    try {
      const data: ExcelPreviewData = await previewBooksImportApi(file);
      setPreviewData(data);

      if (data.invalidCount > 0) {
        toast.warning(
          `تم فحص الملف: يحتوي على ${data.validCount} كتاب صالح و ${data.invalidCount} صف غير صالح`
        );
      } else {
        toast.success(`تم فحص الملف بنجاح: ${data.validCount} كتاب جاهز للاستيراد`);
      }
    } catch (err: any) {
      console.error("Preview error:", err);
      toast.error(err.message || "تعذر فحص وتدقيق ملف Excel");
    } finally {
      setPreviewLoading(false);
    }
  };

  // 3. تأكيد الاستيراد
  const handleConfirmImport = async (onSuccess?: () => void) => {
    if (!selectedFile || isImporting) return;

    setIsImporting(true);
    const loadingToast = toast.loading("جاري استيراد الكتب وتحديث قاعدة البيانات...");

    try {
      const result = await importBooksExcelApi(selectedFile);
      toast.dismiss(loadingToast);
      toast.success(
        `تم الاستيراد بنجاح! تمت إضافة ${result.createdCount} كتاب جديد، وتحديث ${result.updatedCount} كتاب.`,
        { duration: 6000 }
      );

      setIsImportModalOpen(false);
      setSelectedFile(null);
      setPreviewData(null);

      // استدعاء إعادة تحديث البيانات في الصفحة
      onSuccess?.();
    } catch (err: any) {
      console.error("Import error:", err);
      toast.dismiss(loadingToast);
      toast.error(err.message || "فشلت عملية استيراد الكتب");
    } finally {
      setIsImporting(false);
    }
  };

  const handleCloseModal = () => {
    if (isImporting) return; // منع الإغلاق أثناء المعالجة
    setIsImportModalOpen(false);
    setSelectedFile(null);
    setPreviewData(null);
  };

  return {
    isExporting,
    isImportModalOpen,
    selectedFile,
    previewLoading,
    isImporting,
    previewData,
    handleExportExcel,
    handleSelectFile,
    handleConfirmImport,
    handleCloseModal,
  };
}

