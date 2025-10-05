const USER_ID_KEY = 'tyrian_user_id';

export const userStorage = {
  get(): string | null {
    return localStorage.getItem(USER_ID_KEY);
  },
  set(id: string): void {
    localStorage.setItem(USER_ID_KEY, id);
  },
  clear(): void {
    localStorage.removeItem(USER_ID_KEY);
  }
};
