"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import InputField from "@/components/ui/InputField";
import AuthSwitch from "@/components/ui/AuthSwitch";
import { signUp } from "@/lib/auth/register";
import { toast } from "sonner";

const AuthForm = ({ type }) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    ...(type === "register" && { name: "" }),
    email: "",
    password: "",
    ...(type === "register" && { phone: "" }),
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shake, setShake] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const container = document.querySelector(".auth-container");
    if (container) {
      container.classList.add("opacity-100");
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (type === "register" && !formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (type === "register" && !formData.phone.trim()) {
      newErrors.phone = "Phone is required";
    } else if (type === "register" && !/^[0-9]{10,15}$/.test(formData.phone)) {
      newErrors.phone = "Phone number is invalid";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    try {
      const message = await signUp(
        formData.email,
        formData.password,
        formData.phone,
        formData.name
      );

      if (message === "Email Already Exist") {
        throw new Error(message || "Registration failed");
      }

      if (message === "Sign Up Success") {
        router.refresh();
        router.push("/auth/login");
      }
    } catch (error) {
      throw error;
    }
  };

  const handleLogin = async () => {
    const signInresponse = await signIn("credentials", {
      redirect: false,
      email: formData.email,
      password: formData.password,
    });

    if (!signInresponse || signInresponse.ok !== true) {
      throw new Error("Invalid Email or Password");
    }

    if (signInresponse?.error) {
      throw new Error(signInresponse.error);
    }

    return signInresponse;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    setIsSubmitting(true);
    setErrors({});
    let toastId;

    try {
      if (type === "register") {
        toastId = toast.loading("Creating your account...", {
          description: "Please wait while we process your registration",
        });

        const result = await handleRegister();

        console.log(result);

        toast.success("Registration Successful!", {
          id: toastId,
          description: "Your account has been created successfully",
        });

        setTimeout(() => {
          router.push("/auth/login?registered=true");
        }, 1500);
      } else {
        toastId = toast.loading("Signing in...", {
          description: "Please wait while we authenticate you",
        });

        const result = await handleLogin();

        toast.success("Login Successful!", {
          id: toastId,
          description: "Redirecting to your dashboard",
        });

        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Auth Error:", error);

      // Pastikan untuk menghapus toast loading sebelum menampilkan error
      toast.dismiss(toastId);

      toast.error("Authentication Failed", {
        description: error.message || "An error occurred. Please try again.",
      });
      setShake(true);
      setTimeout(() => setShake(false), 500);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div
      className={`auth-container min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0B1D51] via-[#4DA8DA] to-gray-900 opacity-0 transition-opacity duration-1000 relative overflow-hidden px-4 sm:px-6 lg:px-8`}
    >
      {/* Floating Particles */}
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white bg-opacity-10"
          style={{
            width: `${Math.random() * 20 + 4}px`,
            height: `${Math.random() * 20 + 4}px`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animation: `float ${Math.random() * 12 + 8}s linear infinite`,
            animationDelay: `${Math.random() * 4}s`,
            opacity: Math.random() * 0.4 + 0.1,
          }}
        />
      ))}

      {/* Twinkling Stars */}
      {[...Array(15)].map((_, i) => (
        <div
          key={`star-${i}`}
          className="absolute rounded-full bg-white"
          style={{
            width: `${Math.random() * 10 + 1}px`,
            height: `${Math.random() * 10 + 1}px`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animation: `twinkle ${
              Math.random() * 2 + 1.5
            }s ease-in-out infinite alternate`,
            animationDelay: `${Math.random() * 4}s`,
            opacity: 0,
          }}
        />
      ))}

      {/* Floating Shapes */}
      <div className="absolute top-1/4 left-1/4 w-24 h-24 sm:w-32 sm:h-32 bg-[#0B1D51] rounded-full opacity-10 blur-xl animate-float1"></div>
      <div className="absolute top-1/3 right-1/4 w-28 h-28 sm:w-40 sm:h-40 bg-blue-500 rounded-lg opacity-10 blur-xl animate-float2"></div>
      <div className="absolute bottom-1/4 left-1/3 w-32 h-32 sm:w-48 sm:h-48 bg-[#4DA8DA] rounded-full opacity-10 blur-xl animate-float3"></div>
      <div className="absolute bottom-1/3 right-1/3 w-28 h-28 sm:w-36 sm:h-36 bg-pink-500 rounded-lg opacity-10 blur-xl animate-float4"></div>

      <div
        className={`relative bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl w-full max-w-[700px] ${
          shake ? "animate-shake" : ""
        }`}
      >
        {/* Header dengan gradient */}
        <div className="bg-gradient-to-r from-[#0B1D51] to-[#4DA8DA] p-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            {type === "login" ? "Welcome Back" : "Create Account"}
          </h2>
          <p className="text-blue-100 mt-2 text-sm sm:text-base">
            {type === "login" ? "Sign in to continue" : "Join us today"}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {type === "register" && (
            <InputField
              label="Full Name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              icon={
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              }
            />
          )}

          <InputField
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            icon={
              <svg
                className="w-5 h-5 text-gray-400"
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
            }
          />

          <InputField
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            icon={
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            }
          />

          {type === "register" && (
            <InputField
              label="Phone Number"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              error={errors.phone}
              icon={
                <svg
                  className="w-5 h-5 text-gray-400"
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
              }
            />
          )}

          {type === "login" && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-[#0B1D51] focus:ring-[#0B1D51] border-gray-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a
                  href="#"
                  className="font-medium text-[#0B1D51] hover:text-[#0B1D51]/80 transition-colors"
                >
                  Forgot password?
                </a>
              </div>
            </div>
          )}

          <div className="relative">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 px-4 bg-gradient-to-r from-[#0B1D51] to-[#4DA8DA] hover:from-[#0B1D51]/90 hover:to-[#4DA8DA]/90 text-white font-medium rounded-lg shadow-md transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[#0B1D51] focus:ring-opacity-50 ${
                isSubmitting ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  {type === "login" ? "Signing in..." : "Registering..."}
                </span>
              ) : type === "login" ? (
                "Sign In"
              ) : (
                "Sign Up"
              )}
            </button>

            {success && (
              <div className="absolute inset-0 flex items-center justify-center bg-green-500 bg-opacity-90 rounded-lg transition-opacity duration-500">
                <svg
                  className="w-8 h-8 text-white animate-check"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            )}
          </div>

          {errors.submit && (
            <div className="text-red-500 text-sm text-center py-2 px-4 bg-red-50 rounded-lg animate-pulse">
              {errors.submit}
            </div>
          )}
        </form>

        {/* Footer dengan switch antara login/register */}
        <div className="px-6 py-4 bg-gray-50 text-center">
          <AuthSwitch type={type} />
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
