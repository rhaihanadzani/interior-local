// app/components/ImageUpload.jsx
"use client";

import { useState } from "react";
import { supabase } from "@/utils/client";

export default function ImageUpload({ userId }) {
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleUpload = async (e) => {
    try {
      setUploading(true);
      setProgress(0);

      const file = e.target.files[0];
      if (!file) return;

      // Generate unique filename
      const fileExt = file.name.split(".").pop();
      const fileName = `${userId}-${Math.random()
        .toString(36)
        .substring(2)}.${fileExt}`;
      const filePath = `public/${fileName}`;

      // Upload file dengan progress tracking
      const { data, error } = await supabase.storage
        .from("jasa-interior") // Your bucket name
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (error) throw error;

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("jasa-interior").getPublicUrl(data.path);

      setImageUrl(publicUrl);
    } catch (error) {
      alert(`Error uploading image: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <label className="block">
        <span className="sr-only">Choose profile photo</span>
        <input
          type="file"
          accept="image/*"
          onChange={handleUpload}
          disabled={uploading}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-primary file:text-white
            hover:file:bg-primary/90"
        />
      </label>

      {uploading && (
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-primary h-2.5 rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}

      {imageUrl && (
        <div className="mt-4">
          <img
            src={imageUrl}
            alt="Uploaded preview"
            className="h-32 w-32 rounded-full object-cover"
          />
          <p className="mt-2 text-sm text-muted-foreground">
            Image uploaded successfully!
          </p>
        </div>
      )}
    </div>
  );
}
