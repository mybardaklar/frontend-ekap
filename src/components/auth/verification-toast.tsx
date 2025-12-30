'use client'

import { useEffect } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { toast } from 'sonner'

export function VerificationToast() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (searchParams.get('verified') === 'true') {
      toast.success('E-posta adresiniz başarıyla doğrulandı!', {
         duration: 5000,
         style: { backgroundColor: '#dcfce7', color: '#16a34a', borderColor: '#86efac' },
      })

      // Cleanup the URL parameter
      const params = new URLSearchParams(searchParams.toString())
      params.delete('verified')
      router.replace(`${pathname}?${params.toString()}`)
    }
  }, [searchParams, router, pathname])

  return null
}
