"use client";

import { useState } from "react";
import { toast } from "sonner";
import { FileText } from "lucide-react";

export default function PdfExportButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleExportPdf = async () => {
    setIsLoading(true);
    toast.info("Sedang mempersiapkan PDF...");
    try {
      const response = await fetch("/api/exports/pdf");

      if (!response.ok) {
        throw new Error("Gagal mengunduh PDF");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `daftar-pesanan-${new Date()
        .toISOString()
        .slice(0, 10)}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();

      toast.success("PDF berhasil diunduh!");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Gagal mengekspor ke PDF");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleExportPdf}
      disabled={isLoading}
      className={`
        px-4 py-2 bg-red-600 text-white rounded-lg 
        hover:bg-red-700 disabled:bg-red-400 ml-2
        transition-all duration-300 ease-in-out
        shadow-md hover:shadow-lg
        flex items-center justify-center gap-2
        transform hover:-translate-y-0.5
        border border-red-700
      `}
    >
      <FileText className="w-5 h-5" />
      {isLoading ? "Membuat PDF..." : "Export ke PDF"}
    </button>
  );
}
