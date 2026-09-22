import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { OrderStatusBadge } from "@/components/admin/orders/OrderStatusBadge";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);

  const [
    productsCount,
    categoriesCount,
    brandsCount,
    ordersCount,
    pendingOrders,
    confirmedOrders,
    deliveredOrders,
    cancelledOrders,
    revenueAgg,
    recentOrders,
    allActiveProducts,
    theme,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.category.count(),
    prisma.brand.count(),
    prisma.order.count(),
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.order.count({ where: { status: "CONFIRMED" } }),
    prisma.order.count({ where: { status: "DELIVERED" } }),
    prisma.order.count({ where: { status: "CANCELLED" } }),
    prisma.order.aggregate({
      where: { status: { not: "CANCELLED" } },
      _sum: { total: true },
    }),
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { _count: { select: { items: true } } },
    }),
    prisma.product.findMany({
      where: { isActive: true },
      select: { stockQuantity: true, lowStockThreshold: true },
    }),
    prisma.theme.findFirst({ where: { isActive: true } }),
  ]);

  const lowStockCount = allActiveProducts.filter(
    (p) => p.stockQuantity <= p.lowStockThreshold
  ).length;
  const revenue = revenueAgg._sum.total || 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-heading font-bold">لوحة التحكم</h1>
        <p className="text-muted-text mt-1">
          مرحباً، {session?.user?.name || session?.user?.email}
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <Link href="/admin/orders" className="bg-white rounded-xl border border-border p-5 hover:border-primary transition">
          <p className="text-sm text-muted-text">إجمالي الطلبات</p>
          <p className="text-3xl font-bold mt-1">{ordersCount}</p>
        </Link>
        <div className="bg-white rounded-xl border border-border p-5">
          <p className="text-sm text-muted-text">قيد الانتظار</p>
          <p className="text-3xl font-bold mt-1 text-yellow-700">{pendingOrders}</p>
        </div>
        <div className="bg-white rounded-xl border border-border p-5">
          <p className="text-sm text-muted-text">مؤكدة</p>
          <p className="text-3xl font-bold mt-1 text-blue-700">{confirmedOrders}</p>
        </div>
        <div className="bg-white rounded-xl border border-border p-5">
          <p className="text-sm text-muted-text">تم التسليم</p>
          <p className="text-3xl font-bold mt-1 text-green-700">{deliveredOrders}</p>
        </div>
        <div className="bg-white rounded-xl border border-border p-5">
          <p className="text-sm text-muted-text">ملغاة</p>
          <p className="text-3xl font-bold mt-1">{cancelledOrders}</p>
        </div>
        <div className="bg-white rounded-xl border border-border p-5">
          <p className="text-sm text-muted-text">الإيرادات (غير الملغاة)</p>
          <p className="text-xl font-bold mt-1">{formatPrice(revenue)}</p>
        </div>
        <Link href="/admin/products" className="bg-white rounded-xl border border-border p-5 hover:border-primary transition">
          <p className="text-sm text-muted-text">المنتجات</p>
          <p className="text-3xl font-bold mt-1">{productsCount}</p>
        </Link>
        <div className="bg-white rounded-xl border border-border p-5">
          <p className="text-sm text-muted-text">مخزون منخفض</p>
          <p className={`text-3xl font-bold mt-1 ${lowStockCount > 0 ? "text-error" : ""}`}>
            {lowStockCount}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading font-semibold text-lg">أحدث الطلبات</h2>
          <Link href="/admin/orders" className="text-sm text-primary hover:underline">
            عرض الكل
          </Link>
        </div>
        {recentOrders.length === 0 ? (
          <p className="text-muted-text text-sm">لا توجد طلبات بعد</p>
        ) : (
          <ul className="space-y-3">
            {recentOrders.map((o) => (
              <li key={o.id} className="flex items-center justify-between gap-3 text-sm border-b border-border pb-3 last:border-0">
                <div>
                  <Link href={`/admin/orders/${o.id}`} className="font-mono text-xs hover:underline" dir="ltr">
                    {o.orderNumber}
                  </Link>
                  <p className="text-muted-text">{o.customerName} · {o._count.items} منتج</p>
                </div>
                <div className="text-left flex items-center gap-3">
                  <OrderStatusBadge status={o.status} />
                  <span className="font-medium">{formatPrice(o.total)}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="bg-white rounded-xl border border-border p-6">
        <h2 className="font-heading font-semibold text-lg mb-4">روابط سريعة</h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/orders" className="px-4 py-2 bg-primary text-white rounded-lg text-sm">
            الطلبات
          </Link>
          <Link href="/admin/products/new" className="px-4 py-2 border border-border rounded-lg text-sm hover:bg-surface">
            + منتج جديد
          </Link>
          <Link href="/admin/appearance" className="px-4 py-2 border border-border rounded-lg text-sm hover:bg-surface">
            المظهر
          </Link>
          <Link href="/admin/settings" className="px-4 py-2 border border-border rounded-lg text-sm hover:bg-surface">
            الإعدادات
          </Link>
        </div>
        <p className="text-sm text-muted-text mt-4">
          الثيم النشط: <strong>{theme?.name || "—"}</strong> · تصنيفات: {categoriesCount} · براندات: {brandsCount}
        </p>
      </div>
    </div>
  );
}
