export type Entity = Record<string, unknown> & { id?: number | string };

const TOKEN_KEY = 'nempo_garut_admin_token';
const USER_KEY = 'nempo_garut_admin_user';
const API_ORIGIN = (import.meta.env.VITE_NEMPO_GARUT_API_URL as string | undefined)?.trim().replace(/\/+$/, '');

export class ApiError extends Error {
  constructor(message: string, readonly status?: number) { super(message); this.name = 'ApiError'; }
}

function validConfiguredOrigin() {
  if (!API_ORIGIN) return false;
  try {
    const parsed = new URL(API_ORIGIN);
    return (parsed.protocol === 'https:' || parsed.protocol === 'http:') && parsed.origin !== window.location.origin;
  } catch { return false; }
}
export function apiOrigin() { return validConfiguredOrigin() ? API_ORIGIN as string : ''; }
export function getStoredToken() { return localStorage.getItem(TOKEN_KEY) || ''; }
export function getStoredUser() { return localStorage.getItem(USER_KEY) || 'Petugas'; }
export function clearSession() { localStorage.removeItem(TOKEN_KEY); localStorage.removeItem(USER_KEY); }
export function saveSession(token: string, user: string) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, user);
}

function requireOrigin() {
  if (!API_ORIGIN) throw new ApiError('API belum dikonfigurasi. Tambahkan VITE_NEMPO_GARUT_API_URL pada environment CMS Nempo Organizer Garut.');
  if (!validConfiguredOrigin()) throw new ApiError('VITE_NEMPO_GARUT_API_URL harus berupa URL API absolut dan berbeda dari origin CMS ini. Same-origin API tidak digunakan.');
  return API_ORIGIN;
}
async function decode<T>(response: Response): Promise<T> {
  const text = await response.text();
  let data: unknown = {};
  if (text.trim()) {
    try { data = JSON.parse(text); } catch { data = { message: text }; }
  }
  if (!response.ok) {
    const message = typeof data === 'object' && data && 'error' in data ? String((data as { error: unknown }).error) :
      typeof data === 'object' && data && 'message' in data ? String((data as { message: unknown }).message) : `Permintaan gagal (${response.status})`;
    throw new ApiError(message, response.status);
  }
  return data as T;
}
export async function request<T>(path: string, method = 'GET', body?: unknown): Promise<T> {
  const base = requireOrigin();
  try {
    const response = await fetch(`${base}${path}`, {
      method,
      headers: {
        ...(body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
        ...(getStoredToken() ? { Authorization: `Bearer ${getStoredToken()}` } : {}),
      },
      body: body === undefined ? undefined : body instanceof FormData ? body : JSON.stringify(body),
    });
    return decode<T>(response);
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(`API Nempo Organizer Garut tidak dapat dijangkau di ${base}. Periksa URL dan koneksi layanan.`);
  }
}
export async function login(username: string, password: string) {
  const result = await request<{ token: string; username?: string; user?: { username?: string; name?: string } }>('/api/admin/auth/login', 'POST', { username, password });
  if (!result?.token) throw new ApiError('Respons login tidak memuat token yang valid.');
  const user = result.username || result.user?.name || result.user?.username || username;
  saveSession(result.token, user);
  return result.token;
}

export const routeFor: Record<string, string> = {
  wisata: 'wisata', kuliner: 'kuliner', cafe: 'cafe', penginapan: 'penginapan', events: 'events',
  berita: 'berita', vouchers: 'vouchers', 'kamus-sunda': 'kamus-sunda', transportasi: 'transportasi',
  'price-list': 'price-list', partnership: 'partnership', 'digital-services': 'digital-services',
  banners: 'banners', 'promo-banners': 'promo-banners', partners: 'partners',
  notifications: 'notifications', users: 'users', mitra: 'mitra', donations: 'donations',
  influencers: 'influencers', 'influencer-banner-photos': 'influencer-banner-photos',
  talent: 'talents', 'talent-portfolio': 'talent-portfolio', 'talent-banner': 'talent-banner',
};
export const resourceApi = {
  list: (slug: string) => request<unknown>(`/api/admin/${routeFor[slug]}`),
  create: (slug: string, payload: unknown) => request<unknown>(`/api/admin/${routeFor[slug]}`, 'POST', payload),
  update: (slug: string, id: string | number, payload: unknown) => request<unknown>(`/api/admin/${routeFor[slug]}/${encodeURIComponent(String(id))}`, 'PUT', payload),
  remove: (slug: string, id: string | number) => request<unknown>(`/api/admin/${routeFor[slug]}/${encodeURIComponent(String(id))}`, 'DELETE'),
};
export function asRows(value: unknown): Entity[] {
  if (Array.isArray(value)) return value.filter((row): row is Entity => !!row && typeof row === 'object');
  if (value && typeof value === 'object') {
    const obj = value as Record<string, unknown>;
    for (const key of ['data', 'items', 'results', 'rows']) if (Array.isArray(obj[key])) return (obj[key] as unknown[]).filter((row): row is Entity => !!row && typeof row === 'object');
    if ('id' in obj) return [obj as Entity];
  }
  return [];
}
