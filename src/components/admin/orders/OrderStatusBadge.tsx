const styles: Record<string, string> = {
  PENDING: "bg-yellow-50 text-yellow-800",
  CONFIRMED: "bg-blue-50 text-blue-800",
  PREPARING: "bg-indigo-50 text-indigo-800",
  SHIPPED: "bg-purple-50 text-purple-800",
  DELIVERED: "bg-green-50 text-green-800",
  CANCELLED: "bg-gray-100 text-gray-600",
};

const labels: Record<string, string> = {
  PENDING: "قيد الانتظار",
  CONFIRMED: "مؤكد",
  PREPARING: "قيد التجهيز",
  SHIPPED: "تم الشحن",
  DELIVERED: "تم التسليم",
  CANCELLED: "ملغي",
};

export function OrderStatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
        styles[status] || "bg-gray-100"
      }`}
    >
      {labels[status] || status}
    </span>
  );
}
