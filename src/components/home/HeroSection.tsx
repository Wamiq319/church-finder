"use client";

import { useState } from "react";
import { Button } from "@/components";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import content from "@/data/content.json";

export const HeroSection = () => {
  const hero = content.HomePage.hero;
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const onSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/churches?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <section className="relative h-[90vh] min-h-[600px] w-full bg-[#F0FAF5]">
      {/* Background image overlay */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <Image
          src="/assets/images/nigeria-map-bg.jpeg"
          alt="Nigeria map background"
          fill
          className="object-cover opacity-10"
          priority
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center items-center text-center">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center">
          <Image
            src="/assets/images/logo.png"
            alt="ChurchFinder.ng Logo"
            width={80}
            height={80}
            className="w-32 h-32"
            priority
          />
          <div className="flex items-baseline mt-2 opacity-70">
            <span className="text-1xl md:text-2xl font-bold text-[#249178] ">
              Church
            </span>
            <span className="text-1xl md:text-2xl font-bold text-[#ea9838] ml-1">
              Finder
            </span>
            <span className="text-1xl md:text-2xl font-medium text-[#249178] ml-0.5">
              .ng
            </span>
          </div>
        </div>

        {/* Headline */}
        <h1 className="text-2xl md:text-4xl lg:text-4xl font-bold text-[#1A365D] leading-snug max-w-4xl">
          {hero.headline1} <br className="hidden md:block" />
          {hero.headline2}
          <span className="inline-block w-2" />
          <span className="text-[#2D9C6F]">{hero.headline3}</span>
        </h1>

        {/* Subtitle */}
        <p className="text-base md:text-lg text-[#444] max-w-2xl mx-auto mt-3 mb-8">
          {hero.subtitle}
        </p>

        {/* Search Input + Button */}
        <div className="flex items-center max-w-xl w-full mx-auto mb-6">
          <input
            type="text"
            placeholder={
              hero.searchPlaceholder || "Search churches by name, location..."
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") onSearch();
            }}
            className="flex-grow px-5 py-3 rounded-full border border-[#7FC242] focus:outline-none focus:ring-2 focus:ring-[#7FC242]/60 text-base text-gray-800"
          />
          <button
            onClick={onSearch}
            aria-label="Search Churches"
            className="ml-3 rounded-full bg-[#7FC242] hover:bg-[#5A7D2C] text-white p-3 flex items-center justify-center transition cursor-pointer"
          >
            <Search size={20} />
          </button>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            variant="primary"
            onClick={() => router.push("/register")}
            className="px-8 py-3 text-base rounded-md"
          >
            {hero.ctaEmail}
          </Button>

          <Button
            variant="outline"
            onClick={() => router.push("/dashboard/create-church")}
            className="px-8 py-3 text-base rounded-md border-2"
          >
            {hero.ctaCall}
          </Button>
        </div>
      </div>
    </section>
  );
};
