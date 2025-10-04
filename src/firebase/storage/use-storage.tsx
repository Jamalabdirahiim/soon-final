
import { useState, useEffect, useCallback } from 'react';
import { getStorage, ref, listAll, getDownloadURL, uploadBytes, deleteObject, type StorageReference } from 'firebase/storage';
import { useFirebaseApp } from '../provider';

export function useStorage(path: string) {
  const app = useFirebaseApp();
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const storage = app ? getStorage(app) : null;

  const listFiles = useCallback(async () => {
    if (!storage) return;
    setLoading(true);
    const listRef = ref(storage, path);
    try {
      const res = await listAll(listRef);
      const filesWithUrls = await Promise.all(
        res.items.map(async (itemRef) => {
          const url = await getDownloadURL(itemRef);
          return {
            name: itemRef.name,
            url,
            ref: itemRef,
          };
        })
      );
      setFiles(filesWithUrls);
    } catch (error) {
      console.error("Error listing files:", error);
    } finally {
      setLoading(false);
    }
  }, [path, storage]);

  useEffect(() => {
    listFiles();
  }, [listFiles]);

  async function uploadFile(file: File) {
    if (!storage) return;
    const storageRef = ref(storage, `${path}/${file.name}`);
    await uploadBytes(storageRef, file);
    await listFiles();
  }

  async function deleteFile(fileRef: StorageReference) {
    if (!storage) return;
    await deleteObject(fileRef);
    await listFiles();
  }

  return { files, loading, uploadFile, deleteFile, app: storage };
}
