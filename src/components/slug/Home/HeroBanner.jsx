"use client";
import Link from "next/link";
import React from "react";

const HeroBanner = () => {
  return (
    <div className="relative h-[80vh] bg-gradient-to-r from-[#0b1d51] to-[#4DA8DA] overflow-hidden">
      {/* Floating decorative elements */}
      <div className="absolute top-20 left-20 w-40 h-40 bg-white/10 rounded-full animate-float1"></div>
      <div className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-white/10 rounded-lg animate-float2"></div>

      {/* Twinkling stars */}
      {[...Array(15)].map((_, i) => (
        <div
          key={i}
          className="absolute bg-white rounded-full"
          style={{
            width: `${Math.random() * 4 + 2}px`,
            height: `${Math.random() * 4 + 2}px`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animation: `twinkle ${
              Math.random() * 3 + 2
            }s ease-in-out infinite alternate`,
            opacity: 0,
          }}
        />
      ))}

      <div className="container mx-auto h-full flex items-center relative z-10 px-4">
        <div className="max-w-2xl text-white">
          <h1 className="text-5xl font-bold mb-4 animate-fadeIn">
            Transformasi Ruangan Impian Anda
          </h1>
          <p className="text-xl mb-8 opacity-90 animate-fadeIn delay-100">
            Temukan desainer interior profesional untuk mewujudkan visi Anda
          </p>
          <div className="flex gap-4 animate-fadeIn delay-200">
            <Link
              href={"/auth/login"}
              className="bg-white text-[#0b1d51] px-6 py-3 rounded-lg font-medium hover:bg-opacity-90 transition-all transform hover:scale-105"
            >
              Pesan Sekarang
            </Link>
            <button className="border-2 border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white hover:bg-opacity-10 transition-all transform hover:scale-105">
              Lihat Portofolio
            </button>
          </div>
        </div>

        <div className="hidden lg:block absolute right-0 bottom-0 w-1/2 h-full">
          <div className="relative h-full">
            {/* Decorative room image with floating effect */}
            {/* <div className="absolute bottom-0 right-0 w-full h-4/5 bg-[url('/images/interior-sample.jpeg')] bg-cover bg-center rounded-tl-3xl shadow-2xl animate-float3"></div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
