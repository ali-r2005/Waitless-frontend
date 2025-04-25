import { NextResponse } from 'next/server'
import { getStaffMembers } from '@/lib/data-service'
import type { StaffMember } from '@/types/staff'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('query')

    let staff = getStaffMembers()
    
    if (query) {
      staff = staff.filter(member => 
        member.name.toLowerCase().includes(query.toLowerCase()) ||
        member.email.toLowerCase().includes(query.toLowerCase()) ||
        member.role.toLowerCase().includes(query.toLowerCase()) ||
        member.branch.toLowerCase().includes(query.toLowerCase())
      )
    }

    return NextResponse.json({
      success: true,
      data: staff,
      message: "Staff retrieved successfully"
    })
  } catch (error) {
    console.error('Error in staff GET:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: "Failed to retrieve staff",
        data: []
      },
      { status: 500 }
    )
  }
} 