"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import type { Research } from "iara-shared/database/schema";
// Import all possible icons used
import { List, PencilRuler, MailOpen, Search, Cog, CheckCircle, type LucideIcon } from "lucide-react";

// Map icon names to actual components
const iconMap: Record<string, LucideIcon> = {
  List,
  PencilRuler,
  MailOpen,
  Search,
  Cog,
  CheckCircle,
};

type StatusDetail = {
  value: Research["status"] | undefined;
  label: string;
  iconName: keyof typeof iconMap; // Use icon name (string key)
};

interface StatusFilterSelectProps {
  currentStatus: Research["status"] | undefined;
  statuses: Readonly<StatusDetail[]>; // Accept iconName
}

export function StatusFilterSelect({ currentStatus, statuses }: StatusFilterSelectProps) {
  const router = useRouter();

  const handleValueChange = (value: string) => {
    const newStatus = value === "all" ? undefined : value;
    const href = newStatus ? `/dashboard?status=${newStatus}` : "/dashboard";
    router.push(href);
  };

  const currentLabel = statuses.find(s => s.value === currentStatus)?.label ?? "Todas";

  return (
    <Select
      onValueChange={handleValueChange}
      defaultValue={currentStatus ?? "all"}
    >
      <SelectTrigger className="w-full">
         <SelectValue placeholder="Filtrar por status...">
            {currentLabel}
         </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {statuses.map(({ value, label, iconName }) => {
          const Icon = iconMap[iconName]; // Get the component from the map
          return (
            <SelectItem key={value ?? "all"} value={value ?? "all"}>
              <span className="flex items-center gap-2">
                {Icon && <Icon className="h-4 w-4 text-muted-foreground" />} {/* Render the icon */}
                {label}
              </span>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
