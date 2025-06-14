"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
import { Progress } from "@/components/ui/progress";
import { formatCurrency, formatDate } from "@/lib/utils";
import { getAllOrdersAdminById } from "@/lib/services/orderService";
import { TestimonialForm } from "./TestimonialForm";
import { Star } from "lucide-react";
import DashboardLoading from "@/components/Loader/DashboardLoading";

const statusColors = {
  menunggu: "bg-yellow-100 text-yellow-800",
  dikonfirmasi: "bg-blue-100 text-blue-800",
  diproses: "bg-purple-100 text-purple-800",
  selesai: "bg-green-100 text-green-800",
  ditolak: "bg-red-100 text-red-800",
};

const statusSteps = [
  { id: "menunggu", name: "Menunggu Konfirmasi" },
  { id: "dikonfirmasi", name: "Dikonfirmasi" },
  { id: "diproses", name: "Dalam Pengerjaan" },
  { id: "selesai", name: "Selesai" },
];

const getStatusProgress = (status) => {
  const currentIndex = statusSteps.findIndex((step) => step.id === status);
  return ((currentIndex + 1) / statusSteps.length) * 100;
};

export default function UserOrderDetailPage({ params }) {
  const paramsId = params.id;
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [orderData, setOrderData] = useState({
    user: {},
    service: {},
    updates: [],
  });

  useEffect(() => {
    const fetchOrdersId = async () => {
      try {
        const data = await getAllOrdersAdminById(paramsId);
        setOrderData(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrdersId();
  }, [paramsId]);

  const currentStatusIndex = statusSteps.findIndex(
    (step) => step.id === orderData.status
  );

  const handleTestimonialSubmitted = (testimonialData) => {
    setOrderData((prev) => ({
      ...prev,
      testimonial: testimonialData?.testimonial,
    }));

    // console.log("Testimonial submitted:", testimonialData);
  };

  // console.log("orderData", orderData);

  if (loading) {
    return <DashboardLoading />;
  }

  return (
    <div className="container mx-auto py-8 space-y-8 animate-fadeIn">
      {/* Header dengan tombol kembali */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => router.push("/dashboard/order")}
          className="flex items-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m12 19-7-7 7-7" />
            <path d="M19 12H5" />
          </svg>
          Kembali ke Daftar Pesanan
        </Button>
        <Badge className={`${statusColors[orderData.status]} capitalize`}>
          {orderData.status}
        </Badge>
      </div>

      {/* Konten utama */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Kolom kiri - Informasi pesanan */}
        <div className="lg:col-span-2 space-y-6">
          {/* Progress Tracking */}
          <Card className="hover-scale transition-all duration-300">
            <CardHeader>
              <CardTitle>Progress Pesanan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Progress
                  value={getStatusProgress(orderData.status)}
                  className="h-2 bg-secondary"
                />
                <div className="grid grid-cols-4 gap-4">
                  {statusSteps.map((step, index) => (
                    <div
                      key={step.id}
                      className={`flex flex-col items-center text-center ${
                        index <= currentStatusIndex
                          ? "text-primary"
                          : "text-muted-foreground"
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 
                        ${
                          index <= currentStatusIndex
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary"
                        }`}
                      >
                        {index + 1}
                      </div>
                      <span className="text-sm font-medium">{step.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informasi Pesanan */}
          <Card className="hover-scale transition-all duration-300">
            <CardHeader>
              <CardTitle>Detail Pesanan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-md overflow-hidden">
                  <img
                    src={orderData.service.imageUrl}
                    alt={orderData.service.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-semibold">{orderData.service.name}</h3>
                  <p className="text-muted-foreground text-sm">
                    {formatCurrency(
                      orderData.offerPrice || orderData.service.basePrice
                    )}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Detail Pemesanan</h4>
                  <div className="text-sm">
                    <p className="text-muted-foreground">Tanggal Pesan</p>
                    <p>{formatDate(orderData.createdAt)}</p>
                  </div>
                  <div className="text-sm">
                    <p className="text-muted-foreground">Jadwal Pelaksanaan</p>
                    <p>{formatDate(orderData.scheduledDate)}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Lokasi</h4>
                  <p className="text-sm">{orderData.location}</p>
                  <Button variant="outline" size="sm" className="mt-2">
                    Lihat di Peta
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Deskripsi Pekerjaan</h4>
                <p className="text-sm">{orderData.description}</p>
              </div>
            </CardContent>
          </Card>

          {/* Riwayat Update */}
          <Card className="hover-scale transition-all duration-300">
            <CardHeader>
              <CardTitle>Riwayat Update</CardTitle>
              <CardDescription>
                Perkembangan terbaru dari pesanan ini
              </CardDescription>
            </CardHeader>
            <CardContent>
              {orderData.updates && orderData.updates.length > 0 ? (
                <div className="space-y-6">
                  {orderData.updates.map((update, index) => (
                    <div
                      key={update.id}
                      className={`flex gap-4 relative pb-6 ${
                        index !== orderData.updates.length - 1 ? "border-b" : ""
                      }`}
                    >
                      <div className="flex-shrink-0">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={orderData.user.profileImage?.url} />
                          <AvatarFallback>
                            {orderData.user.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">Admin</h4>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(update.createdAt)}
                          </span>
                        </div>
                        <p>{update.note}</p>
                        {update.images && update.images.length > 0 && (
                          <div className="grid grid-cols-2 gap-2 mt-2">
                            {update.images.map((image) => (
                              <div
                                key={image.id}
                                className="rounded-md overflow-hidden aspect-square"
                              >
                                <img
                                  src={image.url}
                                  alt={image.description || "Update image"}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Belum ada update order</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Kolom kanan - Update status */}
        <div className="space-y-6">
          {/* Informasi Pelanggan */}
          <Card className="hover-scale transition-all duration-300">
            <CardHeader>
              <CardTitle>Informasi Pelanggan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={orderData.user.profileImage?.url} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                    {orderData.user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{orderData.user.name}</h3>
                  <p className="text-muted-foreground text-sm">
                    {orderData.user.email}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {orderData.user.phone}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Testimonial */}
          {orderData.status === "selesai" ? (
            orderData.testimonial ? (
              // Jika status selesai DAN ada testimonial, tampilkan rating
              <Card className="hover-scale transition-all duration-300">
                <CardHeader>
                  <CardTitle>Ulasan Anda</CardTitle>
                  <CardDescription>
                    Terima kasih telah memberikan ulasan
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < orderData.testimonial.rating
                            ? "fill-primary text-primary"
                            : "text-muted-foreground"
                        }`}
                      />
                    ))}
                    <span className="ml-2 text-sm text-muted-foreground">
                      ({orderData.testimonial.rating}/5)
                    </span>
                  </div>
                  {orderData.testimonial.comment && (
                    <p className="mt-2 text-sm">
                      "{orderData.testimonial.comment}"
                    </p>
                  )}
                  {/* <UpdateTestimonial
                    testimonial={orderData.testimonial}
                    onTestimonialUpdated={(updatedTestimonial) => {
                      console.log("Updated testimonial:", updatedTestimonial);
                      setOrderData((prev) => ({
                        ...prev,
                        testimonial: updatedTestimonial,
                      }));
                    }}
                  /> */}
                </CardContent>
              </Card>
            ) : (
              // Jika status selesai TAPI TIDAK ada testimonial, tampilkan form
              <Card className="hover-scale transition-all duration-300">
                <CardHeader>
                  <CardTitle>Beri Ulasan Untuk Pemesanan Ini</CardTitle>
                  <CardDescription>
                    Berikan ulasan untuk pemesanan ini
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <TestimonialForm
                    orderId={orderData.id}
                    onTestimonialSubmitted={handleTestimonialSubmitted}
                  />
                </CardContent>
              </Card>
            )
          ) : null}
        </div>
      </div>
    </div>
  );
}
