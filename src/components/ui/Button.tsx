'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart' | 'style'> {
  children: ReactNode;
  variant?: 'primary' | 'outline' | 'glass';
  size?: 'sm' | 'md' | 'lg';
}

export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className,
  ...props 
}: ButtonProps) {
  const variants = {
    primary: 'bg-brand text-black hover:bg-brand-light shadow-[0_0_20px_rgba(16,185,129,0.3)]',
    outline: 'bg-transparent border border-white/20 text-white hover:border-brand hover:bg-brand/10 hover:text-brand-light',
    glass: 'glass-morphism-brand text-white hover:bg-brand/20',
  };

  const sizes = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-8 py-3.5 text-sm',
    lg: 'px-12 py-4 text-base',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        'rounded-full font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
}
