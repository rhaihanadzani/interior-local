"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

const NoSessionLayout = ({ children }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const quickLinks = [
    { name: "Beranda", href: "/" },
    { name: "Layanan", href: "/layanan" },
    { name: "Portofolio", href: "/portofolio" },
    { name: "Tentang Kami", href: "/tentang" },
    { name: "Kontak", href: "/kontak" },
    { name: "Blog", href: "/blog" },
  ];

  const services = [
    { name: "Desain Rumah", href: "/layanan/desain-rumah" },
    { name: "Desain Kantor", href: "/layanan/desain-kantor" },
    { name: "Desain Restoran", href: "/layanan/desain-restoran" },
    { name: "Renovasi Interior", href: "/layanan/renovasi-interior" },
    { name: "Konsultasi Desain", href: "/layanan/konsultasi-desain" },
    { name: "3D Rendering", href: "/layanan/3d-rendering" },
  ];

  const contactInfo = [
    {
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
      text: "Jl. Desain Interior No. 123, Jakarta, Indonesia",
    },
    {
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
          />
        </svg>
      ),
      text: "+62 123 4567 890",
    },
    {
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      ),
      text: "info@interiorplus.com",
    },
  ];

  const socialMedia = [
    { name: "Facebook", icon: "facebook", href: "#" },
    { name: "Instagram", icon: "instagram", href: "#" },
    { name: "Twitter", icon: "twitter", href: "#" },
    { name: "LinkedIn", icon: "linkedin", href: "#" },
    { name: "Pinterest", icon: "pinterest", href: "#" },
  ];
  return (
    <>
      {/* Navbar */}
      <nav
        className={`fixed w-full z-50 transition-all duration-300 h-16 flex items-center  ${
          scrolled
            ? "bg-[#fff]/70 top-2 backdrop-blur-md  py-2 shadow-lg scale-[0.98] rounded-lg"
            : "bg-transparent py-4 "
        }`}
      >
        <div className="container mx-auto md:px-4 ">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <span
                className={`text-2xl font-bold  px-4 md:px-0 ${
                  scrolled ? "text-primary" : "text-white"
                }`}
              >
                InteriorPlus
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8 ">
              <Link
                href="/"
                className={`  transition-colors  ${
                  scrolled ? "text-primary font-bold" : "text-white font-medium"
                }`}
              >
                Beranda
              </Link>
              <Link
                href="/layanan"
                className={`  transition-colors  ${
                  scrolled ? "text-primary font-bold" : "text-white font-medium"
                }`}
              >
                Layanan
              </Link>
              <Link
                href="/portofolio"
                className={`  transition-colors  ${
                  scrolled ? "text-primary font-bold" : "text-white font-medium"
                }`}
              >
                Portofolio
              </Link>
              <Link
                href="/tentang"
                className={`  transition-colors  ${
                  scrolled ? "text-primary font-bold" : "text-white font-medium"
                }`}
              >
                Tentang Kami
              </Link>
              <Link
                href="/kontak"
                className={`  transition-colors  ${
                  scrolled ? "text-primary font-bold" : "text-white font-medium"
                }`}
              >
                Kontak
              </Link>

              <div className="ml-4">
                <Link
                  href="/auth/login"
                  className="bg-[#4DA8DA] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#3a8fc4] transition-colors"
                >
                  Masuk
                </Link>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden ">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-white focus:outline-none"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {mobileMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          <div
            className={`md:hidden ${
              mobileMenuOpen ? "block" : "hidden"
            } transition-all duration-300  `}
          >
            <div className="pt-4 pb-2 space-y-2 bg-gradient-to-r from-[#0b1d51] to-[#4DA8DA] min-h-screen w-full">
              <Link
                href="/"
                className="block text-white hover:bg-white/10 px-3 py-2 rounded-md transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Beranda
              </Link>
              <Link
                href="/layanan"
                className="block text-white hover:bg-white/10 px-3 py-2 rounded-md transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Layanan
              </Link>
              <Link
                href="/portofolio"
                className="block text-white hover:bg-white/10 px-3 py-2 rounded-md transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Portofolio
              </Link>
              <Link
                href="/tentang"
                className="block text-white hover:bg-white/10 px-3 py-2 rounded-md transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Tentang Kami
              </Link>
              <Link
                href="/kontak"
                className="block text-white hover:bg-white/10 px-3 py-2 rounded-md transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Kontak
              </Link>

              <div className="pt-2 px-4">
                <Link
                  href="/auth/login"
                  className="block bg-[#4DA8DA] text-white text-center px-3 py-2 rounded-lg font-medium hover:bg-[#3a8fc4] transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Masuk
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {children}

      {/* Footer */}
      <footer className="bg-[#0b1d51] text-white pt-16 pb-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* About */}
            <div className="lg:col-span-2">
              <h3 className="text-2xl font-bold mb-4">InteriorPlus</h3>
              <p className="text-gray-300 mb-6">
                Platform terdepan untuk pemesanan jasa desain interior
                profesional. Kami menghubungkan Anda dengan desainer
                berpengalaman untuk mewujudkan ruang impian Anda.
              </p>
              <div className="flex space-x-4">
                {socialMedia.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#4DA8DA] transition-colors"
                    aria-label={social.name}
                  >
                    <p className="text-white text-sm ">
                      {social.name.charAt(0).toUpperCase()}
                    </p>
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Tautan Cepat</h4>
              <ul className="space-y-2">
                {quickLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-300 hover:text-[#4DA8DA] transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Layanan</h4>
              <ul className="space-y-2">
                {services.map((service) => (
                  <li key={service.name}>
                    <Link
                      href={service.href}
                      className="text-gray-300 hover:text-[#4DA8DA] transition-colors"
                    >
                      {service.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div className="md:col-span-2 lg:col-span-1">
              <h4 className="text-lg font-semibold mb-4">Hubungi Kami</h4>
              <ul className="space-y-3">
                {contactInfo.map((info, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-3 mt-0.5 text-[#4DA8DA]">
                      {info.icon}
                    </span>
                    <span className="text-gray-300">{info.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-300 text-sm mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} InteriorPlus. All rights
              reserved.
            </p>

            <div className="flex space-x-6">
              <Link
                href="/privacy"
                className="text-gray-300 hover:text-[#4DA8DA] text-sm transition-colors"
              >
                Kebijakan Privasi
              </Link>
              <Link
                href="/terms"
                className="text-gray-300 hover:text-[#4DA8DA] text-sm transition-colors"
              >
                Syarat & Ketentuan
              </Link>
              <Link
                href="/sitemap"
                className="text-gray-300 hover:text-[#4DA8DA] text-sm transition-colors"
              >
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};
export default NoSessionLayout;
