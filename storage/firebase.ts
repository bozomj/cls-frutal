import { v4 as uuid } from "uuid";
export type ImageFile = {
  file: File;
};

// lib/firebase.ts
import firebaseConfig from "@/firebaseConfig";
import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getStorage,
  connectStorageEmulator,
  ref,
  getDownloadURL,
  uploadBytes,
  deleteObject,
  StorageReference,
} from "firebase/storage";

// Garante que não inicializa mais de uma vez
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Inicializa o Storage
const storage = getStorage(app);

const baseRef = ref(storage, "/");

if (process.env.NODE_ENV === "development") {
  connectStorageEmulator(storage, "192.168.0.150", 9199);
}

async function uploadImageFirebase(imagens: ImageFile[]) {
  const images = [];
  if (imagens.length > 0) {
    for (const image of imagens) {
      const partes = image.file.name.split(".");
      const ext = partes[partes.length - 1];
      const name = uuid() + "." + ext;

      const storageRef = ref(storage, name);

      await uploadBytes(storageRef, image.file);

      const url = await getDownloadURL(storageRef);

      images.push({ url: url });
    }
  }

  return images;
}

async function deleteImage(img: StorageReference) {
  return await deleteObject(img);
}

async function deleteImageFromUrl(url: string) {
  const storage = getStorage();

  // Extrai o caminho do arquivo da URL
  const path = url.split("/o/")[1]?.split("?")[0];
  const decodedPath = decodeURIComponent(path || "");

  // Cria o StorageReference
  const imageRef = ref(storage, decodedPath);

  // Usa sua função existente
  await deleteImage(imageRef);
}

const imagemFirebase = {
  uploadImageFirebase,
  deleteImage,
  deleteImageFromUrl,
};

export { app, storage, baseRef, imagemFirebase };
