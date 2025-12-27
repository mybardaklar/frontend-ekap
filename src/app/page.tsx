import { Suspense } from "react"
import { redirect } from "next/navigation"
import { Loader2 } from "lucide-react"
import SearchAndFilters from "@/components/decisions/search-and-filters"
import DecisionList from "@/components/decisions/decision-list"
import { DecisionListSkeleton } from "@/components/decisions/decision-skeleton"

export const dynamic = 'force-dynamic'

import { Metadata } from 'next';

interface HomeProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata({ searchParams }: HomeProps): Promise<Metadata> {
  const resolvedSearchParams = await searchParams
  const search = (resolvedSearchParams.search || '') as string
  const category = (resolvedSearchParams.category || 'all') as string
  const hasCourtDecision = resolvedSearchParams.court_decision === 'true'

  let title = 'KİK Kararları'

  if (category !== 'all') {
    title = `${category} - ${title}`
  }

  if (search) {
    title = `"${search}" Arama Sonuçları - ${title}`
  }

  if (hasCourtDecision) {
    title = `Mahkeme Kararları - ${title}`
  }

  return {
    title: title,
    description: 'Kamu İhale Kurulu kararları, emsal kararlar ve ihale zekası rehberi.',
  }
}

export default async function Home({ searchParams }: HomeProps) {
  const resolvedSearchParams = await searchParams

  // Legacy / Share Link Support
  // Redirect /?product=UUID -> /p/UUID
  if (resolvedSearchParams.product) {
      redirect(`/p/${resolvedSearchParams.product}`);
  }

  const page = Number(resolvedSearchParams.page) || 1
  const pageSize = 12

  // We explicitly want to remount the Suspense boundary when search params change.
  // Next.js handles this automatically for page params, but adding a key can ensure
  // the skeleton shows up during transitions.
  // The key should be a combination of all filter params.
  const suspenseKey = JSON.stringify(resolvedSearchParams);

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-zinc-900">
      <main className="container mx-auto py-10 px-4">

        {/* Header Section */}
        <div className="flex flex-col gap-4 mb-4 text-center">
           <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100 font-serif">
             KİK Kararları
           </h1>
           <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
             Kamu İhale Kurulu kararları, emsal kararlar ve ihale zekası rehberi.
           </p>
        </div>

        {/* Search & Filters */}
        <Suspense fallback={<div className="h-32 flex items-center justify-center"><Loader2 className="animate-spin" /></div>}>
           <SearchAndFilters />
        </Suspense>

        {/* Decisions List with Skeleton */}
        <Suspense key={suspenseKey} fallback={<DecisionListSkeleton />}>
            <DecisionList searchParams={resolvedSearchParams} page={page} pageSize={pageSize} />
        </Suspense>

      </main>
    </div>
  )
}
