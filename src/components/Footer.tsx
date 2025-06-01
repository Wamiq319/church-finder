"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";

export const Footer = () => {
  const t = useTranslations("Footer");
  const currentYear = new Date().getFullYear();

  const linkKeys = ["home", "about", "events", "contact"];
  const serviceKeys = [
    "church_search",
    "event_listings",
    "church_listings",
    "community_support",
  ];

  return (
    <footer className="bg-[#1A1A1A] text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t("company.title")}</h3>
            <p className="text-[#B3B3B3]">{t("company.description")}</p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t("links.title")}</h3>
            <ul className="space-y-2">
              {linkKeys.map((key) => (
                <li key={key}>
                  <Link
                    href={`/${key === "home" ? "" : key}`}
                    className="text-[#B3B3B3] hover:text-[#7FC242] transition-colors"
                  >
                    {t(`links.names.${key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              {t("services.title")}
            </h3>
            <ul className="space-y-2">
              {serviceKeys.map((key) => (
                <li key={key}>
                  <Link
                    href="#"
                    className="text-[#B3B3B3] hover:text-[#7FC242] transition-colors"
                  >
                    {t(`services.names.${key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t("contact.title")}</h3>
            <address className="not-italic text-[#B3B3B3] space-y-2">
              <p>{t("contact.address")}</p>
              <p>{t("contact.phone")}</p>
              <p>{t("contact.email")}</p>
            </address>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-[#333] mt-12 pt-8 text-center text-[#B3B3B3]">
          <p>
            &copy; {currentYear} {t("copyright")}
          </p>
        </div>
      </div>
    </footer>
  );
};
