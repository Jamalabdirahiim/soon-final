'use client';

import { useState, useCallback, ChangeEvent } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useFirestore, useStorage } from '@/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { doc, setDoc } from 'firebase/firestore';
import { toast } from 'sonner';

const UniversalLogoUploader = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const storage = useStorage();
  const db = useFirestore();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      setFile(selectedFile);
      handleUpload(selectedFile);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false,
  });

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      handleUpload(selectedFile);
    }
  };

  const handleUpload = async (fileToUpload: File) => {
    if (!fileToUpload) return;

    setUploading(true);
    setUploadProgress(0);

    const storageRef = ref(storage, `logos/${fileToUpload.name}`);
    const uploadTask = uploadBytesResumable(storageRef, fileToUpload);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (error) => {
        console.error('Upload failed:', error);
        toast.error('Upload failed. Please try again.');
        setUploading(false);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        await saveLogoUrlToFirestore(downloadURL);
        setUploading(false);
        setFile(null);
        toast.success('Logo uploaded successfully!');
      }
    );
  };

  const saveLogoUrlToFirestore = async (url: string) => {
    try {
      const settingsRef = doc(db, 'site-settings', 'logo');
      await setDoc(settingsRef, { url });
    } catch (error) {
      console.error('Error saving logo URL to Firestore:', error);
      toast.error('Failed to save logo URL.');
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Upload Your Logo</h2>
      <div
        {...getRootProps()}
        className={`p-10 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors ${
          isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
        }`}
      >
        <input {...getInputProps()} />
        {
          isDragActive ?
            <p className="text-blue-600">Drop the files here ...</p> :
            <p className="text-gray-500">Drag 'n' drop some files here, or click to select files</p>
        }
      </div>
      <div className="mt-6 text-center">
        <Button onClick={() => document.getElementById('file-input')?.click()} variant="outline">
          Select from Device
        </Button>
        <input
          id="file-input"
          type="file"
          className="hidden"
          onChange={handleFileChange}
          accept="image/*"
        />
      </div>
      {file && (
        <div className="mt-6">
          <p className="text-sm font-medium text-gray-700">Selected file: {file.name}</p>
        </div>
      )}
      {uploading && (
        <div className="mt-6">
          <Progress value={uploadProgress} />
          <p className="text-sm text-center mt-2 text-gray-600">Uploading... {Math.round(uploadProgress)}%</p>
        </div>
      )}
    </div>
  );
};

export default UniversalLogoUploader;
