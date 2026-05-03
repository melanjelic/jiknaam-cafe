"use client";

import { useEffect, useState } from "react";
import {
  getContactInfo,
  saveContactInfo,
  type ContactInfo,
  type DayKey,
  DEFAULT_CONTACT,
} from "@/lib/firestore";
import { useAdminLang } from "@/context/AdminLangContext";
import { Phone, Loader2, Check } from "lucide-react";

const DAYS: DayKey[] = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

export default function AdminContactPage() {
  const { t } = useAdminLang();
  const [form, setForm] = useState<ContactInfo>(DEFAULT_CONTACT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getContactInfo().then((data) => {
      setForm(data);
      setLoading(false);
    });
  }, []);

  function setField<K extends keyof ContactInfo>(key: K, value: ContactInfo[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function setDayField(day: DayKey, field: keyof import("@/lib/firestore").DayHours, value: string | boolean) {
    setForm((prev) => ({
      ...prev,
      hours: {
        ...prev.hours,
        [day]: { ...prev.hours[day], [field]: value },
      },
    }));
  }

  async function handleSave() {
    setSaving(true);
    try {
      await saveContactInfo(form);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 size={24} className="animate-spin text-[#d4a853]" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Phone size={20} className="text-[#d4a853]" />
          <h1 className="text-xl font-semibold text-[#f0ece4]">{t("contactInfo")}</h1>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-[#d4a853] hover:bg-[#c49a3c] disabled:opacity-50 text-[#0d0d0d] text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          {saving ? (
            <><Loader2 size={14} className="animate-spin" /> {t("savingChanges")}</>
          ) : saved ? (
            <><Check size={14} /> {t("savedChanges")}</>
          ) : (
            t("saveChanges")
          )}
        </button>
      </div>

      <div className="space-y-6">
        {/* Address */}
        <Section title={t("addressEn")}>
          <textarea
            rows={2}
            value={form.address_en}
            onChange={(e) => setField("address_en", e.target.value)}
            className={inputCls}
            placeholder="22/2 Moo 2, Bang Boribon, Prachin Buri, Thailand"
          />
        </Section>

        <Section title={t("addressTh")}>
          <textarea
            rows={2}
            value={form.address_th}
            onChange={(e) => setField("address_th", e.target.value)}
            className={inputCls}
            placeholder="22/2 หมู่ 2 ตำบล บางบริบูรณ์, ปราจีนบุรี"
          />
        </Section>

        {/* Contact details */}
        <div className="grid grid-cols-2 gap-4">
          <Section title={t("email")}>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setField("email", e.target.value)}
              className={inputCls}
              placeholder="hello@jiknaam.com"
            />
          </Section>
          <Section title={t("phone")}>
            <input
              value={form.phone}
              onChange={(e) => setField("phone", e.target.value)}
              className={inputCls}
              placeholder="+66 98 604 4280"
            />
          </Section>
        </div>

        {/* Social */}
        <div className="grid grid-cols-2 gap-4">
          <Section title={t("instagramUrl")}>
            <input
              value={form.instagram}
              onChange={(e) => setField("instagram", e.target.value)}
              className={inputCls}
              placeholder="https://instagram.com/jiknaam"
            />
          </Section>
          <Section title={t("facebookUrl")}>
            <input
              value={form.facebook}
              onChange={(e) => setField("facebook", e.target.value)}
              className={inputCls}
              placeholder="https://facebook.com/jiknaam"
            />
          </Section>
        </div>

        {/* Opening hours */}
        <div>
          <p className="text-xs font-medium text-[#888] mb-3">{t("hoursLabel")}</p>
          <div className="bg-[#141414] border border-[#2a2a2a] rounded-2xl overflow-hidden">
            {DAYS.map((day, i) => {
              const h = form.hours[day];
              return (
                <div
                  key={day}
                  className={`flex items-center gap-3 px-4 py-3 ${i !== 0 ? "border-t border-[#1f1f1f]" : ""}`}
                >
                  <span className="w-24 text-sm text-[#c8bfb0]">{t(day)}</span>

                  <button
                    onClick={() => setDayField(day, "open", !h.open)}
                    className={`text-xs px-3 py-1 rounded-full border transition-colors w-16 text-center ${
                      h.open
                        ? "bg-green-500/15 border-green-500/30 text-green-400"
                        : "bg-[#2a2a2a] border-[#3a3a3a] text-[#555]"
                    }`}
                  >
                    {h.open ? t("openLabel") : t("closedLabel")}
                  </button>

                  <div className={`flex items-center gap-2 transition-opacity ${h.open ? "opacity-100" : "opacity-30 pointer-events-none"}`}>
                    <span className="text-xs text-[#555]">{t("fromTime")}</span>
                    <input
                      type="time"
                      value={h.from}
                      onChange={(e) => setDayField(day, "from", e.target.value)}
                      className="bg-[#1c1c1c] border border-[#3a3a3a] rounded-lg px-2 py-1 text-xs text-[#f0ece4] focus:outline-none focus:border-[#d4a853] transition-colors"
                    />
                    <span className="text-xs text-[#555]">{t("toTime")}</span>
                    <input
                      type="time"
                      value={h.to}
                      onChange={(e) => setDayField(day, "to", e.target.value)}
                      className="bg-[#1c1c1c] border border-[#3a3a3a] rounded-lg px-2 py-1 text-xs text-[#f0ece4] focus:outline-none focus:border-[#d4a853] transition-colors"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

const inputCls = "w-full bg-[#1c1c1c] border border-[#3a3a3a] rounded-lg px-3 py-2 text-sm text-[#f0ece4] placeholder-[#555] focus:outline-none focus:border-[#d4a853] transition-colors";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <p className="text-xs font-medium text-[#888]">{title}</p>
      {children}
    </div>
  );
}
