
// Güvenli içerik maskeleme ve güvenlik kontrolleri
export interface SecureContentOptions {
  isPurchased: boolean;
  isAdmin: boolean;
  maxPreviewLength?: number;
}

// İçeriği güvenli şekilde maskele (DOM'a hassas veri yazma)
export const securelyMaskContent = (
  content: string | null | undefined,
  options: SecureContentOptions
): string => {
  const { isPurchased, isAdmin, maxPreviewLength = 100 } = options;

  // Admin veya satın alınmış içerik için tam içerik döndür
  if (isAdmin || isPurchased) {
    return content || '';
  }

  // Satın alınmamış içerik için güvenli maskeleme
  if (!content) return '';

  // Maksimum preview uzunluğu kontrolü
  if (content.length <= maxPreviewLength) {
    return content;
  }

  // İçeriği güvenli şekilde kırp ve maske ekle
  return content.substring(0, maxPreviewLength) + '... [Devamını görmek için satın alın]';
};

// Karar numarasını güvenli şekilde maskele
export const securelyMaskKararNo = (
  kararNo: string,
  isPurchased: boolean,
  isAdmin: boolean
): string => {
  // Admin veya satın alınmış için tam numara
  if (isAdmin || isPurchased) {
    return kararNo;
  }

  // Güvenli maskeleme - sadece yıl ve tür kısmını göster
  const parts = kararNo.split('/');
  if (parts.length >= 2) {
    const year = parts[0];
    const typeAndRest = parts[1];

    // Tür kısmını çıkar (UY, M, H, D vb.)
    const typeMatch = typeAndRest.match(/^([A-Z]+)/);
    const type = typeMatch ? typeMatch[1] : '';

    return `${year}/${type}***`;
  }

  // Format farklıysa sadece ilk 4 karakteri göster
  return kararNo.substring(0, 4) + '****';
};

// İhale türünü çıkar ve açıklamayı döndür
export const extractProcurementType = (kararNo: string) => {
  const parts = kararNo.split('/');
  if (parts.length < 2) return null;

  const typeSection = parts[1];
  const typeMatch = typeSection.match(/^([A-Z]+)/);

  if (!typeMatch) return null;

  const type = typeMatch[1];

  const typeDescriptions: Record<string, { label: string; description: string; color: string }> = {
    'UY': { label: 'Yapım', description: 'Yapım İşi', color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 border-orange-200 dark:border-orange-700' },
    'M': { label: 'Mal', description: 'Mal Alımı', color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-700' },
    'H': { label: 'Hizmet', description: 'Hizmet Alımı', color: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-700' },
    'D': { label: 'Danışmanlık', description: 'Danışmanlık Hizmeti', color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-700' }
  };

  return {
    type,
    displayText: `${parts[0]}/${type}`,
    ...typeDescriptions[type] || { label: type, description: 'Diğer', color: 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700' }
  };
};

// Güvenlik doğrulaması - hassas verilerin DOM'a yazılmasını engelle
export const validateSecureAccess = (
  productId: string,
  purchasedProducts: string[],
  isAdmin: boolean
): boolean => {
  return isAdmin || purchasedProducts.includes(productId);
};

/**
 * SECURITY ENHANCEMENT: Enhanced sanitization for developer tools
 * Removes all sensitive fields and PII to prevent data leakage
 */
export const sanitizeForDevTools = (obj: any, isAdmin: boolean = false): any => {
  if (!obj || typeof obj !== 'object') return obj;

  // Admin için hiç maskeleme yapma
  if (isAdmin) return obj;

  const sensitiveFields = [
    'baslik_metin', 'karar', 'full_content',
    'email', 'phone', 'kimlik_numarasi', 'tc_kimlik',
    'password', 'token', 'api_key', 'secret',
    'credit_card', 'bank_account', 'iban'
  ];

  // Admin için karar_no'yu sensitive field'lardan çıkar
  if (!isAdmin) {
    sensitiveFields.push('karar_no');
  }

  const sanitized = { ...obj };

  sensitiveFields.forEach(field => {
    if (sanitized[field] !== undefined) {
      if (typeof sanitized[field] === 'string') {
        // Show only first 3 characters for debugging purposes
        sanitized[field] = sanitized[field].substring(0, 3) + '***[MASKED]';
      } else {
        sanitized[field] = '[MASKED]';
      }
    }
  });

  return sanitized;
};
