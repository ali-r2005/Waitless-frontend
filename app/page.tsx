"use client"

import { Navbar } from "@/components/sections/layouts/Header"
import { Phone, Mail, Instagram, Youtube, Facebook } from "lucide-react"
import { Footer } from "@/components/ui/footer"
import { motion } from "framer-motion"
import Image from "next/image"
import { useAuth } from "@/lib/auth-context"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  
  useEffect(() => {
    // Redirect authenticated users with specific roles to dashboard
    if (isAuthenticated && user) {
      const role = user.role?.toLowerCase()
      if (role === "staff" || role === "business_owner" || role === "branch_manager") {
        router.push("/dashboard")
      }
    }
  }, [isAuthenticated, user, router])
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-20">
        {/* Hero Section */}
        <div id="home" className="flex flex-col lg:flex-row items-center justify-between py-12 lg:py-20 animate-fadeIn">
          {/* Hero Content */}
          <div className="lg:w-1/2 lg:pr-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Simplify virtual queue <span className="text-waitless-green">management</span>
                  </h1>
            <p className="mt-6 text-lg text-gray-600 dark:text-gray-300">
              Streamline your operations and enhance customer experience with our intelligent queue management system.
                  </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a href="/dashboard">
                  <button className="cssbuttons-io-button">
                  Get started
                    <div className="icon">
                    <svg
                      height="24"
                      width="24"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                        <path d="M0 0h24v24H0z" fill="none"></path>
                        <path
                          d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z"
                          fill="currentColor"
                        ></path>
                      </svg>
                    </div>
                    </button>
              </a>
            </div>
          </div>
          {/* Hero Image */}
          <div className="lg:w-1/2 mt-12 lg:mt-0">
            <motion.div
              animate={{ y: [-20, 0, -20] }}
              transition={{ 
                repeat: Infinity, 
                duration: 3,
                ease: "easeInOut"
              }}
            >
              <img
                src="/images/Queue-amico.svg?v=2"
                alt="Queue Management Illustration"
                className="w-full h-auto max-w-md mx-auto" 
              />
            </motion.div>
          </div>
        </div>

        {/* Features Section */}
        <div id="features" className="py-20 dark:bg-gray-900 scroll-mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Title */}
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold relative inline-block after:content-[''] after:block after:w-0 after:h-1 after:bg-waitless-green after:transition-all after:duration-300 hover:after:w-full">
                Our Features
              </h2>
              <p className="mt-4 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Discover how our innovative features can transform your queue management experience
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Virtual Queue */}
              <div className="group bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm transform transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 animate-fadeInUp delay-100 relative overflow-hidden border border-waitless-green">
                <div className="absolute inset-0 bg-gradient-to-r from-waitless-green/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="text-waitless-green mb-6 transform transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                    <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" fill="currentColor"/>
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 transition-colors duration-300 group-hover:text-waitless-green">Virtual Queue</h3>
                  <p className="text-gray-600 dark:text-gray-300 transition-all duration-300 group-hover:translate-x-2">
                    Let customers join queues via smartphones and enjoy freedom while waiting for their turn.
                  </p>
                </div>
              </div>

              {/* Real-Time Analytics */}
              <div className="group bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm transform transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 animate-fadeInUp delay-200 relative overflow-hidden border border-waitless-green">
                <div className="absolute inset-0 bg-gradient-to-r from-waitless-green/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="text-waitless-green mb-6 transform transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                    <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3.5 18.5L9.5 12.5L13.5 16.5L22 6.92L20.59 5.5L13.5 13.5L9.5 9.5L2 17L3.5 18.5Z" fill="currentColor"/>
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 transition-colors duration-300 group-hover:text-waitless-green">Real-Time Analytics</h3>
                  <p className="text-gray-600 dark:text-gray-300 transition-all duration-300 group-hover:translate-x-2">
                    Monitor wait times, traffic patterns, and satisfaction metrics to optimize resources effectively.
                  </p>
                </div>
              </div>

              {/* Newsletter */}
              <div className="group bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm transform transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 animate-fadeInUp delay-300 relative overflow-hidden border border-waitless-green">
                <div className="absolute inset-0 bg-gradient-to-r from-waitless-green/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="text-waitless-green mb-6 transform transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                    <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 18H4V8L12 13L20 8V18ZM12 11L4 6H20L12 11Z" fill="currentColor"/>
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 transition-colors duration-300 group-hover:text-waitless-green">Subscribe to Newsletter</h3>
                  <p className="text-gray-600 dark:text-gray-300 transition-all duration-300 group-hover:translate-x-2">
                    Keep customers informed of queue position and estimated wait times via SMS and email alerts.
                  </p>
                  </div>
              </div>
            </div>
          </div>
        </div>

        {/* Transform/About Section */}
        <div id="about" className="py-20 scroll-mt-16 animate-fadeIn">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold">ABOUT US</h2>
              <p className="mt-4 text-gray-600 dark:text-gray-300">
                Revolutionize your queue management with our intelligent and efficient system.
              </p>
            </div>
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="lg:w-1/2">
                <Image
                  src="/images/Aboutus.svg"
                  alt="Queue Illustration"
                  width={600}
                  height={400}
                  className="w-full h-auto"
                  priority
                />
              </div>
              <div className="lg:w-1/2">
                <h2 className="text-3xl font-bold mb-6">
                  Transform your customer experience with Waitless
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-8 italic">
                  Advanced technology meets intuitive design to eliminate wait times and increase customer satisfaction.
                </p>
                <ul className="space-y-4">
                  <li className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                    <svg className="w-5 h-5 text-waitless-green" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Predictive algorithms optimize customer distribution
                  </li>
                  <li className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                    <svg className="w-5 h-5 text-waitless-green" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Real-time monitoring dashboard for staff management
                  </li>
                  <li className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                    <svg className="w-5 h-5 text-waitless-green" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Customer mobile app with virtual queue and notifications
                  </li>
                  <li className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                    <svg className="w-5 h-5 text-waitless-green" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Customizable business rules and priority handling
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

       {/* Contact Section */}
<div
  id="contact" 
  className="py-20 bg-gray-50 dark:bg-gray-900 scroll-mt-16 animate-fadeIn"
>
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center mb-12">
      <h2 className="text-3xl font-bold relative inline-block after:content-[''] after:block after:w-0 after:h-1 after:bg-waitless-green after:transition-all after:duration-300 hover:after:w-full">CONTACT</h2>
      <p className="mt-4 text-gray-600 dark:text-gray-300">
        Get in touch with us for any questions or support
      </p>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 max-w-4xl mx-auto px-4 sm:px-0">
      {/* Contact Info */}
      <div className="transition-all duration-300 p-4 rounded-lg hover:bg-white hover:shadow-lg dark:hover:bg-gray-800 flex flex-col items-center sm:items-start text-center sm:text-left">
        <h3 className="flex items-center gap-2 text-lg sm:text-xl font-semibold mb-2 group">
          <Phone className="text-waitless-green transition-transform duration-300 group-hover:scale-125" />
          <span className="relative overflow-hidden">
            Call Us
            <span className="absolute left-0 bottom-0 w-full h-0.5 bg-waitless-green transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></span>
          </span>
        </h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">+1 5589 55488 55</p>
      </div>
      <div className="transition-all duration-300 p-4 rounded-lg hover:bg-white hover:shadow-lg dark:hover:bg-gray-800 flex flex-col items-center sm:items-start text-center sm:text-left">
        <h3 className="flex items-center gap-2 text-lg sm:text-xl font-semibold mb-2 group">
          <Mail className="text-waitless-green transition-transform duration-300 group-hover:scale-125" />
          <span className="relative overflow-hidden">
            Email Us
            <span className="absolute left-0 bottom-0 w-full h-0.5 bg-waitless-green transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></span>
          </span>
        </h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">info@waitless.com</p>
      </div>
      <div className="transition-all duration-300 p-4 rounded-lg hover:bg-white hover:shadow-lg dark:hover:bg-gray-800 flex flex-col items-center sm:items-start text-center sm:text-left">
        <h3 className="flex items-center gap-2 text-lg sm:text-xl font-semibold mb-2 group">
          <Instagram className="text-waitless-green transition-transform duration-300 group-hover:scale-125" />
          <span className="relative overflow-hidden">
            Instagram
            <span className="absolute left-0 bottom-0 w-full h-0.5 bg-waitless-green transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></span>
          </span>
        </h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">@waitless_official</p>
      </div>
      <div className="transition-all duration-300 p-4 rounded-lg hover:bg-white hover:shadow-lg dark:hover:bg-gray-800 flex flex-col items-center sm:items-start text-center sm:text-left">
        <h3 className="flex items-center gap-2 text-lg sm:text-xl font-semibold mb-2 group">
          <Youtube className="text-waitless-green transition-transform duration-300 group-hover:scale-125" />
          <span className="relative overflow-hidden">
            YouTube
            <span className="absolute left-0 bottom-0 w-full h-0.5 bg-waitless-green transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></span>
          </span>
        </h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">Waitless Channel</p>
      </div>
      <div className="transition-all duration-300 p-4 rounded-lg hover:bg-white hover:shadow-lg dark:hover:bg-gray-800 flex flex-col items-center sm:items-start text-center sm:text-left">
        <h3 className="flex items-center gap-2 text-lg sm:text-xl font-semibold mb-2 group">
          <Facebook className="text-waitless-green transition-transform duration-300 group-hover:scale-125" />
          <span className="relative overflow-hidden">
            Facebook
            <span className="absolute left-0 bottom-0 w-full h-0.5 bg-waitless-green transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></span>
          </span>
        </h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">facebook.com/waitless</p>
      </div>
    </div>
  </div>
</div>
      </main>
      <Footer />
    </div>
  )
}
