
import { securelyMaskKararNo, extractProcurementType } from './securityUtils';

export const getDecisionBadgeColor = (karar_sonucu: string | null, hasCourtDecision: boolean = false) => {
  // Mahkeme kararı varsa mavi renk
  if (hasCourtDecision) {
    return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
  }

  // Orijinal karar_sonucu metnine göre renk belirleme - düzeltici/iptal içeriyorsa yeşil, değilse kırmızı
  if (karar_sonucu && (karar_sonucu.toLowerCase().includes('düzeltici') || karar_sonucu.toLowerCase().includes('iptal'))) {
    return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
  }
  return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
};

export const isGreenDecision = (karar_sonucu: string | null) => {
  return karar_sonucu && (karar_sonucu.toLowerCase().includes('düzeltici') || karar_sonucu.toLowerCase().includes('iptal'));
};

export const isBlueDecision = (hasCourtDecision: boolean) => {
  return hasCourtDecision;
};

export const sortDecisionsByPriorityAndDate = (products: any[]) => {
  return products.sort((a, b) => {
    const aHasCourt = a.hasCourtDecision || false;
    const bHasCourt = b.hasCourtDecision || false;
    const aIsGreen = isGreenDecision(a.karar_sonucu);
    const bIsGreen = isGreenDecision(b.karar_sonucu);

    // Önce mavi (mahkeme kararı olanlar) üstte
    if (aHasCourt && !bHasCourt) return -1;
    if (!aHasCourt && bHasCourt) return 1;

    // Sonra yeşilleri (düzeltici/iptal) üstte göster
    if (aIsGreen && !bIsGreen) return -1;
    if (!aIsGreen && bIsGreen) return 1;

    // Aynı renkteyse, karar tarihine göre sırala (yeni olan üstte)
    const aYear = extractYearFromKararNo(a.karar_no);
    const bYear = extractYearFromKararNo(b.karar_no);

    if (aYear && bYear) {
      if (aYear !== bYear) return bYear - aYear;
    }

    return b.karar_no.localeCompare(a.karar_no);
  });
};

const extractYearFromKararNo = (karar_no: string): number | null => {
  const yearMatch = karar_no.match(/(\d{4})/);
  return yearMatch ? parseInt(yearMatch[1]) : null;
};

export const filterProducts = (products: any[], searchTerm: string, selectedCategory: string) => {
  const filtered = products.filter(product => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = (product.baslik || '').toLowerCase().includes(searchLower) ||
                         (product.sunum_turu && product.sunum_turu.toLowerCase().includes(searchLower));

    const matchesCategory = selectedCategory === 'all' ||
                           (product.kategori && product.kategori === selectedCategory);

    return matchesSearch && matchesCategory;
  });

  return sortDecisionsByPriorityAndDate(filtered);
};

// Güvenli karar no maskeleme (legacy function - yönlendirme)
export const maskKararNo = (karar_no: string, isPurchased: boolean, isAdmin: boolean = false) => {
  return securelyMaskKararNo(karar_no, isPurchased, isAdmin);
};

// %80 yeşil, %20 kırmızı karışımı yapan fonksiyon
export const createGreenRedMixQuery = () => {
  return {
    greenFilter: `karar_sonucu.ilike.%düzeltici%,karar_sonucu.ilike.%iptal%`,
    redFilter: `not.karar_sonucu.ilike.%düzeltici%,not.karar_sonucu.ilike.%iptal%`
  };
};

export const calculateMixedPagination = (currentPage: number, itemsPerPage: number) => {
  const totalItemsPerPage = itemsPerPage;
  const greenItemsPerPage = Math.floor(totalItemsPerPage * 0.8); // %80 yeşil
  const redItemsPerPage = totalItemsPerPage - greenItemsPerPage; // %20 kırmızı

  const offset = (currentPage - 1) * totalItemsPerPage;
  const greenOffset = Math.floor(offset * 0.8);
  const redOffset = Math.floor(offset * 0.2);

  return {
    greenLimit: greenItemsPerPage,
    redLimit: redItemsPerPage,
    greenOffset,
    redOffset
  };
};

// İhale türü çıkarma (legacy function - yönlendirme)
export const getProcurementType = (karar_no: string) => {
  return extractProcurementType(karar_no);
};
