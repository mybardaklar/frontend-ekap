
import { UrunBilgisi } from '@/types/kikDecisions';
import QRCode from 'qrcode';

export interface ShareableSearchResult {
  searchTerm?: string;
  selectedCategory?: string;
  totalCount: number;
  currentPage: number;
}

// URL encoding/decoding utilities
export const encodeSearchParams = (params: ShareableSearchResult): string => {
  const urlParams = new URLSearchParams();

  if (params.searchTerm && params.searchTerm.trim()) {
    urlParams.set('search', params.searchTerm.trim());
  }

  if (params.selectedCategory && params.selectedCategory !== 'all') {
    urlParams.set('category', params.selectedCategory);
  }

  urlParams.set('results', params.totalCount.toString());
  urlParams.set('ref', 'share');

  return urlParams.toString();
};

export const encodeProductParams = (product: UrunBilgisi): string => {
  const urlParams = new URLSearchParams();
  // Güvenlik: Karar numarasını paylaşma; sadece ürün ID kullan
  urlParams.set('product', product.id);
  urlParams.set('ref', 'share');
  return urlParams.toString();
};

// Share URL generators
export const generateShareUrl = (params: string): string => {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  return `${baseUrl}/?${params}`;
};

export const generateShortUrl = (productId: string): string => {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  return `${baseUrl}/?p=${productId}`;
};

// Platform-specific share functions
export const shareViaWhatsApp = (url: string, message: string): void => {
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${message}\n\n${url}`)}`;
  window.open(whatsappUrl, '_blank');
};

export const shareViaTelegram = (url: string, message: string): void => {
  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(message)}`;
  window.open(telegramUrl, '_blank');
};

export const shareViaEmail = (url: string, subject: string, body: string): void => {
  const emailUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`${body}\n\n${url}`)}`;
  window.open(emailUrl);
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    // Fallback for older browsers
    try {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        const success = document.execCommand('copy');
        document.body.removeChild(textArea);
        return success;
    } catch (e) {
        console.error('Kopyalama başarısız:', e);
        return false;
    }
  }
};

// Message generators
export const generateProductShareMessage = (product: UrunBilgisi): string => {
  return `🏛️ KİK Kararı: ${product.baslik || 'Başlıksız Karar'}\n✨ Sadece ${product.price_in_credits || 0} kredi\n\n👆 Bio linkimize tıklayarak ulaşabilirsiniz\n\nekap.ai sizin için cevapladı ⬇️`;
};

export const generateInstagramShareMessage = (product: UrunBilgisi): string => {
  const shortUrl = generateShortUrl(product.id);
  return `🏛️ KİK Kararı: ${product.baslik || 'Başlıksız Karar'}\n✨ Sadece ${product.price_in_credits || 0} kredi\n\n🔗 ${shortUrl}\n📱 QR kodu taratarak direkt ulaşabilirsiniz\n\nekap.ai sizin için cevapladı ⬇️`;
};

// QR Code generator with background
export const generateQRCode = async (url: string): Promise<string> => {
  try {
    const qrCodeDataUrl = await QRCode.toDataURL(url, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });
    return qrCodeDataUrl;
  } catch (error) {
    console.error('QR kod oluşturulamadı:', error);
    throw error;
  }
};

// Generate Instagram story/post image with QR code
export const generateInstagramImage = async (product: UrunBilgisi): Promise<string> => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) throw new Error('Canvas context not available');

  // Instagram post boyutu (1080x1080)
  canvas.width = 1080;
  canvas.height = 1080;

  // Gradient arka plan
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, '#667eea');
  gradient.addColorStop(1, '#764ba2');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // QR kod oluştur
  const qrCodeDataUrl = await generateQRCode(generateShortUrl(product.id));

  return new Promise((resolve) => {
    const qrImg = new Image();
    qrImg.onload = () => {
      // QR kod boyutu ve pozisyonu
      const qrSize = 300;
      const qrX = (canvas.width - qrSize) / 2;
      const qrY = canvas.height - qrSize - 100;

      // Beyaz arka plan (QR kod için)
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(qrX - 20, qrY - 20, qrSize + 40, qrSize + 40);

      // QR kodu çiz
      ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);

      // Başlık
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 48px Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🏛️ KİK Kararı', canvas.width / 2, 120);

      // Ürün başlığı (kısaltılmış)
      ctx.font = '36px Arial, sans-serif';
      const title = (product.baslik || '').length > 50 ? (product.baslik || '').substring(0, 50) + '...' : (product.baslik || '');

      // Çok satırlı metin için
      const words = title.split(' ');
      let line = '';
      let y = 200;

      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        const testWidth = metrics.width;

        if (testWidth > 900 && n > 0) {
          ctx.fillText(line, canvas.width / 2, y);
          line = words[n] + ' ';
          y += 50;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, canvas.width / 2, y);

      // Fiyat
      y += 80;
      ctx.font = 'bold 42px Arial, sans-serif';
      ctx.fillStyle = '#FFD700';
      ctx.fillText(`✨ Sadece ${product.price_in_credits || 0} kredi`, canvas.width / 2, y);

      // QR kod açıklaması
      ctx.fillStyle = '#ffffff';
      ctx.font = '32px Arial, sans-serif';
      ctx.fillText('📱 QR kodu taratarak direkt ulaşın', canvas.width / 2, qrY - 40);

      // Branding
      ctx.font = 'bold 28px Arial, sans-serif';
      ctx.fillText('ekap.ai sizin için cevapladı ⬇️', canvas.width / 2, canvas.height - 40);

      resolve(canvas.toDataURL('image/png'));
    };
    qrImg.src = qrCodeDataUrl;
  });
};

export const generateSearchShareMessage = (params: ShareableSearchResult): string => {
  let message = `🔍 KİK Kararları Arama Sonucu\n📊 ${params.totalCount} karar bulundu`;

  if (params.searchTerm) {
    message += `\n🔎 Arama: "${params.searchTerm}"`;
  }

  if (params.selectedCategory && params.selectedCategory !== 'all') {
    message += `\n🏷️ Kategori: ${params.selectedCategory}`;
  }

  message += "\n\nekap.ai sizin için cevapladı ⬇️";
  return message;
};

// Social Media Sharing with Web Share API
export const shareTosocialMedia = async (product: UrunBilgisi): Promise<boolean> => {
  const shareText = generateProductShareMessage(product);
  const shareParams = encodeProductParams(product);
  const shareUrl = generateShareUrl(shareParams);

  // Web Share API kontrolü
  if (navigator.share) {
    try {
      await navigator.share({
        title: `KİK Kararı: ${product.baslik || 'Başlıksız'}`,
        text: shareText,
        url: shareUrl,
      });
      return true;
    } catch (error) {
      // Kullanıcı paylaşımı iptal etti veya hata oluştu
      console.log('Paylaşım iptal edildi veya hata oluştu:', error);
      return false;
    }
  } else {
    // Fallback: URL'yi kopyala
    const fullShareText = `${shareText}\n${shareUrl}`;
    // Use the robust copyToClipboard helper defined in this file (which has execCommand fallback)
    return await copyToClipboard(fullShareText);
  }
};

export const generateEmailSubject = (type: 'product' | 'search', title?: string): string => {
  if (type === 'product') {
    return `KİK Kararı: ${title || 'İhale Bilgisi'}`;
  }
  return 'KİK Kararları Arama Sonucu';
};
