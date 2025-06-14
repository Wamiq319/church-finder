"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { ListYourChurchCTA } from "@/components/home/ListYourChurchCTA";
import {
  Mail,
  Phone,
  MapPin,
  Twitter,
  Facebook,
  Linkedin,
  Globe,
} from "lucide-react";
import { HeroSection } from "@/components/ui/HeroSection";

export default function AboutUsPage() {
  const t = useTranslations("AboutUsPage");

  return (
    <div className="bg-white">
      <HeroSection
        title={t("heroTitle")}
        subtitle={t("heroSubtitle")}
        height="md"
      />

      {/* Our Mission Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#1A365D] mb-6">
                {t("missionTitle")}
              </h2>
              <p className="text-lg text-[#444] mb-6">{t("missionText1")}</p>
              <p className="text-lg text-[#444] mb-8">{t("missionText2")}</p>
              <Button
                variant="primary"
                // onClick={() => router.push("/list-your-church")}
                className="px-8 py-3 text-base rounded-md"
              >
                {t("joinButton")}
              </Button>
            </div>
            <div className="relative h-80 md:h-96 rounded-lg overflow-hidden shadow-lg">
              <Image
                src="/assets/images/church-community.jpg"
                alt="Church community"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>
      <HowItWorksSection />
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1A365D]">
              {t("founderTitle")}
            </h2>
            <p className="text-lg text-[#444] max-w-2xl mx-auto mt-4">
              {t("founderSubtitle")}
            </p>
          </div>

          <div className="flex flex-col items-center">
            <div className="relative w-48 h-48 md:w-64 md:h-64 mb-8 rounded-full overflow-hidden border-4 border-[#7FC242]">
              <Image
                src="/assets/images/founder.jpg"
                alt="Sam Proclim - Founder"
                fill
                className="object-cover"
              />
            </div>

            <div className="text-center max-w-2xl">
              <h3 className="text-2xl md:text-3xl font-bold text-[#1A365D] mb-2">
                Evg. Sam Sonibare
              </h3>
              <p className="text-[#7FC242] text-lg md:text-xl mb-6">
                {t("founderRole")}
              </p>
              <p className="text-[#444] mb-8">{t("founderBio")}</p>

              <div className="flex justify-center gap-4">
                <a
                  href="#"
                  className="text-[#7FC242] hover:text-[#5A7D2C] transition-colors"
                >
                  <Twitter size={24} />
                </a>
                <a
                  href="#"
                  className="text-[#7FC242] hover:text-[#5A7D2C] transition-colors"
                >
                  <Facebook size={24} />
                </a>
                <a
                  href="#"
                  className="text-[#7FC242] hover:text-[#5A7D2C] transition-colors"
                >
                  <Linkedin size={24} />
                </a>
                <a
                  href="#"
                  className="text-[#7FC242] hover:text-[#5A7D2C] transition-colors"
                >
                  <Globe size={24} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ListYourChurchCTA />
    </div>
  );
}
