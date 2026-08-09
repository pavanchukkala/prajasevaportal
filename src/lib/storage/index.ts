import { IStorageProvider } from "./provider";
import { LocalStorageProvider } from "./local-provider";
import { FirebaseStorageProvider } from "./firebase-provider";

export function getStorageProvider(): IStorageProvider {
  const hasFirebase = Boolean(
    process.env.FIREBASE_PROJECT_ID &&
    process.env.FIREBASE_CLIENT_EMAIL &&
    process.env.FIREBASE_PRIVATE_KEY
  );

  if (hasFirebase) {
    try {
      return new FirebaseStorageProvider();
    } catch (err) {
      console.warn("[Storage] Firebase configuration error, falling back to Local Storage:", err);
      return new LocalStorageProvider();
    }
  }

  return new LocalStorageProvider();
}

export const storage = getStorageProvider();
