
import { Metadata } from 'next';
import { PetitionForm } from "@/components/petition/petition-form";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Şikayet Dilekçesi Asistanı | EKAP.AI",
  description: "Yapay zeka destekli şikayet dilekçesi hazırlama hizmeti. Dakikalar içinde mevzuata uygun dilekçenizi oluşturun.",
  alternates: {
    canonical: 'https://ekap.ai/sikayet-asistani',
  },
};

export default function ComplaintAssistantPage() {
  return (
    <div className="container py-12 md:py-16 px-4 max-w-5xl mx-auto">
      <div className="text-center mb-10 space-y-4">
        <h1 className="text-3xl md:text-5xl font-bold gradient-text pb-2">İdareye Şikayet Başvurusu</h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          AI destekli sistemimizle hukuki standartlara uygun şikayet dilekçenizi saniyeler içinde hazırlayın.
        </p>
        <div className="flex gap-2 justify-center mt-4">
            <Badge variant="outline" className="text-sm py-1 px-3 border-blue-200 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800">
             Yapay Zeka Destekli
            </Badge>
            <Badge variant="outline" className="text-sm py-1 px-3 border-green-200 bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800">
             Anında Teslim
            </Badge>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <PetitionForm
          petitionType="complaint"
          creditCost={50}
          title="Şikayet Dilekçesi Oluştur"
          description="Aşağıdaki formu eksiksiz doldurarak yapay zeka tarafından hazırlanan profesyonel dilekçenizi oluşturabilirsiniz."
          showHeader={true}
        />
      </div>
    </div>
  );
}
