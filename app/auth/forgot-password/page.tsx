"use client"

import { useState } from "react"
import Link from "next/link"
import Image from 'next/image'

import { authService } from "@/lib/auth-service"

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [email, setEmail] = useState("")

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(false)

    try {      const result = await authService.forgotPassword({ email })

      if (!result.success) {
        setError(result.error)
        return
      }

      setSuccess(true)
      setEmail("")
    } catch (error) {
      setError("An unexpected error occurred. Please try again.")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br py-8 px-4">
      <div className="flex w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden relative min-h-[600px] border border-[#10bc69]/10">
        {/* Form Section */}
        <div className="flex-1 p-10 z-10 flex flex-col justify-center">
          <h2 className="text-3xl font-bold mb-8 text-gray-800 relative after:content-[''] after:block after:w-12 after:h-1 after:bg-gradient-to-r after:from-[#10bc69] after:to-[#10bc69] after:mt-2 after:rounded-full">Reset Password</h2>
          <form onSubmit={onSubmit} className="space-y-6">
            {error && <div className="text-red-600 text-sm mt-1 font-medium">{error}</div>}
            {success && (
              <div className="bg-[#10bc69]/10 text-[#10bc69] p-4 rounded-lg mb-4">
                If an account exists with that email, we've sent password reset instructions.
              </div>
            )}
            <div className="relative mb-4">
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className="w-full py-3 pl-12 pr-4 rounded-full bg-gray-100 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#10bc69] text-base text-gray-900 placeholder-gray-500 transition shadow-sm"
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2l0 12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6z" />
                  <path d="M2 6l10 7 10-7" />
                </svg>
              </span>
            </div>
            <div className="mb-4">
              <button
                type="submit"
                className="w-full py-3 rounded-full bg-[#10bc69] text-white font-semibold text-lg shadow-md hover:bg-[#0e9e5c] transition disabled:opacity-60"
                disabled={isLoading}
              >
                {isLoading ? 'Sending instructions...' : 'Reset Password'}
              </button>
            </div>
          </form>
          <Link href="/auth/login" className="block mt-2 text-center text-sm text-gray-500 hover:text-[#10bc69] transition">Back to Login</Link>
        </div>
        {/* Curve Divider */}
        <div className="absolute top-0 bottom-0 left-[45%] w-[10%] z-0 hidden md:block">
          <div className="absolute inset-0 bg-gradient-to-br from-[#10bc69] to-[#10bc69] rounded-l-full scale-x-125"></div>
        </div>
        {/* Info Section */}
        <div className="flex-1 bg-gradient-to-br from-[#10bc69] to-[#10bc69] text-white p-10 flex flex-col justify-between relative z-10">
          <div className="text-center mt-10">
            <h3 className="text-3xl font-bold mb-4">Remember Password?</h3>
            <p className="mb-8 text-lg">Sign in to access your account and manage your queues!</p>
            <Link href="/auth/login" className="inline-block px-8 py-3 border-2 border-white rounded-full font-bold text-white hover:bg-white hover:text-[#10bc69] transition-all duration-200">Sign In</Link>
          </div>
          <div className="flex justify-center items-center mt-10">
            <Image
              src="/images/Forgotpassword.svg"
              alt="Reset password illustration"
              width={300}
              height={300}
              priority
              className="drop-shadow-lg"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
