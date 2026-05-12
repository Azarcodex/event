'use client';

import { useState, useCallback } from 'react';
import axios from 'axios';
import { UploadProgress } from '@/types/media';

export function useUpload(eventId: string, onSuccess: () => void) {
  const [uploads, setUploads] = useState<UploadProgress[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const updateUpload = useCallback((fileName: string, patch: Partial<UploadProgress>) => {
    setUploads((prev) =>
      prev.map((u) => (u.fileName === fileName ? { ...u, ...patch } : u))
    );
  }, []);

  const uploadFiles = useCallback(
    async (files: File[]) => {
      if (files.length === 0) return;

      const initial: UploadProgress[] = files.map((f) => ({
        fileName: f.name,
        progress: 0,
        status: 'pending',
      }));
      setUploads(initial);
      setIsUploading(true);

      let anySuccess = false;

      await Promise.all(
        files.map(async (file) => {
          const formData = new FormData();
          formData.append('file', file);

          updateUpload(file.name, { status: 'uploading', progress: 0 });

          try {
            const url = eventId 
              ? `/api/events/${eventId}/media` 
              : `/api/admin/media`;
              
            await axios.post(url, formData, {
              onUploadProgress: (e) => {
                const pct = e.total ? Math.round((e.loaded / e.total) * 100) : 0;
                updateUpload(file.name, { progress: pct });
              },
            });

            updateUpload(file.name, { status: 'success', progress: 100 });
            anySuccess = true;
          } catch (err: any) {
            const msg =
              err.response?.data?.message || 'Upload failed';
            updateUpload(file.name, { status: 'error', error: msg });
          }
        })
      );

      setIsUploading(false);

      if (anySuccess) {
        setTimeout(() => {
          onSuccess();
          setUploads([]);
        }, 1200);
      }
    },
    [eventId, onSuccess, updateUpload]
  );

  const clearUploads = useCallback(() => setUploads([]), []);

  return { uploads, isUploading, uploadFiles, clearUploads };
}
