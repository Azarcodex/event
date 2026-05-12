'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, CheckCircle2, AlertCircle, Loader2, Image, Film } from 'lucide-react';
import { UploadProgress } from '@/types/media';
import { cn } from '@/lib/utils';

interface MediaUploaderProps {
  uploads: UploadProgress[];
  isUploading: boolean;
  onDrop: (files: File[]) => void;
}

const ACCEPTED_TYPES = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/webp': ['.webp'],
  'video/mp4': ['.mp4'],
  'video/webm': ['.webm'],
};

export function MediaUploader({ uploads, isUploading, onDrop }: MediaUploaderProps) {
  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (!isUploading) onDrop(acceptedFiles);
    },
    [isUploading, onDrop]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    accept: ACCEPTED_TYPES,
    multiple: true,
    disabled: isUploading,
  });

  return (
    <div className="space-y-6">
      <div
        {...getRootProps()}
        className={cn(
          'relative border-2 border-dashed rounded-[1.5rem] sm:rounded-[2.5rem] p-6 sm:p-12 text-center cursor-pointer transition-all duration-500 overflow-hidden group/dropzone',
          isDragActive
            ? 'border-indigo-500 bg-indigo-500/10 scale-[1.01] shadow-2xl shadow-indigo-500/10'
            : 'border-zinc-800 bg-zinc-900/30 hover:border-zinc-600 hover:bg-zinc-800/40',
          isUploading && 'opacity-50 cursor-not-allowed'
        )}
      >
        <input {...getInputProps()} />
        
        {/* Animated Background for Drag Active */}
        <div className={cn(
          "absolute inset-0 opacity-0 transition-opacity duration-500 pointer-events-none",
          isDragActive && "opacity-100"
        )}>
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 to-purple-600/10 animate-pulse" />
        </div>

        <div className="flex flex-col items-center gap-4 sm:gap-6 pointer-events-none relative z-10">
          <div className={cn(
            'w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl flex items-center justify-center transition-all duration-500 shadow-2xl',
            isDragActive ? 'bg-indigo-600 scale-110 shadow-indigo-600/40' : 'bg-zinc-800 border border-zinc-700/50'
          )}>
            <Upload 
              size={isDragActive ? 32 : 28} 
              className={cn(
                "transition-all duration-500",
                isDragActive ? "text-white" : "text-zinc-500 group-hover/dropzone:text-zinc-300"
              )} 
            />
          </div>
          
          <div className="max-w-xs sm:max-w-none">
            <p className="text-base sm:text-xl font-black text-white tracking-tight">
              {isDragActive ? 'Release to initiate upload' : 'Drop your media assets here'}
            </p>
            <p className="text-xs sm:text-sm text-zinc-500 mt-1 font-medium">or click to browse local storage</p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 mt-2">
            <span className="flex items-center gap-1.5 bg-zinc-800/80 border border-zinc-700/50 px-3 py-1.5 rounded-xl text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
              <Image size={12} className="text-indigo-400" /> Images 10MB
            </span>
            <span className="flex items-center gap-1.5 bg-zinc-800/80 border border-zinc-700/50 px-3 py-1.5 rounded-xl text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
              <Film size={12} className="text-purple-400" /> Videos 100MB
            </span>
          </div>
        </div>
      </div>

      {/* Upload List - Responsive Grid */}
      {uploads.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 animate-in fade-in zoom-in-95 duration-500">
          {uploads.map((upload) => (
            <UploadItem key={upload.fileName} upload={upload} />
          ))}
        </div>
      )}
    </div>
  );
}

function UploadItem({ upload }: { upload: UploadProgress }) {
  const icon = {
    pending: <Loader2 size={18} className="text-zinc-600 animate-spin" />,
    uploading: <Loader2 size={18} className="text-indigo-500 animate-spin" />,
    success: <CheckCircle2 size={18} className="text-emerald-500" />,
    error: <AlertCircle size={18} className="text-rose-500" />,
  }[upload.status];

  return (
    <div className={cn(
      "flex items-center gap-4 bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4 transition-all",
      upload.status === 'success' && "border-emerald-500/20 bg-emerald-500/5",
      upload.status === 'error' && "border-rose-500/20 bg-rose-500/5"
    )}>
      <div className="w-10 h-10 rounded-xl bg-zinc-800/50 flex items-center justify-center flex-shrink-0 border border-zinc-700/30 shadow-inner">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <p className="text-xs sm:text-sm text-zinc-200 truncate font-bold tracking-tight">{upload.fileName}</p>
          <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest bg-zinc-800/50 px-2 py-0.5 rounded flex-shrink-0">
            {upload.status === 'uploading' ? `${upload.progress}%` : upload.status}
          </span>
        </div>
        
        {upload.status === 'error' ? (
          <p className="text-[10px] text-rose-400 font-bold uppercase tracking-wider">{upload.error}</p>
        ) : (
          <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden shadow-inner">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(99,102,241,0.3)]",
                upload.status === 'success' ? "bg-emerald-500" : "bg-indigo-600"
              )}
              style={{ width: `${upload.progress}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
