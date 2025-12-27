'use client'

import Link from "next/link"
import { useQueryState } from "nuqs"
import { CreditBalanceDisplay } from "@/components/layout/credit-balance-display"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { signOut } from "@/app/auth/actions"
import { User } from "@supabase/supabase-js"

interface HeaderProps {
    user: User | null
    isAdmin?: boolean
}

import { useGlobalLoader } from "@/providers/global-loader-provider";

export function Header({ user, isAdmin = false }: HeaderProps) {
    const initials = user?.email?.substring(0, 2).toUpperCase() || "U"
    const { showLoader } = useGlobalLoader();
    const [, setModal] = useQueryState('modal');

    const handleSignOut = async () => {
        showLoader();
        await signOut();
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/75 dark:bg-zinc-950/75 backdrop-blur-md">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-8">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <Image
                            src="/images/logo.svg"
                            alt="EKAP Logo"
                            width={130}
                            height={43}
                            className="h-10 w-auto"
                            priority
                        />
                    </Link>

                    {/* Navigation */}
                    <nav className="hidden md:flex items-center gap-6">
                        <Link href="/kik" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                            KİK Sorgu
                        </Link>
                        <Link href="/ai-asistan" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                            AI Asistan
                        </Link>
                        <Link href="/sikayet-asistani" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                            Şikayet Dilekçesi
                        </Link>
                        <Link href="/fiyatlandirma" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                            Fiyatlandırma
                        </Link>
                        <Link href="/iletisim" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                            İletişim
                        </Link>
                    </nav>
                </div>

                {/* Right Side: Auth */}
                <div className="flex items-center gap-4">
                    {user ? (
                        <>
                            <CreditBalanceDisplay />
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                                        <Avatar className="h-10 w-10 border border-zinc-200 dark:border-zinc-800">
                                            <AvatarImage src="" alt={user.email || ""} />
                                            <AvatarFallback>{initials}</AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end" forceMount>
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium leading-none">Hesabım</p>
                                        <p className="text-xs leading-none text-muted-foreground">
                                            {user.email}
                                        </p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    {/* Placeholder for Profile */}
                                    <Link href="/profil" className="cursor-pointer">
                                        Profil
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/profil/kararlarim" className="cursor-pointer">
                                        Kararlarım
                                    </Link>
                                </DropdownMenuItem>
                                {isAdmin && (
                                    <>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem asChild>
                                            <Link href="/admin/dashboard" className="cursor-pointer text-red-600">
                                                Admin Panel
                                            </Link>
                                        </DropdownMenuItem>
                                    </>
                                )}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    className="cursor-pointer"
                                    onSelect={(e) => {
                                        e.preventDefault();
                                        handleSignOut();
                                    }}
                                >
                                    Çıkış Yap
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        </>
                    ) : (
                        <div className="flex items-center gap-2">
                             <Button variant="ghost" className="hidden sm:inline-flex" onClick={() => setModal('sign_in')}>
                                 Giriş Yap
                             </Button>
                             <Button onClick={() => setModal('sign_up')}>
                                 Kayıt Ol
                             </Button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    )
}
