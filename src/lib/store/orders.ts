"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export type CheckoutItemInput = {
  productId: string;
  variantId?: string | null;
  quantity: number;
};

export type CheckoutInput = {
  customerName: string;
  customerPhone: string;
  governorate: string;
  city: string;
  address: string;
  notes?: string;
  paymentMethod: "CASH_ON_DELIVERY" | "VODAFONE_CASH";
  items: CheckoutItemInput[];
};

function normalizePhone(phone: string) {
  return phone.replace(/[\s\-]/g, "").trim();
}

function isValidEgyptianPhone(phone: string) {
  const p = normalizePhone(phone);
  // 01xxxxxxxxx or +201xxxxxxxxx or 201xxxxxxxxx
  return /^(?:\+?20)?0?1[0125]\d{8}$/.test(p);
}

async function generateOrderNumber() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const prefix = `EL-${y}${m}${d}`;

  // Count today's orders for sequence
  const start = new Date(y, now.getMonth(), now.getDate());
  const end = new Date(y, now.getMonth(), now.getDate() + 1);
  const count = await prisma.order.count({
    where: { createdAt: { gte: start, lt: end } },
  });
  const seq = String(count + 1).padStart(4, "0");
  // Add random suffix to reduce collision on parallel requests
  const rand = Math.floor(Math.random() * 90 + 10);
  return `${prefix}-${seq}${rand}`;
}

export async function createOrder(input: CheckoutInput) {
  try {
    // ---- Validation ----
    const name = input.customerName?.trim();
    const phone = normalizePhone(input.customerPhone || "");
    const governorate = input.governorate?.trim();
    const city = input.city?.trim();
    const address = input.address?.trim();
    const notes = input.notes?.trim() || null;
if (
  input.paymentMethod !== "CASH_ON_DELIVERY" &&
  input.paymentMethod !== "VODAFONE_CASH"
) {
  return { ok: false as const, error: "طريقة الدفع غير صحيحة" };
}
    if (!name) return { ok: false as const, error: "الاسم مطلوب" };
    if (!phone) return { ok: false as const, error: "رقم الهاتف مطلوب" };
    if (!isValidEgyptianPhone(phone)) {
      return { ok: false as const, error: "رقم الهاتف غير صحيح. مثال: 01012345678" };
    }
    if (!governorate) return { ok: false as const, error: "المحافظة مطلوبة" };
    if (!city) return { ok: false as const, error: "المدينة مطلوبة" };
    if (!address) return { ok: false as const, error: "العنوان مطلوب" };
    if (!input.items?.length) {
      return { ok: false as const, error: "السلة فارغة" };
    }

    // ---- Load settings for shipping ----
    const shippingSetting = await prisma.setting.findUnique({
      where: { key: "shipping_fee" },
    });
    const freeThresholdSetting = await prisma.setting.findUnique({
      where: { key: "free_shipping_threshold" },
    });
    const shippingFeeBase = Number(shippingSetting?.value ?? 50);
    const freeThreshold = Number(freeThresholdSetting?.value ?? 500);

    // ---- Transaction ----
    const result = await prisma.$transaction(async (tx) => {
      const orderItemsData: {
        productId: string;
        variantId: string | null;
        productName: string;
        productImage: string | null;
        variantInfo: string | null;
        size: string | null;
        color: string | null;
        quantity: number;
        unitPrice: number;
        totalPrice: number;
      }[] = [];

      let subtotal = 0;

      for (const line of input.items) {
        if (!line.productId || line.quantity <= 0) {
          throw new Error("INVALID_ITEM");
        }

        const product = await tx.product.findFirst({
          where: { id: line.productId, isActive: true },
          include: {
            images: { where: { isPrimary: true }, take: 1 },
            variants: true,
          },
        });

        if (!product) {
          throw new Error("PRODUCT_NOT_FOUND");
        }

        let unitPrice = product.price;
        let size: string | null = null;
        let color: string | null = null;
        let variantId: string | null = line.variantId || null;
        let availableStock = product.stockQuantity;
        let productImage = product.images[0]?.url || null;

        if (variantId) {
          const variant = product.variants.find((v) => v.id === variantId && v.isActive);
          if (!variant) {
            throw new Error("VARIANT_NOT_FOUND");
          }
          if (variant.price != null) unitPrice = variant.price;
          size = variant.size;
          color = variant.color;
          availableStock = variant.stockQuantity;

          // Decrease variant stock with guard
          const updated = await tx.productVariant.updateMany({
            where: {
              id: variant.id,
              stockQuantity: { gte: line.quantity },
            },
            data: { stockQuantity: { decrement: line.quantity } },
          });
          if (updated.count === 0) {
            throw new Error("INSUFFICIENT_STOCK");
          }
        } else {
          // Product-level stock
          if (product.variants.length > 0) {
            // Product requires variant selection
            throw new Error("VARIANT_REQUIRED");
          }
          const updated = await tx.product.updateMany({
            where: {
              id: product.id,
              stockQuantity: { gte: line.quantity },
            },
            data: { stockQuantity: { decrement: line.quantity } },
          });
          if (updated.count === 0) {
            throw new Error("INSUFFICIENT_STOCK");
          }
        }

        // Also decrease product.stockQuantity aggregate when using variants
        if (variantId) {
          await tx.product.update({
            where: { id: product.id },
            data: { stockQuantity: { decrement: line.quantity } },
          });
        }

        const lineTotal = unitPrice * line.quantity;
        subtotal += lineTotal;

        const variantInfo = [size, color].filter(Boolean).join(" / ") || null;

        orderItemsData.push({
          productId: product.id,
          variantId,
          productName: product.nameAr || product.name,
          productImage,
          variantInfo,
          size,
          color,
          quantity: line.quantity,
          unitPrice,
          totalPrice: lineTotal,
        });
      }

      const shippingFee = subtotal >= freeThreshold ? 0 : shippingFeeBase;
      const total = subtotal + shippingFee;

      let orderNumber = await generateOrderNumber();
      // retry once on unique collision
      for (let attempt = 0; attempt < 3; attempt++) {
        try {
          const order = await tx.order.create({
            data: {
              orderNumber,
              customerName: name,
              customerPhone: phone,
              governorate,
              city,
              address,
              notes,
              status: "PENDING",
              paymentMethod: input.paymentMethod,
              subtotal,
              discountAmount: 0,
              shippingFee,
              total,
              items: {
                create: orderItemsData,
              },
              statusHistory: {
                create: {
                  status: "PENDING",
                  note: "تم إنشاء الطلب",
                },
              },
            },
            include: { items: true },
          });
          return order;
        } catch (e: any) {
          if (e?.code === "P2002") {
            orderNumber = await generateOrderNumber();
            continue;
          }
          throw e;
        }
      }
      throw new Error("ORDER_NUMBER_FAILED");
    });

    revalidatePath("/admin");
    revalidatePath("/admin/orders");
    revalidatePath("/admin/products");

    return {
      ok: true as const,
      orderNumber: result.orderNumber,
      total: result.total,
      orderId: result.id,
    };
  } catch (e: any) {
    console.error("[createOrder]", e);
    const msg = e?.message;
    if (msg === "INSUFFICIENT_STOCK") {
      return { ok: false as const, error: "الكمية المطلوبة غير متوفرة لبعض المنتجات" };
    }
    if (msg === "PRODUCT_NOT_FOUND") {
      return { ok: false as const, error: "أحد المنتجات غير متاح حالياً" };
    }
    if (msg === "VARIANT_NOT_FOUND" || msg === "VARIANT_REQUIRED") {
      return { ok: false as const, error: "يرجى اختيار المقاس واللون بشكل صحيح" };
    }
    if (msg === "INVALID_ITEM") {
      return { ok: false as const, error: "بيانات السلة غير صحيحة" };
    }
    return {
      ok: false as const,
      error: "حدثت مشكلة أثناء إنشاء الطلب. برجاء المحاولة مرة أخرى.",
    };
  }
}

export async function updateOrderStatus(orderId: string, status: string, note?: string) {
  const { requireAdmin } = await import("@/lib/admin/auth");
  await requireAdmin();

  const valid = ["PENDING", "CONFIRMED", "PREPARING", "SHIPPED", "DELIVERED", "CANCELLED"];
  if (!valid.includes(status)) {
    return { ok: false as const, error: "حالة غير صالحة" };
  }

  try {
    await prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: { id: orderId },
        include: { items: true },
      });
      if (!order) throw new Error("NOT_FOUND");

      const prev = order.status;
      if (prev === status) return;

      // Restock only when transitioning TO cancelled from a non-cancelled state
      if (status === "CANCELLED" && prev !== "CANCELLED") {
        for (const item of order.items) {
          if (item.variantId) {
            await tx.productVariant.updateMany({
              where: { id: item.variantId },
              data: { stockQuantity: { increment: item.quantity } },
            });
          }
          if (item.productId) {
            await tx.product.updateMany({
              where: { id: item.productId },
              data: { stockQuantity: { increment: item.quantity } },
            });
          }
        }
      }

      // If un-cancelling (CANCELLED -> something else), re-deduct stock
      if (prev === "CANCELLED" && status !== "CANCELLED") {
        for (const item of order.items) {
          if (item.variantId) {
            const updated = await tx.productVariant.updateMany({
              where: {
                id: item.variantId,
                stockQuantity: { gte: item.quantity },
              },
              data: { stockQuantity: { decrement: item.quantity } },
            });
            if (updated.count === 0) throw new Error("INSUFFICIENT_STOCK");
          }
          if (item.productId) {
            await tx.product.updateMany({
              where: { id: item.productId },
              data: { stockQuantity: { decrement: item.quantity } },
            });
          }
        }
      }

      await tx.order.update({
        where: { id: orderId },
        data: { status: status as any },
      });

      await tx.orderStatusHistory.create({
        data: {
          orderId,
          status: status as any,
          note: note || null,
        },
      });
    });

    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${orderId}`);
    revalidatePath("/admin");
    revalidatePath("/admin/products");
    return { ok: true as const };
  } catch (e: any) {
    console.error("[updateOrderStatus]", e);
    if (e?.message === "INSUFFICIENT_STOCK") {
      return { ok: false as const, error: "لا يمكن إعادة تفعيل الطلب — المخزون غير كافٍ" };
    }
    if (e?.message === "NOT_FOUND") {
      return { ok: false as const, error: "الطلب غير موجود" };
    }
    return { ok: false as const, error: "تعذر تحديث حالة الطلب" };
  }
}
