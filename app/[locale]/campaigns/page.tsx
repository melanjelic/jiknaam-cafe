"use client";

import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";
import { getActiveCampaigns, type Campaign } from "@/lib/firestore";
import FadeIn from "@/components/FadeIn";
import { Loader2 } from "lucide-react";

export default function CampaignsPage() {
  const t = useTranslations("campaigns");
  const tCommon = useTranslations("common");
  const locale = useLocale();

  const [items, setItems] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    getActiveCampaigns()
      .then(setItems)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const title = (c: Campaign) => (locale === "th" ? c.title_th || c.title_en : c.title_en);
  const desc = (c: Campaign) => (locale === "th" ? c.desc_th || c.desc_en : c.desc_en);

  return (
    <div className="min-h-screen py-20 px-5">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <FadeIn className="text-center mb-14">
          <p className="text-xs text-[#d4a853] font-medium tracking-widest uppercase mb-3">
            Jiknam
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
          <div className="text-center py-24">
            <p className="text-2xl mb-3">☕</p>
            <p className="text-[#555]">{t("noActive")}</p>
          </div>
        )}

        {!loading && !error && items.length > 0 && (
          <div className="space-y-6">
            {items.map((c, i) => (
              <FadeIn key={c.id} delay={i * 0.1}>
                <div
                  className={`relative overflow-hidden rounded-2xl flex flex-col ${
                    i === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  } bg-[#141414] border border-[#2a2a2a] hover:border-[#d4a853]/30 transition-colors group`}
                >
                  {/* Image */}
                  <div className="relative md:w-1/2 h-64 md:h-80 flex-shrink-0 overflow-hidden">
                    <Image
                      src={c.image_url}
                      alt={title(c)}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-8 md:p-12 flex flex-col justify-center">
                    <span className="inline-flex items-center gap-1.5 text-xs text-green-400 mb-4">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                      Active Promotion
                    </span>
                    <h2 className="text-2xl md:text-3xl font-bold text-[#f0ece4] mb-4">
                      {title(c)}
                    </h2>
                    <p className="text-[#888] leading-relaxed">{desc(c)}</p>
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
