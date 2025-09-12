'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';

interface AnimatedSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  buttonText?: string;
}

export function AnimatedSuccessModal({
  isOpen,
  onClose,
  title,
  message,
  buttonText = "OK"
}: AnimatedSuccessModalProps) {
  const [showCheck, setShowCheck] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Delay para mostrar o check animado
      const checkTimer = setTimeout(() => setShowCheck(true), 200);
      // Delay para mostrar o conteúdo
      const contentTimer = setTimeout(() => setShowContent(true), 800);
      
      return () => {
        clearTimeout(checkTimer);
        clearTimeout(contentTimer);
      };
    } else {
      setShowCheck(false);
      setShowContent(false);
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-[9999] animate-fadeIn">
      <div className="bg-slate-800 rounded-2xl w-full max-w-md mx-auto shadow-2xl border border-slate-600 transform animate-scaleIn">
        <div className="p-8 text-center">
          {/* Animated Check Icon */}
          <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-6 relative overflow-hidden">
            <div 
              className={`absolute inset-0 bg-green-500 rounded-full transform transition-all duration-700 ease-out ${
                showCheck ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
              }`}
            />
            <svg 
              className={`h-10 w-10 text-white relative z-10 transform transition-all duration-500 ease-out ${
                showCheck ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
              }`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              style={{ 
                strokeDasharray: 50,
                strokeDashoffset: showCheck ? 0 : 50,
                transition: 'stroke-dashoffset 0.6s ease-in-out 0.3s'
              }}
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={3} 
                d="M5 13l4 4L19 7" 
              />
            </svg>
          </div>

          {/* Content with fade-in animation */}
          <div className={`transform transition-all duration-500 ease-out ${
            showContent ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}>
            {/* Title */}
            <h3 className="text-2xl font-bold text-white mb-3">
              {title}
            </h3>

            {/* Message */}
            <p className="text-gray-300 mb-8 leading-relaxed">
              {message}
            </p>

            {/* Button */}
            <Button
              onClick={onClose}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              {buttonText}
            </Button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes scaleIn {
          from { 
            opacity: 0;
            transform: scale(0.9) translateY(20px);
          }
          to { 
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        .animate-scaleIn {
          animation: scaleIn 0.4s ease-out;
        }
      `}</style>
    </div>
  );
}
