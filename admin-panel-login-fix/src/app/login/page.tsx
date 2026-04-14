'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { authStorage } from '@/lib/auth';

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await api.login(email, password);

      authStorage.setAccessToken(result.tokens.accessToken);
      authStorage.setRefreshToken(result.tokens.refreshToken);
      authStorage.setUser(result.user);

      router.push('/');
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Ошибка входа';
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="centered">
      <form className="login-box stack" onSubmit={handleSubmit}>
        <h1>Lakes Admin</h1>
        <p>Вход администратора для работы с lakes-backend</p>

        <label className="field">
          <span>Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Введите email"
            autoComplete="email"
            required
          />
        </label>

        <label className="field">
          <span>Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Введите пароль"
            autoComplete="current-password"
            required
          />
        </label>

        {error && <div style={{ color: 'red' }}>{error}</div>}

        <button className="btn" type="submit" disabled={loading}>
          {loading ? 'Вход...' : 'Login'}
        </button>
      </form>
    </div>
  );
}