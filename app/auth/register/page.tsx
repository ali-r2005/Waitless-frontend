"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { fixFileInputLanguage } from "./file-upload-fix"
import "./dark-mode-fix.css"

import { registerSchema } from "@/lib/validations/auth"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/lib/auth-context"
import { useRedirectIfAuthenticated } from "@/hooks/use-redirect-if-authenticated"
import type { RegisterFormValues } from "@/types/auth"

export default function RegisterPage() {
  const router = useRouter()
  const { register: registerUser } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [registerType, setRegisterType] = useState<'business_owner' | 'customer'>('customer')
  const [animating, setAnimating] = useState(false)

  useRedirectIfAuthenticated()
  
  // Fix file input language issue on component mount
  useEffect(() => {
    fixFileInputLanguage();
  }, [registerType]); // Re-run when registration type changes

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema) as any,
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      password_confirmation: "",
      role: undefined,
      business_name: "",
      industry: "",
      logo: undefined,
    },
  })

  const switchRegistrationType = (type: 'business_owner' | 'customer') => {
    setAnimating(true)
    setTimeout(() => {
      setRegisterType(type)
      form.reset({
        ...form.getValues(),
        role: type === 'business_owner' ? 'business_owner' : undefined,
      })
    }, 300)
    
    // Reset animation state after animation completes
    setTimeout(() => {
      setAnimating(false)
    }, 800)
  }

  async function onSubmit(data: RegisterFormValues) {
    setIsLoading(true)
    setError(null)

    try {
      let payload: any = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
        password_confirmation: data.password_confirmation,
      }
      if (registerType === 'business_owner') {
        payload.role = 'business_owner'
        payload.business_name = data.business_name
        payload.industry = data.industry
        if (data.logo) payload.logo = data.logo
      }
      await registerUser(payload)
      // Success: user is redirected by context
    } catch (err: any) {
      let errorMessage = "Registration failed. Please try again."
      
      if (err.message) {
        // Error messages in English
        if (err.message.toLowerCase().includes("email")) {
          errorMessage = "This email address is already in use."
        } else if (err.message.toLowerCase().includes("password")) {
          errorMessage = "The provided password is not valid."
        } else if (err.message.toLowerCase().includes("network")) {
          errorMessage = "Connection error. Please check your internet connection."
        } else if (err.message.toLowerCase().includes("server")) {
          errorMessage = "Server error. Please try again later."
        }
      }
      
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-6 md:py-8 px-4 overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`flex w-full max-w-4xl bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden relative min-h-[700px] border border-[#10bc69]/10 ${registerType === 'business_owner' ? 'flex-row-reverse' : ''}`}
        layout
      >
        {/* Form Section */}
        <div className="flex-1 p-6 md:p-10 z-10 overflow-y-auto register-form register-form-container">
          <motion.h2 
            key={registerType}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-gray-800 dark:text-white relative after:content-[''] after:block after:w-12 after:h-1 after:bg-gradient-to-r after:from-[#10bc69] after:to-[#10bc69] after:mt-2 after:rounded-full"
            layout
          >
            {registerType === 'customer' ? 'Client Registration' : 'Business Registration'}
          </motion.h2>

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full name</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          placeholder="John Doe" 
                          {...field} 
                          className="w-full py-4 md:py-6 pl-12 pr-4 rounded-full bg-gray-100 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-[#10bc69] text-base text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition shadow-sm border-0"
                        />
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-300">
                          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                          </svg>
                        </span>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          placeholder="name@example.com" 
                          {...field} 
                          className="w-full py-4 md:py-6 pl-12 pr-4 rounded-full bg-gray-100 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-[#10bc69] text-base text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition shadow-sm border-0"
                        />
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-300">
                          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </span>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          placeholder="+1 (555) 123-4567" 
                          {...field} 
                          className="w-full py-4 md:py-6 pl-12 pr-4 rounded-full bg-gray-100 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-[#10bc69] text-base text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition shadow-sm border-0"
                        />
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-300">
                          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M20 14.66V17.66C20 18.77 19.1 19.66 18 19.66C13.04 19.66 8.34 17.66 4.93 14.25C1.52 10.84 -0.48 6.14 -0.48 1.18C-0.48 0.08 0.41 -0.82 1.52 -0.82H4.52C5.63 -0.82 6.52 0.08 6.52 1.18C6.52 2.29 6.91 3.36 7.69 4.14C8.47 4.92 9.54 5.31 10.65 5.31H13.65C14.76 5.31 15.65 6.21 15.65 7.31C15.65 8.42 15.26 9.49 14.48 10.27C13.7 11.05 12.63 11.44 11.52 11.44" />
                          </svg>
                        </span>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {registerType === 'business_owner' && (
                <>
                  <FormField
                    control={form.control}
                    name="business_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business name</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input 
                              placeholder="Your business" 
                              {...field} 
                              className="w-full py-4 md:py-6 pl-12 pr-4 rounded-full bg-gray-100 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-[#10bc69] text-base text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition shadow-sm border-0"
                            />
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-300 input-icon">
                              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path d="M3 21h18M3 7v1a1 1 0 001 1h16a1 1 0 001-1V7m-9-4h3m-6 0h3m-6 4V3h12v4H3z" />
                              </svg>
                            </span>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="industry"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Industry</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input 
                              placeholder="eg: Restaurant, Healthcare, Retail" 
                              {...field} 
                              className="w-full py-4 md:py-6 pl-12 pr-4 rounded-full bg-gray-100 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-[#10bc69] text-base text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition shadow-sm border-0"
                            />
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-300 input-icon">
                              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path d="M21 13V6a2 2 0 00-2-2H5a2 2 0 00-2 2v7m18 0v3a2 2 0 01-2 2H5a2 2 0 01-2-2v-3m18 0H3" />
                              </svg>
                            </span>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="logo"
                    render={({ field: { value, onChange, ...field } }) => (
                      <FormItem>
                        <FormLabel>Logo (optional)</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) {
                                  onChange(file)
                                }
                              }}
                              className="w-full py-4 md:py-6 pl-12 pr-4 rounded-full bg-gray-100 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#10bc69] text-base text-gray-900 placeholder-gray-500 transition shadow-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:font-semibold file:bg-[#10bc69]/10 file:text-[#10bc69] hover:file:bg-[#10bc69]/20 border-0"
                              // Original file input - visual aspects handled by our script
                              {...field}
                              value={undefined}
                            />
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-300 input-icon">
                              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </span>
                                            {/* Custom file upload language fix */}
                            <span className="hidden">
                              <span className="file-upload-english" data-choose="Choose File" data-selected="File chosen"></span>
                            </span>
                            {value && (
                              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                <div className="w-6 h-6 text-[#10bc69]">
                                  <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path d="M5 13l4 4L19 7" />
                                  </svg>
                                </div>
                              </div>
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => {
                  const [showPassword, setShowPassword] = useState(false)
                  return (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input 
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            {...field} 
                            className="w-full py-4 md:py-6 pl-12 pr-12 rounded-full bg-gray-100 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#10bc69] text-base text-gray-900 placeholder-gray-500 transition shadow-sm border-0"
                          />
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-300 input-icon">
                            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
                              <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" />
                            </svg>
                          </span>
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100 toggle-button"
                          >
                            {showPassword ? (
                              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path d="M13.875 18.825A10.05 10.05 0 0112 19c-7 0-10-7-10-7s1.125-2.625 3.375-4.5M8.25 15.75A4.5 4.5 0 0114.25 9.75M3 3l18 18M9.75 9.75A4.5 4.5 0 0115 15" />
                              </svg>
                            ) : (
                              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" />
                                <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
                              </svg>
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )
                }}
              />

              <FormField
                control={form.control}
                name="password_confirmation"
                render={({ field }) => {
                  const [showPassword, setShowPassword] = useState(false)
                  return (
                    <FormItem>
                      <FormLabel>Confirm password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input 
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            {...field} 
                            className="w-full py-4 md:py-6 pl-12 pr-12 rounded-full bg-gray-100 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#10bc69] text-base text-gray-900 placeholder-gray-500 transition shadow-sm border-0"
                          />
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-300 input-icon">
                            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
                              <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" />
                            </svg>
                          </span>
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100 toggle-button"
                          >
                            {showPassword ? (
                              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path d="M13.875 18.825A10.05 10.05 0 0112 19c-7 0-10-7-10-7s1.125-2.625 3.375-4.5M8.25 15.75A4.5 4.5 0 0114.25 9.75M3 3l18 18M9.75 9.75A4.5 4.5 0 0115 15" />
                              </svg>
                            ) : (
                              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" />
                                <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
                              </svg>
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )
                }}
              />

              <button
                type="submit"
                className="w-full py-4 md:py-6 mt-4 rounded-full bg-[#10bc69] text-white font-semibold hover:bg-[#0e9e5c] transition shadow-lg disabled:opacity-60 transform-gpu hover:translate-y-[-2px] dark:shadow-emerald-900/20"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin inline-block" />
                    Creating account...
                  </>
                ) : (
                  "Create account"
                )}
              </button>

              <div className="text-center text-sm text-gray-600 dark:text-gray-300 login-link-container">
                Already registered?{" "}
                <Link href="/auth/login" className="text-[#10bc69] hover:underline font-medium">
                  Log in
                </Link>
              </div>
            </form>
          </Form>
        </div>

        {/* Curve Divider */}
        {/* Custom curved divider for a smoother transition */}
        <div 
          className={`absolute top-0 bottom-0 ${registerType === 'business_owner' ? 'right-[48%]' : 'left-[48%]'} w-[4%] z-0 hidden md:flex items-center`}
        >
          <motion.div 
            className="h-full w-full relative overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7 }}
            key={registerType}
          >
            <svg 
              viewBox="0 0 100 800" 
              preserveAspectRatio="none" 
              className="h-full w-full absolute top-0 left-0"
              style={{ 
                transform: registerType === 'business_owner' ? 'scaleX(-1)' : 'none',
                filter: 'drop-shadow(0px 0px 4px rgba(0,0,0,0.05))'
              }}
            >
              <motion.path 
                d="M0,0 L0,800 L20,800 C60,600 100,400 100,0 L0,0 Z" 
                fill={`url(#${registerType === 'business_owner' ? 'greenGradientReverse' : 'greenGradient'})`}
                className="transition-all duration-500"
                initial={{ x: registerType === 'business_owner' ? 100 : -100 }}
                animate={{ x: 0 }}
                transition={{ duration: 0.5 }}
              />
              <defs>
                <linearGradient id="greenGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#10bc69" />
                  <stop offset="100%" stopColor="#0e9e5c" />
                </linearGradient>
                <linearGradient id="greenGradientReverse" x1="0%" y1="100%" x2="0%" y2="0%">
                  <stop offset="0%" stopColor="#10bc69" />
                  <stop offset="100%" stopColor="#0e9e5c" />
                </linearGradient>
              </defs>
            </svg>
          </motion.div>
        </div>

        {/* Info Section */}
        <motion.div 
          key={registerType + "content"}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="hidden md:flex flex-1 bg-gradient-to-br from-[#10bc69] to-[#0e9e5c] text-white p-6 md:p-10 flex-col justify-between relative z-0 overflow-hidden"
          layout
        >
          <div className="text-center mt-10">
            <motion.h3 
              className="text-2xl md:text-3xl font-bold mb-3 md:mb-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              layout
            >
              Join the waiting queues!
            </motion.h3>
            <motion.p 
              className="mb-6 md:mb-8 text-base md:text-lg"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              layout
            >
              Register to easily manage your waiting queues and wait time!
            </motion.p>
            <motion.button
              type="button"
              onClick={() => switchRegistrationType(registerType === 'customer' ? 'business_owner' : 'customer')}
              className="inline-block px-6 md:px-8 py-2.5 md:py-3 border-2 border-white rounded-full font-semibold md:font-bold text-white hover:bg-white hover:text-[#10bc69] transition-all duration-200 shadow-md mb-4"
              whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 1)", color: "#10bc69" }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              {registerType === 'customer' ? 'Register as owner' : 'Register as client'}
            </motion.button>
          </div>
          <motion.div 
            className="flex flex-col justify-center items-center py-0 h-[480px] w-full"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            layout
          >
            <div className="relative w-full h-full flex items-center justify-center flex-grow">
              <Image
                src={registerType === 'customer' ? '/images/Signup1.svg' : '/images/Signup.svg'}
                alt="Registration illustration"
                width={registerType === 'customer' ? 580 : 550}
                height={registerType === 'customer' ? 550 : 550}
                priority
                style={{ 
                  objectFit: 'contain',
                  maxHeight: '470px',
                  width: 'auto',
                  margin: '0 auto',
                  position: 'relative',
                  top: '-10px',
                  filter: 'drop-shadow(0px 8px 16px rgba(0,0,0,0.2))'
                }}
              className="transform-gpu transition-transform duration-500 hover:scale-105 pb-2"
            />
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
      {/* Add theme toggle */}
      <div className="absolute bottom-4 right-4 text-gray-600 dark:text-gray-300">
        <button 
          onClick={() => document.documentElement.classList.toggle('dark')} 
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          aria-label="Toggle dark mode"
        >
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className="hidden dark:block" // Sun icon - show in dark mode
          >
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
          </svg>
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className="block dark:hidden" // Moon icon - show in light mode
          >
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>
        </button>
      </div>
    </div>
  )
}
