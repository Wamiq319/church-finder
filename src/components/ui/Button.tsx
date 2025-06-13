"use client";

import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline";
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  rounded?: boolean;
}

export const Button = ({
  children,
  variant = "primary",
  className = "",
  onClick = () => {},
  type = "button",
  disabled = false,
  rounded = false,
  ...props
}: ButtonProps) => {
  const baseClasses =
    "inline-flex items-center justify-center px-6 font-medium transition-all duration-200 whitespace-nowrap shadow-sm cursor-pointer";

  const variants = {
    primary: "bg-[#7FC242] hover:bg-[#5A7D2C] text-white",
    secondary: "bg-[#2E2E2E] hover:bg-[#1A1A1A] text-white",
    outline:
      "border border-[#7FC242] text-[#7FC242] hover:bg-[#F8F8F8] hover:text-[#5A7D2C]",
  };

  const shape = rounded ? "rounded-full px-4 py-2" : "rounded-md";

  const cursorClass = disabled ? "cursor-not-allowed" : "cursor-pointer";

  const classes =
    baseClasses +
    " " +
    variants[variant] +
    " " +
    shape +
    " " +
    cursorClass +
    " " +
    className;

  return (
    <button
      className={classes.trim()}
      onClick={onClick}
      type={type}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};
