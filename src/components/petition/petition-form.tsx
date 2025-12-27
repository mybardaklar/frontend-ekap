"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Loader2 } from "lucide-react";
import { usePetitionService, PetitionFormData } from '@/hooks/use-petition-service';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

// Validation Schema
const petitionSchema = z.object({
  idare_adi: z.string().min(2, "İdare adı en az 2 karakter olmalıdır"),
  idare_adresi: z.string().min(5, "İdare adresi en az 5 karakter olmalıdır"),
  basvuru_sahibi: z.string().min(2, "Başvuru sahibi adı en az 2 karakter olmalıdır"),
  kimlik_numarasi: z.string().min(10, "Kimlik/Vergi numarası en az 10 karakter olmalıdır"),
  vekil_bilgisi: z.string().optional(),
  ihale_kayit_numarasi: z.string().min(4, "İhale kayıt numarası gereklidir"),
  ihale_adi: z.string().min(5, "İhale adı en az 5 karakter olmalıdır"),
  farkina_varildigi_tarih: z.string().min(1, "Tarih seçimi zorunludur"),
  sikayet_konusu: z.string().min(20, "Şikayet konusu ile ilgili detaylı bilgi gereklidir (min 20 karakter)"),
  email: z.string().email("Geçerli bir e-posta adresi giriniz"),
});

interface PetitionFormProps {
  petitionType: 'complaint' | 'objection';
  creditCost: number;
  title?: string;
  description?: string;
  showHeader?: boolean;
}

export function PetitionForm({
  petitionType,
  creditCost,
  title,
  description,
  showHeader = false,
}: PetitionFormProps) {
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const { writePetition, isLoading } = usePetitionService();

  const form = useForm<PetitionFormData>({
    resolver: zodResolver(petitionSchema),
    defaultValues: {
      idare_adi: '',
      idare_adresi: '',
      basvuru_sahibi: '',
      kimlik_numarasi: '',
      vekil_bilgisi: '',
      ihale_kayit_numarasi: '',
      ihale_adi: '',
      farkina_varildigi_tarih: '',
      sikayet_konusu: '',
      email: ''
    }
  });

  const handleSubmit = async (data: PetitionFormData) => {
    const result = await writePetition({
      petition_type: petitionType,
      subject: data.ihale_adi,
      content: JSON.stringify(data),
      amount: creditCost,
      form_data: data
    });

    if (result.success && result.file_url) {
      setFileUrl(result.file_url);
    }
  };

  const handleDownload = () => {
    if (fileUrl) {
      window.open(fileUrl, '_blank');
    }
  };

  return (
    <Card className="w-full border-t-4 border-t-blue-600 shadow-md">
      {(showHeader || title) && (
        <CardHeader>
           {title && <CardTitle className="text-2xl">{title}</CardTitle>}
           {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent>
        {!fileUrl ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="idare_adi"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>İhaleyi Yapan İdarenin Adı <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Örn: İZMİR BÜYÜKŞEHİR BELEDİYESİ"
                          {...field}
                          disabled={isLoading}
                          className="bg-gray-50 border-gray-200 dark:bg-zinc-900/50 dark:border-zinc-800"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="idare_adresi"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>İdarenin Adresi <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Örn: KONAK / İZMİR"
                          {...field}
                          disabled={isLoading}
                          className="bg-gray-50 border-gray-200 dark:bg-zinc-900/50 dark:border-zinc-800"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="basvuru_sahibi"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Başvuru Sahibi Adı/Ünvanı <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Örn: AAB MÜHENDİSLİK SAN.TİC.AŞ."
                          {...field}
                          disabled={isLoading}
                          className="bg-gray-50 border-gray-200 dark:bg-zinc-900/50 dark:border-zinc-800"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="kimlik_numarasi"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>T.C. Kimlik / Vergi No <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input
                          placeholder="11 haneli TC veya 10 haneli Vergi No"
                          {...field}
                          disabled={isLoading}
                          className="bg-gray-50 border-gray-200 dark:bg-zinc-900/50 dark:border-zinc-800"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="vekil_bilgisi"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vekili/Temsilcisi Bilgileri</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Örn: Av. Ali VELİ - İstanbul Barosu"
                        rows={2}
                        {...field}
                        disabled={isLoading}
                        className="bg-gray-50 border-gray-200 dark:bg-zinc-900/50 dark:border-zinc-800 resize-none"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="ihale_kayit_numarasi"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>İhale Kayıt Numarası (İKN) <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Örn: 2024/123456"
                          {...field}
                          disabled={isLoading}
                          className="bg-gray-50 border-gray-200 dark:bg-zinc-900/50 dark:border-zinc-800"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="ihale_adi"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>İhalenin Adı (İşin Adı) <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Örn: PARK BAHÇE BAKIM ONARIMI İŞİ"
                          {...field}
                          disabled={isLoading}
                          className="bg-gray-50 border-gray-200 dark:bg-zinc-900/50 dark:border-zinc-800"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="farkina_varildigi_tarih"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tebliğ / Farkına Varma Tarihi <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        disabled={isLoading}
                        className="bg-gray-50 border-gray-200 dark:bg-zinc-900/50 dark:border-zinc-800 w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sikayet_konusu"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Şikayet Konusu ve Nedenleri <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="İhale mevzuatına aykırılıkları ve gerekçelerinizi detaylı bir şekilde açıklayınız..."
                        rows={6}
                        {...field}
                        disabled={isLoading}
                        className="bg-gray-50 border-gray-200 dark:bg-zinc-900/50 dark:border-zinc-800"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-posta Adresiniz <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="ornek@sirket.com"
                        {...field}
                        disabled={isLoading}
                        className="bg-gray-50 border-gray-200 dark:bg-zinc-900/50 dark:border-zinc-800"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex flex-col sm:flex-row justify-between items-center pt-6 gap-4 border-t border-gray-100 dark:border-zinc-800">
                <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-full">
                  <span className="text-sm font-medium text-blue-700 dark:text-blue-300">İşlem Bedeli:</span>
                  <Badge variant="secondary" className="bg-white dark:bg-zinc-800 text-blue-600 dark:text-blue-400 border-none shadow-sm">{creditCost} Kredi</Badge>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  size="lg"
                  className="w-full sm:w-auto min-w-[200px]"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Dilekçe Hazırlanıyor...
                    </>
                  ) : (
                    <>
                      <FileText className="h-5 w-5 mr-2" />
                      Dilekçe Oluştur
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        ) : (
          <div className="text-center space-y-6 py-10">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto shadow-inner animate-in zoom-in duration-300">
              <FileText className="h-10 w-10 text-green-600" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Dilekçeniz Hazır!</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Yapay zeka asistanımız şikayet dilekçenizi başarıyla hazırladı. Aşağıdaki butona tıklayarak hemen indirebilirsiniz.
              </p>
            </div>

            <Button onClick={handleDownload} size="lg" className="w-full max-w-xs bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/20 transition-all">
              <Download className="h-5 w-5 mr-2" />
              Dilekçeyi İndir
            </Button>

            <p className="text-xs text-gray-400">
               * Dilekçe PDF formatında indirilecektir.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
