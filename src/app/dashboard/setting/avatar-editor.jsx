"use client";

import { useState, useRef } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Pencil } from "lucide-react";

export function AvatarEditor({ imageUrl, name, onImageChange }) {
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validasi ukuran file (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert("Ukuran gambar maksimal 2MB");
      return;
    }

    // Validasi tipe file
    if (!file.type.match("image.*")) {
      alert("Hanya file gambar yang diperbolehkan");
      return;
    }

    // Buat preview URL
    const previewUrl = URL.createObjectURL(file);
    onImageChange({
      previewUrl,
      file,
    });
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative group">
        <Avatar className="w-32 h-32 border-4 border-primary/20">
          <AvatarImage src={imageUrl} />
          <AvatarFallback className="bg-primary text-primary-foreground text-4xl">
            {name?.charAt(0).toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>

        <button
          onClick={() => fileInputRef.current.click()}
          className="absolute bottom-0 right-0 bg-primary rounded-full p-2 text-white hover:bg-primary/90 transition-all duration-300 group-hover:opacity-100 opacity-0"
        >
          <Pencil className="h-5 w-5" />
        </button>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageChange}
        accept="image/*"
        className="hidden"
      />
    </div>
  );
}
