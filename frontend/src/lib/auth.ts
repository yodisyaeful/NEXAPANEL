import Cookies from 'js-cookie';

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

export function saveAuth(token: string, user: User) {
  Cookies.set('token', token, { expires: 1 }); // 1 day
  Cookies.set('user', JSON.stringify(user), { expires: 1 });
}

export function clearAuth() {
  Cookies.remove('token');
  Cookies.remove('user');
}

export function getToken(): string | undefined {
  return Cookies.get('token');
}

export function getUser(): User | null {
  const raw = Cookies.get('user');
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

export function isAuthenticated(): boolean {
  return !!Cookies.get('token');
}
