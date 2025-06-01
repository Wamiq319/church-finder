"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { Globe } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/Button";

const languages = [
  { code: "en", label: "English" },
  { code: "yo", label: "Yorùbá" }, // or "ha" or "ig" as needed
];

export default function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const switchLocale = (targetLocale: string) => {
    if (!pathname) return;
    setLoading(true);
    const pathWithoutLocale = pathname.split("/").slice(2).join("/") || "/";
    router.push(`/${targetLocale}/${pathWithoutLocale}`);
    setLoading(false);
  };

  // Find the other language label to display
  const otherLanguageLabel = (() => {
    if (locale === "en")
      return languages.find((l) => l.code !== "en")?.label || "Yorùbá";
    return languages.find((l) => l.code === "en")?.label || "English";
  })();

  return (
    <Button
      variant="outline"
      rounded={true}
      onClick={() => switchLocale(locale === "en" ? "yo" : "en")}
      className="flex items-center gap-1 text-sm font-semibold p-0"
      disabled={loading}
      aria-label="Switch language"
    >
      <Globe size={16} className="text-green-700" />
      {otherLanguageLabel}
    </Button>
  );
}
