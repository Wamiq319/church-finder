// components/ui/Loader.tsx
import { Loader2 } from "lucide-react";

export function Loader({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="flex items-center gap-2 text-sm animate-pulse">
      <Loader2 className="animate-spin" size={20} />
      {text}
    </div>
  );
}
