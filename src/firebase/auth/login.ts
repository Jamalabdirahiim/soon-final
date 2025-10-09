"use client";

import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { initializeFirebase } from "@/firebase";

export async function signInWithGoogle() {
  const { auth } = initializeFirebase();
  if (!auth) {
    console.error("Firebase Auth is not initialized.");
    return;
  }

  const provider = new GoogleAuthProvider();

  try {
    await signInWithPopup(auth, provider);
    // The onAuthStateChanged listener in useUser will handle the redirect/UI update.
  } catch (error) {
    console.error("Error during Google Sign-In:", error);
    // You could show a toast notification to the user here.
  }
}
