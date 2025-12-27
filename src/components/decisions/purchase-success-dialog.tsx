"use client";

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Download, Eye } from "lucide-react";
import { getDecisionBadgeColor } from '@/utils/decisionUtils';
import { createClient } from "@/utils/supabase/client";
import { UrunBilgisi, KararDetayi } from '@/types/kikDecisions';
// Reuse the robust logic from AdminActions for PDF/View if possible, or reimplement
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { toast } from "sonner";

// PdfMake setup (duplicated for now to ensure self-containment, or could export setup function)
// @ts-ignore
if (pdfFonts && pdfFonts.pdfMake && pdfFonts.pdfMake.vfs) {
  // @ts-ignore
  pdfMake.vfs = pdfFonts.pdfMake.vfs;
} else if (pdfFonts && (pdfFonts as any).vfs) {
  // @ts-ignore
  pdfMake.vfs = (pdfFonts as any).vfs;
}

interface PurchaseSuccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedProduct: UrunBilgisi | null;
}

export function PurchaseSuccessDialog({
  open,
  onOpenChange,
  selectedProduct,
}: PurchaseSuccessDialogProps) {
  const [fullBaslikMetin, setFullBaslikMetin] = useState<string>('');
  const [decisionDetail, setDecisionDetail] = useState<KararDetayi | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchFullContent = async () => {
      if (selectedProduct && open) {
        try {
          // 1. Fetch full baslik_metin
          const { data: productData, error: productError } = await supabase
            .from('urun_bilgileri')
            .select('baslik_metin')
            .eq('id', selectedProduct.id)
            .maybeSingle();

          if (productData && !productError) {
            setFullBaslikMetin(productData.baslik_metin || '');
          }

          // 2. Fetch decision detail (date, text)
          const { data: detailData, error: detailError } = await supabase
            .from('karar_detaylari')
            .select('*')
            .eq('karar_no', selectedProduct.karar_no)
            .maybeSingle();

          if (detailData && !detailError) {
             setDecisionDetail(detailData as KararDetayi);
          }

        } catch (error) {
          console.error('Error fetching full content:', error);
        }
      }
    };

    fetchFullContent();
  }, [selectedProduct, open]);

  if (!selectedProduct) return null;

  const handleView = () => {
      // Basic view implementation
      if (!decisionDetail?.karar) {
        toast.error("Karar metni yüklenemedi.");
        return;
      }
      const blob = new Blob([decisionDetail.karar], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
  };

  const handleDownload = () => {
      if (!decisionDetail?.karar) {
        toast.error("Karar metni yüklenemedi.");
        return;
      }

      const docDefinition: any = {
        info: { title: `KİK Kararı ${selectedProduct.karar_no}` },
        content: [
          { text: `KİK KARARI: ${selectedProduct.karar_no}`, style: 'header', fontSize: 14, bold: true, margin: [0, 0, 0, 10] },
          { text: `BAŞLIK: ${selectedProduct.baslik}`, margin: [0, 0, 0, 10] },
          { text: `TARİH: ${decisionDetail.karar_tarihi ? new Date(decisionDetail.karar_tarihi).toLocaleDateString('tr-TR') : 'Belirtilmemiş'}`, margin: [0, 0, 0, 20] },
          { text: 'KARAR METNİ:', style: 'subheader', bold: true, margin: [0, 0, 0, 5] },
          { text: decisionDetail.karar, fontSize: 11 }
        ]
      };

      pdfMake.createPdf(docDefinition).download(`KIK_${selectedProduct.karar_no.replace('/', '_')}.pdf`);
  };

  const purchaseDate = new Date(); // approximate, or fetch actual purchase date

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-extrabold text-green-600 dark:text-green-400 flex items-center gap-2">
            Satın Alma Başarılı! 🎉
          </DialogTitle>
          <DialogDescription>
            Karar başarıyla hesabınıza tanımlandı. Hemen inceleyebilir veya PDF olarak indirebilirsiniz.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          <div>
            <h3 className="font-bold text-lg leading-snug">{selectedProduct.baslik}</h3>

            <div className="flex items-center gap-2 mt-2 flex-wrap">
              {selectedProduct.public_product_no && (
                <Badge variant="outline" className="text-sm">
                  Ürün No: {selectedProduct.public_product_no}
                </Badge>
              )}
              <Badge variant="outline">{selectedProduct.karar_no}</Badge>
              <Badge className={getDecisionBadgeColor(selectedProduct.karar_sonucu || null)}>
                {selectedProduct.karar_sonucu}
              </Badge>

              {selectedProduct.kategori && (
                <Badge variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                  {selectedProduct.kategori}
                </Badge>
              )}
            </div>

            {fullBaslikMetin && (
              <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-800">
                 <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-4 whitespace-pre-wrap">
                   {fullBaslikMetin}
                 </p>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between text-sm text-muted-foreground border-t pt-3">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {decisionDetail?.karar_tarihi
                ? new Date(decisionDetail.karar_tarihi).toLocaleDateString('tr-TR')
                : 'Tarih yükleniyor...'}
            </div>
            <div>
              İşlem Tarihi: {purchaseDate.toLocaleDateString('tr-TR')}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button onClick={handleView} className="flex-1" variant="outline">
              <Eye className="mr-2 h-4 w-4" />
              İncele
            </Button>
            <Button onClick={handleDownload} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
              <Download className="mr-2 h-4 w-4" />
              PDF İndir
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
