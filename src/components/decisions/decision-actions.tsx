"use client";

import { Button } from "@/components/ui/button";
import { Download, Eye } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { UrunBilgisi } from "@/types/kikDecisions";

// Initialize pdfMake
// @ts-ignore
if (pdfFonts && pdfFonts.pdfMake && pdfFonts.pdfMake.vfs) {
  // @ts-ignore
  pdfMake.vfs = pdfFonts.pdfMake.vfs;
} else if (pdfFonts && (pdfFonts as any).vfs) {
  // @ts-ignore
  pdfMake.vfs = (pdfFonts as any).vfs;
} else {
  console.warn("PDF fonts (vfs) could not be loaded for pdfMake.");
}

interface DecisionActionsProps {
  decision: UrunBilgisi;
  hasCourtDecision: boolean;
  isAdmin: boolean;
}

export function DecisionActions({ decision, hasCourtDecision, isAdmin }: DecisionActionsProps) {
  const supabase = createClient();

  // Helper: Fetch combined or single text
  const fetchDecisionText = async () => {
    try {
      const { data, error } = await supabase
        .from('karar_detaylari')
        .select('karar, karar_tarihi')
        .eq('karar_no', decision.karar_no)
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (e) {
      console.error(e);
      toast.error("Karar metni alınamadı.");
      return null;
    }
  };

  const handleView = async () => {
    const data = await fetchDecisionText();
    if (!data?.karar) {
        toast.error("Karar metni bulunamadı.");
        return;
    }

    const blob = new Blob([data.karar], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  const handleDownloadPdf = async () => {
    const data = await fetchDecisionText();
    if (!data?.karar) return;

    const docDefinition: any = {
      info: { title: `KİK Kararı ${decision.karar_no}` },
      content: [
        { text: `KİK KARARI: ${decision.karar_no}`, style: 'header', fontSize: 14, bold: true, margin: [0, 0, 0, 10] },
        { text: `BAŞLIK: ${decision.baslik}`, margin: [0, 0, 0, 10] },
        { text: `TARİH: ${data.karar_tarihi ? new Date(data.karar_tarihi).toLocaleDateString('tr-TR') : 'Belirtilmemiş'}`, margin: [0, 0, 0, 20] },
        { text: 'KARAR METNİ:', style: 'subheader', bold: true, margin: [0, 0, 0, 5] },
        { text: data.karar, fontSize: 11 }
      ]
    };

    pdfMake.createPdf(docDefinition).download(`KIK_${decision.karar_no.replace('/', '_')}.pdf`);
  };

  return (
    <div className="mt-8 flex gap-4 border-t pt-6">
      <Button variant="outline" className="flex-1" onClick={handleView}>
        <Eye className="mr-2 h-4 w-4" />
        Tam Metni Görüntüle
      </Button>
      <Button variant="outline" className="flex-1" onClick={handleDownloadPdf}>
        <Download className="mr-2 h-4 w-4" />
        PDF Olarak İndir
      </Button>
    </div>
  );
}
