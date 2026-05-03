"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard,
  UtensilsCrossed,
  Megaphone,
  Images,
  LogOut,
  Coffee,
} from "lucide-react";

function AdminShell({ children }: { children: React.ReactNode }) {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (!loading && !user && !isLoginPage) {
      router.replace("/admin/login");
    }
  }, [user, loading, router, isLoginPage]);

  if (isLoginPage) return <>{children}</>;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#d4a853] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  const navLinks = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/menu", label: "Menu", icon: UtensilsCrossed },
    { href: "/admin/campaigns", label: "Campaigns", icon: Megaphone },
    { href: "/admin/gallery", label: "Gallery", icon: Images },
  ];

  return (
    <div className="min-h-screen bg-[#111] flex">
      {/* Sidebar */}
      <aside className="w-56 bg-[#0d0d0d] border-r border-[#2a2a2a] flex flex-col">
        <div className="p-5 border-b border-[#2a2a2a] flex items-center gap-2">
          <Coffee size={20} className="text-[#d4a853]" />
          <span className="font-semibold text-[#f0ece4] text-sm">Jiknaam Admin</span>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {navLinks.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  active
                    ? "bg-[#d4a853]/15 text-[#d4a853]"
                    : "text-[#888] hover:text-[#f0ece4] hover:bg-[#1c1c1c]"
                }`}
              >
                <Icon size={16} />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-[#2a2a2a]">
          <div className="px-3 py-1 mb-2">
            <p className="text-[10px] text-[#555] truncate">{user.email}</p>
          </div>
          <button
            onClick={signOut}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[#888] hover:text-red-400 hover:bg-red-400/10 transition-colors"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto p-8">{children}</main>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AdminShell>{children}</AdminShell>
    </AuthProvider>
  );
}
