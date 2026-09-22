import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { OrderStatusBadge } from "@/components/admin/orders/OrderStatusBadge";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      items: true,
      _count: { select: { items: true } },
    },
    take: 100,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold">الطلبات</h1>
        <p className="text-muted-text text-sm mt-1">{orders.length} طلب</p>
      </div>

      <div className="bg-white rounded-xl border border-border overflow-x-auto">
        <table className="w-full text-sm min-w-[720px]">
          <thead className="bg-surface border-b border-border">
            <tr>
              <th className="text-right p-3 font-medium">رقم الطلب</th>
              <th className="text-right p-3 font-medium">العميل</th>
              <th className="text-right p-3 font-medium">التاريخ</th>
              <th className="text-right p-3 font-medium">المنتجات</th>
              <th className="text-right p-3 font-medium">الإجمالي</th>
              <th className="text-right p-3 font-medium">الدفع</th>
              <th className="text-right p-3 font-medium">الحالة</th>
              <th className="text-right p-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-b border-border last:border-0">
                <td className="p-3 font-mono text-xs" dir="ltr">
                  {o.orderNumber}
                </td>
                <td className="p-3">
                  <div className="font-medium">{o.customerName}</div>
                  <div className="text-xs text-muted-text" dir="ltr">
                    {o.customerPhone}
                  </div>
                </td>
                <td className="p-3 text-xs text-muted-text">
                  {new Date(o.createdAt).toLocaleString("ar-EG")}
                </td>
                <td className="p-3">{o._count.items}</td>
                <td className="p-3 font-medium">{formatPrice(o.total)}</td>
                <td className="p-3 text-xs">عند الاستلام</td>
                <td className="p-3">
                  <OrderStatusBadge status={o.status} />
                </td>
                <td className="p-3">
                  <Link
                    href={`/admin/orders/${o.id}`}
                    className="text-primary hover:underline text-xs"
                  >
                    تفاصيل
                  </Link>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={8} className="p-8 text-center text-muted-text">
                  لا توجد طلبات بعد
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
