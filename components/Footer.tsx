import { getTranslations } from "next-intl/server";
import { Coffee } from "lucide-react";
import { Link } from "@/i18n/navigation";

export default async function Footer() {
  const t = await getTranslations("footer");
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[#1c1c1c] bg-[#0d0d0d]">
      <div className="max-w-6xl mx-auto px-5 py-12">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
          {/* Brand */}
          <div className="flex flex-col items-center md:items-start gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#d4a853]/10 border border-[#d4a853]/30 flex items-center justify-center">
                <Coffee size={15} className="text-[#d4a853]" />
              </div>
              <span className="font-semibold text-[#f0ece4] tracking-wide text-sm">
                JIKNAAM
              </span>
            </div>
            <p className="text-sm text-[#555] max-w-xs text-center md:text-left">
              {t("tagline")}
            </p>
          </div>

          {/* Nav links */}
          <nav className="flex flex-col items-center md:items-start gap-2">
            {(["home", "menu", "gallery", "campaigns", "contact"] as const).map((key) => (
              <Link
                key={key}
                href={key === "home" ? "/" : `/${key}`}
                className="text-sm text-[#555] hover:text-[#d4a853] transition-colors capitalize"
              >
                {key}
              </Link>
            ))}
          </nav>

          {/* Social */}
          <div className="flex flex-col items-center md:items-start gap-3">
            <p className="text-xs font-medium text-[#666] uppercase tracking-wider">
              {t("follow")}
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full border border-[#2a2a2a] flex items-center justify-center text-[#666] hover:text-[#d4a853] hover:border-[#d4a853]/40 transition-colors text-xs font-bold"
              >
                IG
              </a>
              <a
                href="#"
                aria-label="Facebook"
                className="w-9 h-9 rounded-full border border-[#2a2a2a] flex items-center justify-center text-[#666] hover:text-[#d4a853] hover:border-[#d4a853]/40 transition-colors text-xs font-bold"
              >
                FB
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-[#1c1c1c] text-center">
          <p className="text-xs text-[#444]">
            {t("copyright", { year })}
          </p>
        </div>
      </div>
    </footer>
  );
}
