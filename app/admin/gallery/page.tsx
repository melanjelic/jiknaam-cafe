"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import {
  getGalleryItems,
  addGalleryItem,
  deleteGalleryItem,
  type GalleryItem,
} from "@/lib/firestore";
import { uploadImage } from "@/lib/storage";
import { Images, Trash2, Upload, Loader2 } from "lucide-react";

export default function AdminGalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function load() {
    setLoading(true);
    setItems(await getGalleryItems());
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setUploading(true);
    try {
      await Promise.all(
        files.map(async (file) => {
          const url = await uploadImage(file, "gallery");
          await addGalleryItem({
            image_url: url,
            alt_text: file.name.replace(/\.[^/.]+$/, "").replace(/_/g, " "),
          });
        })
      );
      await load();
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function handleDelete(item: GalleryItem) {
    if (!confirm("Remove this image from the gallery?")) return;
    await deleteGalleryItem(item.id);
    await load();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Images size={20} className="text-[#d4a853]" />
          <h1 className="text-xl font-semibold text-[#f0ece4]">Gallery</h1>
          <span className="text-xs text-[#555] bg-[#1c1c1c] px-2 py-0.5 rounded-full">{items.length}</span>
        </div>
        <div>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleUpload}
          />
          <button
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 bg-[#d4a853] hover:bg-[#c49a3c] disabled:opacity-50 text-[#0d0d0d] text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            {uploading ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />}
            {uploading ? "Uploading..." : "Upload Images"}
          </button>
        </div>
      </div>

      {/* Drop hint */}
      {items.length === 0 && !loading && (
        <button
          onClick={() => inputRef.current?.click()}
          className="w-full border-2 border-dashed border-[#2a2a2a] hover:border-[#d4a853]/40 rounded-2xl py-20 flex flex-col items-center gap-3 text-[#555] hover:text-[#888] transition-colors"
        >
          <Upload size={28} />
          <span className="text-sm">Click to upload images</span>
        </button>
      )}

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 size={24} className="animate-spin text-[#d4a853]" /></div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {items.map((item) => (
            <div key={item.id} className="relative aspect-square rounded-xl overflow-hidden group">
              <Image src={item.image_url} alt={item.alt_text} fill className="object-cover" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  onClick={() => handleDelete(item)}
                  className="p-2.5 bg-red-500 hover:bg-red-600 rounded-xl text-white transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
