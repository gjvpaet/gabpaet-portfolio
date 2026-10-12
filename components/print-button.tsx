"use client";

import { Printer } from "@phosphor-icons/react";

import { Button } from "@/components/button";

export function PrintButton({ className }: { className?: string }) {
  return (
    <Button onClick={() => window.print()} icon={<Printer size={20} weight="bold" />} className={className}>
      Print
    </Button>
  );
}
