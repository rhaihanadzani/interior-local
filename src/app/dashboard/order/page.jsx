"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PlusIcon,
  FilterIcon,
  CalendarIcon,
  MapPinIcon,
  ClipboardIcon,
} from "lucide-react";
import Link from "next/link";
import { getOrders } from "@/lib/services/orderService";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import DashboardLoading from "@/components/Loader/DashboardLoading";

const statusFilters = [
  { value: "all", label: "Semua" },
  { value: "menunggu", label: "Menunggu" },
  { value: "dikonfirmasi", label: "Dikonfirmasi" },
  { value: "diproses", label: "Diproses" },
  { value: "selesai", label: "Selesai" },
  { value: "ditolak", label: "Ditolak" },
];

const statusColors = {
  menunggu: "bg-yellow-100 text-yellow-800",
  dikonfirmasi: "bg-blue-100 text-blue-800",
  diproses: "bg-purple-100 text-purple-800",
  selesai: "bg-green-100 text-green-800",
  ditolak: "bg-red-100 text-red-800",
};

export default function UserOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getOrders();
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const filteredOrders =
    activeFilter === "all"
      ? orders
      : orders.filter((order) => order.status === activeFilter);

  if (loading) {
    return <DashboardLoading />;
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Pesanan Saya</h1>
          <p className="text-muted-foreground mt-1">
            {filteredOrders.length} pesanan ditemukan
          </p>
        </div>
        <Link href="/dashboard/order/new">
          <Button className="bg-primary hover:bg-primary/90">
            <PlusIcon className="w-4 h-4 mr-2" />
            Pesan Baru
          </Button>
        </Link>
      </div>

      {/* Filter Section */}
      <div className="bg-white dark:bg-gray-900 rounded-lg p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <FilterIcon className="w-5 h-5 text-muted-foreground" />
          <h3 className="font-medium">Filter Status</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {statusFilters.map((filter) => (
            <Button
              key={filter.value}
              variant={activeFilter === filter.value ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter(filter.value)}
              className={cn(
                "rounded-full",
                activeFilter === filter.value &&
                  "bg-primary hover:bg-primary/90"
              )}
            >
              {filter.label}
            </Button>
          ))}
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12 space-y-4">
          <div className="mx-auto w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
            <ClipboardIcon className="w-10 h-10 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">Anda belum memiliki pesanan</p>
          <Link href="/dashboard/order/new">
            <Button className="mt-4 bg-primary hover:bg-primary/90">
              Buat Pesanan Pertama Anda
            </Button>
          </Link>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-12 space-y-4">
          <div className="mx-auto w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
            <FilterIcon className="w-10 h-10 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">
            Tidak ada pesanan dengan status "
            {statusFilters.find((f) => f.value === activeFilter)?.label}"
          </p>
          <Button
            variant="outline"
            onClick={() => setActiveFilter("all")}
            className="mt-4"
          >
            Tampilkan Semua Pesanan
          </Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredOrders.map((order) => (
            <Card
              key={order.id}
              className="hover:shadow-md transition-shadow border-gray-100 dark:border-gray-800"
            >
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start gap-4">
                  <CardTitle className="text-lg">
                    {order.service.name}
                  </CardTitle>
                  <Badge
                    className={cn(
                      "px-3 py-1 rounded-full capitalize",
                      statusColors[order.status] || "bg-gray-100 text-gray-800"
                    )}
                  >
                    {order.status}
                  </Badge>
                </div>
                {order.updates?.length > 0 && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Update terakhir:{" "}
                    {new Date(order.updates[0].createdAt).toLocaleString()}
                  </p>
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPinIcon className="w-4 h-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                    <p className="text-sm">
                      <span className="font-medium">Lokasi:</span>{" "}
                      {order.location}
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <ClipboardIcon className="w-4 h-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                    <p className="text-sm line-clamp-2">
                      <span className="font-medium">Deskripsi:</span>{" "}
                      {order.description}
                    </p>
                  </div>
                  {order.scheduledDate && (
                    <div className="flex items-start gap-3">
                      <CalendarIcon className="w-4 h-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                      <p className="text-sm">
                        <span className="font-medium">Tanggal:</span>{" "}
                        {new Date(order.scheduledDate).toLocaleDateString(
                          "id-ID",
                          {
                            weekday: "long",
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </p>
                    </div>
                  )}
                  {order.offerPrice && (
                    <div className="flex items-start gap-3">
                      <span className="w-4 h-4 mt-0.5 text-muted-foreground flex-shrink-0">
                        Rp
                      </span>
                      <p className="text-sm">
                        <span className="font-medium">Harga:</span>{" "}
                        {new Intl.NumberFormat("id-ID").format(
                          order.offerPrice
                        )}
                      </p>
                    </div>
                  )}
                </div>
                <div className="mt-6 flex justify-end">
                  <Link href={`/dashboard/order/detail/${order.id}`}>
                    <Button
                      variant="outline"
                      className="border-primary text-primary hover:bg-primary/10"
                    >
                      Lihat Detail
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
