"use client";

import { usePathname } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import Image from "next/image";

const NAV_ITEMS = [
  { path: "home", key: "home" },
  { path: "events", key: "events" },
  { path: "churches", key: "churches" },
  { path: "about", key: "about" },
  { path: "contact", key: "contact" },
] as const;

export default function Navbar() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();

  const isActive = (path: string) => {
    const basePath = `/${locale}${path === "home" ? "" : `/${path}`}`;
    return pathname === basePath
      ? "text-[#2D9C6F] font-semibold"
      : "text-[#1A365D]";
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm border-b border-[#E5E7EB] py-2">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between ">
          {/* Logo */}
          <Link href={`/${locale}`} aria-label="Naija Churches Home">
            <Image
              src="/assets/images/logo.png"
              alt="Logo"
              className="w-10 sm:w-12"
              width={48}
              height={48}
              loading="eager"
            />
          </Link>

          {/* Nav Links + Language Switcher */}
          <div className="flex items-center gap-4 sm:gap-6">
            <ul className="hidden md:flex gap-4 lg:gap-6 items-center">
              {NAV_ITEMS.map((item) => (
                <li key={item.key}>
                  <Link
                    href={`/${locale}/${item.path === "home" ? "" : item.path}`}
                    className={`text-sm font-medium transition-colors hover:text-[#2D9C6F] ${isActive(
                      item.path
                    )}`}
                  >
                    {t(item.key)}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Language Switcher */}
            <LanguageSwitcher />
          </div>
        </div>
      </nav>
    </header>
  );
}
