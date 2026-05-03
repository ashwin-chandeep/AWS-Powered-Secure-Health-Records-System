import { create } from 'zustand';

const TOKEN_KEY = 'auth_token';
const USER_KEY  = 'current_user';

const parseUser = () => {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
};

export const useAuthStore = create((set) => ({
  token: localStorage.getItem(TOKEN_KEY) || null,
  user:  parseUser(),

  setSession: (token, user) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    set({ token, user });
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem('selected_city');
    set({ token: null, user: null });
  },

  isAuthenticated: () => !!localStorage.getItem(TOKEN_KEY),
}));
