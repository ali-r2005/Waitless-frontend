"use client"

import { Navbar } from "@/components/sections/layouts/Navbar"
import { Phone, Mail, MapPin } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-20">
        {/* Hero Section */}
        <div id="home" className="flex flex-col lg:flex-row items-center justify-between py-12 lg:py-20 animate-fadeIn">
          {/* Hero Content */}
          <div className="lg:w-1/2 lg:pr-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Simplify virtual queue <span className="text-[#10bc69]">management</span>
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
            <div className="animate-float">
              <img
                src="/images/queue_bg.svg"
                alt="Queue Management Illustration"
                className="w-full h-auto max-w-2xl mx-auto"
              />
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div id="features" className="py-20 dark:bg-gray-900 scroll-mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Title */}
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold relative inline-block after:content-[''] after:block after:w-0 after:h-1 after:bg-[#10bc69] after:transition-all after:duration-300 hover:after:w-full">
                Our Features
              </h2>
              <p className="mt-4 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Discover how our innovative features can transform your queue management experience
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Virtual Queue */}
              <div className="group bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm transform transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 animate-fadeInUp delay-100 relative overflow-hidden" style={{border:"1px solid #10bc69"}}>
                <div className="absolute inset-0 bg-gradient-to-r from-[#10bc69]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="text-[#10bc69] mb-6 transform transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                    <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" fill="currentColor"/>
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 transition-colors duration-300 group-hover:text-[#10bc69]">Virtual Queue</h3>
                  <p className="text-gray-600 dark:text-gray-300 transition-all duration-300 group-hover:translate-x-2">
                    Let customers join queues via smartphones and enjoy freedom while waiting for their turn.
                  </p>
                </div>
              </div>

              {/* Real-Time Analytics */}
              <div className="group bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm transform transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 animate-fadeInUp delay-200 relative overflow-hidden" style={{border:"1px solid #10bc69"}}>
                <div className="absolute inset-0 bg-gradient-to-r from-[#10bc69]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="text-[#10bc69] mb-6 transform transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                    <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3.5 18.5L9.5 12.5L13.5 16.5L22 6.92L20.59 5.5L13.5 13.5L9.5 9.5L2 17L3.5 18.5Z" fill="currentColor"/>
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 transition-colors duration-300 group-hover:text-[#10bc69]">Real-Time Analytics</h3>
                  <p className="text-gray-600 dark:text-gray-300 transition-all duration-300 group-hover:translate-x-2">
                    Monitor wait times, traffic patterns, and satisfaction metrics to optimize resources effectively.
                  </p>
                </div>
              </div>

              {/* Newsletter */}
              <div className="group bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm transform transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 animate-fadeInUp delay-300 relative overflow-hidden" style={{border:"1px solid #10bc69"}}>
                <div className="absolute inset-0 bg-gradient-to-r from-[#10bc69]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="text-[#10bc69] mb-6 transform transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                    <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 18H4V8L12 13L20 8V18ZM12 11L4 6H20L12 11Z" fill="currentColor"/>
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 transition-colors duration-300 group-hover:text-[#10bc69]">Subscribe to Newsletter</h3>
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
                <img
                  src="/images/rabout.png"
                  alt="Queue Illustration"
                  className="w-full h-auto"
                />
              </div>
              <div className="lg:w-1/2">
                <h2 className="text-3xl font-bold mb-6">
                  Transform your customer experience with QueueMaster
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-8 italic">
                  Advanced technology meets intuitive design to eliminate wait times and increase customer satisfaction.
                </p>
                <ul className="space-y-4">
                  <li className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                    <svg className="w-5 h-5 text-[#10bc69]" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Predictive algorithms optimize customer distribution
                  </li>
                  <li className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                    <svg className="w-5 h-5 text-[#10bc69]" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Real-time monitoring dashboard for staff management
                  </li>
                  <li className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                    <svg className="w-5 h-5 text-[#10bc69]" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Customer mobile app with virtual queue and notifications
                  </li>
                  <li className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                    <svg className="w-5 h-5 text-[#10bc69]" viewBox="0 0 20 20" fill="currentColor">
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
      <h2 className="text-3xl font-bold relative inline-block after:content-[''] after:block after:w-0 after:h-1 after:bg-[#10bc69] after:transition-all after:duration-300 hover:after:w-full">CONTACT</h2>
      <p className="mt-4 text-gray-600 dark:text-gray-300">
        Get in touch with us for any questions or support
      </p>
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      {/* Contact Info */}
      <div className="space-y-8">
        <div className="transition-all duration-300 p-4 rounded-lg hover:bg-white hover:shadow-lg dark:hover:bg-gray-800">
          <h3 className="flex items-center gap-2 text-xl font-semibold mb-2 group">
            <MapPin className="text-[#10bc69] transition-transform duration-300 group-hover:scale-125" />
            <span className="relative overflow-hidden">
              Address
              <span className="absolute left-0 bottom-0 w-full h-0.5 bg-[#10bc69] transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></span>
            </span>
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            PSV+CCW, Av. des Forces Armées Royales, Tanger
          </p>
        </div>
        <div className="transition-all duration-300 p-4 rounded-lg hover:bg-white hover:shadow-lg dark:hover:bg-gray-800">
          <h3 className="flex items-center gap-2 text-xl font-semibold mb-2 group">
            <Phone className="text-[#10bc69] transition-transform duration-300 group-hover:scale-125" />
            <span className="relative overflow-hidden">
              Call Us
              <span className="absolute left-0 bottom-0 w-full h-0.5 bg-[#10bc69] transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></span>
            </span>
          </h3>
          <p className="text-gray-600 dark:text-gray-300">+1 5589 55488 55</p>
        </div>
        <div className="transition-all duration-300 p-4 rounded-lg hover:bg-white hover:shadow-lg dark:hover:bg-gray-800">
          <h3 className="flex items-center gap-2 text-xl font-semibold mb-2 group">
            <Mail className="text-[#10bc69] transition-transform duration-300 group-hover:scale-125" />
            <span className="relative overflow-hidden">
              Email Us
              <span className="absolute left-0 bottom-0 w-full h-0.5 bg-[#10bc69] transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></span>
            </span>
          </h3>
          <p className="text-gray-600 dark:text-gray-300">info@example.com</p>
        </div>
        <div className="w-full h-64 rounded-lg overflow-hidden transition-all duration-500 hover:shadow-xl transform hover:-translate-y-1">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3238.6176767187003!2d-5.8134611!3d35.7721127!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd0b809c6e30b77f%3A0x76d10c4e35f50a8d!2sAv.%20des%20Forces%20Arm%C3%A9es%20Royales%2C%20Tanger%2C%20Morocco!5e0!3m2!1sen!2sus!4v1647904894954!5m2!1sen!2sus"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
          ></iframe>
        </div>
      </div>

      {/* Contact Form */}
      <form className="space-y-6 p-6 rounded-lg transition-all duration-300 hover:shadow-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm" style={{marginTop:"50px"}}>
        <div>
          <input
            type="text"
            placeholder="Your Name"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#10bc69] focus:border-transparent transform hover:scale-[1.01]"
          />
        </div>
        <div>
          <input
            type="email"
            placeholder="Your Email"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#10bc69] focus:border-transparent transform hover:scale-[1.01]"
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="Subject"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#10bc69] focus:border-transparent transform hover:scale-[1.01]"
          />
        </div>
        <div>
          <textarea
            placeholder="Message"
            rows={6}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#10bc69] focus:border-transparent transform hover:scale-[1.01]"
          ></textarea>
        </div>
        <button
          type="submit"
          className="w-full bg-[#10bc69] text-white font-medium py-3 px-4 rounded-lg overflow-hidden relative group"
        >
          <span className="absolute w-64 h-0 transition-all duration-300 origin-center rotate-45 -translate-x-20 bg-white top-1/2 group-hover:h-64 group-hover:-translate-y-32 ease"></span>
          <span className="relative text-white transition duration-300 group-hover:text-[#10bc69] ease">Send Message</span>
        </button>
      </form>
    </div>
  </div>
</div>
      </main>

      {/* Footer */}
      <footer className="relative mt-20 bg-gradient-to-b from-gray-900 to-gray-800 text-white">
        {/* Background Image */}
        <div className="absolute inset-0 w-full h-full">
          <img
            src="/images/mountain-forest.svg"
            alt="Mountain Forest Background"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="relative container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Links Column 1 */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#home" className="hover:text-[#10bc69] transition-colors">Home</a></li>
                <li><a href="#about" className="hover:text-[#10bc69] transition-colors">About Us</a></li>
                <li><a href="#contact" className="hover:text-[#10bc69] transition-colors">Contact</a></li>
                <li><a href="/auth/register" className="hover:text-[#10bc69] transition-colors">Get Started</a></li>
              </ul>
            </div>

            {/* Links Column 2 */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Features</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-[#10bc69] transition-colors">Virtual Queue</a></li>
                <li><a href="#" className="hover:text-[#10bc69] transition-colors">Real-Time Analytics</a></li>
                <li><a href="#" className="hover:text-[#10bc69] transition-colors">Mobile App</a></li>
                <li><a href="#" className="hover:text-[#10bc69] transition-colors">Business Dashboard</a></li>
                  </ul>
            </div>

            {/* Links Column 3 */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-[#10bc69] transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-[#10bc69] transition-colors">API Reference</a></li>
                <li><a href="#" className="hover:text-[#10bc69] transition-colors">Support Center</a></li>
                <li><a href="#" className="hover:text-[#10bc69] transition-colors">Terms & Privacy</a></li>
                  </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-lg font-semibold mb-4">QueueMaster</h3>
              <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#10bc69]" />
                  <span>PSV+CCW, Av. des Forces Armées Royales, Tanger</span>
                    </li>
                    <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#10bc69]" />
                  <span>+1 5589 55488 55</span>
                    </li>
                    <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#10bc69]" />
                  <span>info@queuemaster.com</span>
                    </li>
                  </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-12 pt-8 border-t border-gray-700">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-sm text-gray-400">
                © {new Date().getFullYear()} QueueMaster. All rights reserved.
              </p>
              <div className="flex items-center gap-4 mt-4 md:mt-0">
                <a href="#" className="text-gray-400 hover:text-[#10bc69] transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-[#10bc69] transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-[#10bc69] transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
