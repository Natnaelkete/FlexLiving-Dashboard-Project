export function Header() {
  return (
    <header className="bg-white shadow p-4 flex justify-between items-center">
      <h2 className="text-xl font-semibold text-gray-800">Manager Dashboard</h2>
      <div className="flex items-center space-x-4">
        <span className="text-gray-600">Admin User</span>
      </div>
    </header>
  );
}
