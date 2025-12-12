import Link from 'next/link';

export function Sidebar() {
  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Flex Living</h1>
      </div>
      <nav>
        <ul className="space-y-2">
          <li>
            <Link href="/dashboard" className="block p-2 hover:bg-gray-800 rounded">
              Dashboard
            </Link>
          </li>
          <li>
            <Link href="/dashboard/reviews" className="block p-2 hover:bg-gray-800 rounded">
              Reviews
            </Link>
          </li>
          <li>
            <Link href="/dashboard/properties" className="block p-2 hover:bg-gray-800 rounded">
              Properties
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
