import { Bell, Menu, Search, User } from "lucide-react";

export function Header({ onMenuClick }: { onMenuClick?: () => void }) {
  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-lg md:hidden transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Breadcrumb or Page Title */}
        <h2 className="text-lg font-semibold text-gray-800 hidden sm:block">
          Dashboard
        </h2>
      </div>

      <div className="flex items-center gap-4">
        {/* Search Bar (Visual) */}
        <div className="hidden md:flex items-center relative">
          <Search className="w-4 h-4 absolute left-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all w-64"
          />
        </div>

        <div className="h-8 w-px bg-gray-200 mx-2 hidden md:block"></div>

        {/* Actions */}
        <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        {/* User Profile */}
        <button className="flex items-center gap-3 pl-2 hover:bg-gray-50 rounded-lg p-1 transition-colors">
          <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
            <User className="w-4 h-4" />
          </div>
          <div className="hidden md:block text-left">
            <p className="text-sm font-medium text-gray-700">Admin User</p>
            <p className="text-xs text-gray-500">Manager</p>
          </div>
        </button>
      </div>
    </header>
  );
}
