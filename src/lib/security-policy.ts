/** Public article fields: submission contact details are deliberately excluded. */
export const PUBLIC_NEWS_COLUMNS = "id,title,slug,summary,content,image,category,author,source_name,source_url,photo_source,location,event_date,published_at,featured,active,status,created_at,updated_at";

export function backupAccessDenied() {
  return new Response(JSON.stringify({ error: "Backup hanya tersedia untuk administrator yang terverifikasi. Akses belum diaktifkan." }), {
    status: 403,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });
}

export const SECURITY_HEADERS: Record<string, string> = {
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(self), microphone=(self), geolocation=(self), payment=()",
  // Allow Lovable's embedded preview; disallow embedding by unrelated origins.
  "Content-Security-Policy": "frame-ancestors 'self' https://lovable.dev https://*.lovable.dev https://lovable.app https://*.lovable.app; object-src 'none'; base-uri 'self'",
};