import React from "react";
import { Badge } from "~/components/ui/badge";
import type { Research } from "iara-shared/database/schema";

interface ResearchStatusBadgeProps {
  status: Research["status"];
}

export const ResearchStatusBadge = ({ status }: ResearchStatusBadgeProps) => {
  const mapping = {
    OPENED: (
      <Badge className="whitespace-nowrap w-fit bg-green-600 text-white">
        Aberta
      </Badge>
    ),
    ANALYSIS: (
      <Badge className="whitespace-nowrap w-fit bg-yellow-500 text-white">
        Em Analise
      </Badge>
    ),
    CREATED: (
      <Badge className="whitespace-nowrap w-fit bg-yellow-600 text-black">
        Em Andamento
      </Badge>
    ),
    FINISHED: (
      <Badge className="whitespace-nowrap w-fit bg-sky-800 text-white">
        Encerrada
      </Badge>
    ),
    PROCESSING: (
      <Badge className="whitespace-nowrap w-fit bg-orange-500 text-black">
        Processando
      </Badge>
    ),
  };

  return mapping[status] || null;
};
