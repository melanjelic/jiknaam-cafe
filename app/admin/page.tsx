"use client";

import { useEffect, useState } from "react";
import { getMenuItems, getCampaigns, getGalleryItems } from "@/lib/firestore";
import { UtensilsCrossed, Megaphone, Images, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  const [counts, setCounts] = useState({ menu: 0, campaigns: 0, gallery: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [menu, campaigns, gallery] = await Promise.all([
        getMenuItems(),
        getCampaigns(),
        getGalleryItems(),
      ]);
      setCounts({ menu: menu.length, campaigns: campaigns.length, gallery: gallery.length });
      setLoading(false);
    }
    load();
  }, []);

  const cards = [
    { label: "Menu Items", count: counts.menu, icon: UtensilsCrossed, href: "/admin/menu", color: "text-amber-400" },
    { label: "Campaigns", count: counts.campaigns, icon: Megaphone, href: "/admin/campaigns", color: "text-blue-400" },
    { label: "Gallery Images", count: counts.gallery, icon: Images, href: "/admin/gallery", color: "text-purple-400" },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <TrendingUp size={22} className="text-[#d4a853]" />
        <h1 className="text-xl font-semibold text-[#f0ece4]">Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {cards.map(({ label, count, icon: Icon, href, color }) => (
          <Link
            key={href}
            href={href}
            className="bg-[#141414] border border-[#2a2a2a] rounded-2xl p-6 hover:border-[#d4a853]/40 transition-colors group"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-[#666] mb-1">{label}</p>
                <p className="text-3xl font-bold text-[#f0ece4]">
                  {loading ? "—" : count}
                </p>
              </div>
              <div className={`p-2.5 rounded-xl bg-[#1c1c1c] ${color}`}>
                <Icon size={20} />
              </div>
            </div>
            <p className="text-xs text-[#d4a853] mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
              Manage →
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
