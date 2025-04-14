# QueueMaster Frontend

QueueMaster is a business queue management system built with Next.js, TypeScript, and Tailwind CSS. It helps businesses manage their queues, staff, and customer flow efficiently.

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   # or
   pnpm install
   ```
3. Copy `.env.example` to `.env.local` and update the variables:
   ```bash
   cp .env.example .env.local
   ```
4. Start the development server:
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

## Authentication System

This project uses Laravel Sanctum for authentication with token-based authentication. The frontend works together with a Laravel backend API.

### Auth Flow

1. **Login/Registration**: The user submits credentials to the Laravel API
2. **Session Management**: Laravel Sanctum handles the authentication and creates a session
3. **Token Storage**: The authentication token is stored in an HTTP-only cookie
4. **Protected Routes**: Requests to protected routes automatically include the cookie

### Environment Variables

- `NEXT_PUBLIC_API_URL`: URL of your Laravel backend (e.g., http://localhost:8000)
- `NEXT_PUBLIC_APP_URL`: URL of this frontend application (e.g., http://localhost:3000)

### Authentication Structure

- `contexts/auth-context.tsx`: Provides authentication context throughout the application
- `lib/auth-service.ts`: Contains auth-related API calls (login, register, etc.)
- `lib/axios.ts`: Configured Axios instance that handles CSRF tokens and auth headers

### Protected Routes

Routes are automatically protected based on the `AuthProvider` in `contexts/auth-context.tsx`. Public routes are defined in the `PUBLIC_PATHS` array.

## Backend Requirements

The Laravel backend should implement the following API endpoints:

- `/sanctum/csrf-cookie`: For CSRF protection
- `/api/login`: For user login
- `/api/register`: For user registration
- `/api/logout`: For user logout
- `/api/user`: For fetching the authenticated user
- `/api/forgot-password`: For password reset requests
- `/api/reset-password`: For resetting passwords
- `/api/user/password`: For updating passwords
- `/api/user/profile`: For updating user profiles

## License

This project is licensed under the MIT License. 