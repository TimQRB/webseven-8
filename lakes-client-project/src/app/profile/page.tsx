'use client';

import { useEffect, useState } from 'react';
import { ProtectedShell } from '@/components/ProtectedShell';
import { PageHeader } from '@/components/PageHeader';
import { UserAvatar } from '@/components/UserAvatar';
import { api } from '@/lib/api';
import { User } from '@/types';

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    void api
      .getProfile()
      .then(setUser)
      .catch((err: unknown) => setError(err instanceof Error ? err.message : 'Не удалось загрузить профиль'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <ProtectedShell>
      <div className="stack">
        <PageHeader title="Личный кабинет" description="Просмотр данных текущего пользователя и его аватарки." />

        {loading ? <div className="card">Загрузка профиля...</div> : null}
        {error ? <div className="card">{error}</div> : null}

        {user ? (
          <section className="card profile-card">
            <div className="profile-summary">
              <UserAvatar name={user.login || user.email} avatarUrl={user.avatarUrl} size={96} />
              <div className="stack compact-stack">
                <h2 className="section-title no-margin">{user.login || 'Пользователь'}</h2>
                <div className="muted">{user.email}</div>
                <span className="badge">{user.role}</span>
              </div>
            </div>

            <div className="details-grid">
              <div><strong>ID:</strong> {user.id}</div>
              <div><strong>Логин:</strong> {user.login || '—'}</div>
              <div><strong>Email:</strong> {user.email}</div>
              <div><strong>Роль:</strong> {user.role}</div>
              <div><strong>Аватар:</strong> {user.avatarUrl || 'Используется fallback с инициалами'}</div>
            </div>
          </section>
        ) : null}
      </div>
    </ProtectedShell>
  );
}
