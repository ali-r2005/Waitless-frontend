import { Home, Building2, Users, Settings, LogOut, Shield, Clock, ListOrdered, CalendarClock } from "lucide-react"

import type { NavConfig, NavItemType } from "@/types/navigation"
import type { UserRole } from "@/types/user"

interface NavItem {
  title: string
  href: string
  icon: string
  submenu?: NavItem[]
}

interface NavigationConfig {
  [key: string]: NavItem[]
}

const navIcons = {
  home: "home",
  building: "building",
  users: "users",
  settings: "settings",
  logout: "logout",
  roles: "roles",
  queue: "queue"
}

const navConfig: NavigationConfig = {
  business_owner: [
    { title: "Dashboard", href: "/dashboard", icon: navIcons.home },
    { title: "Branches", href: "/branches", icon: navIcons.building },
    { title: "Role Management", href: "/roles", icon: navIcons.roles },
    { title: "Staff", href: "/staff", icon: navIcons.users },
    { title: "Queue Management", href: "/queue", icon: navIcons.queue }],
  branch_manager: [
    { title: "Dashboard", href: "/dashboard", icon: navIcons.home },
    { title: "Staff", href: "/staff", icon: navIcons.users },
    { title: "Queue Management", href: "/queue", icon: navIcons.queue }],
    
  staff: [
    { title: "Dashboard", href: "/dashboard", icon: navIcons.home },
    { title: "Queue Management", href: "/queue", icon: navIcons.queue }]
}

export const getNavItems = (role: string) => {
  return navConfig[role] || []
}

export const getIconComponent = (iconName: string) => {
  const iconMap = {
    home: Home,
    building: Building2,
    users: Users,
    settings: Settings,
    logout: LogOut,
    roles: Shield,
    queue: CalendarClock,
  }
  return iconMap[iconName as keyof typeof iconMap] || Home
}
