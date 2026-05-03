"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import FadeIn from "@/components/FadeIn";
import { getMenuItems, type MenuItem } from "@/lib/firestore";
import { ArrowRight, Loader2 } from "lucide-react";

interface Props {
  sectionLabel: string;
  viewMenuLabel: string;
}

export default function HomeFeaturedMenu({ sectionLabel, viewMenuLabel }: Props) {
  const locale = useLocale();
  const t = useTranslations("home");
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMenuItems()
      .then((data) => setItems(data.slice(0, 3)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 size={24} className="animate-spin text-[#d4a853]" />
      </div>
    );
  }

  if (items.length === 0) return null;

  return (
    <section className="py-20 px-5">
      <div className="max-w-6xl mx-auto">
        <FadeIn>
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-xs text-[#d4a853] font-medium tracking-widest uppercase mb-2">
                {t("menuLabel")}
              </p>
              <h2 className="text-3xl font-bold text-[#f0ece4]">{sectionLabel}</h2>
            </div>
            <Link
              href="/menu"
              className="text-sm text-[#d4a853] hover:text-[#e8c472] flex items-center gap-1 transition-colors"
            >
              {viewMenuLabel} <ArrowRight size={14} />
            </Link>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((item, i) => (
            <FadeIn key={item.id} delay={i * 0.1}>
              <div className="group overflow-hidden rounded-2xl bg-[#141414] border border-[#2a2a2a] hover:border-[#d4a853]/30 transition-colors">
                <div className="relative h-52 overflow-hidden">
                  <Image
                    src={item.image_url}
                    alt={item.name_en}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent" />
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-[#f0ece4]">
                        {locale === "th" ? item.name_th || item.name_en : item.name_en}
                      </h3>
                      <p className="text-sm text-[#666]">
                        {locale === "th" ? item.name_en : item.name_th}
                      </p>
                    </div>
                    <span className="font-bold text-[#d4a853]">฿{item.price}</span>
                  </div>
                  {item.desc_en && (
                    <p className="text-xs text-[#555] mt-2 line-clamp-2">
                      {locale === "th" ? item.desc_th || item.desc_en : item.desc_en}
                    </p>
                  )}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
