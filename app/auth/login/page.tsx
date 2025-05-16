"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Image from 'next/image'
import { useRedirectIfAuthenticated } from "@/hooks/use-redirect-if-authenticated"

export default function LoginPage() {
  const router = useRouter()
  useRedirectIfAuthenticated()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    try {
      // TODO: Replace with real API call to Laravel backend
      // Example: await authService.login(email, password)
      // Simulate login
      setTimeout(() => {
        setIsLoading(false)
        router.push('/dashboard')
      }, 1000)
    } catch (err) {
      setError('An error occurred. Please try again later.')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8 px-4">
      <div className="flex w-full max-w-4xl bg-white rounded-2xl shadow-lg overflow-hidden relative min-h-[600px]">
        {/* Form Section */}
        <div className="flex-1 p-10 z-10 flex flex-col justify-center">
          <h2 className="text-3xl font-bold mb-8 text-gray-800 relative after:content-[''] after:block after:w-12 after:h-1 after:bg-gradient-to-r after:from-[#10bc69] after:to-[#10bc69] after:mt-2 after:rounded-full">Login</h2>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="relative mb-4">
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className="w-full py-3 pl-12 pr-4 rounded-full bg-gray-100 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#10bc69] text-base text-gray-900 placeholder-gray-500 transition"
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 4h16v16H4z" stroke="none"/><path d="M22 6l-10 7L2 6" /></svg>
              </span>
            </div>
            <div className="relative mb-4">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                disabled={isLoading}
                className="w-full py-3 pl-12 pr-4 rounded-full bg-gray-100 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#10bc69] text-base text-gray-900 placeholder-gray-500 transition"
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" /></svg>
              </span>
            </div>
            {error && <div className="text-red-600 text-sm mt-1">{error}</div>}
            <div className="flex items-center mb-4">
              <label className="flex items-center cursor-pointer text-gray-700 text-base select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  disabled={isLoading}
                  className="hidden"
                />
                <span className="w-4 h-4 mr-2 border-2 border-gray-400 rounded flex items-center justify-center transition-colors bg-white">
                  {rememberMe && (
                    <svg className="w-3 h-3 text-[#10bc69]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" /></svg>
                  )}
                </span>
                Remember Me
              </label>
            </div>
            <div className="mb-4">
              <button
                type="submit"
                className="w-full py-3 rounded-full bg-[#10bc69] text-white font-semibold text-lg shadow-md hover:bg-[#0e9e5c] transition disabled:opacity-60"
                disabled={isLoading}
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </button>
            </div>
          </form>
          <Link href="/auth/forgot-password" className="block mt-2 text-center text-sm text-gray-500 hover:text-[#10bc69] transition">Forgot Your Password?</Link>
          <div className="mt-8 text-center">
            <p className="text-gray-400 mb-4 flex items-center justify-center"><span className="flex-1 h-px bg-gray-200 mx-2"></span>Or Sign in with social platforms<span className="flex-1 h-px bg-gray-200 mx-2"></span></p>
            <div className="flex justify-center gap-3 mt-4">
              <button className="w-10 h-10 rounded-full flex items-center justify-center bg-white shadow hover:shadow-lg transition border border-gray-200 hover:bg-blue-50" aria-label="Facebook">
                <svg className="w-5 h-5 text-[#1877f2]" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.522-4.477-10-10-10S2 6.478 2 12c0 4.991 3.657 9.128 8.438 9.877v-6.987h-2.54v-2.89h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.242 0-1.632.771-1.632 1.562v1.875h2.773l-.443 2.89h-2.33v6.987C18.343 21.128 22 16.991 22 12" /></svg>
              </button>
              <button className="w-10 h-10 rounded-full flex items-center justify-center bg-white shadow hover:shadow-lg transition border border-gray-200 hover:bg-red-50" aria-label="Google">
                <svg className="w-5 h-5 text-[#ea4335]" fill="currentColor" viewBox="0 0 24 24"><path d="M21.805 10.023h-9.765v3.954h5.625c-.243 1.243-1.486 3.654-5.625 3.654-3.375 0-6.125-2.792-6.125-6.25s2.75-6.25 6.125-6.25c1.92 0 3.2.82 3.94 1.53l2.7-2.62C17.06 2.7 14.92 1.5 12.04 1.5 6.48 1.5 2 6.02 2 12s4.48 10.5 10.04 10.5c5.8 0 9.62-4.08 9.62-9.84 0-.66-.07-1.16-.16-1.637z" /></svg>
              </button>
              <button className="w-10 h-10 rounded-full flex items-center justify-center bg-white shadow hover:shadow-lg transition border border-gray-200 hover:bg-blue-100" aria-label="Twitter">
                <svg className="w-5 h-5 text-[#1da1f2]" fill="currentColor" viewBox="0 0 24 24"><path d="M22.46 6c-.77.35-1.6.59-2.47.7a4.3 4.3 0 0 0 1.88-2.37c-.83.5-1.75.87-2.72 1.07A4.28 4.28 0 0 0 16.11 4c-2.37 0-4.29 1.92-4.29 4.29 0 .34.04.67.1.99C7.69 8.99 4.07 7.13 1.64 4.16c-.37.64-.58 1.38-.58 2.18 0 1.5.76 2.82 1.92 3.6-.7-.02-1.36-.22-1.94-.54v.05c0 2.1 1.5 3.85 3.5 4.25-.36.1-.74.16-1.13.16-.28 0-.54-.03-.8-.08.54 1.7 2.1 2.94 3.95 2.97A8.6 8.6 0 0 1 2 19.54c-.63 0-1.25-.04-1.86-.11A12.13 12.13 0 0 0 6.29 21c7.55 0 11.68-6.26 11.68-11.68 0-.18 0-.36-.01-.53A8.18 8.18 0 0 0 22.46 6z" /></svg>
              </button>
              <button className="w-10 h-10 rounded-full flex items-center justify-center bg-white shadow hover:shadow-lg transition border border-gray-200 hover:bg-blue-200" aria-label="LinkedIn">
                <svg className="w-5 h-5 text-[#0077b5]" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-9h3v9zm-1.5-10.28c-.97 0-1.75-.79-1.75-1.75s.78-1.75 1.75-1.75 1.75.79 1.75 1.75-.78 1.75-1.75 1.75zm13.5 10.28h-3v-4.5c0-1.08-.02-2.47-1.5-2.47-1.5 0-1.73 1.18-1.73 2.39v4.58h-3v-9h2.88v1.23h.04c.4-.75 1.38-1.54 2.84-1.54 3.04 0 3.6 2 3.6 4.59v4.72z" /></svg>
              </button>
              <button className="w-10 h-10 rounded-full flex items-center justify-center bg-white shadow hover:shadow-lg transition border border-gray-200 hover:bg-pink-100" aria-label="Instagram">
                <svg className="w-5 h-5 text-[#e1306c]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.2c3.2 0 3.584.012 4.85.07 1.17.056 1.97.24 2.43.41.59.22 1.01.48 1.45.92.44.44.7.86.92 1.45.17.46.354 1.26.41 2.43.058 1.266.07 1.65.07 4.85s-.012 3.584-.07 4.85c-.056 1.17-.24 1.97-.41 2.43-.22.59-.48 1.01-.92 1.45-.44.44-.86.7-1.45.92-.46.17-1.26.354-2.43.41-1.266.058-1.65.07-4.85.07s-3.584-.012-4.85-.07c-1.17-.056-1.97-.24-2.43-.41-.59-.22-1.01-.48-1.45-.92-.44-.44-.7-.86-.92-1.45-.17-.46-.354-1.26-.41-2.43C2.212 15.634 2.2 15.25 2.2 12s.012-3.584.07-4.85c.056-1.17.24-1.97.41-2.43.22-.59.48-1.01.92-1.45.44-.44.86-.7 1.45-.92.46-.17 1.26-.354 2.43-.41C8.416 2.212 8.8 2.2 12 2.2zm0-2.2C8.736 0 8.332.012 7.052.07 5.78.128 4.87.31 4.13.54c-.74.23-1.36.54-1.98 1.16-.62.62-.93 1.24-1.16 1.98-.23.74-.412 1.65-.47 2.92C.012 8.332 0 8.736 0 12c0 3.264.012 3.668.07 4.948.058 1.272.24 2.182.47 2.922.23.74.54 1.36 1.16 1.98.62.62 1.24.93 1.98 1.16.74.23 1.65.412 2.92.47C8.332 23.988 8.736 24 12 24s3.668-.012 4.948-.07c1.272-.058 2.182-.24 2.922-.47.74-.23 1.36-.54 1.98-1.16.62-.62.93-1.24 1.16-1.98.23-.74.412-1.65.47-2.92.058-1.28.07-1.684.07-4.948 0-3.264-.012-3.668-.07-4.948-.058-1.272-.24-2.182-.47-2.922-.23-.74-.54-1.36-1.16-1.98-.62-.62-1.24-.93-1.98-1.16-.74-.23-1.65-.412-2.92-.47C15.668.012 15.264 0 12 0z" /></svg>
              </button>
            </div>
          </div>
        </div>
        {/* Curve Divider */}
        <div className="absolute top-0 bottom-0 left-[45%] w-[10%] z-0 hidden md:block">
          <div className="absolute inset-0 bg-gradient-to-br from-[#10bc69] to-[#10bc69] rounded-l-full scale-x-125"></div>
        </div>
        {/* Info Section */}
        <div className="flex-1 bg-gradient-to-br from-[#10bc69] to-[#10bc69] text-white p-10 flex flex-col justify-between relative z-10">
          <div className="text-center mt-10">
            <h3 className="text-3xl font-bold mb-4">New Here?</h3>
            <p className="mb-8 text-lg">Sign up and discover a great amount of new opportunities!</p>
            <Link href="/auth/register" className="inline-block px-8 py-3 border-2 border-white rounded-full font-bold text-white hover:bg-white hover:text-[#10bc69] transition-all duration-200">Sign Up</Link>
          </div>
          <div className="flex justify-center items-center mt-10">
            <Image
              src="/images/loginq.svg"
              alt="Login illustration"
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

