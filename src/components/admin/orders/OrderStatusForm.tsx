"use client";

import { useState, useTransition } from "react";
import { updateOrderStatus } from "@/lib/store/orders";

const STATUSES = [
  { value: "PENDING", label: "قيد الانتظار" },
  { value: "CONFIRMED", label: "مؤكد" },
  { value: "PREPARING", label: "قيد التجهيز" },
  { value: "SHIPPED", label: "تم الشحن" },
  { value: "DELIVERED", label: "تم التسليم" },
  { value: "CANCELLED", label: "ملغي" },
];

export function OrderStatusForm({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: string;
}) {
  const [status, setStatus] = useState(currentStatus);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setError(null);
    startTransition(async () => {
      const result = await updateOrderStatus(orderId, status);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setMessage("تم تحديث الحالة");
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-3">
      <div>
        <label className="block text-sm mb-1">الحالة</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border border-border rounded-lg px-3 py-2 text-sm bg-white"
        >
          {STATUSES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        disabled={pending || status === currentStatus}
        className="bg-primary text-white px-4 py-2 rounded-lg text-sm disabled:opacity-50"
      >
        {pending ? "جاري الحفظ..." : "تحديث"}
      </button>
      {message && <p className="text-sm text-success">{message}</p>}
      {error && <p className="text-sm text-error">{error}</p>}
    </form>
  );
}
