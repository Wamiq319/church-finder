import { Star, ArrowRight } from "lucide-react";
import { Button } from "./Button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ComingSoonPopup } from "./ComingSoon";

export function PromotionCard() {
  const router = useRouter();
  const [showPopup, setShowPopup] = useState(false);
  return (
    <div className="bg-[#F8F8F8] border border-[#7FC242] rounded-xl p-6 text-center">
      <ComingSoonPopup show={showPopup} onClose={() => setShowPopup(false)} />
      <div className="bg-[#7FC242] text-white rounded-full p-3 inline-flex mb-4">
        <Star className="h-6 w-6" />
      </div>
      <h3 className="text-xl font-bold text-[#1A365D] mb-2">
        Get Featured on Homepage
      </h3>
      <p className="text-gray-600 mb-4">
        Premium placement for your church on our homepage and listings
      </p>
      <Button
        variant="primary"
        rounded
        className="w-full"
        onClick={() => setShowPopup(true)}
      >
        Promote Your Church <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        className="w-full mt-4"
        onClick={() => router.push("/#featured-churches")}
      >
        View All Featured
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
}
