import { NextResponse } from 'next/server'
import type { Role } from '@/types/role'

// Mock roles data - In production, this would be in a database
let mockRoles: Role[] = [
  {
    id: "1",
    name: "Guest",
    type: "guest",
    permissions: ["view_public_content"],
    description: "Basic access for unregistered users",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "2",
    name: "Staff",
    type: "staff",
    permissions: ["view_public_content", "manage_queues", "view_customers"],
    description: "Regular staff member",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
]

// GET /api/roles/{role_id}
export async function GET(
  request: Request,
  { params }: { params: { role_id: string } }
) {
  try {
    const role = mockRoles.find(r => r.id === params.role_id)
    
    if (!role) {
      return NextResponse.json(
        { 
          success: false, 
          message: "Role not found",
          data: null
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: role,
      message: "Role retrieved successfully"
    })
  } catch (error) {
    console.error('Error in role GET:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: "Failed to retrieve role",
        data: null
      },
      { status: 500 }
    )
  }
}

// PUT /api/roles/{role_id}
export async function PUT(
  request: Request,
  { params }: { params: { role_id: string } }
) {
  try {
    const body = await request.json()
    const roleIndex = mockRoles.findIndex(r => r.id === params.role_id)
    
    if (roleIndex === -1) {
      return NextResponse.json(
        { 
          success: false, 
          message: "Role not found",
          data: null
        },
        { status: 404 }
      )
    }

    // Update role
    const updatedRole: Role = {
      ...mockRoles[roleIndex],
      ...body,
      updated_at: new Date().toISOString()
    }

    mockRoles[roleIndex] = updatedRole

    return NextResponse.json({
      success: true,
      data: updatedRole,
      message: "Role updated successfully"
    })
  } catch (error) {
    console.error('Error in role PUT:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: "Failed to update role",
        data: null
      },
      { status: 500 }
    )
  }
}

// DELETE /api/roles/{role_id}
export async function DELETE(
  request: Request,
  { params }: { params: { role_id: string } }
) {
  try {
    const roleIndex = mockRoles.findIndex(r => r.id === params.role_id)
    
    if (roleIndex === -1) {
      return NextResponse.json(
        { 
          success: false, 
          message: "Role not found",
          data: null
        },
        { status: 404 }
      )
    }

    // Don't allow deletion of the guest role
    if (mockRoles[roleIndex].type === 'guest') {
      return NextResponse.json(
        { 
          success: false, 
          message: "Cannot delete the guest role",
          data: null
        },
        { status: 400 }
      )
    }

    // Remove role
    mockRoles = mockRoles.filter(r => r.id !== params.role_id)

    return NextResponse.json({
      success: true,
      data: null,
      message: "Role deleted successfully"
    })
  } catch (error) {
    console.error('Error in role DELETE:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: "Failed to delete role",
        data: null
      },
      { status: 500 }
    )
  }
} 