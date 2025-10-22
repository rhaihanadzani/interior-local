"use client";

import { useState, useEffect } from "react";
import { getCurrentUser } from "@/lib/services/userService";
import { AvatarEditor } from "./avatar-editor";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import DashboardLoading from "@/components/Loader/DashboardLoading";

const roleColors = {
  superAdmin: "bg-purple-100 text-purple-800",
  admin: "bg-blue-100 text-blue-800",
  user: "bg-green-100 text-green-800",
};

const roleLabels = {
  superAdmin: "Super Admin",
  admin: "Admin",
  user: "User",
};

export default function SettingsPage() {
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await getCurrentUser();
        setCurrentUser(user);
        setFormData({
          name: user.name,
          email: user.email,
          phone: user.phone,
        });
      } catch (error) {
        toast.error("Gagal memuat data pengguna");
      } finally {
        setIsInitializing(false);
      }
    };

    fetchUserData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (imageData) => {
    setSelectedImage(imageData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formPayload = new FormData();
      formPayload.append("name", formData.name);
      formPayload.append("email", formData.email);
      formPayload.append("phone", formData.phone || "");
      formPayload.append("userId", currentUser.id);

      if (selectedImage?.file) {
        formPayload.append("profileImage", selectedImage.file);
      }

      const response = await fetch("/api/dashboard/setting", {
        method: "PATCH",
        body: formPayload,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update profile");
      }

      // Update state dengan data terbaru
      setCurrentUser(data.user);
      setSelectedImage(null);

      // Bersihkan preview URL jika ada
      if (selectedImage?.previewUrl) {
        URL.revokeObjectURL(selectedImage.previewUrl);
      }

      console.log(response, "response");

      if (response.ok) {
        toast.success("Perubahan berhasil disimpan");
      }
    } catch (error) {
      toast.error(error.message || "Perubahan gagal disimpan");
    } finally {
      setIsLoading(false);
    }
  };

  // Dapatkan URL gambar untuk ditampilkan
  const displayImageUrl =
    selectedImage?.previewUrl || currentUser?.profileImage?.url;

  if (isInitializing) {
    return <DashboardLoading />;
  }

  if (!currentUser) {
    return (
      <div className="container py-8 text-center">
        <p>Gagal memuat data pengguna</p>
      </div>
    );
  }

  // console.log("currentUser", currentUser);

  return (
    <div className="container py-8 animate-fadeIn">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">Pengaturan Akun</h1>
          <p className="text-muted-foreground mt-2">
            Kelola informasi profil dan preferensi akun Anda
          </p>
        </div>

        <Card className="transition-all duration-300 hover:shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Profil Saya</span>
              <Badge className={`${roleColors[currentUser.role]} capitalize`}>
                {roleLabels[currentUser.role] || currentUser.role}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="w-full md:w-1/3">
                  <AvatarEditor
                    imageUrl={displayImageUrl}
                    name={currentUser.name}
                    onImageChange={handleImageChange}
                  />
                </div>

                <div className="w-full md:w-2/3 space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nama Lengkap</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Masukkan nama lengkap"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Masukkan email"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Nomor Telepon</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Masukkan nomor telepon"
                    />
                  </div>
                </div>
              </div>

              <CardFooter className="flex justify-end gap-4 px-0 pb-0">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setFormData({
                      name: currentUser.name,
                      email: currentUser.email,
                      phone: currentUser.phone,
                    });
                    if (selectedImage) {
                      URL.revokeObjectURL(selectedImage.previewUrl);
                      setSelectedImage(null);
                    }
                  }}
                >
                  Reset
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Menyimpan...
                    </>
                  ) : (
                    "Simpan Perubahan"
                  )}
                </Button>
              </CardFooter>
            </form>
          </CardContent>
        </Card>

        <Card className="transition-all duration-300 hover:shadow-lg">
          <CardHeader>
            <CardTitle>Informasi Akun</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>ID Pengguna</Label>
                <div className="p-3 rounded-md bg-primary text-white text-sm font-mono">
                  {currentUser.id}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Tanggal Bergabung</Label>
                <div className="p-3 rounded-md bg-primary text-white">
                  {new Date(currentUser.createdAt).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
