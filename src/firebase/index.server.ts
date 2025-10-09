
import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { firebaseConfig } from './config';

// This function is for SERVER-side use only.
// It ensures that Firebase is initialized only once.
export function initializeFirebase(): { firebaseApp: FirebaseApp; firestore: Firestore; } {
  if (getApps().length === 0) {
    const firebaseApp = initializeApp(firebaseConfig);
    const firestore = getFirestore(firebaseApp);
    return { firebaseApp, firestore };
  } else {
    const firebaseApp = getApps()[0];
    const firestore = getFirestore(firebaseApp);
    return { firebaseApp, firestore };
  }
}
