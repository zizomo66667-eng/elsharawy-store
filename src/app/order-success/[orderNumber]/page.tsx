import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { StoreShell } from "@/components/store/layout/StoreShell";
import { prisma } from "@/lib/prisma";
import { getCachedStoreConfig } from "@/lib/store/settings";
import { formatPrice } from "@/lib/utils";

export const metadata: Metadata = {
  title: "تم استلام طلبك | الشعراوي",
  robots: { index: false, follow: false },
};

type Props = { params: Promise<{ orderNumber: string }> };

function maskPhone(phone: string) {
  if (phone.length < 7) return phone;
  return phone.slice(0, 3) + "****" + phone.slice(-3);
}

export default async function OrderSuccessPage({ params }: Props) {
  const { orderNumber } = await params;

  // orderNumber is unique and non-sequential enough (date + seq + random)
  const order = await prisma.order.findUnique({
    where: { orderNumber },
    include: { items: true },
  });

  if (!order) notFound();

  const { settings } = await getCachedStoreConfig();
  const currency = String(settings.currency || "EGP");
  const whatsapp = String(settings.whatsapp || "").replace(/[^0-9]/g, "");

  const lines = [
    `طلب جديد من متجر ${settings.store_name || "الشعراوي"}`,
    ``,
    `رقم الطلب: ${order.orderNumber}`,
    `العميل: ${order.customerName}`,
    `الهاتف: ${order.customerPhone}`,
    ``,
    `المنتجات:`,
    ...order.items.map((i) => {
      const v = i.variantInfo ? ` (${i.variantInfo})` : "";
      return `- ${i.productName}${v} × ${i.quantity}`;
    }),
    ``,
    `المجموع: ${order.subtotal} ${currency}`,
    `الشحن: ${order.shippingFee} ${currency}`,
    `الإجمالي: ${order.total} ${currency}`,
    ``,
    `الدفع: عند الاستلام`,
    `العنوان: ${order.governorate} - ${order.city}`,
    order.address,
  ];
  if (order.notes) lines.push(`ملاحظات: ${order.notes}`);

  const waUrl = whatsapp
    ? `https://wa.me/${whatsapp}?text=${encodeURIComponent(lines.join("\n"))}`
    : null;

  return (
    <StoreShell>
      <div className="container py-12 max-w-lg text-center space-y-6">
        <div className="w-16 h-16 mx-auto rounded-full bg-green-50 flex items-center justify-center text-3xl">
          ✓
        </div>
        <h1 className="font-heading text-2xl font-bold">تم استلام طلبك بنجاح</h1>
        <p className="text-muted-text text-sm">
          شكراً لكِ. سنتواصل معكِ قريباً لتأكيد الطلب.
        </p>

        <div className="bg-white border border-border rounded-[var(--card-radius)] p-5 text-right space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-text">رقم الطلب</span>
            <span className="font-mono font-medium" dir="ltr">
              {order.orderNumber}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-text">الاسم</span>
            <span>{order.customerName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-text">الهاتف</span>
            <span dir="ltr">{maskPhone(order.customerPhone)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-text">الإجمالي</span>
            <span className="font-semibold">{formatPrice(order.total, currency)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-text">الدفع</span>
            <span>عند الاستلام</span>
          </div>
          <div className="border-t border-border pt-3 space-y-1">
            {order.items.map((i) => (
              <div key={i.id} className="flex justify-between gap-2">
                <span className="text-muted-text">
                  {i.productName}
                  {i.variantInfo ? ` (${i.variantInfo})` : ""} × {i.quantity}
                </span>
                <span>{formatPrice(i.totalPrice, currency)}</span>
              </div>
            ))}
          </div>
          <p className="text-muted-text text-xs pt-2">
            {order.governorate} — {order.city}
            <br />
            {order.address}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {waUrl && (
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-[#25D366] text-white px-6 py-3 rounded-[var(--btn-radius)] text-sm font-medium"
            >
              إرسال الطلب عبر واتساب
            </a>
          )}
          <Link
            href="/products"
            className="inline-flex items-center justify-center bg-primary text-white px-6 py-3 rounded-[var(--btn-radius)] text-sm font-medium"
          >
            العودة للمتجر
          </Link>
        </div>
      </div>
    </StoreShell>
  );
}
