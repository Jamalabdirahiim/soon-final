import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage as Storage } from 'firebase/storage';
import { firebaseConfig } from './config';

import { FirebaseProvider, useFirebaseApp, useAuth, useFirestore, useStorage } from './provider';
import { FirebaseClientProvider } from './client-provider';
import { useCollection, useMemoFirebase } from './firestore/use-collection';
import { useDoc } from './firestore/use-doc';
import { useUser } from './auth/use-user';


let firebaseApp: FirebaseApp;
let auth: Auth;
let firestore: Firestore;
let storage: Storage;

// This function is for CLIENT-side use only
function initializeFirebase() {
  if (typeof window === 'undefined') {
    throw new Error("Firebase client initialization should only be called on the client.");
  }

  if (getApps().length === 0) {
    firebaseApp = initializeApp(firebaseConfig);
    auth = getAuth(firebaseApp);
    firestore = getFirestore(firebaseApp);
    storage = getStorage(firebaseApp);
  }
  return { firebaseApp, auth, firestore, storage };
}

export {
  initializeFirebase,
  FirebaseProvider,
  FirebaseClientProvider,
  useCollection,
  useDoc,
  useUser,
  useFirebaseApp,
  useAuth,
  useFirestore,
  useStorage,
  useMemoFirebase,
};
