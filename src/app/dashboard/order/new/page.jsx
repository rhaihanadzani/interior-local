"use client";
import { useEffect, useState } from "react";
import OrderForm from "../orderForm";
import { getServices } from "@/lib/services/serviceService";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
import DashboardLoading from "@/components/Loader/DashboardLoading";

export default function NewOrderPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await getServices();
        setServices(data);
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  if (loading) {
    return <DashboardLoading />;
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/order">
          <Button variant="outline" size="icon">
            <ArrowLeftIcon className="w-4 h-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Buat Pesanan Baru</h1>
      </div>

      <div className="max-w-4xl mx-auto">
        <OrderForm services={services} />
      </div>
    </div>
  );
}
