import { NextResponse } from 'next/server'
import type { Role } from '@/types/role'

// Mock roles data - replace with database in production
const mockRoles: Role[] = [
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
  },
  {
    id: "3",
    name: "Branch Manager",
    type: "branch_manager",
    permissions: ["view_public_content", "manage_queues", "manage_staff", "view_reports", "view_customers"],
    description: "Branch manager with staff management capabilities",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "4",
    name: "Administrator",
    type: "admin",
    permissions: ["view_public_content", "manage_queues", "manage_staff", "manage_roles", "view_reports", "manage_settings", "view_customers"],
    description: "System administrator with full access",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

// GET /api/roles - List all roles
export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: mockRoles,
      message: "Roles retrieved successfully"
    })
  } catch (error) {
    console.error('Error in roles GET:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: "Failed to retrieve roles",
        data: []
      },
      { status: 500 }
    )
  }
}

// POST /api/roles - Create a new role
export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.name || !body.type || !body.permissions) {
      return NextResponse.json(
        { 
          success: false, 
          message: "Missing required fields",
          data: null
        },
        { status: 400 }
      )
    }

    // In production, you would save to database here
    const newRole: Role = {
      id: Date.now().toString(),
      name: body.name,
      type: body.type,
      permissions: body.permissions,
      description: body.description || "",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    mockRoles.push(newRole)

    return NextResponse.json({
      success: true,
      data: newRole,
      message: "Role created successfully"
    })
  } catch (error) {
    console.error('Error in roles POST:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: "Failed to create role",
        data: null
      },
      { status: 500 }
    )
  }
} 