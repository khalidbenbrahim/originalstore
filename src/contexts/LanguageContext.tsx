import React, { createContext, useContext, useState, useCallback } from "react";
import { Language, t } from "@/lib/i18n";

interface LanguageContextType {
  lang: Language;
  toggleLang: () => void;
  t: (path: string) => string;
  dir: "ltr" | "rtl";
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Language>("fr");

  const toggleLang = useCallback(() => {
    setLang((prev) => (prev === "fr" ? "ar" : "fr"));
  }, []);

  const dir = lang === "ar" ? "rtl" : "ltr";

  const translate = useCallback(
    (path: string) => t(lang, path),
    [lang]
  );

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, t: translate, dir }}>
      <div dir={dir} className={lang === "ar" ? "font-arabic" : "font-sans"}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
}
