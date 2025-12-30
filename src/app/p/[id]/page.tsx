
import React from 'react';
import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CreditCard, CheckCircle, Shield, Scale, Share2, AlertTriangle, ArrowLeft, Download, Eye, Calendar } from "lucide-react";
import Link from 'next/link';
import { BackButton } from "@/components/ui/back-button";
import { getDecisionBadgeColor } from '@/utils/decisionUtils';
import { UrunBilgisi, KararDetayi } from '@/types/kikDecisions';
import { PurchaseCTA } from '@/components/decisions/purchase-cta';
import { DecisionActions } from '@/components/decisions/decision-actions';

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const isUuid = (str: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
  const isNumeric = (str: string) => /^\d+$/.test(str);

  let query = supabase.from('urun_bilgileri').select('baslik, karar_no');

  if (isUuid(id)) {
    query = query.eq('id', id);
  } else if (isNumeric(id)) {
    query = query.eq('public_product_no', parseInt(id));
  } else {
    // Check both exact match and prefixed path match for flexibility
    query = query.or(`link.eq.${id},link.eq./p/${id}`);
  }

  const { data: product } = await query.single();

  if (!product) {
    return {
      title: 'Karar Bulunamadı',
    };
  }

  return {
    title: `${product.baslik || 'Başlıksız Karar'} - KİK Kararları`,
    description: `KİK Kararı ${product.karar_no || ''} detayları ve sonucu.`,
  };
}

export default async function DecisionDetailPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const queryParams = await searchParams;
  const backUrl = Object.keys(queryParams).length > 0
    ? `/?${new URLSearchParams(queryParams as Record<string, string>).toString()}`
    : '/';

  const supabase = await createClient();

  // 1. Get Current User & Admin Status
  const { data: { user } } = await supabase.auth.getUser();
  let isAdmin = false;
  let isPurchased = false;

  if (user) {
    // Check if admin
    const adminEmails = ['ekap@ekap.ai'];
    if (adminEmails.includes(user.email || '')) {
      isAdmin = true;
    } else {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
      if (profile?.role === 'admin') isAdmin = true;
    }

    // Check if purchased
    // Moved to after product fetch to use correct product.id
  }

  // 2. Fetch Product Data
  // Select fields based on permissions effectively done by selecting all and masking in UI,
  // but for security we should only fetch what is needed or rely on RLS.
  // Since we are in a server component with a service role (or user role), RLS applies.
  // However, simpler to fetch generic fields first.

  // Helper to validate UUID
  const isUuid = (str: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
  const isNumeric = (str: string) => /^\d+$/.test(str);

  let query = supabase.from('urun_bilgileri').select('*');

  if (isUuid(id)) {
    query = query.eq('id', id);
  } else if (isNumeric(id)) {
    query = query.eq('public_product_no', parseInt(id));
  } else {
    // Check both exact match and prefixed path match for flexibility
    query = query.or(`link.eq.${id},link.eq./p/${id}`);
  }

  const { data: product, error } = await query.single();

  if (error || !product) {
    // Fallback: Check if it's a legacy link or try explicit decoding if needed
    // For now, standard 404
    notFound();
  }

  // Cast to type
  const decision: UrunBilgisi = product;

  // 2.1 Check if purchased (Now that we have the product ID)
  let purchaseDate: string | null = null;

  if (user && !isAdmin) {
       const { data: purchase } = await supabase
        .from('user_purchases')
        .select('created_at')
        .eq('user_id', user.id)
        .eq('product_id', decision.id) // Use the resolved UUID
        .maybeSingle();
       if (purchase) {
         isPurchased = true;
         purchaseDate = purchase.created_at;
       }
  } else if (isAdmin) {
      // For admins, just show current date as they have implicit access
      purchaseDate = new Date().toISOString();
  }

  // 3. Determine specific content to show
  let contentToShow = decision.baslik_metin_xxx || decision.baslik_metin;

  if (isAdmin || isPurchased) {
    // Attempt to fetch full text from karar_detaylari
    const { data: detailData } = await supabase
      .from('karar_detaylari')
      .select('karar')
      .eq('karar_no', decision.karar_no)
      .maybeSingle();

    if (detailData?.karar) {
        contentToShow = detailData.karar;
    } else {
        contentToShow = decision.baslik_metin;
    }
  }

  // Helpers for UI
  // Determine "isCourtDecision" based on our previous logic
  const isCourtDecision = !!decision.hasCourtDecision || decision.karar_sonucu?.toLowerCase().includes('mahkeme') || decision.baslik?.toLowerCase().includes('mahkeme');

  const title = decision.baslik || "Başlıksız Karar";

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-6">
        <BackButton />
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
        {/* Header Section */}
        <div className="p-6 md:p-8 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
           <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white leading-tight mb-4">
             {decision.baslik}
           </h1>

           <div className="flex items-center gap-2 flex-wrap">
             {decision.public_product_no && (
               <Badge variant="outline" className="text-sm">
                 Ürün No: {decision.public_product_no}
               </Badge>
             )}
             {(isAdmin || isPurchased) && (
               <Badge variant="outline" className="text-sm">Karar No: {decision.karar_no}</Badge>
             )}
             <Badge className={`text-sm ${getDecisionBadgeColor(decision.karar_sonucu || null, isCourtDecision)}`}>
               {decision.karar_sonucu || "Sonuç Belirsiz"}
             </Badge>

             {decision.kategori && (
               <Badge variant="secondary" className="text-sm bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                 {decision.kategori}
               </Badge>
             )}
           </div>
        </div>

        {/* Content Section */}
        <div className="p-6 md:p-8 space-y-4">

          {(isAdmin || isPurchased) && decision.cevap && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-900">
               <h4 className="text-sm font-semibold text-red-800 dark:text-red-300 mb-1">Cevap:</h4>
               <p className="text-sm text-red-700 dark:text-red-400 whitespace-pre-wrap">
                 {decision.cevap}
               </p>
            </div>
          )}

          <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-800">
             <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-300 mb-1">
                Kararda Geçtiği Bölüm:
             </h4>
             <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
               {(() => {
                 const text = decision.baslik_metin || decision.baslik_metin_xxx || '';
                 const isLocked = !isAdmin && !isPurchased;
                 const shouldTruncate = isLocked && text.length > 150;
                 return shouldTruncate ? text.slice(0, 150) + '...' : text;
               })()}
             </p>
          </div>

          {!isPurchased && !isAdmin && (
             <PurchaseCTA product={decision} price={decision.price_in_credits || 10} />
          )}

          {(isPurchased || isAdmin) && (
            <>
              <div className="flex items-center justify-between text-sm text-muted-foreground border-t pt-3">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                   {decision.tarih ? new Date(decision.tarih).toLocaleDateString('tr-TR') : (
                       "Tarih bilgisi detayda"
                   )}
                </div>
                <div>
                   İşlem Tarihi: {purchaseDate ? new Date(purchaseDate).toLocaleDateString('tr-TR') : new Date().toLocaleDateString('tr-TR')}
                </div>
              </div>

              <DecisionActions
                decision={decision}
                hasCourtDecision={!!isCourtDecision}
                isAdmin={isAdmin}
              />
            </>
          )}

        </div>
      </div>
    </div>
  );
}
