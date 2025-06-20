import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

// Solusi yang berhasil: Import dengan cara khusus untuk Next.js
const { jsPDF } = require("jspdf");
// Tambahkan ini untuk mengaktifkan plugin autoTable
require("jspdf-autotable");

const prisma = new PrismaClient();

// Fungsi format tanggal Indonesia
function formatIndonesianDateTime(date) {
  if (!date) return "-";
  return (
    new Date(date).toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Jakarta",
    }) + " WIB"
  );
}

// Fungsi translate status
function formatStatus(status) {
  const statusMap = {
    menunggu: "Menunggu",
    dikonfirmasi: "Dikonfirmasi",
    diproses: "Diproses",
    selesai: "Selesai",
    ditolak: "Ditolak",
  };
  return statusMap[status] || status;
}

export async function GET(request) {
  try {
    // Dapatkan query parameters untuk filter (opsional)
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    // Build where clause untuk filter
    const where = {};
    if (status) where.status = status;
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) where.createdAt.lte = new Date(endDate);
    }

    // Ambil data dari database
    const orders = await prisma.order.findMany({
      where,
      include: {
        user: {
          select: {
            name: true,
            email: true,
            phone: true,
          },
        },
        service: {
          select: {
            name: true,
            basePrice: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Buat dokumen PDF
    const doc = new jsPDF({
      orientation: "landscape",
    });

    // Judul laporan
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("LAPORAN DAFTAR PESANAN", 14, 20);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Dibuat pada: ${new Date().toLocaleDateString("id-ID")}`, 14, 27);

    // Header tabel
    const headers = [
      [
        "ID Pesanan",
        "Nama Pelanggan",
        "Layanan",
        "Harga",
        "Status",
        "Lokasi",
        "Tanggal Pesan",
        "Tanggal Jadwal",
      ],
    ];

    // Data tabel
    const data = orders.map((order) => [
      order.id.substring(0, 8) + "...",
      order.user.name,
      order.service.name,
      order.offerPrice ? `Rp${order.offerPrice.toLocaleString("id-ID")}` : "-",
      formatStatus(order.status),
      order.location,
      formatIndonesianDateTime(order.createdAt),
      order.scheduledDate ? formatIndonesianDateTime(order.scheduledDate) : "-",
    ]);

    // Generate tabel - pastikan autoTable tersedia
    if (typeof doc.autoTable !== "function") {
      throw new Error("AutoTable plugin tidak terinisialisasi dengan benar");
    }

    doc.autoTable({
      head: headers,
      body: data,
      startY: 30,
      styles: {
        fontSize: 8,
        cellPadding: 2,
        halign: "left",
        font: "helvetica",
      },
      headStyles: {
        fillColor: [22, 160, 133],
        textColor: 255,
        fontStyle: "bold",
        fontSize: 9,
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
      columnStyles: {
        0: { cellWidth: 20 },
        1: { cellWidth: 25 },
        2: { cellWidth: 30 },
        3: { cellWidth: 20 },
        4: { cellWidth: 20 },
        5: { cellWidth: 25 },
        6: { cellWidth: 35 },
        7: { cellWidth: 35 },
      },
      margin: { top: 30 },
    });

    // Footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.text(
        `Halaman ${i} dari ${pageCount}`,
        doc.internal.pageSize.width - 40,
        doc.internal.pageSize.height - 10
      );
    }

    // Generate PDF sebagai buffer
    const pdfBuffer = Buffer.from(doc.output("arraybuffer"));

    // Return response
    const response = new NextResponse(pdfBuffer);
    response.headers.set(
      "Content-Disposition",
      'attachment; filename="daftar-pesanan.pdf"'
    );
    response.headers.set("Content-Type", "application/pdf");

    return response;
  } catch (error) {
    console.error("PDF export error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Gagal mengekspor data ke PDF",
        details: error.message,
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
