'use client';

import { useRouter } from 'next/navigation';
import PropertyForm from '../../components/PropertyForm';
import { createProperty, CreatePropertyData } from '../../../lib/api';

export default function NewPropertyPage() {
  const router = useRouter();

  const handleSubmit = async (data: CreatePropertyData) => {
    await createProperty(data);
    router.push('/properties');
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Create Property</h1>
      <PropertyForm onSubmit={handleSubmit} />
    </div>
  );
}
