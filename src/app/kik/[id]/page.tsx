
import { redirect } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function KikRedirectPage({ params }: PageProps) {
  const { id } = await params;
  // Redirect /kik/1234 -> /p/1234
  // The /p/[id] page already handles lookup by public_product_no (numeric ID)
  redirect(`/p/${id}`);
}
