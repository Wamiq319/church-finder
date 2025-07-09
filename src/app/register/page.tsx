"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { signupSchema } from "@/lib/validations/auth";
import { ZodError } from "zod";
import { Loader } from "@/components/ui/Loader";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate with Zod
      signupSchema.parse(formData);

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Registration failed");
      }

      router.push("/login");
    } catch (err) {
      if (err instanceof ZodError) {
        const zodErrors = err.errors.reduce((acc, curr) => {
          acc[curr.path[0]] = curr.message;
          return acc;
        }, {} as Record<string, string>);
        setErrors(zodErrors);
      } else {
        setErrors({
          general: err instanceof Error ? err.message : "Registration failed",
        });
      }
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
            Why Join ChurchFinder?
          </h2>
          <ul className="space-y-6 w-full max-w-xs mx-auto">
            <li className="flex items-center gap-3 justify-center">
              <span className="text-[#7FC242] text-2xl">✓</span>
              <span className="text-lg text-[#1A365D]">
                Register your church profile
              </span>
            </li>
            <li className="flex items-center gap-3 justify-center">
              <span className="text-[#7FC242] text-2xl">✓</span>
              <span className="text-lg text-[#1A365D]">
                List and promote unlimited events
              </span>
            </li>
            <li className="flex items-center gap-3 justify-center">
              <span className="text-[#7FC242] text-2xl">✓</span>
              <span className="text-lg text-[#1A365D]">
                Get discovered by more people
              </span>
            </li>
            <li className="flex items-center gap-3 justify-center">
              <span className="text-[#7FC242] text-2xl">✓</span>
              <span className="text-lg text-[#1A365D]">
                Free forever for churches
              </span>
            </li>
          </ul>
          <div className="mt-10">
            <p className="text-gray-600 text-sm mb-3">
              Already have an account?
            </p>
            <Button
              variant="outline"
              rounded
              onClick={() => router.push("/login")}
              className="px-6 py-3 font-bold text-base border-[#7FC242] text-[#7FC242] hover:bg-[#F0F7EA]"
            >
              Sign In
            </Button>
          </div>
        </div>
        {/* Registration Form Box on the right */}
        <div className="w-full md:w-1/2 bg-white flex flex-col justify-center p-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-[#249178]">
              Create Your Free Account
            </h1>
            <p className="text-gray-600 mt-1">
              Sign up to register your church, list events, and reach more
              people!
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

            <Input
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              required
            />

            <Button
              type="submit"
              variant="primary"
              disabled={isLoading}
              className="w-full py-3 text-lg font-bold"
            >
              {isLoading ? (
                <Loader text="Creating account..." className="text-current" />
              ) : (
                "Create Account"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
