import { EyeIcon, ClipboardListIcon, UserCheck } from "lucide-react"

export interface ResearchInteractionsCountProps {
  totalViews: number
  formsLength: number
}

export const conversionRate = (formsLength: number, totalViews: number): number => {
  if (formsLength == 0 && totalViews == 0) {
    return 0
  }
  
  if (formsLength > totalViews) {
    return 100
  }

  
  return Math.round(Math.min(100, formsLength * 100 / totalViews))
}

export default function ResearchInteractionsCount ({ totalViews, formsLength }: ResearchInteractionsCountProps) {
  return (
    <span className="flex items-center gap-3">
      <span
        className="flex items-center gap-1"
        title="Número de visualizações únicas desta pesquisa"
      >
        <EyeIcon className="size-4" />
        {totalViews}
      </span>
      <span
        className="flex items-center gap-1"
        title="Número de respostas recebidas"
      >
        <ClipboardListIcon className="size-4" />
        {formsLength}
      </span>
      <span
        className="flex items-center gap-1"
        title="Porcentagem de Conversão"
      >
        <UserCheck className="size-4" />
        {`(${conversionRate(formsLength, totalViews)}%)`}
      </span>
    </span>
  );
};
