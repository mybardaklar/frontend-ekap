
"use client";

import React, { useEffect, useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Scale, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from "@/components/ui/select";
import { createClient } from '@/utils/supabase/client';
import { useRouter, useSearchParams } from 'next/navigation';

// Simple debounce hook implementation if not exists
function useDebounceValue<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}

const SearchAndFilters: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initial state from URL
  const initialSearch = searchParams.get('search') || '';
  const initialCategory = searchParams.get('category') || 'all';
  const initialCourt = searchParams.get('court_decision') === 'true';

  const [categories, setCategories] = useState<{ value: string; label: string }[]>([
    { value: 'all', label: 'Tüm Kategoriler' },
  ]);

  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const debouncedSearch = useDebounceValue(searchTerm, 500); // 500ms debounce

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [showCourtDecisions, setShowCourtDecisions] = useState(initialCourt);

  // Load categories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const cacheKey = 'categories_cache';
        const cached = sessionStorage.getItem(cacheKey);
        if (cached) {
          try {
            const cachedData = JSON.parse(cached);
            if (Date.now() - cachedData.timestamp < 300000) {
              setCategories(cachedData.categories);
              return;
            }
          } catch (e) {
            sessionStorage.removeItem(cacheKey);
          }
        }

        const supabase = createClient();
        const { data, error } = await supabase
          .from('urun_bilgileri')
          .select('kategori')
          .not('kategori', 'is', null)
          .neq('kategori', '')
          .order('kategori', { ascending: true });

        if (error) throw error;

        const uniq = Array.from(new Set((data || []).map((d: any) => d.kategori))).filter(Boolean) as string[];
        const categoryList = [
          { value: 'all', label: 'Tüm Kategoriler' },
          ...uniq.map((k) => ({ value: k, label: k })),
        ];

        setCategories(categoryList);
        sessionStorage.setItem(cacheKey, JSON.stringify({
          categories: categoryList,
          timestamp: Date.now()
        }));
      } catch (e) {
        console.error('Kategoriler alınırken hata:', e);
      }
    };
    loadCategories();
  }, []);

  // Sync URL with state changes
  useEffect(() => {
    // 1. Construct the "current" state of filters from the URL
    // We treat 'all' or missing param as equivalent for category
    const currentSearch = searchParams.get('search') || '';
    const currentCategory = searchParams.get('category') || 'all';
    const currentCourt = searchParams.get('court_decision') === 'true';

    // 2. Construct the "desired" state from local state
    const desiredSearch = debouncedSearch || '';
    const desiredCategory = selectedCategory || 'all';
    const desiredCourt = showCourtDecisions;

    // 3. Compare. If identical, do nothing (preserves page param in URL)
    if (
      currentSearch === desiredSearch &&
      currentCategory === desiredCategory &&
      currentCourt === desiredCourt
    ) {
      return;
    }

    // 4. If different, update URL and reset page
    const params = new URLSearchParams(searchParams.toString());

    // Search
    if (debouncedSearch) {
      params.set('search', debouncedSearch);
    } else {
      params.delete('search');
    }

    // Category
    if (selectedCategory && selectedCategory !== 'all') {
      params.set('category', selectedCategory);
    } else {
      params.delete('category');
    }

    // Court Decision
    if (showCourtDecisions) {
      params.set('court_decision', 'true');
    } else {
      params.delete('court_decision');
    }

    // Reset page because filters changed
    params.delete('page');

    router.push(`/?${params.toString()}`);
  }, [debouncedSearch, selectedCategory, showCourtDecisions, router, searchParams]);

  return (
    <div className="mb-8 space-y-4">
      {/* Search Input */}
      <div className="flex items-center gap-2 max-w-2xl mx-auto">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder="Karar başlığı, karar no veya içerik ile arayın..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-3 text-sm font-serif italic placeholder:italic"
          />
        </div>
        <Button onClick={() => { /* No explicit action needed here, debouncedSearch handles it */ }} className="shrink-0">
          Ara
        </Button>
      </div>

      {/* Kategori ve Mahkeme Filtresi - Yanyana ve ortalı */}
      <div className="flex justify-center gap-3 flex-wrap">
        {/* Mahkeme Filtresi (sola alındı) */}
        <div>
          <Button
            variant={showCourtDecisions ? "default" : "outline"}
            size="sm"
            onClick={() => setShowCourtDecisions(!showCourtDecisions)}
            className={`transition-all duration-200 ${
              showCourtDecisions
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'border-blue-200 text-blue-600 hover:bg-blue-50'
            }`}
          >
            <Scale className="h-4 w-4 mr-2" />
            {showCourtDecisions ? 'Mahkeme Kararları Aktif' : 'Mahkeme Kararları'}
            {showCourtDecisions && <X className="h-3 w-3 ml-2" />}
          </Button>
        </div>

        {/* Kategori Açılır Menü */}
        <div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-56 font-playfair text-sm italic">
              <SelectValue placeholder="Tüm Kategoriler" />
            </SelectTrigger>
            <SelectContent className="z-50 bg-background shadow-lg">
              <SelectGroup>
                <SelectLabel className="font-playfair text-xs">Kategoriler</SelectLabel>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value} className="font-playfair text-sm">
                    {category.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Active Filters Display */}
      {(selectedCategory !== 'all' || showCourtDecisions || searchTerm) && (
        <div className="flex flex-wrap justify-center gap-2 pt-2">
          {searchTerm && (
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Arama: "{searchTerm}"
            </Badge>
          )}
          {selectedCategory !== 'all' && (
            <Badge variant="secondary" className="bg-orange-100 text-orange-800">
              Kategori: {categories.find(c => c.value === selectedCategory)?.label}
            </Badge>
          )}
          {showCourtDecisions && (
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              <Scale className="h-3 w-3 mr-1" />
              Mahkeme Kararları
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchAndFilters;
