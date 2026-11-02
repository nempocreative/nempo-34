import { useState, useEffect, useCallback } from "react";

const API = "/api";

export interface Review {
  id: string;
  name: string;
  picture?: string;
  rating: number;
  comment: string;
  date: string;
}

export function useReviews(itemType: string, itemId: number | string) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = useCallback(async () => {
    try {
      const res = await fetch(`${API}/reviews/${itemType}/${itemId}`);
      if (res.ok) {
        const data = await res.json();
        setReviews(data);
      }
    } catch {}
    setLoading(false);
  }, [itemType, itemId]);

  useEffect(() => { fetchReviews(); }, [fetchReviews]);

  const addReview = useCallback(async (token: string, rating: number, comment: string) => {
    const res = await fetch(`${API}/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ item_type: itemType, item_id: itemId, rating, comment }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error ?? "Gagal menyimpan ulasan");
    }
    await fetchReviews();
  }, [itemType, itemId, fetchReviews]);

  const averageRating =
    reviews.length === 0 ? 0 : reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;

  const distribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }));

  return { reviews, loading, addReview, averageRating, distribution };
}
