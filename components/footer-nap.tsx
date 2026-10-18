"use client";

import { usePathname } from "next/navigation";

import { Illustration } from "@/components/illustration";

// The footer's sign-off (illustration #5): asleep at the desk, Bella asleep
// beside the laptop, with a note. The end of every page except /resume,
// which stays a clean document.
export function FooterNap() {
  if (usePathname() === "/resume") return null;

  return (
    <div className="flex flex-col items-end gap-1 pb-4 sm:flex-row sm:items-end sm:justify-end sm:gap-4 print:hidden">
      <p className="type-hand -rotate-3 text-right text-pen sm:mb-10">
        that&apos;s all for today.
        <br />
        Bella agrees.
      </p>
      <Illustration name="nap" className="w-[260px] md:w-[340px]" />
    </div>
  );
}
