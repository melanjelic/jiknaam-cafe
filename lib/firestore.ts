import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";

// ─── Types ────────────────────────────────────────────────────────────────────

export type MenuCategory = "Drink" | "Food" | "Dessert";

export interface MenuItem {
  id: string;
  name_en: string;
  name_th: string;
  desc_en: string;
  desc_th: string;
  price: number;
  category: MenuCategory;
  image_url: string;
}

export interface Campaign {
  id: string;
  title_en: string;
  title_th: string;
  desc_en: string;
  desc_th: string;
  image_url: string;
  active_status: boolean;
}

export interface GalleryItem {
  id: string;
  image_url: string;
  alt_text: string;
}

// ─── Menu ─────────────────────────────────────────────────────────────────────

const menuCol = () => collection(db, "menu");

export async function getMenuItems(): Promise<MenuItem[]> {
  const snap = await getDocs(menuCol());
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as MenuItem));
}

export async function getMenuItemsByCategory(
  category: MenuCategory
): Promise<MenuItem[]> {
  const q = query(menuCol(), where("category", "==", category));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as MenuItem));
}

export async function addMenuItem(
  data: Omit<MenuItem, "id">
): Promise<string> {
  const ref = await addDoc(menuCol(), { ...data, createdAt: serverTimestamp() });
  return ref.id;
}

export async function updateMenuItem(
  id: string,
  data: Partial<Omit<MenuItem, "id">>
): Promise<void> {
  await updateDoc(doc(db, "menu", id), { ...data, updatedAt: serverTimestamp() });
}

export async function deleteMenuItem(id: string): Promise<void> {
  await deleteDoc(doc(db, "menu", id));
}

// ─── Campaigns ────────────────────────────────────────────────────────────────

const campaignsCol = () => collection(db, "campaigns");

export async function getCampaigns(): Promise<Campaign[]> {
  const snap = await getDocs(campaignsCol());
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Campaign));
}

export async function getActiveCampaigns(): Promise<Campaign[]> {
  const q = query(campaignsCol(), where("active_status", "==", true));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Campaign));
}

export async function addCampaign(
  data: Omit<Campaign, "id">
): Promise<string> {
  const ref = await addDoc(campaignsCol(), { ...data, createdAt: serverTimestamp() });
  return ref.id;
}

export async function updateCampaign(
  id: string,
  data: Partial<Omit<Campaign, "id">>
): Promise<void> {
  await updateDoc(doc(db, "campaigns", id), { ...data, updatedAt: serverTimestamp() });
}

export async function deleteCampaign(id: string): Promise<void> {
  await deleteDoc(doc(db, "campaigns", id));
}

// ─── Gallery ──────────────────────────────────────────────────────────────────

const galleryCol = () => collection(db, "gallery");

export async function getGalleryItems(): Promise<GalleryItem[]> {
  const snap = await getDocs(galleryCol());
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as GalleryItem));
}

export async function addGalleryItem(
  data: Omit<GalleryItem, "id">
): Promise<string> {
  const ref = await addDoc(galleryCol(), { ...data, createdAt: serverTimestamp() });
  return ref.id;
}

export async function deleteGalleryItem(id: string): Promise<void> {
  await deleteDoc(doc(db, "gallery", id));
}

// ─── Contact Info ─────────────────────────────────────────────────────────────

export type DayKey = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";

export interface DayHours {
  open: boolean;
  from: string;
  to: string;
}

export interface ContactInfo {
  address_en: string;
  address_th: string;
  email: string;
  phone: string;
  facebook: string;
  instagram: string;
  hours: Record<DayKey, DayHours>;
}

export const DEFAULT_CONTACT: ContactInfo = {
  address_en: "22/2 Moo 2, Bang Boribon, Prachin Buri, Thailand, 25000",
  address_th: "22/2 หมู่ 2 ตำบล บางบริบูรณ์, ปราจีนบุรี, ประเทศไทย, 25000",
  email: "hello@jiknaam.com",
  phone: "+66 98 604 4280",
  facebook: "#",
  instagram: "#",
  hours: {
    monday:    { open: true,  from: "09:00", to: "22:00" },
    tuesday:   { open: true,  from: "09:00", to: "22:00" },
    wednesday: { open: true,  from: "09:00", to: "22:00" },
    thursday:  { open: true,  from: "09:00", to: "22:00" },
    friday:    { open: true,  from: "09:00", to: "22:00" },
    saturday:  { open: true,  from: "09:00", to: "22:00" },
    sunday:    { open: false, from: "09:00", to: "22:00" },
  },
};

const contactDoc = () => doc(db, "settings", "contact");

export async function getContactInfo(): Promise<ContactInfo> {
  const snap = await getDoc(contactDoc());
  if (!snap.exists()) return DEFAULT_CONTACT;
  return { ...DEFAULT_CONTACT, ...snap.data() } as ContactInfo;
}

export async function saveContactInfo(data: ContactInfo): Promise<void> {
  await setDoc(contactDoc(), data);
}
