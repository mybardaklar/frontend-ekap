'use client'

import { getURL } from "@/utils/get-url"
import { createClient } from "@/utils/supabase/client"

import { useForm } from "react-hook-form"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { signInSchema, signUpSchema, forgotPasswordSchema, updatePasswordSchema } from "@/lib/auth-schemas"
import { login, signup, resetPassword, updatePassword } from "@/app/auth/actions"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import * as z from "zod"
import { toast } from "sonner"
import { SocialAuth } from "./social-auth"
import Link from "next/link"
import Image from "next/image"
import { Checkbox } from "@/components/ui/checkbox"
import { PasswordInput } from "@/components/ui/password-input"
import { useGlobalLoader } from "@/providers/global-loader-provider";

interface AuthFormProps {
  onSuccess?: () => void
}

const AuthHeader = ({ title, subtitle }: { title: string, subtitle: string }) => (
  <div className="flex flex-col gap-2 mb-6">
     <div className="flex items-center gap-2 mb-8 justify-center">
       <Image src="/images/logo.svg" alt="EKAP Logo" width={64} height={64} className="w-16 h-16" />
     </div>
    <h1 className="text-xl font-semibold text-foreground">{title}</h1>
    <p className="text-sm text-muted-foreground">{subtitle}</p>
  </div>
)

const Divider = () => (
  <div className="relative my-6">
    <div className="absolute inset-0 flex items-center">
      <span className="w-full border-t border-zinc-200 dark:border-zinc-800" />
    </div>
    <div className="relative flex justify-center text-xs uppercase">
      <span className="bg-white dark:bg-zinc-950 px-2 text-muted-foreground">
        or
      </span>
    </div>
  </div>
)

import { useQueryState } from 'nuqs'

const AuthFooterLink = ({ text, linkText, modalKey }: { text: string, linkText: string, modalKey: string }) => {
    const [, setModal] = useQueryState('modal')
    return (
        <div className="mt-6 text-center text-sm">
            <p className="text-muted-foreground">
                {text}{" "}
                <button
                    onClick={() => setModal(modalKey)}
                    className="font-semibold text-foreground hover:underline bg-transparent border-none p-0 cursor-pointer"
                >
                    {linkText}
                </button>
            </p>
        </div>
    )
}

const LegalFooter = () => (
    <p className="mt-6 text-xs text-center text-muted-foreground leading-relaxed px-4">
        EKAP'ta hesap oluşturarak <a href="/kullanim-kosullari" className="underline">kullanım koşullarını</a> ve <a href="/gizlilik-politikasi" className="underline">gizlilik politikasını</a> kabul etmiş olursunuz. Size yeni özellikler ve önemli güncellemeler hakkında e-posta gönderebiliriz.
    </p>
)

export function SignInForm({ onSuccess }: AuthFormProps) {
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const { showLoader, hideLoader } = useGlobalLoader();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [, setModal] = useQueryState('modal')

  const supabase = createClient()

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${getURL()}auth/callback`,
        },
      })
      if (error) {
        toast.error(error.message, {
           style: { backgroundColor: '#fee2e2', color: '#dc2626', borderColor: '#fca5a5' },
        })
      }
    } catch (error) {
      console.error("Google Sign In Error:", error)
      toast.error("Bir hata oluştu", {
          style: { backgroundColor: '#fee2e2', color: '#dc2626', borderColor: '#fca5a5' },
      })
    } finally {
      // Note: We don't set loading to false here because the redirect will happen
      // taking the user away from the page. If we set it to false, the user might click again.
      // However, if there was an error, we should reset it.
      // For now, let's keep it simple.
    }
  }

  async function onSubmit(values: z.infer<typeof signInSchema>) {
    showLoader();
    try {
      const res = await login(values)
      if (res?.error) {
        toast.error(res.error, {
          style: { backgroundColor: '#fee2e2', color: '#dc2626', borderColor: '#fca5a5' },
        })
      } else {
        toast.success("Giriş başarılı!")
        if (onSuccess) onSuccess()
        // We don't need to refresh or redirect if the modal just closes and the header updates.
        // But standard practice might be to refresh to update server components.
        router.refresh()
      }
    } finally {
      hideLoader();
      setIsLoading(false);
    }
  }

  return (
    <div>
      <AuthHeader title="Hoş Geldiniz" subtitle="Hesabınıza giriş yapın" />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-posta</FormLabel>
                <FormControl>
                  <Input placeholder="ornek@sirket.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                    <FormLabel>Şifre</FormLabel>
                    <button
                        type="button"
                        onClick={() => setModal('forgot_password')}
                        className="text-sm font-medium text-primary hover:underline bg-transparent border-none p-0 cursor-pointer"
                    >
                        Şifremi unuttum?
                    </button>
                </div>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Giriş Yap
          </Button>
        </form>
      </Form>

      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
        </div>
      </div>

      <Button variant="outline" type="button" disabled={isLoading} className="w-full" onClick={handleGoogleSignIn}>
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
            <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
          </svg>
        )}
        Google ile Giriş Yap
      </Button>

      <AuthFooterLink text="Hesabınız yok mu?" linkText="Kayıt Ol" modalKey="sign_up" />
    </div>
  )
}

export function SignUpForm() {
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const { showLoader, hideLoader } = useGlobalLoader();
  const [isLoading, setIsLoading] = useState(false);
  const [, setModal] = useQueryState('modal')

  const supabase = createClient()

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${getURL()}auth/callback`,
        },
      })
       if (error) {
        toast.error(error.message, {
           style: { backgroundColor: '#fee2e2', color: '#dc2626', borderColor: '#fca5a5' },
        })
        setIsLoading(false)
      }
    } catch (error) {
      console.error("Google Sign In Error:", error)
      toast.error("Bir hata oluştu", {
          style: { backgroundColor: '#fee2e2', color: '#dc2626', borderColor: '#fca5a5' },
      })
      setIsLoading(false)
    }
  }

  const [checkEmail, setCheckEmail] = useState(false)

  async function onSubmit(values: z.infer<typeof signUpSchema>) {
    setIsLoading(true);
    showLoader();
    try {
      const res = await signup(values)
      if (res?.error) {
        toast.error(res.error, {
          style: { backgroundColor: '#fee2e2', color: '#dc2626', borderColor: '#fca5a5' },
        })
      } else {
        setCheckEmail(true)
        toast.success("Hesap oluşturuldu! Lütfen e-postanızı kontrol edin.", {
          style: { backgroundColor: '#dcfce7', color: '#16a34a', borderColor: '#86efac' },
        })
      }
    } finally {
      hideLoader();
      setIsLoading(false);
    }
  }

  if (checkEmail) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 py-8 px-4 text-center animate-in fade-in duration-300">
        <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
          </svg>
        </div>
        <h2 className="text-2xl font-semibold tracking-tight">E-postanızı Kontrol Edin</h2>
        <p className="text-muted-foreground max-w-sm">
          Aktivasyon bağlantısını <strong>{form.getValues().email}</strong> adresine gönderdik.
          Lütfen gelen kutunuzu (ve spam klasörünü) kontrol ederek hesabınızı doğrulayın.
        </p>

        <div className="pt-6 w-full space-y-2">
            <Button variant="outline" className="w-full" onClick={() => setModal('sign_in')}>
                Giriş Yap Ekranına Dön
            </Button>
            <p className="text-xs text-muted-foreground mt-4">
               E-posta gelmedi mi? <button onClick={() => setCheckEmail(false)} className="underline hover:text-primary">Tekrar dene</button>
            </p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      <AuthHeader
        title="Hesap Oluştur"
        subtitle="Başlamak için bilgilerinizi girin."
      />

      <SocialAuth />

      <Divider />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-posta <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input placeholder="ornek@sirket.com" {...field} className="h-11" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Şifre <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <PasswordInput placeholder="••••••" {...field} className="h-11" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full h-11 bg-zinc-950 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200" disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Kayıt Ol
          </Button>
        </form>
      </Form>

      <AuthFooterLink text="Zaten bir hesabınız var mı?" linkText="Giriş Yap" modalKey="sign_in" />
      <LegalFooter />
    </div>
  )
}

export function ForgotPasswordForm() {
  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  })

  const { showLoader, hideLoader } = useGlobalLoader();
  const [isLoading, setIsLoading] = useState(false);
  const [, setModal] = useQueryState('modal')

  async function onSubmit(values: z.infer<typeof forgotPasswordSchema>) {
    setIsLoading(true);
    showLoader();
    try {
      const res = await resetPassword(values)
      if (res?.error) {
        toast.error(res.error, {
          style: { backgroundColor: '#fee2e2', color: '#dc2626', borderColor: '#fca5a5' },
        })
      } else if (res?.success) {
        toast.success(res.message, {
          style: { backgroundColor: '#dcfce7', color: '#16a34a', borderColor: '#86efac' },
        })
      }
    } finally {
      hideLoader();
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full">
      <AuthHeader
        title="Şifreyi Sıfırla"
        subtitle="Sıfırlama bağlantısı almak için e-postanızı girin."
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-posta <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input placeholder="ornek@sirket.com" {...field} className="h-11" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full h-11 bg-zinc-950 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200" disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Şifreyi Sıfırla
          </Button>
        </form>
      </Form>

       <div className="mt-6 text-center text-sm">
          <button
             onClick={() => setModal('sign_in')}
             className="font-semibold text-foreground hover:underline bg-transparent border-none p-0 cursor-pointer"
          >
             Giriş Yap sayfasına dön
          </button>
      </div>
    </div>
  )
}

export function UpdatePasswordForm() {
  const form = useForm<z.infer<typeof updatePasswordSchema>>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  })

  const { showLoader, hideLoader } = useGlobalLoader();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [, setModal] = useQueryState('modal')

  async function onSubmit(values: z.infer<typeof updatePasswordSchema>) {
    setIsLoading(true);
    showLoader();
    try {
        const res = await updatePassword(values)
        if (res?.error) {
            toast.error(res.error, {
                style: { backgroundColor: '#fee2e2', color: '#dc2626', borderColor: '#fca5a5' },
            })
        } else {
            toast.success("Şifre başarıyla güncellendi!", {
                style: { backgroundColor: '#dcfce7', color: '#16a34a', borderColor: '#86efac' },
            })
            router.push('/?modal=sign_in') // Redirect to sign in modal
        }
    } finally {
        hideLoader();
        setIsLoading(false);
    }
  }

  return (
    <div className="w-full">
      <AuthHeader
        title="Şifreyi Güncelle"
        subtitle="Yeni şifrenizi girin."
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Yeni Şifre <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <PasswordInput placeholder="••••••" {...field} className="h-11" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Şifreyi Onayla <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••" {...field} className="h-11" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full h-11 bg-zinc-950 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200" disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Şifreyi Güncelle
          </Button>
        </form>
      </Form>
       <div className="mt-4 text-center text-sm">
          <button
                onClick={() => setModal('sign_in')}
                className="font-semibold text-foreground hover:underline bg-transparent border-none p-0 cursor-pointer"
            >
            Giriş Yap sayfasına dön
          </button>
        </div>
    </div>
  )
}
