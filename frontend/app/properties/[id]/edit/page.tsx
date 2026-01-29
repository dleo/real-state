'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import PropertyForm from '../../../components/PropertyForm';
import { getProperty, updateProperty, Property, CreatePropertyData } from '../../../../lib/api';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditPropertyPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const data = await getProperty(Number(id));
        setProperty(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load property');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  const handleSubmit = async (data: CreatePropertyData) => {
    await updateProperty(Number(id), data);
    router.push('/properties');
  };

  if (isLoading) {
    return <div className="p-8">Loading...</div>;
  }

  if (error || !property) {
    return (
      <div className="p-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">
          {error || 'Property not found'}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Edit Property</h1>
      <PropertyForm initialData={property} onSubmit={handleSubmit} />
    </div>
  );
}
