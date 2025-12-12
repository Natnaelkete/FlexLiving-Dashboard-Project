export function Header({ onMenuClick }: { onMenuClick?: () => void }) {
  return (
    <header className="bg-white shadow p-4 flex justify-between items-center sticky top-0 z-10">
      <div className="flex items-center">
        <button
          onClick={onMenuClick}
          className="mr-4 text-gray-500 focus:outline-none md:hidden"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        <h2 className="text-xl font-semibold text-gray-800">
          Manager Dashboard
        </h2>
      </div>
      <div className="flex items-center space-x-4">
        <span className="text-gray-600 text-sm sm:text-base">Admin User</span>
      </div>
    </header>
  );
}
