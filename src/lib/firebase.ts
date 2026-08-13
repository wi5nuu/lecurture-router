import {
  getApps,
  initializeApp,
  cert,
  type App,
  type ServiceAccount,
} from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";

export class FirebaseNotConfiguredError extends Error {
  constructor() {
    super(
      "Firebase belum dikonfigurasi. Tambahkan FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, dan FIREBASE_PRIVATE_KEY (atau FIREBASE_SERVICE_ACCOUNT) ke environment variables.",
    );
    this.name = "FirebaseNotConfiguredError";
  }
}

export function isFirebaseConfigured(): boolean {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) return true;
  return Boolean(
    process.env.FIREBASE_PROJECT_ID &&
    process.env.FIREBASE_CLIENT_EMAIL &&
    process.env.FIREBASE_PRIVATE_KEY,
  );
}

function normalizePrivateKey(key: string): string {
  return key.replace(/\\n/g, "\n");
}

function buildServiceAccount(): ServiceAccount {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    return JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT) as ServiceAccount;
  }

  return {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: normalizePrivateKey(process.env.FIREBASE_PRIVATE_KEY ?? ""),
  };
}

let firebaseApp: App | undefined;

export function getFirebaseApp(): App {
  if (!isFirebaseConfigured()) {
    throw new FirebaseNotConfiguredError();
  }

  if (firebaseApp) return firebaseApp;

  const existing = getApps()[0];
  if (existing) {
    firebaseApp = existing;
    return firebaseApp;
  }

  firebaseApp = initializeApp({
    credential: cert(buildServiceAccount()),
    projectId: process.env.FIREBASE_PROJECT_ID,
  });

  return firebaseApp;
}

export function getDb(): Firestore {
  return getFirestore(getFirebaseApp());
}
