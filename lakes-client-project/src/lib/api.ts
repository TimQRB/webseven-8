import { LoginResponse, Measurement, User, WaterBody } from '@/types';
import { authStorage } from './auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://lakes-backend.onrender.com';

type RequestOptions = RequestInit & {
  token?: string;
  skipAuth?: boolean;
  retryOnUnauthorized?: boolean;
};

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = authStorage.getRefreshToken();

  if (!refreshToken) {
    authStorage.clear();
    return null;
  }

  const response = await fetch(`${API_URL}/auth/refresh`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${refreshToken}`,
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  });

  const contentType = response.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const data = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    authStorage.clear();
    return null;
  }

  const accessToken = data?.accessToken;
  const newRefreshToken = data?.refreshToken;

  if (!accessToken || !newRefreshToken) {
    authStorage.clear();
    return null;
  }

  authStorage.setAccessToken(accessToken);
  authStorage.setRefreshToken(newRefreshToken);

  return accessToken;
}

async function request<T = unknown>(path: string, init: RequestOptions = {}): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(init.headers as Record<string, string> | undefined),
  };

  const shouldAttachAuth = !init.skipAuth;
  const token = init.token || (shouldAttachAuth ? authStorage.getAccessToken() : null);

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers,
    cache: 'no-store',
  });

  const contentType = response.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const data = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const canRetry = response.status === 401 && shouldAttachAuth && init.retryOnUnauthorized !== false;

    if (canRetry) {
      const nextAccessToken = await refreshAccessToken();
      if (nextAccessToken) {
        return request<T>(path, {
          ...init,
          token: nextAccessToken,
          retryOnUnauthorized: false,
        });
      }
    }

    if (response.status === 401) {
      authStorage.clear();
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }

    const message = typeof data === 'string' ? data : data?.message || `Request failed: ${response.status}`;
    throw new Error(typeof message === 'string' ? message : JSON.stringify(message));
  }

  return data as T;
}

async function tryRequest<T>(path: string): Promise<T | null> {
  try {
    return await request<T>(path, { method: 'GET' });
  } catch {
    return null;
  }
}

function parseUserIdFromAccessToken(): string | null {
  const token = authStorage.getAccessToken();
  if (!token) return null;

  try {
    const [, payload] = token.split('.');
    if (!payload) return null;
    const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
    return decoded?.userId ?? decoded?.sub ?? null;
  } catch {
    return null;
  }
}

export const api = {
  login(email: string, password: string): Promise<LoginResponse> {
    return request<LoginResponse>('/auth/login', {
      method: 'POST',
      skipAuth: true,
      retryOnUnauthorized: false,
      body: JSON.stringify({ email, password }),
    });
  },

  register(login: string, email: string, password: string): Promise<LoginResponse> {
    return request<LoginResponse>('/auth/register', {
      method: 'POST',
      skipAuth: true,
      retryOnUnauthorized: false,
      body: JSON.stringify({ login, email, password, role: 'CLIENT' }),
    });
  },

  async getProfile(): Promise<User> {
    const storedUser = authStorage.getUser<User>();
    if (storedUser?.id) {
      const profile = await request<User>(`/users/${storedUser.id}`, { method: 'GET' });
      authStorage.setUser(profile);
      return profile;
    }

    const tokenUserId = parseUserIdFromAccessToken();
    if (tokenUserId) {
      const profile = await request<User>(`/users/${tokenUserId}`, { method: 'GET' });
      authStorage.setUser(profile);
      return profile;
    }

    const fromAuthMe = await tryRequest<User>('/auth/me');
    if (fromAuthMe) {
      authStorage.setUser(fromAuthMe);
      return fromAuthMe;
    }

    const fromAuthProfile = await tryRequest<User>('/auth/profile');
    if (fromAuthProfile) {
      authStorage.setUser(fromAuthProfile);
      return fromAuthProfile;
    }

    const fromUsersMe = await tryRequest<User>('/users/me');
    if (fromUsersMe) {
      authStorage.setUser(fromUsersMe);
      return fromUsersMe;
    }

    throw new Error('Не удалось получить профиль пользователя');
  },

  getWaterBodies(): Promise<WaterBody[]> {
    return request<WaterBody[]>('/water-bodies', { method: 'GET' });
  },

  getWaterBodyById(id: string): Promise<WaterBody> {
    return request<WaterBody>(`/water-bodies/${id}`, { method: 'GET' });
  },

  getWaterBodyMeasurements(id: string): Promise<Measurement[]> {
    return request<Measurement[]>(`/water-bodies/${id}/measurements`, { method: 'GET' });
  },
};
