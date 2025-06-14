"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const PortfolioGallery = ({ portfolioItems, loading }) => {
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [hoveredItem, setHoveredItem] = useState(null);

  // Extract unique categories from portfolioItems
  const allCategories = [
    "Semua",
    ...new Set(portfolioItems.map((item) => item.category)),
  ];

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          {/* Skeleton untuk header */}
          <div className="text-center mb-12">
            <div className="h-8 w-48 bg-gray-200 rounded mx-auto mb-4 animate-pulse"></div>
            <div className="h-4 w-64 bg-gray-200 rounded mx-auto animate-pulse"></div>
          </div>

          {/* Skeleton untuk category filter */}
          <div className="flex justify-center flex-wrap gap-2 mb-8">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-10 w-24 bg-gray-200 rounded-full animate-pulse"
              ></div>
            ))}
          </div>

          {/* Skeleton untuk portfolio grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-lg overflow-hidden"
              >
                <div className="aspect-[4/3] bg-gray-200 animate-pulse"></div>
                <div className="p-4">
                  <div className="h-5 w-3/4 bg-gray-200 rounded mb-2 animate-pulse"></div>
                  <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Skeleton untuk button */}
          <div className="text-center mt-12">
            <div className="h-12 w-48 bg-gray-200 rounded-lg mx-auto animate-pulse"></div>
          </div>
        </div>
      </section>
    );
  }

  const filteredItems =
    activeCategory === "Semua"
      ? portfolioItems
      : portfolioItems.filter((item) => item.category === activeCategory);

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#0b1d51] mb-4">
            Portofolio Kami
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Lihat hasil karya desainer profesional kami yang telah mengubah
            berbagai ruangan
          </p>
        </div>

        {/* Category filter */}
        <div className="flex justify-center flex-wrap gap-2 mb-8">
          {allCategories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full transition-all ${
                activeCategory === category
                  ? "bg-[#0b1d51] text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Portfolio grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="relative group overflow-hidden rounded-xl shadow-lg bg-white transition-all duration-300 hover:shadow-xl"
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <div className="aspect-[4/3] overflow-hidden">
                {item.images && item.images.length > 0 && (
                  <Image
                    src={item.images[0].url}
                    alt={item.title}
                    width={600}
                    height={450}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                )}
              </div>

              {/* Overlay effect */}
              <div
                className={`absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6`}
              >
                <h3 className="text-white text-xl font-bold mb-1 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  {item.title}
                </h3>
                <p className="text-gray-200 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-100">
                  {item.category} •
                </p>
              </div>

              {/* Floating tag */}
              <div
                className={`absolute top-4 right-4 bg-[#0b1d51] text-white px-3 py-1 rounded-full text-sm font-medium transition-all duration-300 ${
                  hoveredItem === item.id
                    ? "translate-y-0"
                    : "-translate-y-2 opacity-0"
                }`}
              >
                {item.category}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href={"/auth/login"}
            className="border-2 border-[#0b1d51] text-[#0b1d51] px-6 py-3 rounded-lg font-medium hover:bg-[#0b1d51] hover:text-white transition-all"
          >
            Pesan Sekarang Juga
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PortfolioGallery;
