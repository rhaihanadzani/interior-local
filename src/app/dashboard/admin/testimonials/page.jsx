"use client";
import { useEffect, useState } from "react";
import { TestimonialCard } from "./testimonial-card";
import { getAllTestimonialsAdmin } from "@/lib/services/testimoniService";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import DashboardLoading from "@/components/Loader/DashboardLoading";

export default function TestimonialPreviewPage() {
  const [testimoniData, setTestimoniData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6); // Jumlah item per halaman
  const [selectedRating, setSelectedRating] = useState(null); // Filter rating

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const result = await getAllTestimonialsAdmin();
      setTestimoniData(result);
    } catch (error) {
      console.error("Error fetching testimonials:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleStatusChange = (updatedTestimonial) => {
    setTestimoniData((prevData) =>
      prevData.map((item) => {
        if (item.id === updatedTestimonial.id) {
          const userData = updatedTestimonial.user || item.user;
          const orderData = updatedTestimonial.order || item.order;

          return {
            ...item,
            ...updatedTestimonial,
            user: userData,
            order: orderData,
          };
        }
        return item;
      })
    );
  };

  // Filter testimonial berdasarkan rating
  const filteredTestimonials = selectedRating
    ? testimoniData.filter(
        (testimonial) => testimonial.rating === selectedRating
      )
    : testimoniData;

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredTestimonials.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredTestimonials.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () =>
    currentPage < totalPages && setCurrentPage(currentPage + 1);
  const prevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);

  if (loading) {
    return <DashboardLoading />;
  }

  return (
    <div className="container py-8 animate-fadeIn">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Testimonial Management</h1>
        <p className="text-muted-foreground">
          Manage testimonials to be displayed on the landing page
        </p>
      </div>

      {/* Rating Filter */}
      <div className="mb-6 flex flex-wrap gap-2 items-center">
        <Button
          variant={!selectedRating ? "default" : "outline"}
          onClick={() => setSelectedRating(null)}
          className="flex items-center gap-1"
        >
          All Ratings
        </Button>

        {[1, 2, 3, 4, 5].map((rating) => (
          <Button
            key={rating}
            variant={selectedRating === rating ? "default" : "outline"}
            onClick={() => {
              setSelectedRating(rating);
              setCurrentPage(1);
            }}
            className="flex items-center gap-1 px-3"
          >
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < rating
                    ? selectedRating === rating
                      ? "fill-primary text-white"
                      : "fill-primary text-white/50"
                    : "text-gray-500 opacity-30"
                }`}
              />
            ))}
          </Button>
        ))}
      </div>

      {/* Testimonial Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        {currentItems.length > 0 ? (
          currentItems.map((testimonial) => (
            <TestimonialCard
              key={testimonial.id}
              testimonial={testimonial}
              onStatusChange={handleStatusChange}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground">
              No testimonials found with the selected criteria.
            </p>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {filteredTestimonials.length > itemsPerPage && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <Button
            variant="outline"
            onClick={prevPage}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="ml-2">Previous</span>
          </Button>

          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (number) => (
                <Button
                  key={number}
                  variant={currentPage === number ? "default" : "outline"}
                  size="sm"
                  onClick={() => paginate(number)}
                  className="w-10 h-10 p-0"
                >
                  {number}
                </Button>
              )
            )}
          </div>

          <Button
            variant="outline"
            onClick={nextPage}
            disabled={currentPage === totalPages}
          >
            <span className="mr-2">Next</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
