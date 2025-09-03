import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function dateFormatted(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function onCopy(text: string) {
  navigator.clipboard.writeText(text);
}

export const formatter = new Intl.NumberFormat("en-BD", {
  style: "currency",
  currency: "BDT",
});

export function formatPrice(value: number): string {
  try {
    return formatter.format(value ?? 0);
  } catch {
    return formatter.format(0);
  }
}
