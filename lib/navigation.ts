import { Home, Building2, Users, Settings, LogOut, Shield } from "lucide-react"

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
  roles: "roles"
}

const navConfig: NavigationConfig = {
  business_owner: [
    { title: "Dashboard", href: "/dashboard", icon: navIcons.home },
    { title: "Branches", href: "/branches", icon: navIcons.building },
    { title: "Role Management", href: "/roles", icon: navIcons.roles },
    { title: "Staff", href: "/staff", icon: navIcons.users },
    {
      title: "Queue Management",
      href: "/queue",
      icon: navIcons.home,
      submenu: [
        { title: "View Queues", href: "/queue", icon: navIcons.home },
        { title: "Add Queue", href: "/queue/create", icon: navIcons.home },
        { title: "Add Customer", href: "/queue/add-customer", icon: navIcons.users },
        { title: "Start Queue", href: "/queue/start", icon: navIcons.home },
      ],
    },
    { title: "Invitations", href: "/invitations", icon: navIcons.home },
    { title: "Settings", href: "/settings", icon: navIcons.settings },
    { title: "Logout", href: "/auth/login", icon: navIcons.logout },
  ],
  branch_manager: [
    { title: "Dashboard", href: "/dashboard", icon: navIcons.home },
    {
      title: "Queue Management",
      href: "/queue",
      icon: navIcons.home,
      submenu: [
        { title: "View Queues", href: "/queue", icon: navIcons.home },
        { title: "Add Queue", href: "/queue/create", icon: navIcons.home },
        { title: "Add Customer", href: "/queue/add-customer", icon: navIcons.users },
        { title: "Start Queue", href: "/queue/start", icon: navIcons.home },
      ],
    },
    { title: "Staff", href: "/staff", icon: navIcons.users },
    { title: "Invitations", href: "/invitations", icon: navIcons.home },
    { title: "Settings", href: "/settings", icon: navIcons.settings },
    { title: "Logout", href: "/auth/login", icon: navIcons.logout },
  ],
  staff: [
    { title: "View Queues", href: "/queue", icon: navIcons.home },
    { title: "Add Customer", href: "/queue/add-customer", icon: navIcons.users },
    { title: "Start Queue", href: "/queue/start", icon: navIcons.home },
    { title: "My Profile", href: "/profile", icon: navIcons.users },
    { title: "Settings", href: "/settings", icon: navIcons.settings },
    { title: "Logout", href: "/auth/login", icon: navIcons.logout },
  ],
  admin: [
    { title: "Dashboard", href: "/dashboard", icon: navIcons.home },
    { title: "Businesses", href: "/businesses", icon: navIcons.building },
    { title: "Analytics", href: "/analytics", icon: navIcons.home },
    { title: "Settings", href: "/settings", icon: navIcons.settings },
  ],
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
  }
  return iconMap[iconName as keyof typeof iconMap] || Home
}
