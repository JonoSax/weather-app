import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function degToCompass(num) {
  var val = Math.floor(num / 45 + 0.5);
  var arr = [
    "Northerly",
    "North Easterly",
    "Easterly",
    "South Easterly",
    "Southerly",
    "South Westerly",
    "Westerly",
    "North Westerly",
  ];
  return arr[val % 8];
}
