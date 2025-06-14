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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { PlusIcon, PencilIcon, TrashIcon, ImageIcon } from "lucide-react";
import {
  getServices,
  createService,
  updateService,
  deleteService,
} from "@/lib/services/serviceService";
import DashboardLoading from "@/components/Loader/DashboardLoading";
import { toast } from "sonner";
import { ArrowTextarea } from "@/components/ArrowTextarea";

export default function AdminServicesPage() {
  const [services, setServices] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentService, setCurrentService] = useState(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    subdesc: "",
    basePrice: "",
    image: null,
  });

  // Fetch services on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getServices();
        setServices(data);
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleOpenCreateDialog = () => {
    setCurrentService(null);
    setFormData({
      name: "",
      description: "",
      subdesc: "",
      basePrice: "",
      image: null,
    });
    setPreviewImage(null);
    setIsDialogOpen(true);
  };

  const handleOpenEditDialog = (service) => {
    setCurrentService(service);
    setFormData({
      name: service.name,
      description: service.description,
      subdesc: service.subdesc || "",
      basePrice: service.basePrice?.toString() || "",
      image: null,
    });
    setPreviewImage(service.imageUrl);
    setIsDialogOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    const toastId = toast.loading("Mohon Tunggu...");
    e.preventDefault();
    setIsUploading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("description", formData.description);
      if (formData.subdesc) {
        // Format subdesc sebelum dikirim
        const formattedSubdesc = formData.subdesc
          .split("\n")
          .map((line) => (line.trim().startsWith("➡️") ? line : `➡️ ${line}`))
          .join("\n");
        formDataToSend.append("subdesc", formattedSubdesc);
      }
      if (formData.basePrice)
        formDataToSend.append("basePrice", formData.basePrice);
      if (formData.image) formDataToSend.append("image", formData.image);

      if (currentService) {
        // Update service
        const updatedService = await updateService(
          currentService.id,
          formDataToSend
        );
        setServices(
          services.map((s) => (s.id === updatedService.id ? updatedService : s))
        );

        toast.success("Layanan berhasil diupdate", { id: toastId });
      } else {
        // Create service
        const newService = await createService(formDataToSend);
        setServices([...services, newService]);

        toast.success("Layanan berhasil dibuat", { id: toastId });
      }

      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error saving service:", error);
      toast.error("Gagal menyimpan layanan", { id: toastId });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = (service) => {
    setServiceToDelete(service);
    setIsDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    const idToast = toast.loading("Mohon Tunggu...");
    try {
      await deleteService(serviceToDelete.id);
      setServices(services.filter((s) => s.id !== serviceToDelete.id));
      setIsDeleteConfirmOpen(false);
      toast.success("Layanan berhasil dihapus", { id: idToast });
    } catch (error) {
      console.error("Error deleting service:", error);
      toast.error("Gagal menghapus layanan", { id: idToast });
    }
  };

  if (isLoading) {
    return <DashboardLoading />;
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Manajemen Layanan
          </h1>
          <p className="text-muted-foreground">
            Kelola layanan yang ditawarkan kepada pelanggan
          </p>
        </div>
        <Button
          onClick={handleOpenCreateDialog}
          className="bg-primary hover:bg-primary/90"
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          Tambah Layanan
        </Button>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <Card key={service.id} className="hover:shadow-lg transition-shadow ">
            <div className="aspect-video relative">
              <img
                src={service.imageUrl}
                alt={service.name}
                className="w-full h-full object-cover"
              />
            </div>

            <CardHeader>
              <CardTitle>{service.name}</CardTitle>
              <CardDescription className="line-clamp-2">
                {service.description}
              </CardDescription>
              {service.subdesc && (
                <div className="text-sm text-muted-foreground space-y-1">
                  {service.subdesc.split("\n").map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
              )}
              {service.basePrice && (
                <p className="text-lg font-semibold">
                  Rp{parseFloat(service.basePrice).toLocaleString()}
                </p>
              )}
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => handleOpenEditDialog(service)}
                >
                  <PencilIcon className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  className="text-red-500 border-red-500 hover:bg-red-50"
                  onClick={() => handleDelete(service)}
                >
                  <TrashIcon className="w-4 h-4 mr-2" />
                  Hapus
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {services.length === 0 && !isLoading && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <ImageIcon className="w-12 h-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">Belum ada layanan</h3>
          <p className="text-muted-foreground max-w-md mt-2">
            Tambahkan layanan pertama Anda untuk ditawarkan kepada pelanggan
          </p>
          <Button
            onClick={handleOpenCreateDialog}
            className="mt-4 bg-primary hover:bg-primary/90"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Tambah Layanan
          </Button>
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-3xl h-[90%] overflow-auto">
          <DialogHeader>
            <DialogTitle>
              {currentService ? "Edit Layanan" : "Tambah Layanan Baru"}
            </DialogTitle>
            <DialogDescription>
              {currentService
                ? "Perbarui detail layanan ini"
                : "Tambahkan layanan baru untuk ditawarkan kepada pelanggan"}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">
                  Nama Layanan
                </label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Contoh: Renovasi Kamar Mandi"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">
                  Deskripsi
                </label>
                <Textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Jelaskan layanan ini secara detail..."
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">
                  Deskripsi Tambahan (Opsional)
                </label>
                <ArrowTextarea
                  name="subdesc"
                  value={formData.subdesc}
                  onChange={(value) =>
                    setFormData((prev) => ({ ...prev, subdesc: value }))
                  }
                  placeholder="➡️ Tekan Enter untuk membuat list baru"
                  rows={5}
                  className="whitespace-pre-wrap"
                />
                <p className="text-xs text-muted-foreground">
                  Gunakan Enter untuk membuat list baru
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">
                  Harga Dasar (Opsional)
                </label>
                <Input
                  name="basePrice"
                  type="number"
                  value={formData.basePrice}
                  onChange={handleInputChange}
                  placeholder="Contoh: 5000000"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">
                  Gambar Layanan {!currentService && "(Wajib)"}
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <div className="flex items-center justify-center w-full h-24 border-2 border-dashed rounded-md cursor-pointer hover:bg-secondary/50 transition-colors">
                      <span className="text-sm text-muted-foreground flex items-center gap-2">
                        <ImageIcon className="w-4 h-4" />
                        {previewImage ? "Ganti gambar" : "Pilih gambar"}
                      </span>
                    </div>
                  </label>
                  {previewImage && (
                    <div className="w-24 h-24">
                      <img
                        src={previewImage}
                        alt="Preview"
                        className="w-full h-full object-cover rounded-md"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="submit"
                className="bg-primary hover:bg-primary/90"
                disabled={isUploading}
              >
                {isUploading ? (
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
                    Menyimpan...
                  </span>
                ) : currentService ? (
                  "Simpan Perubahan"
                ) : (
                  "Tambah Layanan"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Apakah Anda yakin?</DialogTitle>
            <DialogDescription>
              Aksi ini akan menghapus layanan "{serviceToDelete?.name}" secara
              permanen.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteConfirmOpen(false)}
            >
              Batal
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
