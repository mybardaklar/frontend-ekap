"use client"

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Send } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export function ContactForm() {
    const [formData, setFormData] = useState({
      name: '',
      email: '',
      subject: '',
      message: '',
      companyName: '',
      phone: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      // Form validation
      if (!formData.name || !formData.email || !formData.message) {
        toast.error("Hata", {
          description: "Lütfen tüm zorunlu alanları doldurun.",
        });
        return;
      }

      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        toast.error("Hata", {
          description: "Lütfen geçerli bir email adresi girin.",
        });
        return;
      }

      setIsSubmitting(true);
      const supabase = createClient();

      try {
        const { data, error } = await supabase.functions.invoke('send-contact-email', {
          body: {
            name: formData.name,
            email: formData.email,
            subject: formData.subject || 'İletişim Formu Mesajı',
            message: formData.message,
            companyName: formData.companyName,
            phone: formData.phone
          }
        });

        if (error) {
          console.error('Error sending email:', error);
          throw error;
        }

        console.log('Email sent successfully:', data);

        toast.success("Mesajınız Gönderildi", {
          description: "En kısa sürede size dönüş yapacağız.",
        });

        // Reset form
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
          companyName: '',
          phone: ''
        });
      } catch (error) {
        console.error('Failed to send email:', error);
        toast.error("Hata", {
          description: "Mesaj gönderilirken bir hata oluştu. Lütfen tekrar deneyin.",
        });
      } finally {
        setIsSubmitting(false);
      }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
    };

  return (
    <Card className="h-full border-t-4 border-t-blue-600 shadow-md">
       <CardHeader>
        <CardTitle className="text-2xl">Mesaj Gönderin</CardTitle>
        <CardDescription>
            Bize ulaşmak için formu doldurun. En kısa sürede size geri döneceğiz.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label htmlFor="name">Ad Soyad <span className="text-red-500">*</span></Label>
              <Input
                id="name"
                name="name"
                placeholder="Adınız Soyadınız"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="bg-gray-50 border-gray-200 dark:bg-zinc-900/50 dark:border-zinc-800"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-posta <span className="text-red-500">*</span></Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="ornek@sirket.com"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="bg-gray-50 border-gray-200 dark:bg-zinc-900/50 dark:border-zinc-800"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label htmlFor="companyName">Şirket Adı</Label>
              <Input
                id="companyName"
                name="companyName"
                placeholder="Şirketiniz (Opsiyonel)"
                value={formData.companyName}
                onChange={handleInputChange}
                className="bg-gray-50 border-gray-200 dark:bg-zinc-900/50 dark:border-zinc-800"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefon</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="05XX XXX XX XX"
                value={formData.phone}
                onChange={handleInputChange}
                className="bg-gray-50 border-gray-200 dark:bg-zinc-900/50 dark:border-zinc-800"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Konu</Label>
            <Input
              id="subject"
              name="subject"
              placeholder="Mesajınızın konusu"
              value={formData.subject}
              onChange={handleInputChange}
              className="bg-gray-50 border-gray-200 dark:bg-zinc-900/50 dark:border-zinc-800"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Mesaj <span className="text-red-500">*</span></Label>
            <Textarea
              id="message"
              name="message"
              rows={6}
              placeholder="Mesajınızı buraya yazın..."
              value={formData.message}
              onChange={handleInputChange}
              required
              className="resize-none bg-gray-50 border-gray-200 dark:bg-zinc-900/50 dark:border-zinc-800"
            />
          </div>

          <Button type="submit" className="w-full h-12 text-base font-medium" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                Gönderiliyor...
              </>
            ) : (
              <>
                <Send className="h-5 w-5 mr-2" />
                Mesaj Gönder
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
