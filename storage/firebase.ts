import { v4 as uuid } from "uuid";
type ImageFile = {
  id: number;
  file: File;
  url: string;
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
} from "firebase/storage";

// Garante que não inicializa mais de uma vez
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Inicializa o Storage
const storage = getStorage(app);

const baseRef = ref(storage, "/");

// Conecta ao emulador SOMENTE em ambiente de desenvolvimento
if (process.env.NODE_ENV === "development") {
  connectStorageEmulator(storage, "localhost", 9199);
}

async function uploadImageFirebase(post_id: string, imagens: ImageFile[]) {
  if (imagens.length > 3)
    return { error: "O numero de imagens devem ser no maximo 3!!" };

  if (imagens.length > 0) {
    const images = [];

    for (const image of imagens) {
      const ext = image.file.name.split(".")[1];
      const name = uuid() + "." + ext;

      const storageRef = ref(storage, name);
      await uploadBytes(storageRef, image.file);
      const url = await getDownloadURL(storageRef);

      images.push({ url: url, post_id: post_id });
    }

    await fetch("/api/v1/uploadImages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(images),
    });
  }

  return null;
}

const imagemFirebase = {
  uploadImageFirebase,
};

export { app, storage, baseRef, imagemFirebase };
