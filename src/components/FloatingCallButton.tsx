import { Phone } from "lucide-react";

export default function FloatingCallButton() {
  return (
    <a
      href="tel:010-XXXX-XXXX"
      className="md:hidden fixed bottom-8 right-8 z-[90] w-14 h-14 bg-black text-white rounded-full flex items-center justify-center shadow-2xl animate-pulse"
    >
      <Phone size={24} />
    </a>
  );
}
