import { UrunBilgisi } from "@/types/kikDecisions";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, ArrowRight } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface PurchasesListProps {
  purchases: UrunBilgisi[];
  currentPage: number;
  totalPages: number;
}

export function PurchasesList({ purchases, currentPage, totalPages }: PurchasesListProps) {
  if (purchases.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 dark:bg-zinc-900 rounded-xl border border-dashed">
        <p className="text-muted-foreground">Henüz satın aldığınız bir karar bulunmuyor.</p>
        <Button variant="link" asChild className="mt-2">
          <Link href="/">Kararları İncele</Link>
        </Button>
      </div>
    );
  }

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages = [];
    // Always show current, prev, next if possible
    if (currentPage > 1) pages.push(currentPage - 1);
    pages.push(currentPage);
    if (currentPage < totalPages) pages.push(currentPage + 1);
    return pages.sort((a, b) => a - b);
  };

  return (
    <div className="grid gap-6">
      <div className="grid gap-4">
      {purchases.map((item) => {
        let targetUrl = `/p/${item.id}`;
        if (item.link) {
            if (item.link.includes('ekap.ai/kik/')) {
                 const parts = item.link.split('/kik/');
                 if (parts.length > 1) {
                     targetUrl = `/p/${parts[1]}`;
                 }
            } else if (item.link.startsWith('http') || item.link.startsWith('/')) {
                targetUrl = item.link;
            } else {
                targetUrl = `/p/${item.link}`;
            }
        }

        return (
          <div
            key={item.id}
            className="flex items-center justify-between p-4 bg-white dark:bg-zinc-900 border rounded-lg hover:border-blue-200 transition-colors"
          >
            <div className="flex items-start gap-4">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg mt-1">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                  {item.baslik || "Başlıksız Karar"}
                </h4>
                <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                  <span>Karar No: {item.karar_no}</span>
                  <span>•</span>
                  <span>{item.tarih ? new Date(item.tarih).toLocaleDateString('tr-TR') : '-'}</span>
                </div>
              </div>
            </div>

            <Button asChild size="sm" variant="outline">
              <Link href={targetUrl}>
                Görüntüle
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        );
      })}
      </div>

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            {currentPage > 1 && (
              <PaginationItem>
                <PaginationPrevious href={`?page=${currentPage - 1}`} />
              </PaginationItem>
            )}

            {getPageNumbers().map((page) => (
               <PaginationItem key={page}>
                 <PaginationLink href={`?page=${page}`} isActive={page === currentPage}>
                   {page}
                 </PaginationLink>
               </PaginationItem>
            ))}

            {currentPage < totalPages && (
              <PaginationItem>
                <PaginationNext href={`?page=${currentPage + 1}`} />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
