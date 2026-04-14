'use client';

import { getInitials } from '@/utils/format';

export function UserAvatar({
  name,
  avatarUrl,
  size = 44,
}: {
  name?: string | null;
  avatarUrl?: string | null;
  size?: number;
}) {
  const initials = getInitials(name);

  if (avatarUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={avatarUrl}
        alt={name || 'User avatar'}
        className="avatar"
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div className="avatar avatar-fallback" style={{ width: size, height: size }}>
      {initials}
    </div>
  );
}
