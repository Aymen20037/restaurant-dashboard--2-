"use client"

import { useState } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Store,
  ShoppingBag,
  Utensils,
  Percent,
  Star,
  CreditCard,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  QrCode,
  FileText,
  Target,
  Download,
} from "lucide-react"
import { Button } from "@/components/ui/button"

interface SidebarProps {
  isOpen?: boolean
}

export function Sidebar({ isOpen = true }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)

  const menuItems = [
    {
      title: "Tableau de bord",
      icon: LayoutDashboard,
      href: "/",
      active: true,
    },
    {
      title: "Mon restaurant",
      icon: Store,
      href: "/restaurant",
    },
    {
      title: "Commandes",
      icon: ShoppingBag,
      href: "/commandes",
      badge: "12",
    },
    {
      title: "Plats",
      icon: Utensils,
      href: "/plats",
    },
    {
      title: "Promotions",
      icon: Percent,
      href: "/promotions",
    },
    {
      title: "Avis clients",
      icon: Star,
      href: "/avis",
    },
    {
      title: "Paiements",
      icon: CreditCard,
      href: "/paiements",
    },
    {
      title: "Statistiques",
      icon: TrendingUp,
      href: "/statistiques",
    },
    {
      title: "QR Code",
      icon: QrCode,
      href: "/qr-code",
    },
    {
      title: "Documents",
      icon: FileText,
      href: "/documents",
    },
    {
      title: "Campagnes",
      icon: Target,
      href: "/campagnes",
    },
    {
      title: "Export & WhatsApp",
      icon: Download,
      href: "/export",
    },
    {
      title: "Menu PDF",
      icon: FileText,
      href: "/menu-pdf",
    },
  ]

  return (
    <div
      className={cn(
        "fixed inset-y-0 z-20 flex h-full flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 shadow-lg transition-all duration-300 md:relative",
        isOpen ? "left-0" : "-left-full md:left-0",
        collapsed ? "w-16" : "w-64",
      )}
    >
      {/* Header avec gradient Droovo */}
      <div className="flex h-16 items-center justify-between bg-droovo-gradient px-4">
        <div className={cn("flex items-center gap-3", collapsed && "justify-center w-full")}>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur">
            <span className="text-lg font-bold text-white">D</span>
          </div>
          {!collapsed && <span className="text-lg font-bold text-white">Droovo Pro</span>}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="md:flex hidden text-white hover:bg-white/20"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-auto py-4">
        <nav className="grid gap-1 px-3">
          {menuItems.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all hover:bg-purple-50 hover:text-purple-700 dark:hover:bg-purple-900 dark:hover:text-purple-300",
                item.active
                  ? "bg-gradient-to-r from-purple-500 to-orange-500 text-white shadow-lg"
                  : "text-gray-600 dark:text-gray-300",
                collapsed && "justify-center px-0",
              )}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {!collapsed && (
                <div className="flex items-center justify-between w-full">
                  <span>{item.title}</span>
                  {item.badge && (
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">{item.badge}</span>
                  )}
                </div>
              )}
            </Link>
          ))}
        </nav>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 p-4">
        <div className={cn("flex items-center gap-3", collapsed && "justify-center")}>
          <Button variant="outline" size="icon" className="h-10 w-10 border-purple-200 hover:bg-purple-50">
            <Settings className="h-4 w-4 text-purple-600" />
          </Button>
          {!collapsed && (
            <Button variant="outline" size="icon" className="h-10 w-10 border-orange-200 hover:bg-orange-50">
              <HelpCircle className="h-4 w-4 text-orange-600" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
