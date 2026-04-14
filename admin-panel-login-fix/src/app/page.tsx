'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import { api } from '@/lib/api';
import { authStorage } from '@/lib/auth';

import { Sidebar } from '@/components/Sidebar';
import { PageHeader } from '@/components/PageHeader';
import { KpiCard } from '@/components/KpiCard';
import { UserManager } from '@/components/UserManager';

type User = {
  id: string;
  login: string;
  email: string;
  avatarUrl?: string | null;
  role: 'ADMIN' | 'CLIENT';
};

export default function DashboardPage() {
  const router = useRouter();

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function loadUsers() {
    try {
      setError('');
      const data = await api.getUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Ошибка загрузки пользователей';
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const token = authStorage.getAccessToken();

    if (!token) {
      router.push('/login');
      return;
    }

    loadUsers();
  }, [router]);

  const adminCount = useMemo(
    () => users.filter((u) => u.role === 'ADMIN').length,
    [users],
  );

  const clientCount = useMemo(
    () => users.filter((u) => u.role === 'CLIENT').length,
    [users],
  );

  return (
    <div className="app-shell">
      <Sidebar />

      <main className="content">
        <PageHeader
          title="Dashboard"
          description="Обзор пользователей и основных сущностей системы lakes-backend"
        />

        {error && (
          <div style={{ color: 'red', marginBottom: 16 }}>
            {error}
          </div>
        )}

        <section
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, minmax(220px, 1fr))',
            gap: 16,
            marginBottom: 24,
          }}
        >
          <KpiCard title="Всего пользователей" value={users.length} />
          <KpiCard title="Администраторы" value={adminCount} />
          <KpiCard title="Клиенты" value={clientCount} />
        </section>

        <section>
          <UserManager/>
        </section>
      </main>
    </div>
  );
}