'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, ArrowRight, Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function KikSearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    const query = searchQuery.trim();
    if (!query) {
      return;
    }

    setIsLoading(true);

    try {
      // Clean query (digits only)
      const cleanQuery = query.replace(/\D/g, '');

      if (cleanQuery) {
        // Redirect to /kik/1234 -> which redirects to /p/1234
        router.push(`/kik/${cleanQuery}`);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-zinc-950">
      <main className="flex-grow flex items-center justify-center">
        <div className="container px-4 py-16">
          <div className="max-w-2xl mx-auto">
            {/* Header Section */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                KİK Sorgu No Arama
              </h1>
              <p className="text-xl text-muted-foreground">
                Sorgu numaranızı girerek KİK kararını hızlıca bulun
              </p>
            </div>

            {/* Main Search Card */}
            <Card className="mb-8 border-none shadow-xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Search className="h-5 w-5 text-primary" />
                  Sorgu No ile Arama
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSearch} className="space-y-4">
                  <div>
                    <Input
                      type="text"
                      placeholder="Örnek: 1234, 5678..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="text-lg h-14 px-4 bg-white dark:bg-zinc-950"
                      disabled={isLoading}
                      autoFocus
                    />
                    <p className="text-sm text-muted-foreground mt-2 ml-1">
                      Sorgu numaranızı girin (sadece rakamlar)
                    </p>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 text-lg font-medium transition-all hover:scale-[1.02]"
                    disabled={!searchQuery.trim() || isLoading}
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Yönlendiriliyor...
                      </>
                    ) : (
                      <>
                        <ArrowRight className="mr-2 h-5 w-5" />
                        Ürüne Git
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Info Alert */}
            <Alert className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
              <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <AlertDescription className="text-blue-800 dark:text-blue-300">
                <strong>Nasıl kullanılır?</strong>
                <ul className="mt-2 space-y-1 list-disc list-inside">
                  <li>Sorgu numaranızı yukarıdaki alana girin</li>
                  <li>"Ürüne Git" butonuna tıklayın</li>
                  <li>İlgili KİK kararının sayfasına anında yönlendirileceksiniz</li>
                </ul>
              </AlertDescription>
            </Alert>

          </div>
        </div>
      </main>
    </div>
  );
}
