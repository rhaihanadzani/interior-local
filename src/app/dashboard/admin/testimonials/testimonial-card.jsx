"use client";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { useState } from "react";
import { changeStatusTestimonial } from "@/lib/services/testimoniService";
import { toast } from "sonner";
import Image from "next/image";
import { useRouter } from "next/navigation";

export function TestimonialCard({ testimonial, onStatusChange }) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleToggleStatus = async () => {
    setIsLoading(true);
    try {
      const updatedTestimonial = await changeStatusTestimonial(testimonial.id);
      toast.success(
        `Testimonial is now ${
          updatedTestimonial.active ? "active" : "inactive"
        }`
      );
      router.refresh();
      onStatusChange(updatedTestimonial);
    } catch (error) {
      toast.error("Failed to update testimonial status");
    } finally {
      setIsLoading(false);
    }
  };

  // Safe access with optional chaining and default values
  const userName = testimonial?.user?.name || "Unknown User";
  const profileImage = testimonial?.user?.profileImage;
  const serviceName = testimonial?.order?.service?.name || "Unknown Service";
  const initials = userName.charAt(0).toUpperCase();

  console.log(profileImage);

  return (
    <Card className="hover:shadow-lg transition-all duration-300">
      <CardHeader className="flex flex-row items-center space-x-4 pb-2">
        <div className="relative h-12 w-12 overflow-hidden rounded-full">
          {profileImage?.url ? (
            <Image
              src={profileImage.url.url}
              alt={profileImage.description || `${userName}'s profile`}
              fill
              className="object-cover"
              sizes="48px"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-secondary">
              <span className="text-lg font-medium text-secondary-foreground">
                {initials}
              </span>
            </div>
          )}
        </div>
        <div>
          <h3 className="text-lg font-medium">{userName}</h3>
          <p className="text-sm text-muted-foreground">{serviceName}</p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-2 flex">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-5 w-5 ${
                i < (testimonial?.rating || 0)
                  ? "fill-primary text-primary"
                  : "text-muted-foreground"
              }`}
            />
          ))}
        </div>
        <p className="text-foreground">
          {testimonial?.comment || "No comment"}
        </p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <span className="text-sm text-muted-foreground">
          {testimonial?.createdAt
            ? new Date(testimonial.createdAt).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })
            : "Unknown date"}
        </span>
        <Button
          variant={testimonial?.active ? "default" : "outline"}
          size="sm"
          onClick={handleToggleStatus}
          disabled={isLoading}
        >
          {isLoading
            ? "Processing..."
            : testimonial?.active
            ? "Active"
            : "Inactive"}
        </Button>
      </CardFooter>
    </Card>
  );
}
