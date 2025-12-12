export default function PropertiesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Properties</h1>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700">
          Add Property
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 text-center text-gray-500">
          <p className="text-lg">Property management coming soon.</p>
          <p className="text-sm mt-2">You will be able to manage your listings here.</p>
        </div>
      </div>
    </div>
  );
}
