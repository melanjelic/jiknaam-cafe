import { getTranslations } from "next-intl/server";
import FadeIn from "@/components/FadeIn";
import { MapPin, Clock, Phone, Mail, ExternalLink } from "lucide-react";

export default async function ContactPage() {
  const t = await getTranslations("contact");

  const details = [
    {
      icon: MapPin,
      label: t("address"),
      value: "123 Sukhumvit Road, Bangkok, Thailand 10110",
    },
    {
      icon: Clock,
      label: t("hours"),
      value: t("hoursValue"),
    },
    {
      icon: Phone,
      label: t("phone"),
      value: "+66 2 123 4567",
      href: "tel:+6621234567",
    },
    {
      icon: Mail,
      label: t("email"),
      value: "hello@jiknaam.com",
      href: "mailto:hello@jiknaam.com",
    },
  ];

  return (
    <div className="min-h-screen py-20 px-5">
      <div className="max-w-6xl mx-auto">
        <FadeIn className="text-center mb-14">
          <p className="text-xs text-[#d4a853] font-medium tracking-widest uppercase mb-3">
            Jiknaam
          </p>
          <h1 className="text-4xl font-bold text-[#f0ece4] mb-4">{t("title")}</h1>
          <p className="text-[#666]">{t("subtitle")}</p>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <FadeIn delay={0.1}>
            <div className="space-y-6">
              {details.map(({ icon: Icon, label, value, href }) => (
                <div
                  key={label}
                  className="flex gap-4 p-5 bg-[#141414] border border-[#2a2a2a] rounded-2xl hover:border-[#d4a853]/20 transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#d4a853]/10 flex items-center justify-center flex-shrink-0">
                    <Icon size={18} className="text-[#d4a853]" />
                  </div>
                  <div>
                    <p className="text-xs text-[#555] font-medium uppercase tracking-wider mb-1">
                      {label}
                    </p>
                    {href ? (
                      <a
                        href={href}
                        className="text-[#c8bfb0] hover:text-[#d4a853] transition-colors whitespace-pre-line"
                      >
                        {value}
                      </a>
                    ) : (
                      <p className="text-[#c8bfb0] whitespace-pre-line">{value}</p>
                    )}
                  </div>
                </div>
              ))}

              <div className="flex gap-3 pt-2">
                <a
                  href="#"
                  aria-label="Instagram"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#2a2a2a] text-sm text-[#666] hover:text-[#d4a853] hover:border-[#d4a853]/30 transition-colors"
                >
                  <ExternalLink size={15} /> Instagram
                </a>
                <a
                  href="#"
                  aria-label="Facebook"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#2a2a2a] text-sm text-[#666] hover:text-[#d4a853] hover:border-[#d4a853]/30 transition-colors"
                >
                  <ExternalLink size={15} /> Facebook
                </a>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="rounded-2xl overflow-hidden border border-[#2a2a2a] h-96 lg:h-full min-h-[360px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3875.5!2d100.5610!3d13.7297!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTPCsDQzJzQ3LjAiTiAxMDDCsDMzJzM5LjYiRQ!5e0!3m2!1sen!2sth!4v1"
                width="100%"
                height="100%"
                style={{ border: 0, filter: "invert(90%) hue-rotate(180deg)" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Jiknaam Cafe location"
              />
            </div>
          </FadeIn>
        </div>
      </div>
    </div>
  );
}
