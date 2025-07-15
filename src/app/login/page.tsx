"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input, Button, Loader } from "@/components";
import { signIn, useSession } from "next-auth/react";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    general: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();

  // Redirect logged-in users to dashboard
  useEffect(() => {
    if (status === "authenticated" && session) {
      router.push("/dashboard");
    }
  }, [session, status, router]);

  // Show loading while checking authentication status
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#f0f7ea] to-white flex items-center justify-center">
        <Loader text="Loading..." />
      </div>
    );
  }

  // Don't render the form if user is authenticated
  if (status === "authenticated") {
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
        general: "",
      }));
    }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      email: "",
      password: "",
      general: "",
    };

    if (!formData.email) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
      valid = false;
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setErrors((prev) => ({ ...prev, general: "" }));

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });

      console.log("Login result:", result); // Debugging

      if (result?.error) {
        setErrors({
          email: "",
          password: "",
          general:
            result.error === "Email not registered"
              ? "Email not registered"
              : result.error === "Incorrect password"
              ? "Incorrect password"
              : "Invalid email or password",
        });
      } else if (!result?.error) {
        // Successful login
        router.push("/dashboard");
      }
    } catch (err) {
      console.error("Login error:", err);
      setErrors({
        email: "",
        password: "",
        general: "An unexpected error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f0f7ea] to-white flex items-center justify-center p-4">
      <div className="w-full max-w-4xl flex flex-col md:flex-row gap-0 md:gap-0 items-stretch justify-center shadow-2xl rounded-xl overflow-hidden">
        {/* CTA Card on the left */}
        <div className="flex flex-col justify-center items-center bg-white w-full md:w-1/2 p-8 text-center rounded-none md:rounded-l-xl shadow-md">
          <h2 className="text-2xl font-extrabold mb-6 text-[#1A365D]">
            Welcome Back to ChurchFinder
          </h2>
          <ul className="space-y-6 w-full max-w-xs mx-auto">
            <li className="flex items-center gap-3 justify-center">
              <span className="text-[#7FC242] text-2xl">✓</span>
              <span className="text-lg text-[#1A365D]">
                Access your church dashboard
              </span>
            </li>
            <li className="flex items-center gap-3 justify-center">
              <span className="text-[#7FC242] text-2xl">✓</span>
              <span className="text-lg text-[#1A365D]">
                Manage events and church details
              </span>
            </li>
            <li className="flex items-center gap-3 justify-center">
              <span className="text-[#7FC242] text-2xl">✓</span>
              <span className="text-lg text-[#1A365D]">
                Connect with more believers
              </span>
            </li>
          </ul>
          <div className="mt-10">
            <p className="text-gray-600 text-sm mb-3">Don't have an account?</p>
            <Button
              variant="outline"
              rounded
              onClick={() => router.push("/register")}
              className="px-6 py-3 font-bold text-base border-[#7FC242] text-[#7FC242] hover:bg-[#F0F7EA]"
            >
              Sign Up
            </Button>
          </div>
        </div>
        {/* Login Form Box on the right */}
        <div className="w-full md:w-1/2 bg-white flex flex-col justify-center p-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-[#249178]">
              Sign In to Your Account
            </h1>
            <p className="text-gray-600 mt-1">
              Access your dashboard, manage your church, and more.
            </p>
          </div>

          {errors.general && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-3 rounded">
              <p className="text-red-700 text-sm">{errors.general}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              required
            />

            <Input
              label="Password"
              name="password"
              type="text"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              required
            />

            <Button
              type="submit"
              variant="primary"
              disabled={isLoading}
              className="w-full py-3 text-lg font-bold"
            >
              {isLoading ? (
                <Loader text="Signing in..." />
              ) : (
                <span>Sign In</span>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
