import Link from "next/link"
import { cn } from "@/lib/utils"
import { getIconComponent } from "@/lib/navigation"
import type { NavItemType } from "@/types/navigation"

interface NavItemProps {
  item: NavItemType
  isActive: boolean
}

export function NavItem({ item, isActive }: NavItemProps) {
  const IconComponent = getIconComponent(item.icon)
  
  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
        isActive ? "bg-accent text-accent-foreground" : "transparent",
      )}
    >
      <IconComponent className="h-4 w-4" />
      {item.title}
    </Link>
  )
}
