import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center space-y-4">
        <h1 className="font-heading text-3xl font-bold">الصفحة غير موجودة</h1>
        <p className="text-muted-text">عذراً، لم نتمكن من العثور على هذه الصفحة.</p>
        <Link href="/" className="inline-block bg-primary text-white px-6 py-2.5 rounded-lg text-sm">
          العودة للرئيسية
        </Link>
      </div>
    </div>
  );
}
