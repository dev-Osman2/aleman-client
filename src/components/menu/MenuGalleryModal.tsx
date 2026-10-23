/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect, useCallback } from "react";
import { X, ChevronRight, ChevronLeft, Loader2 } from "lucide-react";

interface MenuGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
}

export default function MenuGalleryModal({
  isOpen,
  onClose,
  images,
}: MenuGalleryModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);
  const minSwipeDistance = 45;

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(0);
      setIsLoading(true);

      images.forEach((src) => {
        const img = new Image();
        img.src = src;
      });
    }
  }, [isOpen, images]);

  const handleNext = useCallback(() => {
    setIsLoading(true);
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const handlePrev = useCallback(() => {
    setIsLoading(true);
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEndX(null);
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStartX || !touchEndX) return;
    const distance = touchStartX - touchEndX;

    if (distance > minSwipeDistance) {
      handleNext();
    } else if (distance < -minSwipeDistance) {
      handlePrev();
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") handleNext();
      if (e.key === "ArrowRight") handlePrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleNext, handlePrev, onClose]);

  if (!isOpen || images.length === 0) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-2 sm:p-6 animate-in fade-in duration-200 select-none"
      onClick={onClose}
    >
      <div
        className="relative flex flex-col items-center justify-center max-w-4xl w-full max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-0 right-0 z-30 bg-black/60 hover:bg-primary text-white p-2.5 rounded-full transition-colors shadow-lg cursor-pointer"
          aria-label="إغلاق المنيو"
        >
          <X size={20} />
        </button>

        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-30 bg-black/60 text-white text-xs sm:text-sm font-bold px-3 py-1 rounded-full shadow-md backdrop-blur-xs">
          {currentIndex + 1} / {images.length}
        </div>

        <button
          type="button"
          onClick={handlePrev}
          className="absolute right-1 sm:right-4 top-1/2 -translate-y-1/2 z-30 bg-black/40 hover:bg-primary text-white p-1.5 sm:p-3 rounded-full transition-all shadow-md cursor-pointer active:scale-90"
          aria-label="الصفحة السابقة"
        >
          <ChevronRight size={18} className="sm:w-6 sm:h-6" />
        </button>

        <button
          type="button"
          onClick={handleNext}
          className="absolute left-1 sm:left-4 top-1/2 -translate-y-1/2 z-30 bg-black/40 hover:bg-primary text-white p-1.5 sm:p-3 rounded-full transition-all shadow-md cursor-pointer active:scale-90"
          aria-label="الصفحة التالية"
        >
          <ChevronLeft size={18} className="sm:w-6 sm:h-6" />
        </button>

        <div
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="relative min-h-[300px] w-full flex items-center justify-center touch-pan-y"
        >
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          )}
          <img
            key={currentIndex}
            src={images[currentIndex]}
            alt={`صفحة المنيو ${currentIndex + 1}`}
            onLoad={() => setIsLoading(false)}
            draggable={false}
            className={`max-h-[84vh] w-auto max-w-full object-contain rounded-xl shadow-2xl transition-opacity duration-150 ${
              isLoading ? "opacity-0" : "opacity-100"
            }`}
          />
        </div>
      </div>
    </div>
  );
}
