'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from 'lucide-react'
import axios from 'axios'
import Image from 'next/image'
import { Logo } from '../../../index'

export default function SetPasswordPage() {
    const [token, setToken] = useState(null)

    useEffect(() => {
        const fetchToken = async () => {
            const searchParams = new URLSearchParams(window.location.search)
            const token = searchParams.get('token')
            setToken(token)
        }
        fetchToken()
    }, [])

    const [password, setPasswordState] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setIsLoading(true)

        if (password !== confirmPassword) {
            setError('Passwords do not match')
            setIsLoading(false)
            return
        }

        if (password.length < 8) {
            setError('Password must be at least 8 characters long')
            setIsLoading(false)
            return
        }

        try {
          const result = await axios.post('http://localhost:8080/set-password', { password_1: password, password_2: confirmPassword }, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          if (result) {
            router.push('/login?reset=success')
          }
        } catch (error) {
          if (error.response && error.response.data) {
            console.error('API Response Error:', error.response.data);
          } else {
            console.error('Unexpected error:', error);
          }
          setError('An unexpected error occurred');
        } finally {
          setIsLoading(false);
        }
        
    }

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
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-6 p-12 bg-gradient-to-br from-purple-700 via-purple-800 to-purple-900 w-full md:w-1/2 text-white"
                >
                    <h2 className="text-4xl font-bold mb-6 text-center">Set New Password</h2>
                    <div className="space-y-2">
                        <Label htmlFor="password" className="font-semibold text-sm">
                            New Password
                        </Label>
                        <div className="relative">
                            <Input
                                id="password"
                                type="password"
                                placeholder="Enter your new password"
                                required
                                className="bg-white text-gray-800 rounded-lg shadow-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                onChange={(e) => setPasswordState(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword" className="font-semibold text-sm">
                            Confirm New Password
                        </Label>
                        <div className="relative">
                            <Input
                                id="confirmPassword"
                                type="password"
                                placeholder="Confirm your new password"
                                required
                                className="bg-white text-gray-800 rounded-lg shadow-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm flex items-center">
                            <AlertCircle className="w-4 h-4 mr-2" />
                            {error}
                        </div>
                    )}

                    <Button
                        type="submit"
                        className="bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 shadow-lg transition mb-4"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Setting Password...' : 'Set New Password'}
                    </Button>
                </form>
            </div>
        </div>
    )
}
