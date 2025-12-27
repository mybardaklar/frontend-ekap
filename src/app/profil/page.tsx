import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { ProfileForm } from "./profile-form";
import { ChangePasswordForm } from "./change-password-form";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Coins, User as UserIcon, LogOut, Lock, ShieldAlert } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Profilim - EKAP',
  description: 'Profil bilgilerinizi düzenleyin ve satın aldığınız kararları görüntüleyin.',
};
// Force dynamic rendering to ensure fresh data
export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/?modal=sign_in');
  }

  // Fetch Profile (Personal Info)
  const { data: profile } = await supabase
    .from('profiles')
    .select('first_name, last_name')
    .eq('id', user.id)
    .single();

  // Fetch Credits (Balance) - Separate table 'user_credits'
  const { data: creditData } = await supabase
    .from('user_credits')
    .select('balance')
    .eq('user_id', user.id)
    .maybeSingle();

  // Fetch Purchases moved to separate page

  // Fallback Logic: If profile names are empty, try to parse from Google metadata
  let displayFirstName = profile?.first_name || '';
  let displayLastName = profile?.last_name || '';

  if (!displayFirstName && !displayLastName && user.user_metadata?.full_name) {
      const fullName = user.user_metadata.full_name.trim();
      const lastSpaceIndex = fullName.lastIndexOf(' ');
      if (lastSpaceIndex > 0) {
          displayFirstName = fullName.substring(0, lastSpaceIndex);
          displayLastName = fullName.substring(lastSpaceIndex + 1);
      } else {
          displayFirstName = fullName;
      }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 py-12 px-4">
      <div className="container mx-auto max-w-5xl">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Hesabım</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Left Column: Stats & Menu */}
          <div className="space-y-6">

            {/* Credits Card */}
            <Card className="bg-gradient-to-br from-blue-600 to-blue-700 text-white border-none shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium opacity-80 flex items-center gap-2">
                  <Coins className="h-4 w-4" />
                  Mevcut Kredi
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-extrabold">{creditData?.balance || 0}</div>
                <p className="text-sm mt-2 opacity-80">
                  Kredileriniz süresiz geçerlidir.
                </p>
              </CardContent>
            </Card>

            {/* Quick Actions / Menu could go here */}
          </div>

          {/* Right Column: Main Content */}
          <div className="md:col-span-2 space-y-8">

            {/* Personal Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserIcon className="h-5 w-5 text-blue-600" />
                  Kişisel Bilgiler
                </CardTitle>
                <CardDescription>
                  Hesap bilgilerinizi buradan güncelleyebilirsiniz.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ProfileForm
                  firstName={displayFirstName}
                  lastName={displayLastName}
                  email={user.email || ''}
                />
              </CardContent>
            </Card>

            {/* Security / Password */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5 text-blue-600" />
                  Güvenlik
                </CardTitle>
                <CardDescription>
                  Şifrenizi ve güvenlik ayarlarınızı yönetin.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/*
                   Check if user is managing auth via 3rd party (e.g. Google).
                   Typically, identities array contains providers.
                   If NO password provider (email) is found, block password change.
                */}
                {user.app_metadata.provider === 'email' || user.identities?.some(i => i.provider === 'email') ? (
                   <ChangePasswordForm />
                ) : (
                   <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 flex items-start gap-3">
                      <ShieldAlert className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-yellow-900 dark:text-yellow-100 text-sm">Harici Hizmet ile Giriş Yapıldı</h4>
                        <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                          Hesabınız (Google vb.) tarafından yönetilmektedir. Şifrenizi değiştirmek için ilgili sağlayıcının ayarlarını kullanmalısınız.
                        </p>
                      </div>
                   </div>
                )}
              </CardContent>
            </Card>

            {/* Purchases moved to /profil/kararlarim */}

          </div>
        </div>
      </div>
    </div>
  );
}
