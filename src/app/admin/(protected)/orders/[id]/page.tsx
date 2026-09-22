import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { OrderStatusBadge } from "@/components/admin/orders/OrderStatusBadge";
import { OrderStatusForm } from "@/components/admin/orders/OrderStatusForm";

type Props = { params: Promise<{ id: string }> };

export default async function AdminOrderDetailPage({ params }: Props) {
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: true,
      statusHistory: { orderBy: { createdAt: "asc" } },
    },
  });
  if (!order) notFound();

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-3 flex-wrap">
        <Link href="/admin/orders" className="text-muted-text hover:text-primary text-sm">
          ← الطلبات
        </Link>
        <h1 className="text-2xl font-heading font-bold">تفاصيل الطلب</h1>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="bg-white rounded-xl border border-border p-5 space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-text">رقم الطلب</span>
          <span className="font-mono" dir="ltr">
            {order.orderNumber}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-text">التاريخ</span>
          <span>{new Date(order.createdAt).toLocaleString("ar-EG")}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-text">الدفع</span>
          <span>عند الاستلام</span>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-border p-5 space-y-2 text-sm">
        <h2 className="font-heading font-semibold text-base mb-2">العميل</h2>
        <p>
          <span className="text-muted-text">الاسم: </span>
          {order.customerName}
        </p>
        <p>
          <span className="text-muted-text">الهاتف: </span>
          <span dir="ltr">{order.customerPhone}</span>
        </p>
        <p>
          <span className="text-muted-text">العنوان: </span>
          {order.governorate} — {order.city}
          <br />
          {order.address}
        </p>
        {order.notes && (
          <p>
            <span className="text-muted-text">ملاحظات: </span>
            {order.notes}
          </p>
        )}
      </div>

      <div className="bg-white rounded-xl border border-border p-5 space-y-3">
        <h2 className="font-heading font-semibold text-base">المنتجات</h2>
        {order.items.map((item) => (
          <div key={item.id} className="flex gap-3 text-sm border-b border-border pb-3 last:border-0">
            {item.productImage && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={item.productImage}
                alt=""
                className="w-14 h-16 object-cover rounded-md bg-surface"
              />
            )}
            <div className="flex-1">
              <p className="font-medium">{item.productName}</p>
              {item.variantInfo && (
                <p className="text-xs text-muted-text">{item.variantInfo}</p>
              )}
              <p className="text-xs text-muted-text">
                {formatPrice(item.unitPrice)} × {item.quantity}
              </p>
            </div>
            <p className="font-medium">{formatPrice(item.totalPrice)}</p>
          </div>
        ))}
        <div className="pt-2 space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-text">المجموع</span>
            <span>{formatPrice(order.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-text">الشحن</span>
            <span>{formatPrice(order.shippingFee)}</span>
          </div>
          <div className="flex justify-between font-semibold text-base">
            <span>الإجمالي</span>
            <span>{formatPrice(order.total)}</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-border p-5 space-y-4">
        <h2 className="font-heading font-semibold text-base">تغيير الحالة</h2>
        <OrderStatusForm orderId={order.id} currentStatus={order.status} />
      </div>

      {order.statusHistory.length > 0 && (
        <div className="bg-white rounded-xl border border-border p-5 space-y-3">
          <h2 className="font-heading font-semibold text-base">سجل الحالات</h2>
          <ul className="space-y-2 text-sm">
            {order.statusHistory.map((h) => (
              <li key={h.id} className="flex items-center gap-3">
                <OrderStatusBadge status={h.status} />
                <span className="text-muted-text text-xs">
                  {new Date(h.createdAt).toLocaleString("ar-EG")}
                </span>
                {h.note && <span className="text-xs">{h.note}</span>}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
