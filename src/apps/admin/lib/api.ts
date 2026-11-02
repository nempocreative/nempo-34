const BASE = "/api";

function getToken() {
  return localStorage.getItem("nempo_admin_token") || "";
}

async function safeJson(res: Response) {
  const text = await res.text();
  if (!text || !text.trim()) return {};
  try { return JSON.parse(text); } catch { return {}; }
}

async function req(method: string, path: string, body?: unknown) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const err = await safeJson(res);
    throw new Error(err.error || "Request failed");
  }
  return safeJson(res);
}

function crud(path: string) {
  return {
    list: () => req("GET", `/admin/${path}`),
    create: (d: unknown) => req("POST", `/admin/${path}`, d),
    update: (id: number, d: unknown) => req("PUT", `/admin/${path}/${id}`, d),
    delete: (id: number) => req("DELETE", `/admin/${path}/${id}`),
    bulkDelete: (ids: number[]) => req("DELETE", `/admin/${path}/bulk`, { ids }),
  };
}

export const api = {
  login: (username: string, password: string) =>
    fetch(`${BASE}/admin/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    }).then(async r => {
      const d = await safeJson(r);
      if (!r.ok) throw new Error(d.error || "Login gagal. Pastikan API server aktif.");
      return d;
    }),

  uploadImage: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch(`${BASE}/admin/upload`, {
      method: "POST",
      headers: { Authorization: `Bearer ${getToken()}` },
      body: formData,
    });
    if (!res.ok) {
      const err = await safeJson(res);
      throw new Error(err.error || "Upload failed");
    }
    const data = await safeJson(res);
    return data.url;
  },

  stats: () => req("GET", "/admin/stats"),

  wisata: crud("wisata"),
  kuliner: crud("kuliner"),
  cafe: crud("cafe"),
  penginapan: crud("penginapan"),
  events: crud("events"),
  eventTickets: {
    list: (eventId: number) => req("GET", `/admin/events/${eventId}/tickets`),
    create: (eventId: number, d: unknown) => req("POST", `/admin/events/${eventId}/tickets`, d),
    update: (ticketId: number, d: unknown) => req("PUT", `/admin/event-tickets/${ticketId}`, d),
    delete: (ticketId: number) => req("DELETE", `/admin/event-tickets/${ticketId}`),
  },
  berita: {
    ...crud("berita"),
    approve: (id: number) => req("PATCH", `/admin/berita/${id}/approve`, {}),
    reject: (id: number) => req("PATCH", `/admin/berita/${id}/reject`, {}),
  },
  vouchers: crud("vouchers"),
  kamusSunda: crud("kamus-sunda"),
  transportasi: crud("transportasi"),
  priceList: crud("price-list"),
  partnership: {
    get: () => req("GET", "/admin/partnership"),
    update: (content: unknown) => req("PUT", "/admin/partnership", { content }),
  },
  digitalServices: crud("digital-services"),
  banners: crud("banners"),
  promoBanners: crud("promo-banners"),
  partners: crud("partners"),
  notifications: crud("notifications"),

  settings: {
    get: () => req("GET", "/admin/settings"),
    update: (d: unknown) => req("PUT", "/admin/settings", d),
  },

  users: {
    list: () => req("GET", "/admin/users"),
    get: (id: number) => req("GET", `/admin/users/${id}`),
    toggleActive: (id: number) => req("PUT", `/admin/users/${id}/toggle-active`, {}),
  },

  mitra: {
    ...crud("mitra"),
    toggleActive: (id: number) => req("PUT", `/admin/mitra/${id}/toggle-active`, {}),
    listingOptions: (type: string) => req("GET", `/admin/listing-options/${type}`),
    listings: (mitraId: number) => req("GET", `/admin/mitra/${mitraId}/listings`),
    addListing: (mitraId: number, listing_type: string, listing_id: number) =>
      req("POST", `/admin/mitra/${mitraId}/listings`, { listing_type, listing_id }),
    removeListing: (mitraId: number, linkId: number) =>
      req("DELETE", `/admin/mitra/${mitraId}/listings/${linkId}`),
  },

  withdrawals: {
    list: (status?: string) => req("GET", `/admin/withdrawals${status && status !== "all" ? `?status=${status}` : ""}`),
    summary: () => req("GET", "/admin/withdrawals/summary"),
    approve: (id: number) => req("POST", `/admin/withdrawals/${id}/approve`, {}),
    reject: (id: number, reason?: string) => req("POST", `/admin/withdrawals/${id}/reject`, { reason }),
    complete: (id: number, reference?: string) => req("POST", `/admin/withdrawals/${id}/complete`, { reference }),
    irisStatus: () => req("GET", "/admin/withdrawals/iris-status"),
  },

  passwordResetRequests: {
    list: () => req("GET", "/admin/password-reset-requests"),
    approve: (id: number) => req("POST", `/admin/password-reset-requests/${id}/approve`, {}),
    reject: (id: number) => req("POST", `/admin/password-reset-requests/${id}/reject`, {}),
  },

  deleteAccountRequests: {
    list: () => req("GET", "/admin/delete-account-requests"),
    approve: (id: number) => req("POST", `/admin/delete-account-requests/${id}/approve`, {}),
    reject: (id: number) => req("POST", `/admin/delete-account-requests/${id}/reject`, {}),
  },

  userActivities: {
    list: (limit?: number) => req("GET", `/admin/user-activities${limit ? `?limit=${limit}` : ""}`),
  },

  donations: {
    list: (status?: string) => req("GET", `/admin/donations${status && status !== "all" ? `?status=${status}` : ""}`),
    update: (id: number, d: unknown) => req("PUT", `/admin/donations/${id}`, d),
    delete: (id: number) => req("DELETE", `/admin/donations/${id}`),
    stats: () => fetch("/api/donations/stats").then(r => safeJson(r)).catch(() => ({})),
  },

  eventOrders: {
    list:    (source?: string) => req("GET", `/event-orders${source && source !== "all" ? `?source=${source}` : ""}`),
    counts:  () => req("GET", "/event-orders/counts"),
    confirm: (id: number) => req("PUT", `/event-orders/${id}/confirm`, {}),
    reject:  (id: number, notes?: string) => req("PUT", `/event-orders/${id}/reject`, { notes: notes ?? "" }),
    delete:  (id: number) => req("DELETE", `/event-orders/${id}`),
    checkin: (code: string) => req("POST", `/event-orders/checkin/${code}`, {}),
  },

  jajanYuk: {
    merchants: () => req("GET", "/admin/jajan-yuk/merchants"),
    menuItems: (merchantId?: number) =>
      req("GET", `/admin/jajan-yuk/menu-items${merchantId ? `?merchant_id=${merchantId}` : ""}`),
    createMenuItem: (data: unknown) => req("POST", "/admin/jajan-yuk/menu-items", data),
    updateMenuItem: (id: number, data: unknown) => req("PUT", `/admin/jajan-yuk/menu-items/${id}`, data),
    deleteMenuItem: (id: number) => req("DELETE", `/admin/jajan-yuk/menu-items/${id}`),
    orders: () => req("GET", "/admin/jajan-yuk/orders"),
    updateOrder: (id: number, data: unknown) => req("PATCH", `/admin/jajan-yuk/orders/${id}`, data),
    manualPayment: (id: number, action: "verify" | "reject") =>
      req("POST", `/admin/jajan-yuk/orders/${id}/manual-payment`, { action }),
  },

  influencers: crud("influencers"),
  influencerBannerPhotos: crud("influencer-banner-photos"),
  talents: crud("talents"),
  talentPortfolio: crud("talent-portfolio"),
  talentBanner: crud("talent-banner"),

  bpjsRegistrations: {
    list: () => req("GET", "/admin/bpjs-registrations"),
    delete: (id: number) => req("DELETE", `/admin/bpjs-registrations/${id}`),
  },

  emailFailures: {
    list: () => req("GET", "/admin/email-failures"),
    count: () => req("GET", "/admin/email-failures/count") as Promise<{ count: number }>,
    resend: (type: string, id: number) => req("POST", `/admin/email-failures/${type}/${id}/resend`),
  },

  backup: {
    download: async () => {
      const res = await fetch(`${BASE}/backup`, { cache: "no-store" });
      if (!res.ok) {
        const err = await safeJson(res);
        throw new Error(err.error || "Backup gagal dibuat");
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `nempo-organizer-backup-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);
    },
    restore: async (file: File) => {
      const formData = new FormData();
      formData.append("backup", file);
      const res = await fetch(`${BASE}/admin/backup/import`, {
        method: "POST",
        headers: { Authorization: `Bearer ${getToken()}` },
        body: formData,
      });
      const data = await safeJson(res);
      if (!res.ok) throw new Error(data.error || "Restore gagal");
      return data as {
        importedRows: number;
        skippedTables: number;
        failedTables: string[];
        message: string;
      };
    },
  },
};
