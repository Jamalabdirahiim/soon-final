'use client';

import { ReactNode } from 'react';
import { FirebaseProvider, FirebaseContextType } from './provider';

interface FirebaseClientProviderProps extends FirebaseContextType {
  children: ReactNode;
}

export function FirebaseClientProvider({
  children,
  firebaseApp,
  auth,
  firestore,
}: FirebaseClientProviderProps) {
  return (
    <FirebaseProvider
      firebaseApp={firebaseApp}
      auth={auth}
      firestore={firestore}
    >
      {children}
    </FirebaseProvider>
  );
}
