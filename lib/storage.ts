import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "./firebase";

export async function uploadImage(
  file: File,
  folder: "menu" | "campaigns" | "gallery"
): Promise<string> {
  const filename = `${folder}/${Date.now()}_${file.name.replace(/\s+/g, "_")}`;
  const storageRef = ref(storage, filename);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}

export async function deleteImage(url: string): Promise<void> {
  try {
    const storageRef = ref(storage, url);
    await deleteObject(storageRef);
  } catch {
    // File may already be deleted
  }
}
