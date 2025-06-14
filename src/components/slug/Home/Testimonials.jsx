"use client";
import React from "react";

const Testimonials = ({ testimonials, loading }) => {
  if (loading) {
    return (
      <section className="py-16 bg-[#0b1d51] text-white">
        <div className="container mx-auto px-4">
          {/* Skeleton untuk header */}
          <div className="text-center mb-12">
            <div className="h-8 w-64 bg-white/20 rounded mx-auto mb-4 animate-pulse"></div>
            <div className="h-4 w-80 bg-white/20 rounded mx-auto animate-pulse"></div>
          </div>

          {/* Skeleton untuk testimonial cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-white/10 rounded-xl p-6 border border-white/20"
              >
                {/* User profile skeleton */}
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-full mr-4 animate-pulse"></div>
                  <div className="flex-1">
                    <div className="h-4 w-3/4 bg-white/20 rounded mb-2 animate-pulse"></div>
                    <div className="h-3 w-1/2 bg-white/20 rounded animate-pulse"></div>
                  </div>
                </div>

                {/* Comment skeleton */}
                <div className="space-y-2 mb-4">
                  <div className="h-3 w-full bg-white/20 rounded animate-pulse"></div>
                  <div className="h-3 w-5/6 bg-white/20 rounded animate-pulse"></div>
                  <div className="h-3 w-4/6 bg-white/20 rounded animate-pulse"></div>
                </div>

                {/* Rating skeleton */}
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="w-5 h-5 bg-white/20 rounded mr-1 animate-pulse"
                    ></div>
                  ))}
                </div>

                {/* Decorative element skeleton */}
                <div
                  className={`absolute ${
                    i % 2 === 0 ? "bottom-0 right-0" : "top-0 left-0"
                  } w-20 h-20 bg-white/10 rounded-full`}
                ></div>
              </div>
            ))}
          </div>

          {/* Skeleton untuk button */}
          <div className="text-center mt-12">
            <div className="h-12 w-64 bg-white/20 rounded-lg mx-auto animate-pulse"></div>
          </div>
        </div>
      </section>
    );
  }

  // Function to get initials from name
  const getInitials = (name) => {
    if (!name) return "";
    const names = name.split(" ");
    let initials = names[0].substring(0, 1).toUpperCase();
    if (names.length > 1) {
      initials += names[names.length - 1].substring(0, 1).toUpperCase();
    }
    return initials;
  };

  // Function to generate random background color
  const getRandomColor = () => {
    const colors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-red-500",
      "bg-yellow-500",
      "bg-teal-500",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <section className="py-16 bg-[#0b1d51] text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Apa Kata Pelanggan Kami</h2>
          <p className="text-blue-100 max-w-2xl mx-auto">
            Dengarkan pengalaman langsung dari klien yang telah menggunakan jasa
            kami
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className="bg-white/10 rounded-xl p-6 backdrop-blur-sm border border-white/20 hover:border-[#4DA8DA] transition-all duration-300 relative overflow-hidden"
            >
              {/* Floating decorative elements */}
              <div
                className={`absolute ${
                  index % 2 === 0 ? "bottom-0 right-0" : "top-0 left-0"
                } w-20 h-20 bg-[#4DA8DA]/20 rounded-full ${
                  index % 2 === 0 ? "animate-float2" : "animate-float4"
                }`}
              ></div>

              <div className="relative z-10">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden mr-4 border-2 border-white flex items-center justify-center">
                    {testimonial.user?.profileImage ? (
                      <img
                        src={testimonial.user.profileImage.url}
                        alt={testimonial.user.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div
                        className={`w-full h-full flex items-center justify-center ${getRandomColor()}`}
                      >
                        <span className="text-white font-bold text-lg">
                          {getInitials(testimonial.user?.name)}
                        </span>
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold">
                      {testimonial.user?.name || "Anonymous"}
                    </h4>
                    <p className="text-blue-100 text-sm">
                      {testimonial.user?.role || "Client"}
                    </p>
                  </div>
                </div>

                <p className="mb-4 italic">"{testimonial.comment}"</p>

                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${
                        i < testimonial.rating
                          ? "text-yellow-400"
                          : "text-gray-500"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="border-2 border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white hover:text-[#0b1d51] transition-all flex items-center mx-auto">
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
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              />
            </svg>
            Beri Testimoni Anda
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
