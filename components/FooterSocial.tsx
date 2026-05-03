"use client";

import { useEffect, useState } from "react";
import { getContactInfo } from "@/lib/firestore";

export default function FooterSocial() {
  const [links, setLinks] = useState({ facebook: "#", instagram: "#" });

  useEffect(() => {
    getContactInfo().then((info) => {
      setLinks({ facebook: info.facebook, instagram: info.instagram });
    });
  }, []);

  return (
    <div className="flex gap-3">
      <a
        href={links.instagram}
        target={links.instagram !== "#" ? "_blank" : undefined}
        rel="noopener noreferrer"
        aria-label="Instagram"
        className="w-9 h-9 rounded-full border border-[#2a2a2a] flex items-center justify-center text-[#666] hover:text-[#d4a853] hover:border-[#d4a853]/40 transition-colors text-xs font-bold"
      >
        IG
      </a>
      <a
        href={links.facebook}
        target={links.facebook !== "#" ? "_blank" : undefined}
        rel="noopener noreferrer"
        aria-label="Facebook"
        className="w-9 h-9 rounded-full border border-[#2a2a2a] flex items-center justify-center text-[#666] hover:text-[#d4a853] hover:border-[#d4a853]/40 transition-colors text-xs font-bold"
      >
        FB
      </a>
    </div>
  );
}
