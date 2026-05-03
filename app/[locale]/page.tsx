import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import FadeIn from "@/components/FadeIn";
import HomeFeaturedMenu from "@/components/HomeFeaturedMenu";
import HomeActiveCampaigns from "@/components/HomeActiveCampaigns";
import { ArrowRight } from "lucide-react";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const [t, tCommon] = await Promise.all([
    getTranslations("home"),
    getTranslations("common"),
  ]);

  return (
    <>
      {/* Hero — fully static, no Firebase */}
      <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1800&q=80"
            alt="Cafe interior"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0d0d0d]/70 via-[#0d0d0d]/50 to-[#0d0d0d]" />
        </div>

        <div className="relative z-10 text-center px-5 max-w-2xl mx-auto">
          <FadeIn delay={0.1}>
            <div className="inline-flex items-center gap-2 bg-[#d4a853]/10 border border-[#d4a853]/30 rounded-full px-4 py-1.5 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-[#d4a853] animate-pulse" />
              <span className="text-xs text-[#d4a853] font-medium tracking-widest uppercase">
                Specialty Coffee
              </span>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <h1 className="text-5xl md:text-6xl font-bold text-[#f0ece4] leading-tight mb-6">
              {t("heroTitle")}
            </h1>
          </FadeIn>

          <FadeIn delay={0.3}>
            <p className="text-lg text-[#a09080] leading-relaxed mb-10">
              {t("heroSubtitle")}
            </p>
          </FadeIn>

          <FadeIn delay={0.4}>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/menu"
                className="flex items-center gap-2 bg-[#d4a853] hover:bg-[#c49a3c] text-[#0d0d0d] font-semibold px-7 py-3 rounded-full transition-colors"
              >
                {tCommon("viewMenu")}
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/contact"
                className="flex items-center gap-2 border border-[#3a3a3a] hover:border-[#d4a853]/40 text-[#888] hover:text-[#f0ece4] px-7 py-3 rounded-full transition-colors"
              >
                {locale === "th" ? "หาเรา" : "Find Us"}
              </Link>
            </div>
          </FadeIn>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-px h-10 bg-gradient-to-b from-transparent to-[#d4a853]/60" />
        </div>
      </section>

      {/* Featured menu — client component, fetches on mount */}
      <HomeFeaturedMenu
        sectionLabel={t("menuSection")}
        viewMenuLabel={tCommon("viewMenu")}
      />

      {/* Active campaigns — client component, fetches on mount */}
      <HomeActiveCampaigns
        sectionLabel={t("campaignsSection")}
        learnMoreLabel={tCommon("learnMore")}
      />

      {/* Quote */}
      <section className="py-24 px-5 text-center">
        <FadeIn>
          <blockquote className="max-w-xl mx-auto">
            <p className="text-2xl font-light text-[#888] leading-relaxed italic">
              &ldquo;A great cup of coffee is a love letter to the senses.&rdquo;
            </p>
            <span className="mt-4 block text-xs text-[#d4a853] tracking-widest uppercase">
              — Jiknaam
            </span>
          </blockquote>
        </FadeIn>
      </section>
    </>
  );
}
