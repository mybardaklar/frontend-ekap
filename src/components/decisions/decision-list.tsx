import { createClient } from "@/utils/supabase/server"
import { UrunBilgisi } from "@/types/kikDecisions"
import DecisionItem from "@/components/decisions/decision-item"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

interface DecisionListProps {
  searchParams: { [key: string]: string | string[] | undefined }
  page: number
  pageSize: number
}

export default async function DecisionList({ searchParams, page, pageSize }: DecisionListProps) {
  const supabase = await createClient()

  const search = (searchParams.search || '') as string
  const category = (searchParams.category || 'all') as string
  const hasCourtDecision = searchParams.court_decision === 'true'

  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  // Start building the query
  let query = supabase
    .from('urun_bilgileri')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .order('id', { ascending: true })

  // Apply filters
  if (search) {
    query = query.or(`baslik.ilike.%${search}%,karar_no.ilike.%${search}%`)
  }

  if (category !== 'all') {
    query = query.eq('kategori', category)
  }

  if (hasCourtDecision) {
    query = query.or('karar_sonucu.ilike.%mahkeme%,baslik.ilike.%mahkeme%')
  }

  // Apply pagination
  query = query.range(from, to)

  const { data: decisions, error, count } = await query

  if (error) {
    console.error("Error fetching decisions:", error)
    return <div className="text-red-500">Kararlar yüklenirken bir hata oluştu.</div>
  }

  // Check user purchases / Admin status
  const { data: { user } } = await supabase.auth.getUser()
  let isAdmin = false
  const purchasedIds = new Set<string>()

  if (user) {
    const adminEmails = ['ekap@ekap.ai']
    if (adminEmails.includes(user.email || '')) {
      isAdmin = true
    } else {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()
      if (profile?.role === 'admin') isAdmin = true
    }

    if (!isAdmin) {
       const { data: purchases } = await supabase
         .from('user_purchases')
         .select('product_id')
         .eq('user_id', user.id)
       purchases?.forEach(p => purchasedIds.add(p.product_id))
    }
  }

  if (!decisions || decisions.length === 0) {
      return (
        <div className="text-center py-20 text-muted-foreground bg-white dark:bg-zinc-950 rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700">
            <p className="text-lg">Aradığınız kriterlere uygun karar bulunamadı.</p>
            <p className="text-sm mt-2">Lütfen arama terimlerini veya filtreleri değiştirerek tekrar deneyin.</p>
        </div>
      )
  }

  const totalPages = count ? Math.ceil(count / pageSize) : 0

  // Helper to preserve search params in pagination
  const createPageUrl = (newPage: number) => {
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (category !== 'all') params.set('category', category)
    if (hasCourtDecision) params.set('court_decision', 'true')
    params.set('page', newPage.toString())
    return `/?${params.toString()}`
  }

  return (
    <>
        <div className="flex flex-col gap-4 mb-8">
        {decisions.map((decision: UrunBilgisi) => (
            <DecisionItem
                key={decision.id}
                product={decision}
                isPurchased={isAdmin || purchasedIds.has(decision.id)}
                isAdmin={isAdmin}
            />
        ))}
        </div>

        {/* Pagination logic */}
        {totalPages > 1 && (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href={createPageUrl(Math.max(1, page - 1))}
                  aria-disabled={page === 1}
                  className={page === 1 ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href={createPageUrl(1)} isActive={page === 1}>1</PaginationLink>
              </PaginationItem>
              {page > 3 && (
                 <PaginationItem>
                    <PaginationEllipsis />
                 </PaginationItem>
              )}
              {page > 2 && (
                  <PaginationItem>
                    <PaginationLink href={createPageUrl(page - 1)} isActive={false}>{page - 1}</PaginationLink>
                  </PaginationItem>
              )}
              {page !== 1 && page !== totalPages && (
                  <PaginationItem>
                    <PaginationLink href={createPageUrl(page)} isActive={true}>{page}</PaginationLink>
                  </PaginationItem>
              )}
              {page < totalPages - 1 && (
                 <PaginationItem>
                    <PaginationLink href={createPageUrl(page + 1)} isActive={false}>{page + 1}</PaginationLink>
                  </PaginationItem>
              )}
              {page < totalPages - 2 && (
                 <PaginationItem>
                    <PaginationEllipsis />
                 </PaginationItem>
              )}
              {totalPages > 1 && (
                  <PaginationItem>
                    <PaginationLink href={createPageUrl(totalPages)} isActive={page === totalPages}>{totalPages}</PaginationLink>
                  </PaginationItem>
              )}
              <PaginationItem>
                <PaginationNext
                  href={createPageUrl(Math.min(totalPages, page + 1))}
                  aria-disabled={page === totalPages}
                  className={page === totalPages ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
    </>
  )
}
