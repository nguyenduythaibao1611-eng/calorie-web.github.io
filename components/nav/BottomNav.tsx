'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, BarChart2 } from 'lucide-react';

export function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { href: '/',      label: 'Tổng quan', Icon: Home      },
    { href: '/diary', label: 'Nhật ký',   Icon: BookOpen  },
    { href: '/stats', label: 'Thống kê',  Icon: BarChart2 },
  ];

  return (
    <nav style={{ position: 'fixed', bottom: 0, left: 0, width: '100%', zIndex: 50, background: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(20px)', borderTop: '1px solid rgba(26,107,78,0.1)', boxShadow: '0 -10px 30px rgba(26,107,78,0.06)', display: 'flex', justifyContent: 'space-around', alignItems: 'center', padding: '16px 24px 32px' }}>
      {navItems.map(({ href, label, Icon }) => {
        const active = href === '/' ? pathname === '/' : pathname?.startsWith(href);
        return (
          <Link key={href} href={href} style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <div style={{ padding: 12, borderRadius: 9999, background: active ? 'rgba(26,107,78,0.12)' : 'transparent', transform: active ? 'scale(1.1)' : 'scale(1)', transition: 'all 0.2s' }}>
              <Icon size={22} color={active ? '#005239' : 'rgba(26,58,42,0.4)'} />
            </div>
            <span style={{ fontFamily: 'var(--font-space-grotesk)', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: active ? '#005239' : 'rgba(26,58,42,0.4)', fontWeight: active ? 700 : 400 }}>
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}