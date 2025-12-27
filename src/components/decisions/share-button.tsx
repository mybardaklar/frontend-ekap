
"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Share2, Copy, Mail, QrCode } from "lucide-react";
import { toast } from "sonner";
import {
  shareViaWhatsApp,
  shareViaTelegram,
  shareViaEmail,
  copyToClipboard,
  generateShareUrl,
  generateQRCode,
  generateInstagramImage,
  encodeProductParams
} from '@/utils/shareUtils';
import { UrunBilgisi } from '@/types/kikDecisions';

interface ShareButtonProps {
  urlParams: string;
  shareMessage: string;
  emailSubject: string;
  emailBody: string;
  size?: 'sm' | 'default';
  variant?: 'default' | 'outline' | 'ghost';
  showLabel?: boolean;
  product?: UrunBilgisi;
}

const ShareButton: React.FC<ShareButtonProps> = ({
  urlParams,
  shareMessage,
  emailSubject,
  emailBody,
  size = 'sm',
  variant = 'outline',
  showLabel = false,
  product
}) => {
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const shareUrl = generateShareUrl(urlParams);

  const handleShare = async (platform: string) => {
    setIsLoading(platform);

    try {
      switch (platform) {
        case 'whatsapp':
          shareViaWhatsApp(shareUrl, shareMessage);
          toast.success("WhatsApp açılıyor...");
          break;

        case 'telegram':
          shareViaTelegram(shareUrl, shareMessage);
          toast.success("Telegram açılıyor...");
          break;

        case 'email':
          shareViaEmail(shareUrl, emailSubject, emailBody);
          toast.success("E-posta uygulamanız açılıyor...");
          break;

        case 'copy':
          const success = await copyToClipboard(shareUrl);
          if (success) {
            toast.success("Bağlantı panoya kopyalandı.");
          } else {
            toast.error("Link kopyalanırken bir hata oluştu.");
          }
          break;

        case 'qrcode':
          if (!product) {
            toast.error("Ürün bilgisi bulunamadı.");
            break;
          }
          try {
            // Her ürün için özel QR kod oluştur
            const productUrl = generateShareUrl(encodeProductParams(product));
            const qrCodeDataUrl = await generateQRCode(productUrl);
            const link = document.createElement('a');
            link.download = `qr-code-${product.id}.png`;
            link.href = qrCodeDataUrl;
            link.click();
            toast.success("Bu ürüne özel QR kod hazır!");
          } catch (error) {
            console.error(error);
            toast.error("QR kod oluşturulamadı.");
          }
          break;

        case 'instagram':
          if (!product) {
            toast.error("Ürün bilgisi bulunamadı.");
            break;
          }
          try {
            const instagramImageDataUrl = await generateInstagramImage(product);
            const link = document.createElement('a');
            link.download = 'instagram-post.png';
            link.href = instagramImageDataUrl;
            link.click();
            toast.success("Görsel Instagram'da paylaşmaya hazır!");
          } catch (error) {
            console.error(error);
            toast.error("Instagram görseli oluşturulamadı.");
          }
          break;
      }
    } catch (error) {
        console.error(error);
      toast.error("Paylaşım sırasında bir hata oluştu.");
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} className="gap-1">
          <Share2 className="h-3 w-3" />
          {showLabel && <span className="hidden sm:inline">Paylaş</span>}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 bg-background border shadow-md z-50">
        <DropdownMenuItem
          onClick={() => handleShare('whatsapp')}
          disabled={isLoading === 'whatsapp'}
          className="cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded-sm flex items-center justify-center">
              <span className="text-white text-xs font-bold">W</span>
            </div>
            WhatsApp
          </div>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => handleShare('telegram')}
          disabled={isLoading === 'telegram'}
          className="cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded-sm flex items-center justify-center">
              <span className="text-white text-xs font-bold">T</span>
            </div>
            Telegram
          </div>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => handleShare('email')}
          disabled={isLoading === 'email'}
          className="cursor-pointer"
        >
          <Mail className="mr-2 h-4 w-4" />
          E-posta
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => handleShare('copy')}
          disabled={isLoading === 'copy'}
          className="cursor-pointer"
        >
          <Copy className="mr-2 h-4 w-4" />
          Linki Kopyala
        </DropdownMenuItem>

        {product && (
          <DropdownMenuItem
            onClick={() => handleShare('qrcode')}
            disabled={isLoading === 'qrcode'}
            className="cursor-pointer"
          >
            <QrCode className="mr-2 h-4 w-4" />
            QR Kod İndir
          </DropdownMenuItem>
        )}

        {product && (
          <DropdownMenuItem
            onClick={() => handleShare('instagram')}
            disabled={isLoading === 'instagram'}
            className="cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-sm flex items-center justify-center">
                <span className="text-white text-xs font-bold">I</span>
              </div>
              Instagram Görseli
            </div>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ShareButton;
