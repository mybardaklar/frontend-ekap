"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

interface BackButtonProps {
  className?: string;
  children?: React.ReactNode;
}

export function BackButton({ className, children }: BackButtonProps) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className={`inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors ${className || ''}`}
    >
      <ArrowLeft className="mr-2 h-4 w-4" />
      {children || "Kararlara Dön"}
    </button>
  );
}
