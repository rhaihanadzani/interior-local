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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  getAllOrdersAdminById,
  updateOrderProses,
} from "@/lib/services/orderService";
import DashboardLoading from "@/components/Loader/DashboardLoading";
import { toast } from "sonner";

const statusOptions = [
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

export default function AdminOrderDetailPage({ params }) {
  const paramsId = params.id;
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const [orderData, setOrderData] = useState({
    user: {},
    service: {},
    updates: [],
  });
  const [newStatus, setNewStatus] = useState(orderData.status);
  const [updateNote, setUpdateNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);

  useEffect(() => {
    const fetchOrdersId = async () => {
      try {
        console.log("paramsId", paramsId);
        const data = await getAllOrdersAdminById(paramsId);
        setOrderData(data);
        setNewStatus(data.status);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrdersId();
  }, [paramsId]);

  // Cleanup blob URLs when component unmounts
  useEffect(() => {
    return () => {
      selectedImages.forEach((image) => {
        URL.revokeObjectURL(image.url);
      });
    };
  }, [selectedImages]);

  const currentStatusIndex = statusSteps.findIndex(
    (step) => step.id === orderData.status
  );

  const handleStatusUpdate = async (e) => {
    e.preventDefault();

    const toastId = toast.loading("Mohon Tunggu...");

    // Validasi
    if (!newStatus) {
      toast.error("Harap pilih status terlebih dahulu", {
        id: toastId,
      });
      return;
    }

    if (!updateNote.trim()) {
      toast.error("Catatan tidak boleh kosong", {
        id: toastId,
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("status", newStatus);
      formData.append("note", updateNote);

      // Tambahkan file gambar ke FormData
      selectedImages.forEach((image) => {
        if (image.file) {
          formData.append("images", image.file, image.name);
        }
      });

      // console.log("selectedImages", selectedImages);

      const result = await updateOrderProses(paramsId, formData);

      // Update state dengan data terbaru
      setOrderData((prev) => ({
        ...prev,
        status: newStatus,
        updates: [...prev.updates, result.update],
      }));

      // Reset form dan bersihkan blob URLs
      selectedImages.forEach((image) => {
        URL.revokeObjectURL(image.url);
      });
      setUpdateNote("");
      setSelectedImages([]);

      toast.success("Status pesanan berhasil diperbarui", {
        id: toastId,
      });
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Gagal memperbarui status pesanan", {
        id: toastId,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);

    // Validasi file (opsional)
    const validFiles = files.filter((file) => {
      const isValidType = file.type.startsWith("image/");
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB
      return isValidType && isValidSize;
    });

    const imagePreviews = validFiles.map((file) => ({
      id: URL.createObjectURL(file), // untuk preview
      url: URL.createObjectURL(file), // untuk preview
      name: file.name,
      file: file, // simpan File object asli
    }));

    setSelectedImages((prev) => [...prev, ...imagePreviews]);
  };

  const removeImage = (id) => {
    // Bersihkan blob URL sebelum menghapus dari state
    const imageToRemove = selectedImages.find((img) => img.id === id);
    if (imageToRemove) {
      URL.revokeObjectURL(imageToRemove.url);
    }
    setSelectedImages((prev) => prev.filter((img) => img.id !== id));
  };

  if (loading) {
    return <DashboardLoading />;
  }

  return (
    <div className="container mx-auto py-8 space-y-8 animate-fadeIn">
      {/* Header dengan tombol kembali */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => router.push("/dashboard/admin/orders")}
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

          {/* Update Status */}
          <Card className="hover-scale transition-all duration-300">
            <CardHeader>
              <CardTitle>Update Status Pesanan</CardTitle>
              <CardDescription>
                Perbarui status dan tambahkan catatan perkembangan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleStatusUpdate} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none">
                    Status
                  </label>
                  <Select value={newStatus} onValueChange={setNewStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih status" />
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

                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none">
                    Catatan Update
                  </label>
                  <Textarea
                    value={updateNote}
                    onChange={(e) => setUpdateNote(e.target.value)}
                    placeholder="Tambahkan catatan perkembangan..."
                    rows={4}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none">
                    Upload Gambar
                  </label>
                  <div className="flex items-center gap-2">
                    <label className="flex-1">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <div className="flex items-center justify-center w-full h-24 border-2 border-dashed rounded-md cursor-pointer hover:bg-secondary/50 transition-colors">
                        <span className="text-sm text-muted-foreground">
                          Klik untuk upload gambar
                        </span>
                      </div>
                    </label>
                  </div>

                  {/* Preview gambar yang dipilih */}
                  {selectedImages.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {selectedImages.map((image) => (
                        <div key={image.id} className="relative group">
                          <img
                            src={image.url}
                            alt={image.name}
                            className="w-full h-20 object-cover rounded-md"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(image.id)}
                            className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Memproses...
                    </span>
                  ) : (
                    "Simpan Perubahan"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Tombol Aksi */}
          <div className="space-y-2">
            <Button variant="outline" className="w-full">
              Hubungi Pelanggan
            </Button>
            <Button variant="outline" className="w-full">
              Ubah Jadwal
            </Button>
            {orderData.status === "selesai" && !orderData.testimonial && (
              <Button variant="outline" className="w-full">
                Minta Testimoni
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
