"use client";

import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";
import { getMenuItems, type MenuItem, type MenuCategory } from "@/lib/firestore";
import FadeIn from "@/components/FadeIn";
import { Loader2 } from "lucide-react";

const CATEGORIES = ["All", "Drink", "Food", "Dessert"] as const;

export default function MenuPage() {
  const t = useTranslations("menu");
  const tCommon = useTranslations("common");
  const locale = useLocale();

  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [active, setActive] = useState<"All" | MenuCategory>("All");

  useEffect(() => {
    getMenuItems()
      .then(setItems)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const filtered = active === "All" ? items : items.filter((i) => i.category === active);

  const name = (item: MenuItem) =>
    locale === "th" ? item.name_th || item.name_en : item.name_en;
  const desc = (item: MenuItem) =>
    locale === "th" ? item.desc_th || item.desc_en : item.desc_en;

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

        {/* Category tabs */}
        <FadeIn delay={0.1} className="flex justify-center flex-wrap gap-2 mb-12">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium border transition-all duration-200 ${
                active === cat
                  ? "bg-[#d4a853] border-[#d4a853] text-[#0d0d0d]"
                  : "border-[#2a2a2a] text-[#666] hover:text-[#f0ece4] hover:border-[#3a3a3a]"
              }`}
            >
              {cat === "All"
                ? t("categories.all")
                : cat === "Drink"
                ? t("categories.drink")
                : cat === "Food"
                ? t("categories.food")
                : t("categories.dessert")}
            </button>
          ))}
        </FadeIn>

        {/* States */}
        {loading && (
          <div className="flex justify-center py-24">
            <Loader2 size={28} className="animate-spin text-[#d4a853]" />
          </div>
        )}
        {error && (
          <p className="text-center text-[#666] py-24">{tCommon("error")}</p>
        )}
        {!loading && !error && filtered.length === 0 && (
          <p className="text-center text-[#555] py-24">{tCommon("noItems")}</p>
        )}

        {/* Grid */}
        {!loading && !error && filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((item, i) => (
              <FadeIn key={item.id} delay={Math.min(i * 0.05, 0.3)}>
                <div className="group bg-[#141414] border border-[#2a2a2a] rounded-2xl overflow-hidden hover:border-[#d4a853]/30 transition-colors">
                  <div className="relative h-44 overflow-hidden">
                    <Image
                      src={item.image_url}
                      alt={name(item)}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3">
                      <span className="text-[10px] font-semibold bg-[#0d0d0d]/80 backdrop-blur-sm text-[#d4a853] px-2.5 py-1 rounded-full">
                        {item.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <h3 className="font-semibold text-[#f0ece4] text-sm leading-snug">
                        {name(item)}
                      </h3>
                      <span className="text-[#d4a853] font-bold text-sm whitespace-nowrap">
                        ฿{item.price}
                      </span>
                    </div>
                    {desc(item) && (
                      <p className="text-xs text-[#555] line-clamp-2 leading-relaxed">
                        {desc(item)}
                      </p>
                    )}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
