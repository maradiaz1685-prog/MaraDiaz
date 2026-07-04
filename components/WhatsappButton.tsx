import { whatsappLink } from "@/lib/types";

export default function WhatsappButton({ phone }: { phone: string }) {
  return (
    <a
      href={whatsappLink(phone, "Hola Mara! Te escribo desde la página web.")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escribir por WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/20 hover:scale-105 transition-transform"
    >
      <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.9-4.45 9.9-9.91 0-2.65-1.03-5.14-2.9-7.01A9.86 9.86 0 0 0 12.04 2zm5.8 14.14c-.24.68-1.4 1.31-1.93 1.36-.5.05-1.05.24-3.5-.73-2.95-1.17-4.84-4.17-4.99-4.36-.15-.2-1.19-1.58-1.19-3.02s.75-2.14 1.02-2.43c.26-.29.57-.36.76-.36.19 0 .38 0 .55.01.18.01.42-.07.65.5.24.58.81 2 .88 2.14.07.15.12.32.02.51-.1.19-.15.31-.3.48-.15.17-.31.38-.44.5-.15.15-.31.31-.13.61.18.29.79 1.31 1.7 2.12 1.17 1.04 2.16 1.37 2.45 1.52.29.15.46.13.63-.08.18-.2.75-.87.95-1.17.2-.29.4-.24.67-.15.28.1 1.76.83 2.06.98.3.15.5.22.57.35.07.13.07.75-.17 1.43z" />
      </svg>
    </a>
  );
}
