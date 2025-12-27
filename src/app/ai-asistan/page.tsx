
import { Metadata } from 'next';
import { ChatInterface } from './chat-interface';

export const metadata: Metadata = {
  title: "AI Asistan | EKAP - Yapay Zeka Destekli İhale Danışmanı",
  description: "EKAP AI Asistan ile kamu ihaleleri hakkında sorularınızı sorun, anında yanıt alın. 7/24 yapay zeka destekli danışmanlık hizmeti.",
  alternates: {
    canonical: 'https://ekap.ai/ai-asistan',
  },
};

export default function ChatAssistantPage() {
  return (
    <div className="container py-8 md:py-12 px-4 max-w-5xl mx-auto">
       <div className="text-center mb-8 md:mb-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 gradient-text pb-2">EKAP.AI Asistan</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Kamu ihaleleri konusunda yapay zeka destekli danışmanlık hizmeti. Sorularınızı sorun, mevzuat ve kararlar hakkında bilgi alın.
        </p>
      </div>

      <ChatInterface />
    </div>
  );
}
