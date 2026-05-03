"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { getGalleryItems, type GalleryItem } from "@/lib/firestore";
import FadeIn from "@/components/FadeIn";
import { Loader2, X } from "lucide-react";

export default function GalleryPage() {
  const t = useTranslations("gallery");
  const tCommon = useTranslations("common");

  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [lightbox, setLightbox] = useState<GalleryItem | null>(null);

  useEffect(() => {
    getGalleryItems()
      .then(setItems)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  // Simple masonry: split items into 3 columns
  const cols: GalleryItem[][] = [[], [], []];
  items.forEach((item, i) => cols[i % 3].push(item));

  return (
    <div className="min-h-screen py-20 px-5">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <FadeIn className="text-center mb-14">
          <p className="text-xs text-[#d4a853] font-medium tracking-widest uppercase mb-3">
            Jiknaam
          </p>
          <h1 className="text-4xl font-bold text-[#f0ece4] mb-4">{t("title")}</h1>
          <p className="text-[#666]">{t("subtitle")}</p>
        </FadeIn>

        {loading && (
          <div className="flex justify-center py-24">
            <Loader2 size={28} className="animate-spin text-[#d4a853]" />
          </div>
        )}
        {error && <p className="text-center text-[#666] py-24">{tCommon("error")}</p>}
        {!loading && !error && items.length === 0 && (
          <p className="text-center text-[#555] py-24">{tCommon("noItems")}</p>
        )}

        {/* Masonry */}
        {!loading && !error && items.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
            {cols.map((col, ci) => (
              <div key={ci} className="flex flex-col gap-4">
                {col.map((item, i) => (
                  <FadeIn key={item.id} delay={i * 0.08}>
                    <button
                      onClick={() => setLightbox(item)}
                      className="relative w-full overflow-hidden rounded-xl group cursor-zoom-in"
                      style={{ aspectRatio: i % 2 === 0 ? "4/3" : "3/4" }}
                    >
                      <Image
                        src={item.image_url}
                        alt={item.alt_text}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300" />
                    </button>
                  </FadeIn>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="relative max-w-3xl w-full max-h-[85vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full h-[75vh]">
                <Image
                  src={lightbox.image_url}
                  alt={lightbox.alt_text}
                  fill
                  className="object-contain"
                />
              </div>
              <button
                onClick={() => setLightbox(null)}
                className="absolute -top-10 right-0 text-[#888] hover:text-[#f0ece4] transition-colors"
              >
                <X size={22} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
