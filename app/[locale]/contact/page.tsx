"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import FadeIn from "@/components/FadeIn";
import { MapPin, Clock, Phone, Mail, ExternalLink, Loader2 } from "lucide-react";
import { getContactInfo, type ContactInfo, type DayKey, DEFAULT_CONTACT } from "@/lib/firestore";

const DAYS: DayKey[] = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
const DAY_LABELS: Record<DayKey, { en: string; th: string }> = {
  monday:    { en: "Mon", th: "จันทร์" },
  tuesday:   { en: "Tue", th: "อังคาร" },
  wednesday: { en: "Wed", th: "พุธ" },
  thursday:  { en: "Thu", th: "พฤหัสบดี" },
  friday:    { en: "Fri", th: "ศุกร์" },
  saturday:  { en: "Sat", th: "เสาร์" },
  sunday:    { en: "Sun", th: "อาทิตย์" },
};

export default function ContactPage() {
  const t = useTranslations("contact");
  const [info, setInfo] = useState<ContactInfo>(DEFAULT_CONTACT);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getContactInfo().then((data) => {
      setInfo(data);
      setLoading(false);
    });
  }, []);

  const locale = typeof window !== "undefined"
    ? document.documentElement.lang || "en"
    : "en";

  const address = locale === "th" ? info.address_th : info.address_en;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 size={28} className="animate-spin text-[#d4a853]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 px-5">
      <div className="max-w-6xl mx-auto">
        <FadeIn className="text-center mb-14">
          <p className="text-xs text-[#d4a853] font-medium tracking-widest uppercase mb-3">
            Jiknam
          </p>
          <h1 className="text-4xl font-bold text-[#f0ece4] mb-4">
            {t("title")}
          </h1>
          <p className="text-[#666]">{t("subtitle")}</p>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <FadeIn delay={0.1}>
            <div className="space-y-6">
              {/* Address */}
              <div className="flex gap-4 p-5 bg-[#141414] border border-[#2a2a2a] rounded-2xl hover:border-[#d4a853]/20 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-[#d4a853]/10 flex items-center justify-center flex-shrink-0">
                  <MapPin size={18} className="text-[#d4a853]" />
                </div>
                <div>
                  <p className="text-xs text-[#555] font-medium uppercase tracking-wider mb-1">{t("address")}</p>
                  <p className="text-[#c8bfb0] whitespace-pre-line">{address}</p>
                </div>
              </div>

              {/* Hours */}
              <div className="flex gap-4 p-5 bg-[#141414] border border-[#2a2a2a] rounded-2xl hover:border-[#d4a853]/20 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-[#d4a853]/10 flex items-center justify-center flex-shrink-0">
                  <Clock size={18} className="text-[#d4a853]" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-[#555] font-medium uppercase tracking-wider mb-2">{t("hours")}</p>
                  <div className="space-y-1">
                    {DAYS.map((day) => {
                      const h = info.hours[day];
                      const label = locale === "th" ? DAY_LABELS[day].th : DAY_LABELS[day].en;
                      return (
                        <div key={day} className="flex items-center justify-between text-sm">
                          <span className="text-[#888] w-20">{label}</span>
                          {h.open ? (
                            <span className="text-[#c8bfb0]">{h.from} – {h.to}</span>
                          ) : (
                            <span className="text-[#555]">{locale === "th" ? "ปิด" : "Closed"}</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Phone */}
              <div className="flex gap-4 p-5 bg-[#141414] border border-[#2a2a2a] rounded-2xl hover:border-[#d4a853]/20 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-[#d4a853]/10 flex items-center justify-center flex-shrink-0">
                  <Phone size={18} className="text-[#d4a853]" />
                </div>
                <div>
                  <p className="text-xs text-[#555] font-medium uppercase tracking-wider mb-1">{t("phone")}</p>
                  <a href={`tel:${info.phone.replace(/\s/g, "")}`} className="text-[#c8bfb0] hover:text-[#d4a853] transition-colors">
                    {info.phone}
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex gap-4 p-5 bg-[#141414] border border-[#2a2a2a] rounded-2xl hover:border-[#d4a853]/20 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-[#d4a853]/10 flex items-center justify-center flex-shrink-0">
                  <Mail size={18} className="text-[#d4a853]" />
                </div>
                <div>
                  <p className="text-xs text-[#555] font-medium uppercase tracking-wider mb-1">{t("email")}</p>
                  <a href={`mailto:${info.email}`} className="text-[#c8bfb0] hover:text-[#d4a853] transition-colors">
                    {info.email}
                  </a>
                </div>
              </div>

              {/* Social */}
              <div className="flex gap-3 pt-2">
                {info.instagram && info.instagram !== "#" && (
                  <a
                    href={info.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#2a2a2a] text-sm text-[#666] hover:text-[#d4a853] hover:border-[#d4a853]/30 transition-colors"
                  >
                    <ExternalLink size={15} /> Instagram
                  </a>
                )}
                {info.facebook && info.facebook !== "#" && (
                  <a
                    href={info.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#2a2a2a] text-sm text-[#666] hover:text-[#d4a853] hover:border-[#d4a853]/30 transition-colors"
                  >
                    <ExternalLink size={15} /> Facebook
                  </a>
                )}
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="rounded-2xl overflow-hidden border border-[#2a2a2a] h-96 lg:h-full min-h-[360px]">
              <iframe
                src="https://www.google.com/maps?q=14.0348529,101.4245145&z=15&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0, filter: "invert(90%) hue-rotate(180deg)" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Jiknam Cafe location"
              />
            </div>
          </FadeIn>
        </div>
      </div>
    </div>
  );
}
