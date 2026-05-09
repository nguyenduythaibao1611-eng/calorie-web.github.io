'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

/**
 * BottomNav Component
 * 
 * Navigation component cho mobile view
 * Hiển thị các tab chính: Home, Diary, Stats
 */

export function BottomNav() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname?.startsWith(path)) return true;
    return false;
  };

  const navItems = [
    { href: '/', label: 'Trang chủ', icon: 'home' },
    { href: '/diary', label: 'Nhật ký', icon: 'restaurant' },
    { href: '/stats', label: 'Thống kê', icon: 'analytics' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-[#005239]/10 max-w-[700px] mx-auto">
      <div className="flex justify-around items-center h-20">
        {navItems.map((item) => {
          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex-1 flex flex-col items-center justify-center gap-1 h-full transition-colors hover:bg-[#f4fbf6]"
            >
              <span
                className="material-symbols-outlined text-2xl"
                style={{
                  color: active ? '#005239' : '#9db5ab',
                  fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0",
                }}
              >
                {item.icon}
              </span>
              <span
                className="text-[11px] font-medium"
                style={{ color: active ? '#005239' : '#9db5ab' }}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
