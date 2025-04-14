import type { ReactNode } from "react"

export interface NavItemType {
  title: string
  href: string
  icon: ReactNode
  submenu?: NavItemType[]
}

export interface NavConfig {
  [key: string]: NavItemType[]
}
