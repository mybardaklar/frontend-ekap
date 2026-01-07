"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Eye } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { UrunBilgisi } from "@/types/kikDecisions";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { highlightMatchingWords } from "@/utils/highlight-utils";

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
  fullText?: string;
  highlightSummary?: string;
  openInNewTab?: boolean;
}

export function DecisionActions({ decision, hasCourtDecision, isAdmin, fullText, highlightSummary, openInNewTab }: DecisionActionsProps) {
  const supabase = createClient();
  const [showModal, setShowModal] = useState(false);

  const [fetchedText, setFetchedText] = useState<string>("");

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
    // Legacy New Tab Behavior
    if (openInNewTab) {
        const data = await fetchDecisionText();
        if (!data?.karar) {
            toast.error("Karar metni bulunamadı.");
            return;
        }
        const blob = new Blob([data.karar], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
        return;
    }

    // Modal Behavior
    if (fullText) {
        setShowModal(true);
        return;
    }

    const data = await fetchDecisionText();
    if (data?.karar) {
        setFetchedText(data.karar);
        setShowModal(true);
    } else {
        toast.error("Karar metni bulunamadı.");
    }
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
    <>
      <div className="flex gap-3 pt-2">
        <Button onClick={handleView} className="flex-1" variant="outline">
          <Eye className="mr-2 h-4 w-4" />
          İncele
        </Button>
        <Button onClick={handleDownloadPdf} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
          <Download className="mr-2 h-4 w-4" />
          PDF İndir
        </Button>
      </div>

       <Dialog open={showModal} onOpenChange={setShowModal}>
            <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>Karar İnceleme: {decision.karar_no}</DialogTitle>
                </DialogHeader>
                <div className="flex-1 overflow-y-auto min-h-0 p-4 border rounded-md bg-gray-50 dark:bg-gray-900">
                     <div
                        className="prose prose-sm max-w-none text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap"
                        dangerouslySetInnerHTML={{
                            __html: highlightMatchingWords(
                                highlightSummary || '',
                                fullText || fetchedText || ''
                            )
                        }}
                      />
                </div>
                <div className="flex justify-end pt-4">
                    <Button onClick={() => setShowModal(false)} variant="outline">Kapat</Button>
                </div>
            </DialogContent>
        </Dialog>
    </>
  );
}
