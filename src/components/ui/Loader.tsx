// components/ui/Loader.tsx
import { Loader2 } from "lucide-react";

export const Loader = ({
  text = "Loading...",
  size = 20,
  className = "",
}: {
  text?: string;
  size?: number;
  className?: string;
}) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Loader2 className="animate-spin" size={size} />
      <span>{text}</span>
    </div>
  );
};
