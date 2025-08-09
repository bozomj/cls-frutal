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
  connectStorageEmulator(storage, "localhost", 9199);
}

async function uploadImageFirebase(imagens: ImageFile[]) {
  if (imagens.length > 0) {
    const images = [];

    for (const image of imagens) {
      const partes = image.file.name.split(".");
      const ext = partes[partes.length - 1];
      const name = uuid() + "." + ext;

      const storageRef = ref(storage, name);
      await uploadBytes(storageRef, image.file);
      const url = await getDownloadURL(storageRef);

      images.push({ url: url });
    }

    return images;
  }

  return [];
}

async function deleteImage(img: StorageReference) {
  return await deleteObject(img);
}

const imagemFirebase = {
  uploadImageFirebase,
  deleteImage,
};

export { app, storage, baseRef, imagemFirebase };
