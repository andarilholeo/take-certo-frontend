'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  buttonText?: string;
  icon?: React.ReactNode;
}

export function SuccessModal({
  isOpen,
  onClose,
  title,
  message,
  buttonText = "OK",
  icon
}: SuccessModalProps) {
  if (isOpen) {
    console.log('✅ SuccessModal aberto:', { title, message });
  }

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-[9999]">
      <div className="bg-slate-800 rounded-lg w-full max-w-md mx-auto shadow-2xl border border-slate-600">
        <div className="p-6 text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
            {icon || (
              <svg 
                className="h-8 w-8 text-green-600" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M5 13l4 4L19 7" 
                />
              </svg>
            )}
          </div>

          <h3 className="text-lg font-medium text-white mb-2">
            {title}
          </h3>

          <p className="text-gray-300 mb-6">
            {message}
          </p>

          <Button
            onClick={onClose}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium"
          >
            {buttonText}
          </Button>
        </div>
      </div>
    </div>
  );
}