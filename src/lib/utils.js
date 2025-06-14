import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export async function convertBlobUrlToFile(blobUrl) {
  const response = await fetch(blobUrl);
  const blob = await response.blob();
  const fileName = Math.random().toString(36).slice(2, 9);
  const mimeType = blob.type || "application/octet-stream";
  const file = new File([blob], `${fileName}.${mimeType.split("/")[1]}`, {
    type: mimeType,
  });
  return file;
}

export const formatDate = (date) => {
  // Handle case ketika date undefined/null
  if (!date) return "-";

  // Handle string date (dari database)
  const dateObj = typeof date === "string" ? new Date(date) : date;

  // Handle invalid date
  if (isNaN(dateObj.getTime())) return "-";

  return dateObj.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export const formatCurrency = (amount) => {
  // Handle undefined/null
  if (amount === null || amount === undefined) return "Rp0";

  // Handle Prisma Decimal type (object)
  let numericAmount;
  if (typeof amount === "object" && amount !== null) {
    numericAmount = parseFloat(amount.toString());
  } else {
    numericAmount = Number(amount);
  }

  // Handle NaN (Not a Number)
  if (isNaN(numericAmount)) return "Rp0";

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numericAmount);
};
