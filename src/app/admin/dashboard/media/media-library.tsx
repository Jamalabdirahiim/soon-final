
'use client';

import { useState } from 'react';
import { useStorage } from '@/firebase/storage/use-storage';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

interface MediaLibraryProps {
  onSelect?: (url: string) => void;
}

export function MediaLibrary({ onSelect }: MediaLibraryProps) {
  const { files, loading, uploadFile, deleteFile } = useStorage('media');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (selectedFile) {
      await uploadFile(selectedFile);
      setSelectedFile(null);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>Upload New Media</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex w-full max-w-sm items-center gap-1.5">
            <Input type="file" onChange={handleFileChange} />
            <Button onClick={handleUpload} disabled={!selectedFile || loading}>
              Upload
            </Button>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <p>Loading...</p>
      ) : (
        files.map((file) => (
          <Card key={file.name}>
            <CardContent className="p-0">
              <img
                src={file.url}
                alt={file.name}
                className="aspect-video w-full rounded-t-lg object-cover"
              />
            </CardContent>
            <div className="p-4">
              <p className="truncate text-sm font-medium">{file.name}</p>
            </div>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onSelect && onSelect(file.url)}
                disabled={!onSelect}>
                Select
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => deleteFile(file.ref)}>
                Delete
              </Button>
            </CardFooter>
          </Card>
        ))
      )}
    </div>
  );
}
