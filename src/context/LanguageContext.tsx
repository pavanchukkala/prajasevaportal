"use client";
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import en from "../../locales/en.json";
import te from "../../locales/te.json";

export type Language = "en" | "te";

const translations: Record<Language, any> = { en, te };

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (keyPath: string, fallback?: string) => string;
  dictionary: typeof en;
}

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  toggleLanguage: () => {},
  t: (keyPath, fallback) => fallback || keyPath,
  dictionary: en,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // 1. Check localStorage
    const saved = localStorage.getItem("psip_lang") as Language;
    if (saved === "te" || saved === "en") {
      setLanguageState(saved);
    } else {
      // 2. Check cookie
      const match = document.cookie.match(/(?:^|; )psip_lang=([^;]*)/);
      if (match && (match[1] === "te" || match[1] === "en")) {
        setLanguageState(match[1] as Language);
      }
    }
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem("psip_lang", lang);
      document.cookie = `psip_lang=${lang}; path=/; max-age=31536000`;
      window.dispatchEvent(new Event("psip_lang_change"));
    } catch {
      // ignore
    }
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguage(language === "en" ? "te" : "en");
  }, [language, setLanguage]);

  // Translate helper using nested key resolution (e.g. t("nav.home"))
  const t = useCallback(
    (keyPath: string, fallback?: string): string => {
      const keys = keyPath.split(".");
      let obj: any = translations[language] || translations["en"];
      for (const k of keys) {
        if (obj && typeof obj === "object" && k in obj) {
          obj = obj[k];
        } else {
          // Fallback to English if key missing in target language
          let fallbackObj: any = translations["en"];
          for (const fk of keys) {
            if (fallbackObj && typeof fallbackObj === "object" && fk in fallbackObj) {
              fallbackObj = fallbackObj[fk];
            } else {
              return fallback || keyPath;
            }
          }
          return typeof fallbackObj === "string" ? fallbackObj : fallback || keyPath;
        }
      }
      return typeof obj === "string" ? obj : fallback || keyPath;
    },
    [language]
  );

  const dictionary = translations[language] || translations["en"];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t, dictionary }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
