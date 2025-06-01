"use client";

import { ArrowRight, Check, BarChart2, Users, LifeBuoy } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

export const ListYourChurchCTA = () => {
  const t = useTranslations("CTAs.listYourChurch");
  const router = useRouter();

  const benefits = [
    {
      icon: <BarChart2 className="h-5 w-5" />,
      text: t("benefits.visibility"),
    },
    {
      icon: <Users className="h-5 w-5" />,
      text: t("benefits.community"),
    },
    {
      icon: <LifeBuoy className="h-5 w-5" />,
      text: t("benefits.support"),
    },
  ];

  return (
    <section className="relative bg-[#1A365D] py-20 px-4 sm:px-6 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-y-0 left-0 w-1/3 bg-[#7FC242] transform -skew-x-12" />
        <div className="absolute inset-y-0 right-0 w-1/3 bg-[#7FC242] transform skew-x-12" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
            {t("title")}
          </h2>
          <p className="max-w-2xl mx-auto text-white/90 text-xl md:text-2xl mb-10">
            {t("subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:border-[#7FC242] transition-all"
            >
              <div className="flex items-center">
                <div className="bg-[#7FC242] p-2 rounded-lg mr-4">
                  {benefit.icon}
                </div>
                <p className="text-lg font-medium text-white">{benefit.text}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button
            onClick={() => router.push("/list-your-church")}
            className="group relative inline-flex items-center justify-center px-10 py-5 bg-[#7FC242] hover:bg-[#5A7D2C] text-white font-bold text-xl rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
          >
            <span className="relative z-10 flex items-center">
              {t("buttonText")}
              <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </span>
            <span className="absolute inset-0 bg-white/10 group-hover:bg-white/0 transition-all duration-500" />
          </button>

          <p className="mt-6 text-white/80">{t("additionalText")}</p>
        </div>
      </div>
    </section>
  );
};
