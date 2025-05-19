"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { NavItem } from "@/components/features/navigation/nav-item"
import { getIconComponent } from "@/lib/navigation"
import type { NavItemType } from "@/types/navigation"

interface MainNavProps {
  items: NavItemType[]
}

export function MainNav({ items }: MainNavProps) {
  const pathname = usePathname()
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null)

  const toggleSubmenu = (title: string) => {
    setOpenSubmenu(openSubmenu === title ? null : title)
  }

  return (
    <nav className="grid gap-2 p-4">
      {items.map((item) => {
        const IconComponent = getIconComponent(item.icon)
        
        return (
          <div key={item.title}>
            {item.submenu ? (
              <div>
                <button
                  onClick={() => toggleSubmenu(item.title)}
                  className={cn(
                    "flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                    openSubmenu === item.title ? "bg-accent text-accent-foreground" : "transparent",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <IconComponent className="h-4 w-4" />
                    {item.title}
                  </div>
                  <ChevronDown
                    className={cn("h-4 w-4 transition-transform", openSubmenu === item.title ? "rotate-180" : "")}
                  />
                </button>
                {openSubmenu === item.title && (
                  <div className="ml-6 mt-1 grid gap-1">
                    {item.submenu.map((subitem) => (
                      <NavItem key={subitem.title} item={subitem} isActive={pathname === subitem.href} />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <NavItem item={item} isActive={pathname === item.href} />
            )}
          </div>
        )
      })}
    </nav>
  )
}
