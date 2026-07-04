"use client";

import { useState } from "react";

export default function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const [imgFailed, setImgFailed] = useState(false);

  const dims = {
    sm: "h-9 w-9 text-sm",
    md: "h-12 w-12 text-base",
    lg: "h-20 w-20 text-2xl",
  }[size];

  if (!imgFailed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src="/logo.jpg"
        alt="Mara Diaz"
        className={`${dims} object-contain`}
        onError={() => setImgFailed(true)}
      />
    );
  }

  return (
    <div
      className={`${dims} shrink-0 rounded-full bg-gradient-to-br from-brand-400 to-brand-700 flex items-center justify-center text-white font-display font-bold shadow-md`}
    >
      MD
    </div>
  );
}
