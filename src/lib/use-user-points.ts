import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/auth-context";

const API = "/api";

export interface UserPoints {
  total_points: number;
  login_streak: number;
  last_login_date: string | null;
  tier: string;
  next: string;
  nextPts: number;
  pct: number;
  transactions: Array<{ id: number; type: string; points: number; description: string; created_at: string }>;
}

export interface UserVoucher {
  id: number;
  code: string;
  title: string;
  description: string | null;
  discount_value: number;
  discount_type: string;
  applicable_type: string;
  event_name: string | null;
  status: string;
  source: string;
  claimed_at: string;
  expires_at: string | null;
}

export function useUserPoints() {
  const { user } = useAuth();
  const [points, setPoints] = useState<UserPoints | null>(null);
  const [vouchers, setVouchers] = useState<UserVoucher[]>([]);
  const [loading, setLoading] = useState(false);

  const token = user ? localStorage.getItem("nempo_user_token") : null;
  const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};

  const fetchPoints = useCallback(async () => {
    if (!user || !token) return;
    try {
      setLoading(true);
      const [pRes, vRes] = await Promise.all([
        fetch(`${API}/user/points`, { headers }),
        fetch(`${API}/user/vouchers`, { headers }),
      ]);
      if (pRes.ok) setPoints(await pRes.json());
      if (vRes.ok) setVouchers(await vRes.json());
    } catch { /* ignore */ } finally {
      setLoading(false);
    }
  }, [user, token]);

  useEffect(() => {
    fetchPoints();
  }, [fetchPoints]);

  const activeVoucherCount = vouchers.filter(v => v.status === "active").length;

  return { points, vouchers, activeVoucherCount, loading, refetch: fetchPoints };
}
