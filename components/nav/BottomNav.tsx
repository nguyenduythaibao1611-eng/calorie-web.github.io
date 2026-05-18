'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

const NAV_ITEMS = [
  { href: '/homepage',  label: 'Trang chủ',  icon: 'home'      },
  { href: '/dashboard', label: 'Tổng quan', icon: 'dashboard' },
  { href: '/diary',     label: 'Nhật ký',   icon: 'menu_book' },
  { href: '/stats',     label: 'Thống kê',  icon: 'bar_chart' },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-t border-[#005239]/10 h-16 lg:h-[68px] flex justify-center items-center">
      <nav className="w-full max-w-7xl flex justify-around items-center px-2 sm:px-6 lg:px-10">
        {NAV_ITEMS.map(({ href, label, icon }) => {
          const active = pathname === href;

          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center gap-1 py-2 px-3 sm:px-5 rounded-2xl relative transition-all"
            >
              {active && (
                <motion.div
                  layoutId="nav-active"
                  className="absolute inset-0 bg-[#caeadd] rounded-2xl"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}

              <motion.span
                className="material-symbols-outlined text-2xl relative z-10"
                style={{
                  color: active ? '#005239' : '#6f7973',
                  fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0",
                }}
                animate={{ scale: active ? 1.1 : 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              >
                {icon}
              </motion.span>

              <motion.span
                className="text-[10px] font-bold uppercase tracking-[0.08em] font-['Be_Vietnam_Pro'] relative z-10"
                animate={{ color: active ? '#005239' : '#6f7973' }}
                transition={{ duration: 0.2 }}
              >
                {label}
              </motion.span>
            </Link>
          );
        })}
      </nav>
    </footer>
  );
}