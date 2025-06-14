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
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ImageIcon,
  XIcon,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import {
  getPortfolios,
  createPortfolio,
  updatePortfolio,
  deletePortfolio,
} from "@/lib/services/portfolioService";
import DashboardLoading from "@/components/Loader/DashboardLoading";
import { toast } from "sonner";

export default function AdminPortfolioPage() {
  const [portfolios, setPortfolios] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentPortfolio, setCurrentPortfolio] = useState(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [portfolioToDelete, setPortfolioToDelete] = useState(null);
  const [selectedImages, setSelectedImages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Add this near the top of your component
  const CATEGORY_OPTIONS = [
    { value: "rumah", label: "Rumah" },
    { value: "kantor", label: "Kantor" },
    { value: "restoran", label: "Restoran" },
    { value: "hotel", label: "Hotel" },
  ];

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    active: true,
  });

  // Fetch portfolios on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getPortfolios();
        setPortfolios(data);
      } catch (error) {
        console.error("Error fetching portfolios:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleOpenCreateDialog = () => {
    setCurrentPortfolio(null);
    setFormData({
      title: "",
      description: "",
      category: "",
      active: true,
    });
    setSelectedImages([]);
    setIsDialogOpen(true);
  };

  const handleOpenEditDialog = (portfolio) => {
    setCurrentPortfolio(portfolio);
    setFormData({
      title: portfolio.title,
      description: portfolio.description,
      category: portfolio.category || "",
      active: portfolio.active,
    });
    setSelectedImages(
      portfolio.images.map((img) => ({
        id: img.id,
        url: img.url,
        description: img.description,
        existing: true, // Mark as existing image
      }))
    );
    setIsDialogOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({
      id: URL.createObjectURL(file), // temporary ID
      url: URL.createObjectURL(file),
      name: file.name,
      file, // store the actual file for upload
    }));
    setSelectedImages((prev) => [...prev, ...newImages]);
  };

  const removeImage = (id) => {
    setSelectedImages((prev) => prev.filter((img) => img.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    const toastId = toast.loading("Mohon Tunggu...");

    if (!formData.title || !formData.description || !formData.category) {
      toast.error("Harap isi semua field yang diperlukan.", { id: toastId });
      setIsUploading(false);
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("active", formData.active.toString());

      // Tambahkan category jika ada di formData
      if (formData.category) {
        formDataToSend.append("category", formData.category);
      }

      // Handle berbeda untuk create vs update
      if (currentPortfolio) {
        // CASE UPDATE ======================================
        // Add existing image IDs to keep
        const existingImageIds = selectedImages
          .filter((img) => img.existing)
          .map((img) => img.id);
        formDataToSend.append(
          "existingImageIds",
          JSON.stringify(existingImageIds)
        );

        // Add IDs of images to delete
        const allExistingImageIds = currentPortfolio.images.map(
          (img) => img.id
        );
        const deletedImageIds = allExistingImageIds.filter(
          (id) => !existingImageIds.includes(id)
        );
        formDataToSend.append(
          "deletedImageIds",
          JSON.stringify(deletedImageIds)
        );

        // Add new images
        selectedImages
          .filter((img) => img.file)
          .forEach((img) => {
            formDataToSend.append("newImages", img.file);
          });

        // Panggil API update
        const updatedPortfolio = await updatePortfolio(
          currentPortfolio.id,
          formDataToSend
        );

        // Update state
        setPortfolios(
          portfolios.map((p) =>
            p.id === updatedPortfolio.id ? updatedPortfolio : p
          )
        );

        toast.success("Data berhasil disimpan.", { id: toastId });
      } else {
        // CASE CREATE ======================================
        // Add all selected images (for create, all are new)
        selectedImages.forEach((img) => {
          if (img.file) {
            formDataToSend.append("images", img.file);
          }
        });

        console.log("selectedImages", selectedImages);

        // Panggil API create
        const newPortfolio = await createPortfolio(formDataToSend);

        // Update state
        setPortfolios([...portfolios, newPortfolio]);

        toast.success("Data berhasil disimpan.", { id: toastId });
      }

      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Gagal menyimpan data.", { id: toastId });
    } finally {
      setIsUploading(false);
    }
  };
  const handleDelete = (portfolio) => {
    setPortfolioToDelete(portfolio);
    setIsDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    const toastId = toast.loading("Mohon Tunggu...");
    try {
      await deletePortfolio(portfolioToDelete.id);
      setPortfolios(portfolios.filter((p) => p.id !== portfolioToDelete.id));
      setIsDeleteConfirmOpen(false);
      toast.success("Data berhasil dihapus.", { id: toastId });
    } catch (error) {
      console.error("Error deleting portfolio:", error);
      toast.error("Gagal menghapus data.", { id: toastId });
    }
  };

  if (isLoading) {
    return <DashboardLoading />;
  }

  return (
    <div className="container mx-auto py-8 space-y-6 animate-fadeIn">
      {/* Header */}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Manajemen Portofolio
          </h1>
          <p className="text-muted-foreground">
            Kelola portofolio pekerjaan untuk ditampilkan ke pelanggan
          </p>
        </div>
        <Button
          onClick={handleOpenCreateDialog}
          className="bg-primary hover:bg-primary/90"
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          Tambah Portofolio
        </Button>
      </div>

      {/* Portfolio Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {portfolios.map((portfolio) => (
          <Card
            key={portfolio.id}
            className="hover-scale transition-all duration-300 group overflow-hidden relative"
          >
            {/* Glass effect overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#0b1d51]/5 to-[#4da8da]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

            {/* Portfolio image or placeholder */}
            {portfolio.images.length > 0 ? (
              <div className="aspect-video relative">
                <img
                  src={portfolio.images[0].url}
                  alt={portfolio.title}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="aspect-video bg-secondary flex items-center justify-center">
                <ImageIcon className="w-12 h-12 text-muted-foreground" />
              </div>
            )}

            <CardHeader>
              <div className="flex justify-between items-start gap-2">
                <CardTitle className="line-clamp-1">
                  {portfolio.title}
                </CardTitle>
                <Badge variant={portfolio.active ? "default" : "outline"}>
                  {portfolio.active ? "Aktif" : "Nonaktif"}
                </Badge>
              </div>
              <CardDescription className="line-clamp-2">
                {portfolio.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{portfolio.images.length} gambar</span>
                <span>{formatDate(new Date(portfolio.createdAt))}</span>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleOpenEditDialog(portfolio)}
                >
                  <PencilIcon className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-500 border-red-500 hover:bg-red-50"
                  onClick={() => handleDelete(portfolio)}
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
      {portfolios.length === 0 && !isLoading && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <ImageIcon className="w-12 h-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">Belum ada portofolio</h3>
          <p className="text-muted-foreground max-w-md mt-2">
            Tambahkan portofolio pertama Anda untuk menampilkan pekerjaan
            terbaik kepada pelanggan
          </p>
          <Button
            onClick={handleOpenCreateDialog}
            className="mt-4 bg-primary hover:bg-primary/90"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Tambah Portofolio
          </Button>
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-3xl h-[90%] overflow-auto">
          <DialogHeader>
            <DialogTitle>
              {currentPortfolio ? "Edit Portofolio" : "Tambah Portofolio Baru"}
            </DialogTitle>
            <DialogDescription>
              {currentPortfolio
                ? "Perbarui detail portofolio ini"
                : "Tambahkan portofolio baru untuk menampilkan pekerjaan Anda"}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">
                  Judul Portofolio
                </label>
                <Input
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Contoh: Renovasi Rumah Minimalis"
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
                  placeholder="Jelaskan detail proyek ini..."
                  rows={4}
                  required
                />
              </div>

              {/* Add this after the description textarea and before the active checkbox */}
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">
                  Kategori
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Pilih Kategori</option>
                  {CATEGORY_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="active"
                  id="active"
                  checked={formData.active}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary"
                />
                <label
                  htmlFor="active"
                  className="text-sm font-medium leading-none"
                >
                  Tampilkan di halaman publik
                </label>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">
                  Gambar Portofolio
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
                      <span className="text-sm text-muted-foreground flex items-center gap-2">
                        <ImageIcon className="w-4 h-4" />
                        Klik untuk upload gambar
                      </span>
                    </div>
                  </label>
                </div>

                {/* Preview gambar yang dipilih */}
                {selectedImages.length > 0 && (
                  <div className="grid grid-cols-3 gap-3 mt-2">
                    {selectedImages.map((image) => (
                      <div
                        key={image.id}
                        className="relative group aspect-square"
                      >
                        <img
                          src={image.url}
                          alt={image.name || "Portfolio image"}
                          className="w-full h-full object-cover rounded-md"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(image.id)}
                          className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <XIcon className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
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
                ) : currentPortfolio ? (
                  "Simpan Perubahan"
                ) : (
                  "Tambah Portofolio"
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
              Aksi ini akan menghapus portofolio "{portfolioToDelete?.title}"
              secara permanen.
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
