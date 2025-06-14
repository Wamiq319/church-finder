import Image from "next/image";
import { ReactNode } from "react";

interface HeroSectionProps {
  title: string;
  subtitle: string;
  showLogo?: boolean;
  children?: ReactNode;
  height?: "sm" | "md" | "lg";
}

export const HeroSection = ({
  title,
  subtitle,
  showLogo = true,
  children,
  height = "lg",
}: HeroSectionProps) => {
  const heightClasses = {
    sm: "h-[40vh] min-h-[300px]",
    md: "h-[50vh] min-h-[400px]",
    lg: "h-[90vh] min-h-[600px]",
  };

  return (
    <section
      className={`relative ${heightClasses[height]} w-full bg-[#F0FAF5]`}
    >
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
        {showLogo && (
          <div className="mb-8 flex flex-col items-center">
            <Image
              src="/assets/images/logo.png"
              alt="TEIC Global Logo"
              width={80}
              height={80}
              className="w-20 h-20"
              priority
            />
            <div className="flex items-baseline mt-2">
              <span className="text-3xl md:text-4xl font-bold text-[#249178]">
                Church
              </span>
              <span className="text-3xl md:text-4xl font-bold text-[#ea9838] ml-1">
                Finder
              </span>
              <span className="text-2xl md:text-3xl font-medium text-[#249178] ml-0.5">
                .ng
              </span>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-bold text-[#1A365D] leading-tight">
            {title}
          </h1>
          <p className="text-lg md:text-xl text-[#444] max-w-2xl mx-auto mt-6">
            {subtitle}
          </p>
          {children}
        </div>
      </div>
    </section>
  );
};
