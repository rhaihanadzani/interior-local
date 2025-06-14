"use client";

import { useState, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icons } from "./Icons";

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { data: session } = useSession();
  const pathname = usePathname();

  // Close mobile sidebar when route changes
  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [pathname]);

  // Navigation items
  const navItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: <Icons.dashboard className="w-5 h-5" />,
      allowedRoles: ["user", "admin", "superAdmin"],
    },

    {
      name: "Pesanan",
      href: "/dashboard/order",
      icon: <Icons.orders className="w-5 h-5" />,
      allowedRoles: ["user"],
    },
    {
      name: "Pesanan",
      href: "/dashboard/admin/orders",
      icon: <Icons.orders className="w-5 h-5" />,
      allowedRoles: ["admin", "superAdmin"],
    },
    {
      name: "Portofolio",
      href: "/dashboard/admin/porto",
      icon: <Icons.portfolio className="w-5 h-5" />,
      allowedRoles: ["admin", "superAdmin"],
    },
    {
      name: "Layanan",
      href: "/dashboard/admin/layanan",
      icon: <Icons.services className="w-5 h-5" />,
      allowedRoles: ["admin", "superAdmin"],
    },
    {
      name: "Testimoni",
      href: "/dashboard/admin/testimonials",
      icon: <Icons.testimonials className="w-5 h-5" />,
      allowedRoles: ["admin", "superAdmin"],
    },
    {
      name: "Pengguna",
      href: "/dashboard/admin/user",
      icon: <Icons.users className="w-5 h-5" />,
      allowedRoles: ["superAdmin"],
    },
    {
      name: "Pengaturan",
      href: "/dashboard/setting",
      icon: <Icons.setting className="w-5 h-5" />,
      allowedRoles: ["user", "admin", "superAdmin"],
    },
  ];

  const filteredNavItems = navItems.filter((item) =>
    item.allowedRoles.includes(session?.user?.role)
  );

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Mobile sidebar backdrop */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-300 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Collapsible Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 bg-white dark:bg-gray-800 shadow-xl transition-all duration-300 ease-in-out ${
          sidebarOpen ? "w-64" : "w-20"
        } ${
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-[#0b1d51] to-[#4DA8DA]">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <Icons.logo className="h-8 w-8 text-white" />
            {sidebarOpen && (
              <span className="text-xl font-bold text-white">InteriorPlus</span>
            )}
          </Link>
          {sidebarOpen && (
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="p-1 rounded-md text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white lg:hidden"
            >
              <Icons.close className="w-6 h-6" />
            </button>
          )}
        </div>

        <div className="overflow-y-auto h-[calc(100vh-4rem)] py-4 px-3">
          <nav>
            <ul className="space-y-1">
              {filteredNavItems.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`flex items-center p-3 rounded-lg hover:bg-[#0b1d51]/10 dark:hover:bg-gray-700 transition-all duration-200 ${
                      sidebarOpen ? "hover:translate-x-1 hover:shadow-sm" : ""
                    } ${
                      pathname === item.href
                        ? "bg-[#0b1d51]/10 dark:bg-gray-700 text-[#0b1d51] dark:text-[#4DA8DA] font-medium border-l-4 border-[#0b1d51] dark:border-[#4DA8DA]"
                        : "text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    <span className="mr-3">{item.icon}</span>
                    {sidebarOpen && (
                      <>
                        <span>{item.name}</span>
                        {pathname === item.href && (
                          <span className="ml-auto w-2 h-2 rounded-full bg-[#0b1d51] dark:bg-[#4DA8DA] animate-pulse"></span>
                        )}
                      </>
                    )}
                  </Link>
                </li>
              ))}
              <li>
                <button
                  onClick={() => signOut({ redirect: true })}
                  className={`flex items-center p-3 rounded-lg hover:bg-[#0b1d51]/10 dark:hover:bg-gray-700 transition-all duration-200 w-full  ${
                    sidebarOpen ? "hover:translate-x-1 hover:shadow-sm" : ""
                  }`}
                >
                  {" "}
                  <Icons.logout className="w-5 h-5 mr-3" />
                  {sidebarOpen && (
                    <>
                      <span>Keluar</span>
                    </>
                  )}
                </button>
              </li>
            </ul>
          </nav>
        </div>

        {/* Sidebar footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0b1d51] to-[#4DA8DA] flex items-center justify-center text-white">
                {session?.user?.name?.charAt(0) || (
                  <Icons.user className="w-5 h-5" />
                )}
              </div>
              {sidebarOpen && (
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    {session?.user?.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                    {session?.user?.role}
                  </p>
                </div>
              )}
            </div>
            {sidebarOpen && (
              <button className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-full transition-colors">
                <Icons.logout className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Static Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-64">
        {/* Adjust the margin when sidebar is collapsed */}
        <style jsx>{`
          .sidebar-collapsed {
            margin-left: 5rem;
          }
        `}</style>

        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm z-10 glass-effect">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center">
              <button
                onClick={() => setMobileSidebarOpen(true)}
                className="p-2 rounded-md text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0b1d51] lg:hidden transition-colors"
              >
                <Icons.menu className="w-6 h-6" />
              </button>
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-md text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0b1d51] hidden lg:block transition-colors"
              >
                <div className="relative w-6 h-6">
                  <Icons.chevronLeft
                    className={`w-6 h-6 absolute transition-all duration-300 ${
                      sidebarOpen
                        ? "opacity-100 rotate-0"
                        : "opacity-0 -rotate-90"
                    }`}
                  />
                  <Icons.chevronRight
                    className={`w-6 h-6 absolute transition-all duration-300 ${
                      sidebarOpen
                        ? "opacity-0 rotate-90"
                        : "opacity-100 rotate-0"
                    }`}
                  />
                </div>
              </button>
              <h1 className="ml-4 text-lg font-semibold text-gray-800 dark:text-gray-200">
                {navItems.find((item) => item.href === pathname)?.name ||
                  "Dashboard"}
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              {/* <button className="p-2 rounded-full text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 relative transition-colors">
                <Icons.bell className="w-5 h-5" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              </button> */}
              <div className="relative">
                <button className="flex items-center space-x-2 focus:outline-none group">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#0b1d51] to-[#4DA8DA] flex items-center justify-center text-white">
                    {session?.user?.name?.charAt(0) || (
                      <Icons.user className="w-5 h-5" />
                    )}
                  </div>
                  <div className="hidden md:flex flex-col items-start">
                    <span className="hidden md:inline-block text-sm font-medium text-gray-700 dark:text-gray-200 group-hover:text-[#0b1d51] dark:group-hover:text-[#4DA8DA] transition-colors capitalize">
                      {session?.user?.name}
                    </span>
                    <span className="hidden md:inline-block text-[12px] font-medium text-gray-700 dark:text-gray-200 group-hover:text-[#0b1d51] dark:group-hover:text-[#4DA8DA] transition-colors">
                      {session?.user?.email}
                    </span>
                  </div>
                  {/* <Icons.chevronDown className="hidden md:block w-4 h-4 text-gray-500 group-hover:text-[#0b1d51] dark:group-hover:text-[#4DA8DA] transition-colors" /> */}
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-6">
          <div className="mx-auto lg:max-w-6xl">
            <div className="animate-fadeIn bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 md:p-6 hover:shadow-md transition-shadow duration-300">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
