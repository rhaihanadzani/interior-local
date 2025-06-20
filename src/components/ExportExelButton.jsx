"use client";

import { useState } from "react";
import { toast } from "sonner";
import { FileSpreadsheet } from "lucide-react";

export default function ExportExcelButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleExport = async () => {
    setIsLoading(true);
    toast.info("Sedang mempersiapkan Excel...");
    try {
      const response = await fetch("/api/exports/exel");
      if (!response.ok) throw new Error("Export failed");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `daftar-pesanan-${new Date()
        .toISOString()
        .slice(0, 10)}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();

      toast.success("File Excel berhasil diunduh!");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Gagal mengekspor ke Excel");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={isLoading}
      className={`
        px-4 py-2 bg-green-600 text-white rounded-lg 
        hover:bg-green-700 disabled:bg-green-400
        transition-all duration-300 ease-in-out
        shadow-md hover:shadow-lg
        flex items-center justify-center gap-2
        transform hover:-translate-y-0.5
        border border-green-700
      `}
    >
      <FileSpreadsheet className="w-5 h-5" />
      {isLoading ? "Membuat Excel..." : "Export ke Excel"}
    </button>
  );
}
