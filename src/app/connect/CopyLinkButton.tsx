'use client';

import { Share2, Check } from 'lucide-react';
import { useState } from 'react';

export default function CopyLinkButton() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="absolute top-6 right-6 flex flex-col items-center gap-2">
      <span className="text-[10px] sm:text-xs text-[#DBB557] font-medium tracking-wide uppercase">
        {copied ? 'Copied!' : 'Copy to share'}
      </span>
      <button
        onClick={handleCopy}
        className="p-3 rounded-full bg-white/5 border border-[#DBB557]/30 text-[#DBB557] hover:bg-[#DBB557]/20 transition-colors shadow-lg"
        aria-label="Share page"
      >
        {copied ? <Check size={20} /> : <Share2 size={20} />}
      </button>
    </div>
  );
}
