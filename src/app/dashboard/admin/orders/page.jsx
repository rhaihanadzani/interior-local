"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAllOrdersAdmin } from "@/lib/services/orderService";
import { useRouter } from "next/navigation";
import DashboardLoading from "@/components/Loader/DashboardLoading";
import ExportExelButton from "@/components/ExportExelButton";
import ExportPdfButton from "@/components/ExportPdfButton";

const statusColors = {
  menunggu: "bg-yellow-100 text-yellow-800",
  dikonfirmasi: "bg-blue-100 text-blue-800",
  diproses: "bg-purple-100 text-purple-800",
  selesai: "bg-green-100 text-green-800",
  ditolak: "bg-red-100 text-red-800",
};

const statusOptions = [
  { value: "all", label: "Semua Status" },
  { value: "menunggu", label: "Menunggu" },
  { value: "dikonfirmasi", label: "Dikonfirmasi" },
  { value: "diproses", label: "Diproses" },
  { value: "selesai", label: "Selesai" },
  { value: "ditolak", label: "Ditolak" },
];

const formatDate = (dateString) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const formatCurrency = (amount) => {
  if (!amount) return "Negosiasi";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const ordersPerPage = 4;

  const router = useRouter();

  // Fetch orders from API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getAllOrdersAdmin();
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // Filter orders based on status and search query
  const filteredOrders = orders.filter((order) => {
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;
    const matchesSearch =
      order.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const currentOrders = filteredOrders.slice(
    (currentPage - 1) * ordersPerPage,
    currentPage * ordersPerPage
  );

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, searchQuery]);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  if (loading) {
    return <DashboardLoading />;
  }

  return (
    <div className="container mx-auto py-8 space-y-6 animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Manajemen Pesanan
          </h1>
          <p className="text-muted-foreground">
            Kelola semua pesanan dari pelanggan
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {filteredOrders.length} pesanan ditemukan
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <ExportExelButton />
        <ExportPdfButton />
      </div>

      {/* Filter Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <Input
            placeholder="Cari pesanan (nama, layanan, lokasi)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filter status" />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {currentOrders.length > 0 ? (
          currentOrders.map((order) => (
            <Card
              key={order.id}
              className="hover-scale transition-all duration-300 group overflow-hidden relative"
            >
              {/* Glass effect overlay on hover */}

              <div className="absolute inset-0 bg-gradient-to-br from-[#0b1d51]/5 to-[#4da8da]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              <CardHeader className="flex flex-row items-start justify-between gap-4 pb-3">
                <div className="space-y-1">
                  <CardTitle className="flex items-center gap-2">
                    <Avatar className="w-8 h-8">
                      {order.user.profileImage ? (
                        <AvatarImage src={order.user.profileImage.url} />
                      ) : (
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {order.user.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <span>{order.user.name}</span>
                  </CardTitle>
                  <CardDescription>{order.user.email}</CardDescription>
                </div>
                <Badge className={`${statusColors[order.status]} capitalize`}>
                  {order.status}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <h3 className="font-semibold">{order.service.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {formatCurrency(
                        order.offerPrice || order.service.basePrice
                      )}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {formatDate(order.scheduledDate)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-sm line-clamp-1">
                    <span className="text-muted-foreground">Lokasi:</span>{" "}
                    {order.location}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-background/50 backdrop-blur-sm"
                    onClick={() => {
                      // Navigate to order detail

                      router.push(`/dashboard/admin/orders/detail/${order.id}`);
                    }}
                  >
                    Lihat Detail
                  </Button>
                </div>

                {order.status === "ditolak" && (
                  <div className="text-sm text-red-500">
                    <span className="font-medium">Alasan:</span>{" "}
                    {order.updates?.[0]?.note || "Tidak disebutkan"}
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full py-12 text-center">
            <p className="text-muted-foreground">
              Tidak ada pesanan yang ditemukan
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {filteredOrders.length > 0 && (
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-muted-foreground">
            Menampilkan {(currentPage - 1) * ordersPerPage + 1} -{" "}
            {Math.min(currentPage * ordersPerPage, filteredOrders.length)} dari{" "}
            {filteredOrders.length} pesanan
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevPage}
              disabled={currentPage === 1}
            >
              Sebelumnya
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <Button
                    key={page}
                    variant={page === currentPage ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                )
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              Berikutnya
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
