import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth/options";
import Link from "next/link";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/admin/login");
  }

  const nav = [
    { href: "/admin", label: "الرئيسية" },
    { href: "/admin/orders", label: "الطلبات" },
    { href: "/admin/products", label: "المنتجات" },
    { href: "/admin/categories", label: "التصنيفات" },
    { href: "/admin/brands", label: "البراندات" },
    { href: "/admin/appearance", label: "المظهر" },
    { href: "/admin/settings", label: "الإعدادات" },
  ];

  return (
    <div className="min-h-screen bg-surface">
      <header className="bg-white border-b border-border sticky top-0 z-50">
        <div className="container flex items-center justify-between h-14">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="font-heading font-bold text-lg">
              الشعراوي Admin
            </Link>
            <nav className="hidden lg:flex items-center gap-4 text-sm">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-muted-text hover:text-primary transition"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <Link href="/" target="_blank" className="text-muted-text hover:text-primary hidden sm:inline">
              المتجر ↗
            </Link>
            <span className="text-muted-text hidden md:inline">
              {session.user?.email}
            </span>
            <Link href="/api/auth/signout" className="text-error hover:underline">
              خروج
            </Link>
          </div>
        </div>
      </header>

      <div className="lg:hidden bg-white border-b border-border overflow-x-auto">
        <div className="flex gap-4 px-4 py-2 text-sm whitespace-nowrap">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="text-muted-text hover:text-primary">
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      <main className="container py-8">{children}</main>
    </div>
  );
}
