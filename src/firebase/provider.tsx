
'use client';

import React, { createContext, useContext, ReactNode, useMemo } from 'react';
import { type FirebaseApp } from 'firebase/app';
import { type Auth } from 'firebase/auth';
import { type Firestore } from 'firebase/firestore';
import { type FirebaseStorage as Storage } from 'firebase/storage';
import { initializeFirebase } from './index';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';

export interface FirebaseContextType {
  firebaseApp: FirebaseApp | null;
  auth: Auth | null;
  firestore: Firestore | null;
  storage: Storage | null;
}

const FirebaseContext = createContext<FirebaseContextType>({
  firebaseApp: null,
  auth: null,
  firestore: null,
  storage: null,
});

export const FirebaseProvider = ({
  children,
  ...props
}: { children: ReactNode } & Partial<FirebaseContextType>) => {
  const { firebaseApp, auth, firestore, storage } = useMemo(() => {
    // This check ensures Firebase is only initialized on the client side.
    if (typeof window === 'undefined') {
      return { firebaseApp: null, auth: null, firestore: null, storage: null };
    }
    if (props.firebaseApp) {
      return {
        firebaseApp: props.firebaseApp,
        auth: props.auth!,
        firestore: props.firestore!,
        storage: props.storage!,
      };
    }
    const a = initializeFirebase();
    return a;
  }, [props.firebaseApp, props.auth, props.firestore, props.storage]);

  return (
    <FirebaseContext.Provider value={{ firebaseApp, auth, firestore, storage }}>
      {children}
      <FirebaseErrorListener />
    </FirebaseContext.Provider>
  );
};

export const useFirebaseApp = () => {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebaseApp must be used within a FirebaseProvider');
  }
  return context.firebaseApp;
};

export const useAuth = () => {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a FirebaseProvider');
  }
  return context.auth;
};

export const useFirestore = () => {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirestore must be used within a FirebaseProvider');
  }
  return context.firestore;
};

export const useStorage = () => {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useStorage must be used within a FirebaseProvider');
  }
  return context.storage;
};
