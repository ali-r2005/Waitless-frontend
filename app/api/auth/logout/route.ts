import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST() {
  // Clear the session cookie
  cookies().delete({
    name: "session",
    path: "/",
  })

  // Return a success response
  return NextResponse.json({ success: true })
}
