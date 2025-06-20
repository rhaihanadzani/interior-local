import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import * as XLSX from "xlsx";

const prisma = new PrismaClient();

// Fungsi untuk format tanggal Indonesia
function formatIndonesianDateTime(date) {
  if (!date) return "-";

  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Jakarta",
  };

  return new Date(date).toLocaleDateString("id-ID", options) + " WIB";
}

export async function GET() {
  try {
    // Fetch orders with related user and service data
    const orders = await prisma.order.findMany({
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

    // Transform data for Excel
    const data = orders.map((order) => ({
      "ID Pesanan": order.id,
      "Nama Pelanggan": order.user.name,
      "Email Pelanggan": order.user.email,
      "Telepon Pelanggan": order.user.phone,
      Layanan: order.service.name,
      "Harga Dasar": order.service.basePrice?.toString(),
      Lokasi: order.location,
      Deskripsi: order.description,
      Status: formatStatus(order.status),
      "Dibuat Pada": formatIndonesianDateTime(order.createdAt),
    }));

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data);

    // Set column widths (opsional)
    ws["!cols"] = [
      { wch: 20 },
      { wch: 20 },
      { wch: 25 },
      { wch: 15 },
      { wch: 20 },
      { wch: 15 },
      { wch: 15 },
      { wch: 30 },
      { wch: 40 },
      { wch: 15 },
      { wch: 30 },
      { wch: 30 },
    ];

    XLSX.utils.book_append_sheet(wb, ws, "Daftar Pesanan");

    // Generate buffer
    const buffer = XLSX.write(wb, { bookType: "xlsx", type: "buffer" });

    // Create response
    const response = new NextResponse(buffer);
    response.headers.set(
      "Content-Disposition",
      'attachment; filename="daftar_pesanan.xlsx"'
    );
    response.headers.set(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    return response;
  } catch (error) {
    console.error("Export error:", error);
    return NextResponse.json(
      { error: "Gagal mengekspor data pesanan" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// Fungsi untuk translate status ke Bahasa Indonesia
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
