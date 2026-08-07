import { en as enMessages } from "./locales/en";
import { zhCN as zhCNMessages } from "./locales/zh-cn";

export type Locale = "en" | "zh-cn";

const localeMessages: Record<Locale, Record<string, string>> = {
  en: enMessages,
  "zh-cn": zhCNMessages,
};

let currentLocale: Locale = "en";

export function setLocale(locale: string | undefined): void {
  if (locale === "zh-cn") {
    currentLocale = "zh-cn";
  } else {
    currentLocale = "en";
  }
}

export function getLocale(): Locale {
  return currentLocale;
}

export function t(
  key: string,
  params?: Record<string, string | number>,
): string {
  const messages = localeMessages[currentLocale] ?? localeMessages.en;
  let template = messages[key] ?? localeMessages.en[key] ?? key;
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      template = template.replaceAll(`{${k}}`, String(v));
    }
  }
  return template;
}
