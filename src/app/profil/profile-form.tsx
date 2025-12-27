"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { createClient } from "@/utils/supabase/client";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface ProfileFormProps {
  firstName: string;
  lastName: string;
  email: string;
}

export function ProfileForm({ firstName, lastName, email }: ProfileFormProps) {
  const [fName, setFName] = useState(firstName);
  const [lName, setLName] = useState(lastName);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        toast.error("Oturum süreniz dolmuş olabilir.");
        return;
      }

      const { error } = await supabase
        .from('profiles')
        .update({ first_name: fName, last_name: lName })
        .eq('id', user.id);

      if (error) {
        console.error('Update Error:', error);
        toast.error("Profil güncellenemedi.");
        return;
      }

      toast.success("Profil bilgileri güncellendi.");
      router.refresh();
    } catch (err) {
      toast.error("Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleUpdate} className="space-y-6 max-w-md">
      <div className="space-y-2">
        <Label htmlFor="email">E-posta</Label>
        <Input
          id="email"
          value={email}
          disabled
          className="bg-muted text-muted-foreground"
        />
        <p className="text-xs text-muted-foreground">E-posta adresi değiştirilemez.</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
            <Label htmlFor="firstname">Ad</Label>
            <Input
            id="firstname"
            value={fName}
            onChange={(e) => setFName(e.target.value)}
            placeholder="Adınız"
            />
        </div>
        <div className="space-y-2">
            <Label htmlFor="lastname">Soyad</Label>
            <Input
            id="lastname"
            value={lName}
            onChange={(e) => setLName(e.target.value)}
            placeholder="Soyadınız"
            />
        </div>
      </div>

      <Button type="submit" disabled={loading}>
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Değişiklikleri Kaydet
      </Button>
    </form>
  );
}
