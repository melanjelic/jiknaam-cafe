"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import FadeIn from "@/components/FadeIn";
import { getActiveCampaigns, type Campaign } from "@/lib/firestore";
import { ArrowRight, Loader2 } from "lucide-react";

interface Props {
  sectionLabel: string;
  learnMoreLabel: string;
}

export default function HomeActiveCampaigns({ sectionLabel, learnMoreLabel }: Props) {
  const locale = useLocale();
  const t = useTranslations("home");
  const [items, setItems] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getActiveCampaigns()
      .then((data) => setItems(data.slice(0, 2)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-16 bg-[#0a0a0a]">
        <Loader2 size={24} className="animate-spin text-[#d4a853]" />
      </div>
    );
  }

  if (items.length === 0) return null;

  return (
    <section className="py-20 px-5 bg-[#0a0a0a]">
      <div className="max-w-6xl mx-auto">
        <FadeIn>
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-xs text-[#d4a853] font-medium tracking-widest uppercase mb-2">
                {t("promotionsLabel")}
              </p>
              <h2 className="text-3xl font-bold text-[#f0ece4]">{sectionLabel}</h2>
            </div>
            <Link
              href="/campaigns"
              className="text-sm text-[#d4a853] hover:text-[#e8c472] flex items-center gap-1 transition-colors"
            >
              {learnMoreLabel} <ArrowRight size={14} />
            </Link>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map((c, i) => (
            <FadeIn key={c.id} delay={i * 0.1}>
              <div className="relative overflow-hidden rounded-2xl group">
                <div className="relative h-56">
                  <Image
                    src={c.image_url}
                    alt={c.title_en}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#0d0d0d]/80 to-transparent" />
                </div>
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  <h3 className="font-bold text-xl text-[#f0ece4]">
                    {locale === "th" ? c.title_th || c.title_en : c.title_en}
                  </h3>
                  <p className="text-sm text-[#bbb] mt-1 line-clamp-2">
                    {locale === "th" ? c.desc_th || c.desc_en : c.desc_en}
                  </p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
