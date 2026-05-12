import { ImageOff, Sparkles } from 'lucide-react';

interface MediaEmptyProps {
  typeFilter: 'IMAGE' | 'VIDEO' | 'ALL';
}

export function MediaEmpty({ typeFilter }: MediaEmptyProps) {
  const label =
    typeFilter === 'IMAGE' ? 'images' : typeFilter === 'VIDEO' ? 'videos' : 'media files';

  return (
    <div className="flex flex-col items-center justify-center py-20 sm:py-32 text-center animate-in fade-in zoom-in-95 duration-700">
      <div className="relative mb-8">
        <div className="w-24 h-24 bg-zinc-900 border border-zinc-800 rounded-[2rem] flex items-center justify-center shadow-2xl relative z-10">
          <ImageOff size={40} className="text-zinc-700" />
        </div>
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/20 z-20 animate-bounce">
           <Sparkles size={16} className="text-white" />
        </div>
        <div className="absolute inset-0 bg-indigo-500/5 blur-3xl rounded-full" />
      </div>
      
      <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">Your Gallery is Vacant</h3>
      <p className="text-zinc-500 mt-2 max-w-[280px] text-sm sm:text-base leading-relaxed">
        Start building your asset collection by uploading your first {label} using the interactive uploader above.
      </p>
    </div>
  );
}
