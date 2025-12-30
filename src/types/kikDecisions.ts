export interface UrunBilgisi {
  id: string; // uuid
  created_at?: string;
  karar_no: string;
  baslik: string | null;
  baslik_metin: string | null;
  ozet: string | null;
  kategori: string | null;
  tarih?: string | null; // This might be used for display date
  sunum_turu: string | null;
  fiyat?: number | null;
  para_birimi?: string | null;
  updated_at?: string | null;
  public_product_no?: string | null;

  // Added based on usage
  price_in_credits?: number | null;
  hasCourtDecision?: boolean | null;
  karar_sonucu?: string | null;
  baslik_metin_xxx?: string | null;
  link?: string | null;
  cevap?: string | null;
}

export interface KararDetayi {
  karar_no: string;
  karar_tarihi: string | null;
  karar: string | null; // The full html/text content
  toplanti_no?: string | null;
  gundem_no?: string | null;
  updated_at?: string | null;
}
