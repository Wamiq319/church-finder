"use client";

import { usePathname } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Button } from "./ui/Button";
import { useSession, signOut } from "next-auth/react";

const NAV_ITEMS = [
  { path: "home", key: "home" },
  { path: "events", key: "events" },
  { path: "churches", key: "churches" },
  { path: "about", key: "about" },
  { path: "contact", key: "contact" },
] as const;

export default function Navbar() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session, status } = useSession();
  const isLoading = status === "loading";

  const isActive = (path: string) => {
    if (path === "home") {
      return pathname === "/" || pathname === "/en" || pathname === "/en/"
        ? "text-[#7FC242] font-semibold"
        : "text-[#1A365D] hover:text-[#7FC242]";
    }
    const basePath = `/${path}`;
    return pathname.includes(basePath)
      ? "text-[#7FC242] font-semibold"
      : "text-[#1A365D] hover:text-[#7FC242]";
  };

  // Don't show auth button on auth pages
  const showAuthButton =
    !pathname.includes("register") &&
    !pathname.includes("login") &&
    !isLoading &&
    !session?.user;

  // Modified to show dashboard button on all pages when user is logged in
  const showDashboardButton = !isLoading && session?.user;

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-white shadow-sm border-b border-[#E5E7EB] py-2">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo - Always visible */}
            <Link href="/" aria-label="Naija Churches Home">
              <Image
                src="/assets/images/logo.png"
                alt="Logo"
                className="w-10 sm:w-12"
                width={48}
                height={48}
                loading="eager"
              />
            </Link>

            {/* Desktop Nav Links - Centered */}
            <div className="hidden md:flex items-center gap-4 sm:gap-6">
              <ul className="flex gap-4 lg:gap-6 items-center absolute left-1/2 transform -translate-x-1/2">
                {NAV_ITEMS.map((item) => (
                  <li key={item.key}>
                    <Link
                      href={`/${item.path === "home" ? "" : item.path}`}
                      className={`text-sm font-medium transition-colors hover:text-[#2D9C6F] ${isActive(
                        item.path
                      )}`}
                    >
                      {t(item.key)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Desktop Auth/Dashboard Buttons */}
            <div className="hidden md:flex items-center gap-4">
              {showAuthButton && (
                <div className="flex gap-2">
                  <Link href="/login">
                    <Button
                      variant="outline"
                      rounded={true}
                      className="px-4 py-2 text-sm whitespace-nowrap"
                    >
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button
                      variant="primary"
                      rounded={true}
                      className="px-4 py-2 text-sm whitespace-nowrap bg-[#2D9C6F] hover:bg-[#24815b] text-white"
                    >
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}

              {showDashboardButton && (
                <div className="flex gap-2">
                  <Link href="/dashboard">
                    <Button
                      variant="primary"
                      rounded={true}
                      className="px-4 py-2 text-sm whitespace-nowrap bg-[#2D9C6F] hover:bg-[#24815b] text-white"
                    >
                      Dashboard
                    </Button>
                  </Link>
                  <Button
                    onClick={handleLogout}
                    variant="outline"
                    rounded={true}
                    className="px-4 py-2 text-sm whitespace-nowrap"
                  >
                    Logout
                  </Button>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Menu */}
            <div className="md:hidden flex items-center gap-4">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700 hover:text-[#2D9C6F] focus:outline-none"
                aria-label="Toggle menu"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {isMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Menu Dropdown */}
          {isMenuOpen && (
            <div className="md:hidden pt-4 pb-2">
              <ul className="flex flex-col gap-3">
                {NAV_ITEMS.map((item) => (
                  <li key={item.key}>
                    <Link
                      href={`/${item.path === "home" ? "" : item.path}`}
                      className={`block px-3 py-2 text-base font-medium rounded-md ${isActive(
                        item.path
                      )} hover:bg-gray-50`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {t(item.key)}
                    </Link>
                  </li>
                ))}
              </ul>

              {showAuthButton && (
                <div className="mt-4 px-3 space-y-2">
                  <Link href="/login" className="block w-full">
                    <Button
                      rounded={true}
                      variant="outline"
                      className="w-full py-3 text-sm font-semibold"
                    >
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/register" className="block w-full">
                    <Button
                      rounded={true}
                      variant="primary"
                      className="w-full py-3 text-sm font-semibold bg-[#2D9C6F] hover:bg-[#24815b] text-white"
                    >
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}

              {showDashboardButton && (
                <div className="mt-4 px-3 space-y-2">
                  <Link href="/dashboard" className="block w-full">
                    <Button
                      rounded={true}
                      variant="primary"
                      className="w-full py-3 text-sm font-semibold bg-[#2D9C6F] hover:bg-[#24815b] text-white"
                    >
                      Dashboard
                    </Button>
                  </Link>
                  <Button
                    onClick={handleLogout}
                    rounded={true}
                    variant="outline"
                    className="w-full py-3 text-sm font-semibold"
                  >
                    Logout
                  </Button>
                </div>
              )}
            </div>
          )}
        </nav>
      </header>
    </>
  );
}
