"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MessageSquare,
  Home,
  PieChart,
  Users,
  Calendar,
  Settings,
  LogOut,
} from "lucide-react";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Properties", href: "/dashboard/properties", icon: Home },
  { name: "Reviews", href: "/dashboard/reviews", icon: MessageSquare },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-72 bg-[#0f172a] text-slate-300 min-h-screen flex flex-col border-r border-slate-800 shadow-xl">
      {/* Logo Section */}
      <div className="h-20 flex items-center px-8 border-b border-slate-800 bg-[#0f172a]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <span className="text-white font-bold text-lg">F</span>
          </div>
          <span className="text-xl font-bold text-white tracking-tight">
            Flex Living
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-4">
          Overview
        </div>

        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`
                    group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ease-in-out
                    ${
                      isActive
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-900/20"
                        : "hover:bg-slate-800 hover:text-white"
                    }
                  `}
                >
                  <Icon
                    className={`w-5 h-5 transition-colors duration-200 ${
                      isActive
                        ? "text-white"
                        : "text-slate-400 group-hover:text-white"
                    }`}
                  />
                  <span className="font-medium text-sm">{item.name}</span>
                  {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white/50" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Profile / Footer */}
      <div className="p-4 border-t border-slate-800 bg-[#0f172a]">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer group text-left">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-lg">
            AD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              Admin User
            </p>
            <p className="text-xs text-slate-500 truncate group-hover:text-slate-400">
              admin@flexliving.com
            </p>
          </div>
          <LogOut className="w-5 h-5 text-slate-500 group-hover:text-white transition-colors" />
        </button>
      </div>
    </aside>
  );
}
