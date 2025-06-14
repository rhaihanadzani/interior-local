"use client";
import NoSessionLayout from "@/components/layout/no-session";
import HeroBanner from "@/components/slug/Home/HeroBanner";
import PortfolioGallery from "@/components/slug/Home/PortfolioGallery";
import Services from "@/components/slug/Home/Services";
import Testimonials from "@/components/slug/Home/Testimonials";
import {
  getAllPortfolios,
  getAllServices,
  getAlltesttimonials,
} from "@/lib/services/homeService";
import { useEffect, useState } from "react";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [portfolios, setPortfolios] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setIsLoading(true);
        // Jalankan semua fetching secara parallel
        const [portfoliosData, testimonialsData, servicesData] =
          await Promise.all([
            getAllPortfolios(),
            getAlltesttimonials(),
            getAllServices(), // Pastikan ini hanya mengambil 3 data
          ]);

        setPortfolios(portfoliosData);
        setTestimonials(testimonialsData);
        setServices(servicesData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, []);

  return (
    <main>
      <NoSessionLayout>
        <HeroBanner />
        <PortfolioGallery loading={isLoading} portfolioItems={portfolios} />
        <Testimonials testimonials={testimonials} loading={isLoading} />
        <Services loading={isLoading} services={services} />
      </NoSessionLayout>
    </main>
  );
}
