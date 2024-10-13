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
