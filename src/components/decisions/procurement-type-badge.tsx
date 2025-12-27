
import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ProcurementTypeBadgeProps {
  kararNo: string;
  showFullDescription?: boolean;
  size?: 'sm' | 'md';
}

const ProcurementTypeBadge: React.FC<ProcurementTypeBadgeProps> = ({
  kararNo,
  showFullDescription = false,
  size = 'sm'
}) => {
  // Karar numarasından ihale türünü belirle
  const getProcurementType = (kararNo: string) => {
    if (!kararNo) return null;

    // 2022/UY, 2023/UM, 2024/UD gibi formatlardan ihale türünü çıkar
    const match = kararNo.match(/\/U([YMHD])/);
    if (!match) return null;

    const typeCode = match[1];

    switch (typeCode) {
      case 'Y':
        return {
          displayText: 'Yapım',
          description: 'Yapım İşleri',
          color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-700'
        };
      case 'M':
        return {
          displayText: 'Mal',
          description: 'Mal Alımı',
          color: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-700'
        };
      case 'H':
        return {
          displayText: 'Hizmet',
          description: 'Hizmet Alımı',
          color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 border-orange-200 dark:border-orange-700'
        };
      case 'D':
        return {
          displayText: 'Danışmanlık',
          description: 'Danışmanlık Hizmetleri',
          color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-700'
        };
      default:
        return null;
    }
  };

  const procurementType = getProcurementType(kararNo);

  if (!procurementType) {
    return null;
  }

  const badgeContent = showFullDescription
    ? procurementType.description
    : procurementType.displayText;

  const badgeSize = size === 'sm' ? 'text-xs' : 'text-sm';

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${procurementType.color} ${badgeSize} cursor-help`}>
            {badgeContent}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{procurementType.description}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ProcurementTypeBadge;
