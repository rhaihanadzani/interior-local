"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { updateTestimonial } from "@/lib/services/testimoniService";
import { toast } from "sonner";

export function UpdateTestimonial({ testimonial, onTestimonialUpdated }) {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(testimonial?.rating || 0);
  const [comment, setComment] = useState(testimonial?.comment || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const toastId = toast.loading("Memperbarui testimoni...");

    try {
      const updatedTestimonial = await updateTestimonial({
        id: testimonial.id,
        rating,
        comment,
      });

      toast.success("Testimoni berhasil diperbarui!", {
        id: toastId,
        duration: 2000,
      });

      setOpen(false);

      if (onTestimonialUpdated) {
        onTestimonialUpdated(updatedTestimonial);
      }
    } catch (error) {
      console.error("Error updating testimonial:", error);
      toast.error("Gagal memperbarui testimoni. Silakan coba lagi.", {
        id: toastId,
        duration: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)} className="mt-4">
        Edit Testimoni
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Testimoni</DialogTitle>
            <DialogDescription>
              Perbarui ulasan Anda untuk pesanan ini
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div>
              <h4 className="mb-2 text-sm font-medium">Rating</h4>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`h-8 w-8 ${
                        star <= rating
                          ? "fill-primary text-primary"
                          : "text-muted-foreground"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="mb-2 text-sm font-medium">Ulasan</h4>
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Bagaimana pengalaman Anda menggunakan layanan kami?"
                rows={5}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isSubmitting}
              >
                Batal
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={rating === 0 || comment.trim() === "" || isSubmitting}
              >
                {isSubmitting ? "Memperbarui..." : "Perbarui Testimoni"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
