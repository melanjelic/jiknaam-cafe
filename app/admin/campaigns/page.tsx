"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Image from "next/image";
import {
  getCampaigns,
  addCampaign,
  updateCampaign,
  deleteCampaign,
  type Campaign,
} from "@/lib/firestore";
import { uploadImage } from "@/lib/storage";
import { useAdminLang } from "@/context/AdminLangContext";
import { Plus, Pencil, Trash2, X, Megaphone, Loader2 } from "lucide-react";

type FormData = Omit<Campaign, "id"> & { imageFile?: FileList };

export default function AdminCampaignsPage() {
  const { t } = useAdminLang();
  const [items, setItems] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<Campaign | null>(null);
  const [showForm, setShowForm] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>();

  async function load() {
    setLoading(true);
    setItems(await getCampaigns());
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function openAdd() {
    reset({ active_status: true, image_url: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80" });
    setEditing(null);
    setShowForm(true);
  }

  function openEdit(item: Campaign) {
    reset({ ...item });
    setEditing(item);
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditing(null);
    reset();
  }

  async function onSubmit(data: FormData) {
    setSaving(true);
    try {
      let image_url = data.image_url;
      if (data.imageFile && data.imageFile.length > 0) {
        image_url = await uploadImage(data.imageFile[0], "campaigns");
      }

      const payload: Omit<Campaign, "id"> = {
        title_en: data.title_en,
        title_th: data.title_th,
        desc_en: data.desc_en,
        desc_th: data.desc_th,
        image_url,
        active_status: Boolean(data.active_status),
      };

      if (editing) {
        await updateCampaign(editing.id, payload);
      } else {
        await addCampaign(payload);
      }

      await load();
      closeForm();
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm(t("deleteCampaignConfirm"))) return;
    await deleteCampaign(id);
    await load();
  }

  async function toggleActive(item: Campaign) {
    await updateCampaign(item.id, { active_status: !item.active_status });
    await load();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Megaphone size={20} className="text-[#d4a853]" />
          <h1 className="text-xl font-semibold text-[#f0ece4]">{t("campaigns")}</h1>
          <span className="text-xs text-[#555] bg-[#1c1c1c] px-2 py-0.5 rounded-full">{items.length}</span>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-[#d4a853] hover:bg-[#c49a3c] text-[#0d0d0d] text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
          <Plus size={15} /> {t("addCampaign")}
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 size={24} className="animate-spin text-[#d4a853]" /></div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 text-[#555]">{t("noCampaigns")}</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <div key={item.id} className="bg-[#141414] border border-[#2a2a2a] rounded-2xl overflow-hidden group">
              <div className="relative h-48 overflow-hidden">
                <Image src={item.image_url} alt={item.title_en} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent" />
                <div className="absolute top-2 right-2">
                  <button
                    onClick={() => toggleActive(item)}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-semibold transition-colors ${
                      item.active_status
                        ? "bg-green-500/20 text-green-400 border border-green-500/30"
                        : "bg-[#2a2a2a] text-[#555] border border-[#3a3a3a]"
                    }`}
                  >
                    {item.active_status ? t("active") : t("inactive")}
                  </button>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-[#f0ece4] text-sm">{item.title_en}</p>
                    <p className="text-xs text-[#666] mt-0.5">{item.title_th}</p>
                    <p className="text-xs text-[#555] mt-1 line-clamp-2">{item.desc_en}</p>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <button onClick={() => openEdit(item)} className="p-1.5 rounded-lg hover:bg-[#2a2a2a] text-[#888] hover:text-[#f0ece4] transition-colors">
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="p-1.5 rounded-lg hover:bg-red-400/10 text-[#888] hover:text-red-400 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#141414] border border-[#2a2a2a] rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-[#2a2a2a]">
              <h2 className="font-semibold text-[#f0ece4]">{editing ? t("editCampaign") : t("addCampaign")}</h2>
              <button onClick={closeForm} className="text-[#555] hover:text-[#f0ece4] transition-colors"><X size={18} /></button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Field label={t("titleEn")} error={errors.title_en ? t("required") : undefined}>
                  <input {...register("title_en", { required: true })} className={inputCls} placeholder="Happy Hour" />
                </Field>
                <Field label={t("titleTh")} error={errors.title_th ? t("required") : undefined}>
                  <input {...register("title_th", { required: true })} className={inputCls} placeholder="แฮปปี้ อาวร์" />
                </Field>
              </div>
              <Field label={t("descEn")}>
                <textarea {...register("desc_en")} rows={2} className={inputCls} placeholder="50% off all drinks..." />
              </Field>
              <Field label={t("descTh")}>
                <textarea {...register("desc_th")} rows={2} className={inputCls} placeholder="ลด 50%..." />
              </Field>
              <Field label={t("imageUrlShort")}>
                <input {...register("image_url")} className={inputCls} placeholder="https://images.unsplash.com/..." />
              </Field>
              <Field label={t("uploadImage")}>
                <input type="file" accept="image/*" {...register("imageFile")} className="text-sm text-[#888] file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-[#2a2a2a] file:text-[#f0ece4] file:text-xs hover:file:bg-[#3a3a3a] cursor-pointer" />
              </Field>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="active" {...register("active_status")} className="w-4 h-4 accent-[#d4a853]" />
                <label htmlFor="active" className="text-sm text-[#888]">{t("activeLabel")}</label>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={closeForm} className="px-4 py-2 text-sm text-[#888] hover:text-[#f0ece4] transition-colors">{t("cancel")}</button>
                <button type="submit" disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-[#d4a853] hover:bg-[#c49a3c] disabled:opacity-50 text-[#0d0d0d] text-sm font-semibold rounded-lg transition-colors">
                  {saving && <Loader2 size={13} className="animate-spin" />}
                  {saving ? t("saving") : t("save")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const inputCls = "w-full bg-[#1c1c1c] border border-[#3a3a3a] rounded-lg px-3 py-2 text-sm text-[#f0ece4] placeholder-[#555] focus:outline-none focus:border-[#d4a853] transition-colors";

function Field({ label, children, error }: { label: string; children: React.ReactNode; error?: string }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-[#888]">{label}</label>
      {children}
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
