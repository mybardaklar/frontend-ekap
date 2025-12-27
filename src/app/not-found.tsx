
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FileQuestion } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <div className="w-24 h-24 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-6 animate-in zoom-in duration-500">
        <FileQuestion className="h-12 w-12 text-blue-600 dark:text-blue-400" />
      </div>

      <h1 className="text-8xl font-black gradient-text mb-2 tracking-tighter">404</h1>

      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
        Sayfa Bulunamadı
      </h2>

      <p className="text-muted-foreground max-w-[600px] mb-10 text-lg leading-relaxed">
        Üzgünüz, aradığınız sayfa mevcut değil veya taşınmış olabilir.
        Aşağıdaki butonları kullanarak ana sayfaya dönebilir veya bizimle iletişime geçebilirsiniz.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
        <Button asChild size="lg" className="min-w-[180px] h-12 text-base shadow-lg shadow-blue-600/20">
          <Link href="/">
            Ana Sayfaya Dön
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="min-w-[180px] h-12 text-base hover:bg-gray-50 dark:hover:bg-gray-800">
          <Link href="/iletisim">
            Destek Al
          </Link>
        </Button>
      </div>

      <div className="mt-16 pt-8 border-t border-gray-100 dark:border-gray-800 w-full max-w-md">
        <p className="text-sm text-gray-400 dark:text-gray-500 font-mono">
          Error Code: 404_PAGE_NOT_FOUND
        </p>
      </div>
    </div>
  )
}
