"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";

export async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || !["ADMIN", "SUPER_ADMIN"].includes((session.user as any)?.role)) {
    throw new Error("Unauthorized");
  }
  return session;
}
