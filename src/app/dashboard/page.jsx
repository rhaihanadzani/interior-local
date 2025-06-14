"use client";

import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { getDashboardData } from "@/lib/services/dashboardService";
import { formatDate, formatCurrency } from "@/lib/utils";
import Link from "next/link";
import DashboardLoading from "@/components/Loader/DashboardLoading";

const statusColors = {
  menunggu: "bg-yellow-100 text-yellow-800",
  dikonfirmasi: "bg-blue-100 text-blue-800",
  diproses: "bg-purple-100 text-purple-800",
  selesai: "bg-green-100 text-green-800",
  ditolak: "bg-red-100 text-red-800",
};

const DashboardPage = () => {
  const { data: session } = useSession();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getDashboardData();
        setDashboardData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <DashboardLoading />;
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="container mx-auto py-8">
        <p>Tidak ada data yang tersedia</p>
      </div>
    );
  }

  const { user, orderStats, orders, isAdmin } = dashboardData;
  const hasOrders = orders?.length > 0;
  const recentOrders = hasOrders ? orders.slice(0, isAdmin ? 5 : 3) : [];

  return (
    <div className="container mx-auto py-8 animate-fadeIn">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Section */}
        <div className="lg:col-span-1">
          <Card className="hover:shadow-lg transition-all duration-300">
            <CardHeader className="items-center">
              <Avatar className="w-32 h-32 mb-4">
                {user.profileImage ? (
                  <AvatarImage src={user.profileImage.url} alt={user.name} />
                ) : (
                  <AvatarFallback className="bg-primary text-primary-foreground text-4xl">
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="text-center">
                <h2 className="text-2xl font-bold">{user.name}</h2>
                <p className="text-muted-foreground">{user.email}</p>
                <Badge variant="outline" className="mt-2 capitalize">
                  {user.role}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Nomor Telepon</span>
                <span>{user.phone || "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Bergabung Sejak</span>
                <span>{formatDate(user.createdAt)}</span>
              </div>
              <Link href="/profile/edit" passHref>
                <Button className="w-full mt-4 bg-primary hover:bg-primary/90">
                  Edit Profil
                </Button>
              </Link>
              {isAdmin && (
                <Link href="/admin" passHref>
                  <Button variant="outline" className="w-full mt-2">
                    Panel Admin
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Order Summary and Recent Orders */}
        <div className="lg:col-span-2 space-y-8">
          {/* Order Summary Cards */}
          <div
            className={`grid gap-4 ${
              isAdmin
                ? "grid-cols-1 md:grid-cols-3"
                : "grid-cols-1 md:grid-cols-3"
            }`}
          >
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Pesanan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {orderStats.totalOrders}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {isAdmin ? "Semua pesanan" : "Pesanan Anda"}
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Dalam Proses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {orderStats.inProgress}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {isAdmin ? "Sedang dikerjakan" : "Pesanan Anda"}
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Selesai
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{orderStats.completed}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {isAdmin ? "Pesanan selesai" : "Pesanan Anda"}
                </p>
              </CardContent>
            </Card>

            {/* Hanya tampil untuk admin */}
            {isAdmin && (
              <>
                <Card className="hover:shadow-lg transition-all duration-300">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Menunggu
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      {orderStats.waiting || 0}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Pesanan menunggu
                    </p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-all duration-300">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Ditolak
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      {orderStats.rejected || 0}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Pesanan ditolak
                    </p>
                  </CardContent>
                </Card>
              </>
            )}
          </div>

          {/* Recent Orders */}
          <Card className="hover:shadow-lg transition-all duration-300">
            <CardHeader className="border-b">
              <div className="flex justify-between items-center">
                <CardTitle>
                  {isAdmin ? "Pesanan Terbaru" : "Pesanan Terakhir Anda"}
                </CardTitle>
                <Link href={isAdmin ? "/admin/orders" : "/orders"} passHref>
                  <Button variant="link" className="text-primary">
                    Lihat Semua
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {hasOrders ? (
                <div className="divide-y">
                  {recentOrders.map((order) => (
                    <div
                      key={order.id}
                      className="flex flex-col sm:flex-row justify-between gap-4 p-6 hover:bg-gray-50 transition-colors"
                    >
                      <div className="space-y-1.5">
                        <h3 className="font-medium text-lg">
                          {order.service.name}
                        </h3>
                        {isAdmin && (
                          <div className="flex items-center gap-2 text-sm">
                            <span className="font-medium">Pemesan:</span>
                            <span>{order.user?.name}</span>
                            <span className="text-muted-foreground">
                              ({order.user?.email})
                            </span>
                          </div>
                        )}
                        <div className="flex items-center gap-3 pt-1">
                          <Badge
                            className={`${
                              statusColors[order.status]
                            } capitalize`}
                          >
                            {order.status}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {formatDate(order.createdAt)}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-lg">
                          {formatCurrency(
                            order.offerPrice || order.service.basePrice
                          )}
                        </p>
                        {order.scheduledDate && (
                          <p className="text-sm text-muted-foreground mt-1">
                            <span className="font-medium">Jadwal:</span>{" "}
                            {formatDate(order.scheduledDate)}
                          </p>
                        )}
                        <Link
                          href={`${isAdmin ? "/admin/orders" : "/orders"}/${
                            order.id
                          }`}
                          passHref
                        >
                          <Button
                            variant="link"
                            className="text-primary p-0 h-auto mt-2"
                          >
                            Detail Pesanan
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 space-y-4 text-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  <h3 className="text-xl font-medium text-gray-600">
                    Belum Ada Pesanan
                  </h3>
                  <p className="text-gray-500 max-w-md">
                    {isAdmin
                      ? "Belum ada pesanan yang dibuat oleh pelanggan."
                      : "Anda belum membuat pesanan apapun. Mulai pesanan pertama Anda sekarang!"}
                  </p>
                  {isAdmin ? (
                    <>
                      <Link href="/dashboard/admin/layanan" passHref>
                        <Button className="mt-4">Lihat Layanan</Button>
                      </Link>
                    </>
                  ) : (
                    <>
                      {" "}
                      <Link href="/dashboard/order" passHref>
                        <Button className="mt-4">Pesan Sekarang</Button>
                      </Link>
                    </>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
