"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { type AdminLang, type TranslationKey, getT } from "@/lib/adminT";

type Ctx = { lang: AdminLang; setLang: (l: AdminLang) => void; t: (key: TranslationKey) => string };

const AdminLangCtx = createContext<Ctx>({ lang: "th", setLang: () => {}, t: getT("th") });

export function AdminLangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<AdminLang>("th");

  useEffect(() => {
    const s = localStorage.getItem("admin-lang") as AdminLang | null;
    if (s === "en" || s === "th") setLangState(s);
  }, []);

  function setLang(l: AdminLang) {
    setLangState(l);
    localStorage.setItem("admin-lang", l);
  }

  return (
    <AdminLangCtx.Provider value={{ lang, setLang, t: getT(lang) }}>
      {children}
    </AdminLangCtx.Provider>
  );
}

export function useAdminLang() {
  return useContext(AdminLangCtx);
}
