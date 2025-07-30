// lib/firebase.ts
import firebaseConfig from "@/firebaseConfig";
import { initializeApp, getApps, getApp } from "firebase/app";
import { getStorage, connectStorageEmulator, ref } from "firebase/storage";

// Garante que não inicializa mais de uma vez
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Inicializa o Storage
const storage = getStorage(app);

const baseRef = ref(storage, "/");

// Conecta ao emulador SOMENTE em ambiente de desenvolvimento
if (process.env.NODE_ENV === "development") {
  connectStorageEmulator(storage, "localhost", 9199);
}

export { app, storage, baseRef };
