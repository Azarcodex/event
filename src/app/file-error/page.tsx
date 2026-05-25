'use client';

import { useSearchParams } from 'next/navigation';
import { FileX, ShieldAlert, AlertTriangle } from 'lucide-react';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import { Suspense } from 'react';

function ErrorContent() {
  const searchParams = useSearchParams();
  const reason = searchParams.get('reason');

  let title = 'File Error';
  let message = 'An unknown error occurred while trying to access the file.';
  let Icon = AlertTriangle;

  if (reason === 'not_found') {
    title = 'File Not Found';
    message = 'The requested file does not exist or has been removed.';
    Icon = FileX;
  } else if (reason === 'access_denied') {
    title = 'Access Denied';
    message = 'This file has been disabled or you do not have permission to view it.';
    Icon = ShieldAlert;
  } else if (reason === 'server_error') {
    title = 'Server Error';
    message = 'There was a problem communicating with the server. Please try again later.';
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden p-8 text-center border border-gray-100 dark:border-gray-700">
        <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-500 rounded-full flex items-center justify-center mb-6">
          <Icon className="w-8 h-8" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{title}</h1>
        <p className="text-gray-500 dark:text-gray-400">{message}</p>
      </div>
    </div>
  );
}

export default function FileErrorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
        <div className="animate-pulse bg-white dark:bg-gray-800 w-full max-w-md h-64 rounded-2xl"></div>
      </div>
    }>
      <ErrorContent />
    </Suspense>
  );
}
