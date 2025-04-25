import { NextResponse } from 'next/server'
import { getStaffMembers } from '@/lib/data-service'
import type { StaffMember } from '@/types/staff'

export async function GET() {
  try {
    // Get all staff members and filter branch managers
    const allStaff = getStaffMembers()
    const branchManagers = allStaff.filter(
      staff => staff.role.toLowerCase() === "branch manager"
    )

    return NextResponse.json({
      success: true,
      data: branchManagers,
      message: "Branch managers retrieved successfully"
    })
  } catch (error) {
    console.error('Error in branch managers GET:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: "Failed to retrieve branch managers",
        data: []
      },
      { status: 500 }
    )
  }
} 