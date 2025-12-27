'use client';

import { useGlobalLoader } from "@/providers/global-loader-provider";
import { Loader2 } from "lucide-react";

export function GlobalLoader() {
  const { isLoading } = useGlobalLoader();

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-xl flex flex-col items-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-sm font-medium text-muted-foreground animate-pulse">İşleminiz yapılıyor...</p>
      </div>
    </div>
  );
}
