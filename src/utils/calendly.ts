export type CalendlyPageType = "services" | "contact" | "homepage" | "default";

export type CalendlyServiceType =
  | "capital_raising"
  | "debt_structuring"
  | "escrow_services"
  | "bank_account_setup"
  | "guarantees_solutions"
  | "transaction_advisory"
  | "investor_representation";

export const getCalendlyUrl = (
  page: CalendlyPageType | CalendlyServiceType = "default"
): string => {
  const urls = {
    // Page-specific URLs
    services: process.env.NEXT_PUBLIC_CALENDLY_URL_SERVICES,
    contact: process.env.NEXT_PUBLIC_CALENDLY_URL_CONTACT,
    homepage: process.env.NEXT_PUBLIC_CALENDLY_URL_HOMEPAGE,

    // Service-specific URLs
    capital_raising: process.env.NEXT_PUBLIC_CALENDLY_URL_CAPITAL_RAISING,
    debt_structuring: process.env.NEXT_PUBLIC_CALENDLY_URL_DEBT_STRUCTURING,
    escrow_services: process.env.NEXT_PUBLIC_CALENDLY_URL_ESCROW,
    bank_account_setup: process.env.NEXT_PUBLIC_CALENDLY_URL_BANK_SETUP,
    guarantees_solutions: process.env.NEXT_PUBLIC_CALENDLY_URL_GUARANTEES,
    transaction_advisory: process.env.NEXT_PUBLIC_CALENDLY_URL_ADVISORY,
    investor_representation: process.env.NEXT_PUBLIC_CALENDLY_URL_INVESTOR,

    // Default URL
    default: process.env.NEXT_PUBLIC_DEFAULT_CALENDLY_URL,
  };

  // Return the specific URL if it exists, otherwise fall back to default URL
  return urls[page] || urls.default || "https://calendly.com/default";
};
