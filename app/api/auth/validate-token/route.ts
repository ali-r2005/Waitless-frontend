import { type NextRequest, NextResponse } from "next/server"
import { validateResetToken } from "@/lib/auth-service"

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token")

  if (!token) {
    return NextResponse.json({ valid: false }, { status: 400 })
  }

  try {
    const isValid = await validateResetToken(token)
    return NextResponse.json({ valid: isValid })
  } catch (error) {
    console.error("Error validating token:", error)
    return NextResponse.json({ valid: false }, { status: 500 })
  }
}
