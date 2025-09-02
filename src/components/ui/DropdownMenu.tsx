'use client';

import { useState, useRef, useEffect } from 'react';

interface DropdownMenuProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: 'left' | 'right';
}

export function DropdownMenu({ trigger, children, align = 'right' }: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)}>
        {trigger}
      </div>
      
      {isOpen && (
        <div className={`absolute top-full mt-2 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-lg z-50 ${
          align === 'left' ? 'left-0' : 'right-0'
        }`}>
          <div className="py-2">
            {children}
          </div>
        </div>
      )}
    </div>
  );
}

interface DropdownMenuItemProps {
  onClick: () => void;
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export function DropdownMenuItem({ onClick, children, icon, className = '' }: DropdownMenuItemProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full px-4 py-2 text-left text-white hover:bg-slate-700 transition-colors flex items-center space-x-2 ${className}`}
    >
      {icon && <span className="text-gray-400">{icon}</span>}
      <span>{children}</span>
    </button>
  );
}
