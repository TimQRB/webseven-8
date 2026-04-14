'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authStorage } from '@/lib/auth';
import { api } from '@/lib/api';
import { User } from '@/types';
import { Header } from './Header';

export function ProtectedShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<User | null>(authStorage.getUser<User>());

  useEffect(() => {
    const token = authStorage.getAccessToken();
    if (!token) {
      router.replace('/login');
      return;
    }

    void api
      .getProfile()
      .then((profile) => {
        setUser(profile);
        setReady(true);
      })
      .catch(() => {
        authStorage.clear();
        router.replace('/login');
      });
  }, [router]);

  if (!ready) {
    return <div className="centered">Проверка авторизации...</div>;
  }

  return (
    <div className="app-frame">
      <Header user={user} />
      <main className="page-shell">{children}</main>
    </div>
  );
}
