'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"
import axios from "axios"
import Image from "next/image"
import { Logo } from '../../../index'
import { useSearchParams } from "next/navigation"
import { useRouter } from "next/navigation"

export default function ForgotPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token"); // Ambil token dari URL parameter
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    if (!token) {
      alert("Token is missing. Please check your reset link.");
      setLoading(false);
      return;
    }
  
    if (password.length < 8) {
      alert("Password must be at least 8 characters long.");
      setLoading(false);
      return;
    }
  
    try {
      await axios.post(`http://localhost:8080/update-password`, {
        token,
        password,
      });
      alert("Password updated successfully!");
      router.push("/login");
    } catch (error) {
      console.error("Error resetting password:", error);
      alert("Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="relative flex h-screen items-center justify-center bg-gray-100 overflow-hidden">
      {/* Circle Backgrounds */}
      <div className="absolute top-[-120px] left-[-120px] w-[300px] h-[300px] border-[15px] border-green-500 rounded-full opacity-70 z-0"></div>
      <div className="absolute top-0 right-[-150px] w-[300px] h-[300px] bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full opacity-50 z-0"></div>
      <div className="absolute bottom-[-100px] left-[-80px] w-[300px] h-[300px] bg-gradient-to-br from-teal-400 to-teal-600 rounded-full opacity-60 z-0"></div>
      <div className="absolute bottom-0.5 right-[120px] w-[300px] h-[300px] border-[10px] border-purple-400 rounded-full opacity-70 z-0"></div>
      <div className="absolute top-[250px] left-[50px] w-[200px] h-[200px] bg-gradient-to-br from-red-400 to-red-500 rounded-full opacity-50 z-0"></div>
      <div className="absolute top-[20px] right-[450px] w-[250px] h-[250px] border-[12px] border-blue-500 rounded-full opacity-50 z-0"></div>
      <div className="absolute bottom-[20px] right-[900px] w-[220px] h-[220px] bg-gradient-to-br from-purple-600 to-purple-700 rounded-full opacity-50 z-0"></div>

      {/* Form Container */}
      <div className="relative bg-white shadow-xl rounded-3xl flex w-full max-w-4xl overflow-hidden z-10">
        {/* Left Section */}
        <div className="hidden md:flex items-center justify-center w-1/2 bg-white">
          <Image
            src={Logo}
            alt="Geeksfarm"
          />
        </div>

        {/* Right Section (Form) */}
        <form
          onSubmit={handleResetPassword}
          className="flex flex-col gap-6 p-12 bg-gradient-to-br from-purple-700 via-purple-800 to-purple-900 w-full md:w-1/2 text-white"
        >
          <h2 className="text-4xl font-bold mb-6 text-center">Forgot Password</h2>
<div className="space-y-2">
  <Label htmlFor="password" className="font-semibold text-sm">
    Password
  </Label>
  <div className="relative">
    <Input
      id="password"
      type="password"
      placeholder="Enter your password"
      required
      className="bg-white text-gray-800 rounded-lg shadow-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
      onChange={(e) => setPassword(e.target.value)}
    />
  </div>
</div>

          <Button
            type="submit"
            className="bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 shadow-lg transition mb-4"
            disabled={loading}
          >
            {loading ? "Sending..." : "Reset Password"}
          </Button>
        </form>
      </div>
    </div>
  )
}
