'use client';

import { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { IMedia } from '@/types/media';
import { Trash2, Play, ImageIcon, Film, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MediaCardProps {
  media: IMedia;
  onDelete: (id: string) => void;
}

export function MediaCard({ media, onDelete }: MediaCardProps) {
  const [hovered, setHovered] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [imageError, setImageError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const isVideo = media.mediaType === 'VIDEO';

  const handleVideoPlay = useCallback(() => {
    if (videoRef.current) {
      if (videoPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setVideoPlaying((p) => !p);
    }
  }, [videoPlaying]);

  const formatSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDuration = (sec?: number) => {
    if (!sec) return null;
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div
      className="group relative bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden transition-all duration-300 hover:border-zinc-600 hover:shadow-2xl hover:shadow-black/40 hover:-translate-y-0.5"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); }}
    >
      {/* Media Display */}
      <div className="relative aspect-video bg-zinc-800 overflow-hidden">
        {isVideo ? (
          <>
            {/* Show thumbnail first */}
            {!videoPlaying && media.thumbnailUrl && !imageError && (
              <Image
                src={media.thumbnailUrl}
                alt="Video thumbnail"
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                onError={() => setImageError(true)}
              />
            )}
            <video
              ref={videoRef}
              src={media.secureUrl}
              className={cn(
                'absolute inset-0 w-full h-full object-cover transition-opacity',
                videoPlaying ? 'opacity-100' : 'opacity-0'
              )}
              loop
              muted
              playsInline
              onEnded={() => setVideoPlaying(false)}
            />
            {/* Play button overlay */}
            {!videoPlaying && (
              <button
                onClick={handleVideoPlay}
                className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/20 transition-colors group/play"
              >
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover/play:scale-110 transition-transform border border-white/30">
                  <Play size={18} className="text-white fill-white ml-0.5" />
                </div>
              </button>
            )}
            {/* Duration badge */}
            {formatDuration(media.duration) && (
              <span className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded font-mono">
                {formatDuration(media.duration)}
              </span>
            )}
          </>
        ) : (
          <>
            {!imageError ? (
              <Image
                src={media.secureUrl}
                alt={`Media ${media._id}`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <ImageIcon size={32} className="text-zinc-600" />
              </div>
            )}
          </>
        )}

        {/* Type badge */}
        <div className="absolute top-2 left-2">
          <span className={cn(
            'flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full',
            isVideo
              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
              : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
          )}>
            {isVideo ? <Film size={10} /> : <ImageIcon size={10} />}
            {isVideo ? 'Video' : 'Image'}
          </span>
        </div>

        {/* Action overlay */}
        <div className={cn(
          'absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end justify-between p-3 transition-opacity duration-200',
          hovered ? 'opacity-100' : 'opacity-0'
        )}>
          <a
            href={media.secureUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-white/80 hover:text-white bg-white/10 hover:bg-white/20 px-2.5 py-1.5 rounded-lg transition-colors backdrop-blur-sm"
          >
            <Eye size={12} /> View
          </a>
          <button
            onClick={() => onDelete(media._id)}
            className="flex items-center gap-1.5 text-xs text-red-300 hover:text-white bg-red-500/20 hover:bg-red-500 px-2.5 py-1.5 rounded-lg transition-colors backdrop-blur-sm border border-red-500/30"
          >
            <Trash2 size={12} /> Delete
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="p-3 space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-xs text-zinc-400 font-mono uppercase">
            {media.format}
          </span>
          <span className="text-xs text-zinc-500">{formatSize(media.size)}</span>
        </div>
        {(media.width && media.height) && (
          <p className="text-xs text-zinc-600">
            {media.width} × {media.height}px
          </p>
        )}
      </div>
    </div>
  );
}
