import Link from "next/link"
import { cn } from "@/lib/utils"
import type { NavItemType } from "@/types/navigation"

interface NavItemProps {
  item: NavItemType
  isActive: boolean
}

export function NavItem({ item, isActive }: NavItemProps) {
  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
        isActive ? "bg-accent text-accent-foreground" : "transparent",
      )}
    >
      {item.icon}
      {item.title}
    </Link>
  )
}
