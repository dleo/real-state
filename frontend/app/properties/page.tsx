'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Property, getProperties, deleteProperty } from '../../lib/api';

const assetTypeLabels: Record<number, string> = {
  0: 'Residential',
  1: 'Commercial',
  2: 'Land',
};

const conditionLabels: Record<number, string> = {
  0: 'New',
  1: 'Old',
};

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProperties = async () => {
    try {
      const data = await getProperties();
      console.log(data);
      setProperties(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load properties');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this property?')) return;

    try {
      await deleteProperty(id);
      setProperties(properties.filter((p) => p.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete property');
    }
  };

  if (isLoading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Properties</h1>
        <Link
          href="/properties/new"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Property
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
          {error}
        </div>
      )}

      {properties.length === 0 ? (
        <p className="text-gray-500">No properties found.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left">Type</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Condition</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Price</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Features</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {properties.map((property) => (
              <tr key={property.id}>
                <td className="border border-gray-300 px-4 py-2">
                  {assetTypeLabels[property.asset_type]}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {conditionLabels[property.condition]}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  ${property.price.toLocaleString()}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {(property.features || []).join(', ')}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <Link
                    href={`/properties/${property.id}/edit`}
                    className="text-blue-500 hover:underline mr-4"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(property.id)}
                    className="text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
