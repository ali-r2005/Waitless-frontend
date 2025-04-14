"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Loader2 } from "lucide-react"

import { loginSchema } from "@/lib/validations/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AuthLayout } from "@/components/sections/layouts/auth-layout"
import { authService } from "@/lib/auth-service"
import { useAuth } from "@/contexts/auth-context"
import type { LoginFormValues } from "@/types/auth"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard"
  const status = searchParams.get("status")
  const { login: setAuthUser } = useAuth()

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [apiAvailable, setApiAvailable] = useState(true)
  const [statusMessage, setStatusMessage] = useState<string | null>(
    status === "reset-success"
      ? "Your password has been reset successfully. Please log in with your new password."
      : status === "logout"
        ? "You have been logged out successfully."
        : status === "expired"
          ? "Your session has expired. Please log in again."
          : status === "logout-error"
            ? "You have been logged out, but there was an error communicating with the server."
            : null
  )

  // Check if API is available
  useEffect(() => {
    const checkApiAvailability = async (): Promise<void> => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL
        if (!apiUrl) {
          setApiAvailable(false)
          setError("API URL is not configured. Please contact the administrator.")
          return
        }

        console.log("Checking API availability at:", apiUrl)
        
        // Just try to connect to the API without making a request
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 5000)
        
        await fetch(apiUrl, {
          method: "GET",
          signal: controller.signal
        })
        
        clearTimeout(timeoutId)
        console.log("API is available")
        setApiAvailable(true)
      } catch (error) {
        const err = error as Error
        console.error("API availability check failed:", err)
        setApiAvailable(false)
        setError(`Unable to connect to the authentication server (${err.message}). Please try again later or contact support.`)
      }
    }

    checkApiAvailability()
  }, [])

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(data: LoginFormValues) {
    if (!apiAvailable) {
      setError("Cannot log in: Authentication server is unavailable.")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const result = await authService.login(data.email, data.password)

      if (!result.success) {
        setError(result.error || "An unexpected error occurred")
        return
      }

      // Set user in auth context
      if (result.user) {
        setAuthUser(data.email, data.password)
      }

      router.push(callbackUrl)
      router.refresh()
    } catch (error) {
      setError("An unexpected error occurred. Please try again.")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout>
      <Card className="w-full max-w-md border-primary-teal/20 shadow-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Login</CardTitle>
          <CardDescription>Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {statusMessage && (
            <Alert className="mb-4 border-primary-teal bg-primary-teal/10">
              <AlertDescription>{statusMessage}</AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="name@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>Password</FormLabel>
                      <Link href="/auth/forgot-password" className="text-sm text-primary-teal hover:underline">
                        Forgot password?
                      </Link>
                    </div>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full bg-primary-teal hover:bg-primary-teal/90"
                disabled={isLoading || !apiAvailable}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging in...
                  </>
                ) : !apiAvailable ? (
                  "Authentication Server Unavailable"
                ) : (
                  "Login"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/auth/register" className="text-primary-teal hover:underline">
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </AuthLayout>
  )
}
