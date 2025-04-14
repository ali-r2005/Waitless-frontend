"use client"

import type React from "react"

import Link from "next/link"
import { Menu } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { MainNav } from "@/components/features/navigation/main-nav"
import type { NavItemType } from "@/types/navigation"

interface MobileNavProps {
  items: NavItemType[]
  businessName: string
  logo: React.ReactNode
}

export function MobileNav({ items, businessName, logo }: MobileNavProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72">
        <div className="flex h-full flex-col">
          <div className="flex h-14 items-center border-b px-4">
            <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
              {logo}
              <span>{businessName}</span>
            </Link>
          </div>
          <MainNav items={items} />
        </div>
      </SheetContent>
    </Sheet>
  )
}
