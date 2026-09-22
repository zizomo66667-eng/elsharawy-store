# متجر الشعراوي — Elsharawy Store

## الحالة: Phase 5 مكتملة (Cart → Checkout → Orders → Inventory → WhatsApp)

---

### Completed

**Cart**
- Zustand + localStorage persistence (`elsharawy-cart`)
- إضافة منتج مع Variant (مقاس/لون) + كمية
- زيادة/تقليل/حذف + مسح السلة
- احترام maxStock من جهة العميل (والتحقق النهائي من السيرفر)
- أيقونة السلة في Header مع العداد

**Checkout (COD فقط)**
- `/checkout` — اسم، هاتف مصري، محافظة، مدينة، عنوان، ملاحظات
- الشحن من Settings (`shipping_fee` / `free_shipping_threshold`)
- الأسعار والمخزون تُعاد قراءتها من Database على السيرفر
- Prisma `$transaction`: تحقق مخزون → إنشاء Order + Items → خصم المخزون
- حماية من النقص تحت الصفر عبر `updateMany` بشرط `stockQuantity >= qty`
- زر مع loading لمنع double submit

**Order**
- رقم طلب: `EL-YYYYMMDD-####RR`
- Snapshot: اسم المنتج، صورة، مقاس، لون، سعر الوحدة وقت الشراء
- OrderItem.productId اختياري (`onDelete: SetNull`) حتى لا تنكسر الطلبات القديمة

**Order Success**
- `/order-success/[orderNumber]`
- ملخص الطلب + رابط WhatsApp click-to-chat (من Settings)
- `noindex`

**Admin Orders**
- `/admin/orders` — قائمة
- `/admin/orders/[id]` — تفاصيل + تغيير الحالة + سجل الحالات
- إلغاء الطلب يعيد المخزون مرة واحدة فقط
- Dashboard: طلبات، حالات، إيرادات، أحدث الطلبات

**Inventory**
- خصم عند إنشاء الطلب (product + variant)
- إرجاع عند التحويل إلى CANCELLED من حالة أخرى
- إعادة الخصم عند إلغاء الإلغاء (إن أمكن)

---

### Routes الجديدة

| Route | الوصف |
|-------|--------|
| `/cart` | سلة التسوق |
| `/checkout` | إتمام الطلب (COD) |
| `/order-success/[orderNumber]` | تأكيد الطلب |
| `/admin/orders` | قائمة الطلبات |
| `/admin/orders/[id]` | تفاصيل الطلب |

---

### Database Changes

- `OrderItem`: حقول snapshot إضافية (`variantId`, `productImage`, `size`, `color`)، `productId` أصبح optional مع `onDelete: SetNull`
- `OrderStatusHistory` model جديد + علاقة على `Order`

بعد السحب:

```bash
npx prisma generate
npx prisma db push
```

---

### Cart

- التخزين: Zustand `persist` → localStorage
- ليس مصدر حقيقة للسعر/المخزون عند الطلب

### Checkout / Order

- Server Action: `createOrder` في `src/lib/store/orders.ts`
- يعيد حساب السعر والشحن من DB + Settings
- Transaction ذرية

### Inventory

- `updateMany` بشرط الكمية ≥ المطلوبة
- Restock فقط عند الانتقال إلى CANCELLED

### WhatsApp

- Click-to-chat فقط (ليس WhatsApp Business API)
- الرقم من Setting `whatsapp`
- الرسالة تُبنى من بيانات الطلب الفعلية

### Security

- Admin orders محمية بـ Middleware + `requireAdmin` على `updateOrderStatus`
- صفحات cart/checkout/success: `robots: noindex`
- Order success يعتمد على `orderNumber` الفريد (تاريخ + تسلسل + عشوائي)

---

### Testing

بسبب قيود الـSandbox:

- ❌ لم يُشغَّل `npm install` / `build` / `dev` هنا بنجاح
- ❌ لم يُختبر سيناريو الشراء الكامل داخل هذه البيئة

على جهازك بعد `db push`:

1. أضف منتج بمخزون 5 + variants
2. من المتجر: اختاري variant → أضيفي للسلة → checkout
3. تأكيد الطلب → راقبي `/admin/orders`
4. تحققي أن المخزون نقص
5. ألغِ الطلب من الأدمن → المخزون يعود

---

### Known Issues

1. لا يوجد Payment Gateway (متعمد — COD فقط)
2. WhatsApp = deep link وليس API رسمي
3. Image upload ما زال بروابط
4. سباق طلبين على آخر قطعة: محمي بـ conditional update؛ SQLite أضعف من Postgres في القفل
5. المشروع ليس Production Ready بالكامل قبل اختبارك المحلي

---

### Next Phase (Phase 6 مقترح)

- Image Upload (Cloudinary/S3)
- Coupons تفعيل كامل
- تحسين Homepage Builder (ترتيب/إخفاء sections من الأدمن)
- إشعارات أدمن للطلبات الجديدة
- (لاحقاً) Payment Gateway
