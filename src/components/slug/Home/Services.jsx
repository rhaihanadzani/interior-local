import React from "react";

const Services = ({ services, loading }) => {
  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          {/* Skeleton untuk header */}
          <div className="text-center mb-12">
            <div className="h-8 w-48 bg-gray-200 rounded mx-auto mb-4 animate-pulse"></div>
            <div className="h-4 w-64 bg-gray-200 rounded mx-auto animate-pulse"></div>
          </div>

          {/* Skeleton untuk service cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-gray-50 rounded-xl p-6 border border-gray-100"
              >
                {/* Icon circle skeleton */}
                <div className="w-16 h-16 bg-gray-200 rounded-full mb-4 animate-pulse"></div>

                {/* Title skeleton */}
                <div className="h-6 w-3/4 bg-gray-200 rounded mb-3 animate-pulse"></div>

                {/* Description skeleton */}
                <div className="space-y-2 mb-4">
                  <div className="h-3 w-full bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-3 w-5/6 bg-gray-200 rounded animate-pulse"></div>
                </div>

                {/* Sub-description skeleton */}
                <div className="space-y-2">
                  <div className="h-3 w-4/5 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-3 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-3 w-2/3 bg-gray-200 rounded animate-pulse"></div>
                </div>

                {/* Decorative element skeleton */}
                <div
                  className={`absolute ${
                    i % 2 === 0 ? "top-0 right-0" : "bottom-0 left-0"
                  } w-16 h-16 bg-gray-200/30 rounded-full`}
                ></div>
              </div>
            ))}
          </div>

          {/* Skeleton untuk button */}
          <div className="text-center mt-12">
            <div className="h-12 w-64 bg-gray-200 rounded-lg mx-auto animate-pulse"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#0b1d51] mb-4">
            Layanan Kami
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Solusi lengkap untuk semua kebutuhan desain interior Anda
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div
              key={service.id}
              className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-[#4DA8DA]/30 group relative overflow-hidden"
            >
              {/* Decorative floating element */}
              <div
                className={`absolute ${
                  index % 2 === 0 ? "top-0 right-0" : "bottom-0 left-0"
                } w-16 h-16 bg-[#4DA8DA]/10 rounded-full ${
                  index % 2 === 0 ? "animate-float2" : "animate-float4"
                }`}
              ></div>

              <div className="relative z-10">
                <div className="w-16 h-16 bg-[#4DA8DA]/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-[#4DA8DA]/20 transition-colors">
                  <svg
                    className="w-10 h-10 text-[#0b1d51]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>

                <h3 className="text-xl font-bold text-[#0b1d51] mb-2">
                  {service.name}
                </h3>
                <p className="text-gray-600 mb-4">{service.description}</p>

                <ul className="space-y-2">
                  {service.subdesc && (
                    <div className="text-sm text-muted-foreground space-y-1">
                      {service.subdesc.split("\n").map((line, i) => (
                        <p key={i}>{line}</p>
                      ))}
                    </div>
                  )}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="bg-[#0b1d51] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#0a1845] transition-all flex items-center mx-auto">
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
              />
            </svg>
            Jelajahi Semua Layanan
          </button>
        </div>
      </div>
    </section>
  );
};

export default Services;
