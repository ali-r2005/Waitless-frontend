import { NextResponse } from 'next/server'
import type { RoleRequest } from '@/types/role'

// Mock role requests data - replace with database in production
let mockRoleRequests: RoleRequest[] = [
  {
    id: "1",
    userId: "user1",
    userName: "John Doe",
    userEmail: "john@example.com",
    requestedRole: "staff",
    status: "pending",
    requestDate: new Date().toISOString()
  }
];

// GET /api/roles/requests - List all role requests
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    
    let requests = mockRoleRequests
    if (status) {
      requests = requests.filter(req => req.status === status)
    }

    return NextResponse.json({
      success: true,
      data: requests,
      message: "Role requests retrieved successfully"
    })
  } catch (error) {
    console.error('Error in role requests GET:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: "Failed to retrieve role requests",
        data: []
      },
      { status: 500 }
    )
  }
}

// POST /api/roles/requests - Create a new role request
export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.userId || !body.userName || !body.userEmail || !body.requestedRole) {
      return NextResponse.json(
        { 
          success: false, 
          message: "Missing required fields",
          data: null
        },
        { status: 400 }
      )
    }

    // Create new request
    const newRequest: RoleRequest = {
      id: Date.now().toString(),
      userId: body.userId,
      userName: body.userName,
      userEmail: body.userEmail,
      requestedRole: body.requestedRole,
      status: "pending",
      requestDate: new Date().toISOString()
    }

    mockRoleRequests.push(newRequest)

    return NextResponse.json({
      success: true,
      data: newRequest,
      message: "Role request created successfully"
    })
  } catch (error) {
    console.error('Error in role requests POST:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: "Failed to create role request",
        data: null
      },
      { status: 500 }
    )
  }
}

// PUT /api/roles/requests/{request_id} - Update a role request (approve/reject)
export async function PUT(request: Request) {
  try {
    const body = await request.json()
    
    if (!body.requestId || !body.status || !body.adminId) {
      return NextResponse.json(
        { 
          success: false, 
          message: "Missing required fields",
          data: null
        },
        { status: 400 }
      )
    }

    const requestIndex = mockRoleRequests.findIndex(r => r.id === body.requestId)
    if (requestIndex === -1) {
      return NextResponse.json(
        { 
          success: false, 
          message: "Role request not found",
          data: null
        },
        { status: 404 }
      )
    }

    // Update request
    const updatedRequest: RoleRequest = {
      ...mockRoleRequests[requestIndex],
      status: body.status,
      responseDate: new Date().toISOString(),
      respondedBy: body.adminId
    }

    mockRoleRequests[requestIndex] = updatedRequest

    return NextResponse.json({
      success: true,
      data: updatedRequest,
      message: `Role request ${body.status} successfully`
    })
  } catch (error) {
    console.error('Error in role requests PUT:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: "Failed to update role request",
        data: null
      },
      { status: 500 }
    )
  }
} 