import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { PurchasesList } from "../purchases-list";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Satın Aldıklarım - EKAP',
  description: 'Satın aldığınız tüm kararları burada görüntüleyebilirsiniz.',
};

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function MyDecisionsPage({ searchParams }: PageProps) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/?modal=sign_in');
  }

  // Pagination Params
  const resolvedSearchParams = await searchParams;
  const page = Number(resolvedSearchParams.page) || 1;
  const pageSize = 10;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  // Fetch Purchases with Pagination
  const { data: purchaseRecords, count } = await supabase
    .from('user_purchases')
    .select('product_id', { count: 'exact' })
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .range(from, to);

  const productIds = purchaseRecords?.map(p => p.product_id) || [];
  const totalPurchases = count || 0;
  const totalPages = Math.ceil(totalPurchases / pageSize);

  // 2. Get Products details
  let purchases: any[] = [];
  if (productIds.length > 0) {
      const { data: products } = await supabase
        .from('urun_bilgileri')
        .select('*')
        .in('id', productIds);

      // Preserve order from purchaseRecords
      if (products) {
          purchases = productIds.map(id => products.find(p => p.id === id)).filter(Boolean);
      }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 py-12 px-4">
      <div className="container mx-auto max-w-5xl">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Satın Alınan Kararlar</h1>
        <PurchasesList
          purchases={purchases}
          currentPage={page}
          totalPages={totalPages}
        />
      </div>
    </div>
  );
}
