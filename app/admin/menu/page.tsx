"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Image from "next/image";
import {
  getMenuItems,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
  type MenuItem,
  type MenuCategory,
} from "@/lib/firestore";
import { uploadImage } from "@/lib/storage";
import { Plus, Pencil, Trash2, X, UtensilsCrossed, Loader2 } from "lucide-react";

type FormData = Omit<MenuItem, "id"> & { imageFile?: FileList };

const CATEGORIES: MenuCategory[] = ["Drink", "Food", "Dessert"];

const SEED_IMAGES: Record<MenuCategory, string> = {
  Drink: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&q=80",
  Food: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80",
  Dessert: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&q=80",
};

export default function AdminMenuPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<MenuItem | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [filterCat, setFilterCat] = useState<MenuCategory | "All">("All");

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<FormData>();
  const watchedCategory = watch("category");

  async function load() {
    setLoading(true);
    setItems(await getMenuItems());
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function openAdd() {
    reset({ category: "Drink", price: 0, image_url: SEED_IMAGES["Drink"] });
    setEditing(null);
    setShowForm(true);
  }

  function openEdit(item: MenuItem) {
    reset({ ...item });
    setEditing(item);
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditing(null);
    reset();
  }

  // Auto-fill placeholder image when category changes (only for new items)
  useEffect(() => {
    if (!editing && watchedCategory && SEED_IMAGES[watchedCategory as MenuCategory]) {
      setValue("image_url", SEED_IMAGES[watchedCategory as MenuCategory]);
    }
  }, [watchedCategory, editing, setValue]);

  async function onSubmit(data: FormData) {
    setSaving(true);
    try {
      let image_url = data.image_url;

      if (data.imageFile && data.imageFile.length > 0) {
        image_url = await uploadImage(data.imageFile[0], "menu");
      }

      const payload: Omit<MenuItem, "id"> = {
        name_en: data.name_en,
        name_th: data.name_th,
        desc_en: data.desc_en,
        desc_th: data.desc_th,
        price: Number(data.price),
        category: data.category,
        image_url,
      };

      if (editing) {
        await updateMenuItem(editing.id, payload);
      } else {
        await addMenuItem(payload);
      }

      await load();
      closeForm();
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this menu item?")) return;
    await deleteMenuItem(id);
    await load();
  }

  const filtered = filterCat === "All" ? items : items.filter((i) => i.category === filterCat);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <UtensilsCrossed size={20} className="text-[#d4a853]" />
          <h1 className="text-xl font-semibold text-[#f0ece4]">Menu</h1>
          <span className="text-xs text-[#555] bg-[#1c1c1c] px-2 py-0.5 rounded-full">{items.length}</span>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-[#d4a853] hover:bg-[#c49a3c] text-[#0d0d0d] text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          <Plus size={15} /> Add Item
        </button>
      </div>

      {/* Category filter */}
      <div className="flex gap-2 mb-6">
        {(["All", ...CATEGORIES] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCat(cat)}
            className={`text-xs px-3.5 py-1.5 rounded-full border transition-colors ${
              filterCat === cat
                ? "bg-[#d4a853]/15 border-[#d4a853]/40 text-[#d4a853]"
                : "border-[#2a2a2a] text-[#666] hover:text-[#f0ece4]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 size={24} className="animate-spin text-[#d4a853]" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-[#555]">No items found.</div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((item) => (
            <div key={item.id} className="bg-[#141414] border border-[#2a2a2a] rounded-2xl overflow-hidden group">
              <div className="relative h-48 overflow-hidden">
                <Image src={item.image_url} alt={item.name_en} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button onClick={() => openEdit(item)} className="p-2 bg-[#1c1c1c] rounded-lg hover:bg-[#d4a853] hover:text-[#0d0d0d] text-[#f0ece4] transition-colors">
                    <Pencil size={14} />
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="p-2 bg-[#1c1c1c] rounded-lg hover:bg-red-500 text-[#f0ece4] transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-[#f0ece4] text-sm">{item.name_en}</p>
                    <p className="text-xs text-[#666]">{item.name_th}</p>
                  </div>
                  <span className="text-xs font-semibold text-[#d4a853] whitespace-nowrap">฿{item.price}</span>
                </div>
                <span className="mt-2 inline-block text-[10px] px-2 py-0.5 rounded-full bg-[#2a2a2a] text-[#888]">
                  {item.category}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#141414] border border-[#2a2a2a] rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-[#2a2a2a]">
              <h2 className="font-semibold text-[#f0ece4]">{editing ? "Edit Item" : "Add Item"}</h2>
              <button onClick={closeForm} className="text-[#555] hover:text-[#f0ece4] transition-colors">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Field label="Name (EN)" error={errors.name_en?.message}>
                  <input {...register("name_en", { required: "Required" })} className={inputCls} placeholder="Latte" />
                </Field>
                <Field label="Name (TH)" error={errors.name_th?.message}>
                  <input {...register("name_th", { required: "Required" })} className={inputCls} placeholder="ลาเต้" />
                </Field>
              </div>

              <Field label="Description (EN)">
                <textarea {...register("desc_en")} rows={2} className={inputCls} placeholder="Rich espresso with steamed milk..." />
              </Field>
              <Field label="Description (TH)">
                <textarea {...register("desc_th")} rows={2} className={inputCls} placeholder="เอสเพรสโซ่เข้มข้น..." />
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Price (฿)" error={errors.price?.message}>
                  <input type="number" min={0} {...register("price", { required: "Required", min: 0 })} className={inputCls} placeholder="95" />
                </Field>
                <Field label="Category" error={errors.category?.message}>
                  <select {...register("category", { required: "Required" })} className={inputCls}>
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </Field>
              </div>

              <Field label="Image URL (placeholder)">
                <input {...register("image_url")} className={inputCls} placeholder="https://images.unsplash.com/..." />
              </Field>

              <Field label="Upload Image (overrides URL)">
                <input type="file" accept="image/*" {...register("imageFile")} className="text-sm text-[#888] file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-[#2a2a2a] file:text-[#f0ece4] file:text-xs hover:file:bg-[#3a3a3a] cursor-pointer" />
              </Field>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={closeForm} className="px-4 py-2 text-sm text-[#888] hover:text-[#f0ece4] transition-colors">Cancel</button>
                <button type="submit" disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-[#d4a853] hover:bg-[#c49a3c] disabled:opacity-50 text-[#0d0d0d] text-sm font-semibold rounded-lg transition-colors">
                  {saving && <Loader2 size={13} className="animate-spin" />}
                  {saving ? "Saving..." : "Save"}
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
