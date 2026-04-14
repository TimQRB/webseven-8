'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { authStorage } from '@/lib/auth';
import { User } from '@/types';
import { UserAvatar } from './UserAvatar';

const navLinks = [
  { href: '/', label: 'Главная' },
  { href: '/water-bodies', label: 'Озёра' },
  { href: '/profile', label: 'Личный кабинет' },
];

export function Header({ user }: { user: User | null }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link href="/" className="brand-block" onClick={closeMenu}>
          <span className="brand-badge">LC</span>

          <div className="brand-copy">
            <div className="brand-title">Lakes Client</div>
            <div className="brand-subtitle">Мониторинг озёр и показателей воды</div>
          </div>
        </Link>

        <button
          type="button"
          className={`burger ${isOpen ? 'is-open' : ''}`}
          aria-label={isOpen ? 'Закрыть меню' : 'Открыть меню'}
          aria-expanded={isOpen}
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`header-nav ${isOpen ? 'open' : ''}`} aria-label="Основная навигация">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={pathname === link.href ? 'is-active' : ''}
              onClick={closeMenu}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className={`header-user ${isOpen ? 'open' : ''}`}>
          <Link href="/profile" className="profile-chip" onClick={closeMenu}>
            <UserAvatar
              name={user?.login || user?.email}
              avatarUrl={user?.avatarUrl}
              size={40}
            />
            <div>
              <div className="profile-chip__name">{user?.login || 'Пользователь'}</div>
              <div className="profile-chip__meta">{user?.email || 'Открыть профиль'}</div>
            </div>
          </Link>

          <button
            className="btn secondary"
            onClick={() => {
              authStorage.clear();
              router.replace('/login');
            }}
          >
            Выйти
          </button>
        </div>
      </div>
    </header>
  );
}