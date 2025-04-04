import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatters = {
  date: (date: Date | number) => {
    const intl = new Intl.DateTimeFormat("pt-BR");
    return intl.format(date);
  },
};


export const relativeTime = (date: number | Date) => {
  const now = new Date();
  const diff = Math.abs(now.getTime() - new Date(date).getTime());
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 60) return `${minutes} minutos atrás`;
  if (hours < 24) return `${hours} horas atrás`;
  return `${days} dias atrás`;
};
