'use client';

import { useState, useEffect, useRef } from 'react';
import { Menu } from 'lucide-react';

interface MobileMenuProps {
  waLink: string;
}

export default function MobileMenu({ waLink }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const menuItems = ['Services', 'Gallery', 'Reviews', 'FAQ'];

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current && 
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close menu when pressing Escape key
  useEffect(() => {
    function handleEscapeKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    document.addEventListener('keydown', handleEscapeKey);
    return () => document.removeEventListener('keydown', handleEscapeKey);
  }, []);

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="md:hidden relative">
      <button
        ref={buttonRef}
        onClick={toggleMenu}
        className="text-white p-2 hover:text-[#14b866] transition-colors focus:outline-none"
        aria-label="Toggle menu"
        aria-expanded={isOpen}
      >
        <Menu size={28} />
      </button>

      {isOpen && (
        <div
          ref={menuRef}
          className="absolute top-full right-0 mt-4 w-56 bg-[#162b22]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-5 flex flex-col gap-3 z-50"
        >
          {menuItems.map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-sm font-medium text-white/80 hover:text-[#14b866] uppercase tracking-wider border-b border-white/5 pb-2 transition-colors"
              onClick={handleLinkClick}
            >
              {item}
            </a>
          ))}
          <a
            href={waLink}
            className="mt-2 bg-[#14b866] hover:bg-[#14b866]/90 text-white px-5 py-3 rounded-full text-xs font-bold uppercase tracking-wider text-center transition-colors"
            onClick={handleLinkClick}
          >
            Book Now
          </a>
        </div>
      )}
    </div>
  );
}