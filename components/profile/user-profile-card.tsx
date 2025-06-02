import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"


interface User {
  id: string | number;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  created_at?: string;
}

interface UserProfileCardProps {
  user: User
}

export function UserProfileCard({ user }: UserProfileCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col items-center space-y-4">
          <Avatar className="h-24 w-24">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="text-2xl">
              {user.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1 text-center">
            <h3 className="text-xl font-semibold">{user.name}</h3>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
          <div className="w-full space-y-2 pt-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Role</span>
              <span className="text-sm">{user.role.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}</span>
            </div>
            <Separator />
            {user.created_at && (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Member Since</span>
                  <span className="text-sm">{new Date(user.created_at).toLocaleString('en-US', { dateStyle: 'medium'})}</span>
                </div>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
