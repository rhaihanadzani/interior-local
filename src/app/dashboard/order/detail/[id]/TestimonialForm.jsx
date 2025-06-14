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
import { createTestimoniUser } from "@/lib/services/testimoniService";
import { toast } from "sonner";

export function TestimonialForm({ orderId, onTestimonialSubmitted }) {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitTestimonial = async () => {
    setIsSubmitting(true);
    const toastId = toast.loading("Tunggu sebentar...");
    try {
      const formData = new FormData();
      formData.append("orderId", orderId);
      formData.append("rating", rating);
      formData.append("comment", comment);

      const response = await createTestimoniUser(formData);

      // Update toast menjadi success
      toast.success("Terima Kasih untuk testimoni Anda!", {
        id: toastId,
        duration: 2000,
      });
      setOpen(false);

      // Reset form
      setRating(0);
      setComment("");

      // Panggil callback dengan data testimonial baru
      if (onTestimonialSubmitted) {
        onTestimonialSubmitted(response);
      }
    } catch (error) {
      console.error("Error submitting testimonial:", error);

      toast.error("Gagal mengirim testimoni. Silakan coba lagi.", {
        id: toastId,
        duration: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="w-full bg-primary hover:bg-primary/90"
      >
        Beri Testimoni
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Beri Testimoni</DialogTitle>
            <DialogDescription>
              Pendapat Anda sangat berarti! Beri ulasan untuk membantu kami
              meningkatkan layanan.
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
                onClick={submitTestimonial}
                disabled={rating === 0 || comment.trim() === "" || isSubmitting}
              >
                {isSubmitting ? "Mengirim..." : "Kirim Testimoni"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
