import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

import enCommon from "./locales/en/common.json";
import zhCommon from "./locales/zh/common.json";

export const SUPPORTED_LOCALES = ["zh", "en"] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const FALLBACK_LOCALE: Locale = "zh";

// Mirrors the "chatgpt2api-theme" convention already used by theme-script.tsx.
// locale-script.tsx repeats this literal because an inline script cannot import.
export const LOCALE_STORAGE_KEY = "chatgpt2api-locale";

const resources = {
  zh: { common: zhCommon },
  en: { common: enCommon },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    // Pin the initial language to the fallback so the prerendered HTML from
    // `output: 'export'` always matches what React renders on hydration.
    // provider.tsx applies the detected locale after mount instead.
    lng: FALLBACK_LOCALE,
    fallbackLng: FALLBACK_LOCALE,
    supportedLngs: [...SUPPORTED_LOCALES],
    defaultNS: "common",
    detection: {
      order: ["localStorage", "navigator"],
      // init() writes this cache synchronously, before the useEffect below runs, so caching here would overwrite an existing choice with the fallback; locale-toggle.tsx persists explicitly instead.
      caches: [],
      lookupLocalStorage: LOCALE_STORAGE_KEY,
    },
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
  });

export default i18n;
