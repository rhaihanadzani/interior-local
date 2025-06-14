"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createOrder } from "@/lib/services/orderService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, MapPin, ClipboardList, Clock, Home } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

export default function OrderForm({ services }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [date, setDate] = useState(null);

  const [formData, setFormData] = useState({
    serviceId: "",
    location: "",
    description: "",
    scheduledDate: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    const toastId = toast.loading("Membuat pesanan...");
    e.preventDefault();
    setIsSubmitting(true);

    console.log("formData", formData);
    console.log("formData", date);

    if (
      !formData.serviceId ||
      !formData.location ||
      !formData.description ||
      !date
    ) {
      toast.error("Harap isi semua field yang diperlukan.", { id: toastId });

      setIsSubmitting(false);
      return;
    }

    try {
      const orderData = {
        ...formData,
        scheduledDate: date ? date.toISOString() : null,
      };

      const newOrder = await createOrder(orderData);

      toast.success("Pesanan berhasil dibuat.", { id: toastId });
      router.push(`/dashboard/order/detail/${newOrder.id}`);
    } catch (err) {
      console.error("Error creating order:", err);
      toast.error("Gagal membuat pesanan. Silakan coba lagi.", { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Formulir Pesanan Baru</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Isi detail pesanan Anda dengan lengkap
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          {/* Service Selection */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Home className="w-4 h-4 text-muted-foreground" />
              <label className="block text-sm font-medium">Layanan</label>
            </div>
            <Select
              onValueChange={(value) =>
                setFormData({ ...formData, serviceId: value })
              }
              value={formData.serviceId}
              required
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih layanan yang Anda butuhkan..." />
              </SelectTrigger>
              <SelectContent>
                {services.map((service) => (
                  <SelectItem
                    key={service.id}
                    value={service.id.toString()}
                    className="py-2"
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">{service.name}</span>
                      <span className="text-xs text-muted-foreground">
                        Harga: Rp
                        {service.basePrice?.toLocaleString("id-ID") ||
                          "Negosiasi"}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Location Input */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <label className="block text-sm font-medium">Lokasi</label>
            </div>
            <Input
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Contoh: Jl. Merdeka No. 123, Jakarta Pusat"
              required
              className="py-2"
            />
          </div>

          {/* Description Textarea */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-muted-foreground" />
              <label className="block text-sm font-medium">
                Deskripsi Kebutuhan
              </label>
            </div>
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Jelaskan kebutuhan Anda secara detail. Contoh: Saya membutuhkan perbaikan AC di ruang tamu dengan kapasitas 1 PK..."
              rows={5}
              required
              className="resize-none"
            />
          </div>

          {/* Date Picker */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <label className="block text-sm font-medium">
                Tanggal Preferensi
              </label>
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal py-2",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? (
                    format(date, "EEEE, d MMMM yyyy")
                  ) : (
                    <span>Pilih tanggal preferensi Anda</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  fromDate={new Date()}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 py-2 h-auto"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
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
              "Buat Pesanan Sekarang"
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
}
