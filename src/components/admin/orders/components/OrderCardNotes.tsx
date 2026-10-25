"use client";

import { FileText, ClipboardEdit, ChevronDown, Loader2 } from "lucide-react";

interface OrderCardNotesProps {
  notes?: string | null;
  hasCustomerNote: boolean;
  showCustomerNote: boolean;
  setShowCustomerNote: React.Dispatch<React.SetStateAction<boolean>>;
  hasSavedAdminNote: boolean;
  showAdminNote: boolean;
  setShowAdminNote: React.Dispatch<React.SetStateAction<boolean>>;
  adminNoteText: string;
  setAdminNoteText: (val: string) => void;
  savingNote: boolean;
  onSaveNote: () => void;
  onCancelNote: () => void;
}

export default function OrderCardNotes({
  notes,
  hasCustomerNote,
  showCustomerNote,
  setShowCustomerNote,
  hasSavedAdminNote,
  showAdminNote,
  setShowAdminNote,
  adminNoteText,
  setAdminNoteText,
  savingNote,
  onSaveNote,
  onCancelNote,
}: OrderCardNotesProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="pt-2 border-t border-border-subtle flex items-center justify-start gap-2 flex-wrap">
        {hasCustomerNote && (
          <button
            type="button"
            onClick={() => setShowCustomerNote((prev) => !prev)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-extrabold border transition-all cursor-pointer ${
              showCustomerNote
                ? "bg-info text-white border-info shadow-xs"
                : "bg-info-light text-info border-info-border hover:bg-info-light"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>العميل</span>
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform duration-200 ${
                showCustomerNote ? "rotate-180" : ""
              }`}
            />
          </button>
        )}

        <button
          type="button"
          onClick={() => setShowAdminNote((prev) => !prev)}
          className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-extrabold border transition-all cursor-pointer ${
            hasSavedAdminNote
              ? "bg-warning hover:bg-warning text-white border-warning-border shadow-xs"
              : "bg-surface-subtle hover:bg-surface-hover/80 text-muted border-border/80"
          }`}
        >
          <ClipboardEdit className="w-3.5 h-3.5" />
          <span>الأدمن</span>
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform duration-200 ${
              showAdminNote ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      {showCustomerNote && hasCustomerNote && (
        <div className="bg-info-light/70 border border-info-border rounded-2xl p-3.5 text-right flex flex-col gap-1 animate-in fade-in duration-150">
          <p className="text-xs font-extrabold text-info">
            ملاحظة كتبها العميل:
          </p>
          <p className="text-xs sm:text-sm text-sub font-medium leading-relaxed">
            {notes}
          </p>
        </div>
      )}

      {showAdminNote && (
        <div className="bg-warning-light/70 border border-warning-border/80 rounded-2xl p-4 text-right flex flex-col gap-3 animate-in fade-in duration-150">
          <p className="text-xs font-extrabold text-warning">
            ملاحظة الأدمن الخاصة بالطلب:
          </p>
          <textarea
            rows={2}
            value={adminNoteText}
            onChange={(e) => setAdminNoteText(e.target.value)}
            placeholder="اكتب ملاحظات المطبخ أو النواقص أو باقي المبلغ..."
            className="w-full p-3 bg-white border border-warning-border rounded-xl text-xs sm:text-sm text-body focus:outline-none focus:border-primary resize-none"
          />
          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onCancelNote}
              className="px-3 py-1.5 text-xs font-extrabold text-sub hover:text-heading cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="button"
              disabled={savingNote}
              onClick={onSaveNote}
              className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover disabled:opacity-60 text-white text-xs font-extrabold flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
            >
              {savingNote && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>حفظ الملاحظة</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
