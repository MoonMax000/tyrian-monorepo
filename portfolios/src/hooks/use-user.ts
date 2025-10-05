import { useEffect, useState } from 'react';
import { api } from '@/lib/api-client';
import { userStorage } from '@/lib/user-storage';

export function useUser() {
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initUser = async () => {
      try {
        let id = userStorage.get();
        if (!id) {
          const result = await api.users.seed();
          id = result.id;
          userStorage.set(id);
        }
        setUserId(id);
      } catch (error) {
        console.error('Failed to initialize user:', error);
      } finally {
        setLoading(false);
      }
    };

    initUser();
  }, []);

  return { userId, loading };
}
