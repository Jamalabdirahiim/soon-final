
import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { firebaseConfig } from './config';

let firebaseApp: FirebaseApp;
let firestore: Firestore;

// This function is for SERVER-side use only
function initializeFirebase() {
  // Check if we're on the server
  if (typeof window !== 'undefined') {
    throw new Error("Server Firebase initialization should not be called on the client.");
  }

  if (getApps().length === 0) {
    firebaseApp = initializeApp(firebaseConfig);
    firestore = getFirestore(firebaseApp);
  } else {
    firebaseApp = getApps()[0];
    firestore = getFirestore(firebaseApp);
  }
  
  return { firebaseApp, firestore };
}

export { initializeFirebase };
