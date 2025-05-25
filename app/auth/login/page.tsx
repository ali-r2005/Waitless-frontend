"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Image from 'next/image'
import { useRedirectIfAuthenticated } from "@/hooks/use-redirect-if-authenticated"
import { useAuth } from "@/lib/auth-context"
import { useTheme } from "next-themes"


export default function LoginPage() {
  const router = useRouter()
  useRedirectIfAuthenticated()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { theme } = useTheme()
  
  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    try {
      await login(email, password)
      // Success: user is redirected by context
    } catch (err: any) {
      setError(err.message || 'Invalid email or password. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br py-8 px-4 bg-gray-100 dark:bg-gray-900">
      {/* No styles needed for remember me checkbox anymore */}
      <div className="flex w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden relative min-h-[600px] border border-[#10bc69]/10 bg-white dark:bg-gray-800">
        {/* Form Section */}
        <div className="flex-1 p-10 z-10 flex flex-col justify-center">        
          <div className="mb-2">
            <h2 className="text-3xl font-bold mb-2 relative after:content-[''] after:block after:w-12 after:h-1 after:bg-gradient-to-r after:from-[#10bc69] after:to-[#10bc69] after:mt-2 after:rounded-full text-gray-800 dark:text-white">Login</h2>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="relative mb-4">
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className="w-full py-3 pl-12 pr-4 rounded-full bg-gray-100 text-gray-900 placeholder-gray-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#10bc69] text-base transition shadow-sm dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:bg-gray-600"
              />              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-300">
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2l0 12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6z" />
                  <path d="M2 6l10 7 10-7" />
                </svg>
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
                className="w-full py-3 pl-12 pr-4 rounded-full bg-gray-100 text-gray-900 placeholder-gray-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#10bc69] text-base transition shadow-sm dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:bg-gray-600"
              />              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-300">
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M19 11H5a2 2 0 00-2 2v7a2 2 0 002 2h14a2 2 0 002-2v-7a2 2 0 00-2-2z" />
                  <path d="M7 11V7a5 5 0 0110 0v4" />
                </svg>              </span>
            </div>
            {/* Remember me checkbox removed */}
            {error && <div className="text-red-600 text-sm mt-1 font-medium">{error}</div>}
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
          <Link href="/auth/forgot-password" className="block mt-2 text-center text-sm text-gray-500 hover:text-[#10bc69] transition dark:text-gray-400 dark:hover:text-[#10bc69]">Forgot Your Password?</Link>
          <div className="mt-8 text-center">
            <p className="text-gray-400 dark:text-gray-300 mb-4 flex items-center justify-center"><span className="flex-1 h-px mx-2 bg-gray-200 dark:bg-gray-600"></span>Or Sign in with social platforms<span className="flex-1 h-px mx-2 bg-gray-200 dark:bg-gray-600"></span></p>
            <div className="flex justify-center gap-4 mt-4">
              <button className="w-12 h-12 rounded-xl flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300 border hover:-translate-y-1 bg-white border-gray-200 hover:bg-blue-50 dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-blue-900/30" aria-label="Facebook">
                <svg className="w-6 h-6 text-[#1877f2]" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.522-4.477-10-10-10S2 6.478 2 12c0 4.991 3.657 9.128 8.438 9.877v-6.987h-2.54v-2.89h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.242 0-1.632.771-1.632 1.562v1.875h2.773l-.443 2.89h-2.33v6.987C18.343 21.128 22 16.991 22 12" /></svg>
              </button>
              <button className="w-12 h-12 rounded-xl flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300 border hover:-translate-y-1 bg-white border-gray-200 hover:bg-red-50 dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-red-900/30" aria-label="Google">
                <svg className="w-6 h-6 text-[#ea4335]" fill="currentColor" viewBox="0 0 24 24"><path d="M21.805 10.023h-9.765v3.954h5.625c-.243 1.243-1.486 3.654-5.625 3.654-3.375 0-6.125-2.792-6.125-6.25s2.75-6.25 6.125-6.25c1.92 0 3.2.82 3.94 1.53l2.7-2.62C17.06 2.7 14.92 1.5 12.04 1.5 6.48 1.5 2 6.02 2 12s4.48 10.5 10.04 10.5c5.8 0 9.62-4.08 9.62-9.84 0-.66-.07-1.16-.16-1.637z" /></svg>
              </button>
              <button className="w-12 h-12 rounded-xl flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300 border hover:-translate-y-1 bg-white border-gray-200 hover:bg-blue-100 dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-blue-900/30" aria-label="Twitter">
                <svg className="w-6 h-6 text-[#1da1f2]" fill="currentColor" viewBox="0 0 24 24"><path d="M22.46 6c-.77.35-1.6.59-2.47.7a4.3 4.3 0 0 0 1.88-2.37c-.83.5-1.75.87-2.72 1.07A4.28 4.28 0 0 0 16.11 4c-2.37 0-4.29 1.92-4.29 4.29 0 .34.04.67.1.99C7.69 8.99 4.07 7.13 1.64 4.16c-.37.64-.58 1.38-.58 2.18 0 1.5.76 2.82 1.92 3.6-.7-.02-1.36-.22-1.94-.54v.05c0 2.1 1.5 3.85 3.5 4.25-.36.1-.74.16-1.13.16-.28 0-.54-.03-.8-.08.54 1.7 2.1 2.94 3.95 2.97A8.6 8.6 0 0 1 2 19.54c-.63 0-1.25-.04-1.86-.11A12.13 12.13 0 0 0 6.29 21c7.55 0 11.68-6.26 11.68-11.68 0-.18 0-.36-.01-.53A8.18 8.18 0 0 0 22.46 6z" /></svg>
              </button>
              <button className="w-12 h-12 rounded-xl flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300 border hover:-translate-y-1 bg-white border-gray-200 hover:bg-blue-200 dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-blue-900/30" aria-label="LinkedIn">
                <svg className="w-6 h-6 text-[#0077b5]" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-9h3v9zm-1.5-10.28c-.97 0-1.75-.79-1.75-1.75s.78-1.75 1.75-1.75 1.75.79 1.75 1.75-.78 1.75-1.75 1.75zm13.5 10.28h-3v-4.5c0-1.08-.02-2.47-1.5-2.47-1.5 0-1.73 1.18-1.73 2.39v4.58h-3v-9h2.88v1.23h.04c.4-.75 1.38-1.54 2.84-1.54 3.04 0 3.6 2 3.6 4.59v4.72z" /></svg>
              </button>
              <button className="w-12 h-12 rounded-xl flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300 border hover:-translate-y-1 bg-white border-gray-200 hover:bg-pink-50 dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-pink-900/30" aria-label="Instagram">
                <svg className="w-6 h-6 text-[#e1306c]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0-.795-.646-1.44-1.44-1.44-.795 0-1.44.646-1.44 1.44 0 .794.646 1.439 1.44 1.439.793-.001 1.44-.645 1.44-1.439z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
        {/* Curve Divider */}
        <div className="absolute top-0 bottom-0 left-[45%] w-[10%] z-0 hidden md:block">
          <div className="absolute inset-0 bg-gradient-to-br from-[#10bc69] to-[#10bc69] rounded-l-full scale-x-125"></div>
        </div>
        {/* Info Section */}
        <div className="flex-1 bg-gradient-to-br text-white p-10 flex flex-col justify-between relative z-10 from-[#10bc69] to-[#10bc69]">
          <div className="text-center mt-10">
            <h3 className="text-3xl font-bold mb-4">New Here?</h3>
            <p className="mb-8 text-lg">Sign up and discover a great amount of new opportunities!</p>
            <Link href="/auth/register" className="inline-block px-8 py-3 border-2 border-white rounded-full font-bold text-white hover:bg-white transition-all duration-200 hover:text-[#10bc69]">Sign Up</Link>
          </div>
          <div className="flex justify-center items-center mt-10">
            <Image
              src="/images/Login-pana.svg"
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

