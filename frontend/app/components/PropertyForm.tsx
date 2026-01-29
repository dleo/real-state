'use client';

import { useState } from 'react';
import { Property, AssetType, Condition, CreatePropertyData } from '../../lib/api';

interface PropertyFormProps {
  initialData?: Property;
  onSubmit: (data: CreatePropertyData) => Promise<void>;
}

export default function PropertyForm({ initialData, onSubmit }: PropertyFormProps) {
  const [assetType, setAssetType] = useState<number>(initialData?.asset_type ?? AssetType.Residential);
  const [condition, setCondition] = useState<number>(initialData?.condition ?? Condition.New);
  const [price, setPrice] = useState<string>(initialData?.price?.toString() ?? '');
  const [taxes, setTaxes] = useState<string>(initialData?.taxes?.toString() ?? '');
  const [income, setIncome] = useState<string>(initialData?.income?.toString() ?? '');
  const [expenditure, setExpenditure] = useState<string>(initialData?.expenditure?.toString() ?? '');
  const [features, setFeatures] = useState<string>(initialData?.features?.join(', ') ?? '');
  const [address, setAddress] = useState<string>(initialData?.address ?? '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setError(null);

    if (!price || !taxes) {
      setError('Price and taxes are required fields');
      return;
    }

    const parsedPrice = parseFloat(price);
    const parsedTaxes = parseFloat(taxes);

    if (isNaN(parsedPrice) || parsedPrice < 0) {
      setError('Price must be a valid positive number');
      return;
    }

    if (isNaN(parsedTaxes) || parsedTaxes < 0) {
      setError('Taxes must be a valid positive number');
      return;
    }

    const featuresArray = features
      .split(',')
      .map((f) => f.trim())
      .filter((f) => f.length > 0);

    const data: CreatePropertyData = {
      asset_type: assetType,
      condition: condition,
      price: parsedPrice,
      taxes: parsedTaxes,
      income: income ? parseFloat(income) : 0,
      expenditure: expenditure ? parseFloat(expenditure) : 0,
      features: featuresArray,
      address: address || undefined,
    };

    setIsSubmitting(true);
    try {
      await onSubmit(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save property');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Asset Type *
        </label>
        <select
          value={assetType}
          onChange={(e) => setAssetType(Number(e.target.value))}
          className="w-full border border-gray-300 rounded px-3 py-2"
        >
          <option value={AssetType.Residential}>Residential</option>
          <option value={AssetType.Commercial}>Commercial</option>
          <option value={AssetType.Land}>Land</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Condition *
        </label>
        <select
          value={condition}
          onChange={(e) => setCondition(Number(e.target.value))}
          className="w-full border border-gray-300 rounded px-3 py-2"
        >
          <option value={Condition.New}>New</option>
          <option value={Condition.Old}>Old</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Price *
        </label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="0.00"
          min="0"
          step="0.01"
          className="w-full border border-gray-300 rounded px-3 py-2"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Taxes *
        </label>
        <input
          type="number"
          value={taxes}
          onChange={(e) => setTaxes(e.target.value)}
          placeholder="0.00"
          min="0"
          step="0.01"
          className="w-full border border-gray-300 rounded px-3 py-2"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Income
        </label>
        <input
          type="number"
          value={income}
          onChange={(e) => setIncome(e.target.value)}
          placeholder="0.00"
          min="0"
          step="0.01"
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Expenditure
        </label>
        <input
          type="number"
          value={expenditure}
          onChange={(e) => setExpenditure(e.target.value)}
          placeholder="0.00"
          min="0"
          step="0.01"
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Features
        </label>
        <input
          type="text"
          value={features}
          onChange={(e) => setFeatures(e.target.value)}
          placeholder="garage, pool, garden"
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
        <p className="text-sm text-gray-500 mt-1">Comma-separated list</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Address
        </label>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="123 Main St"
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-blue-300"
      >
        {isSubmitting ? 'Saving...' : initialData ? 'Update Property' : 'Create Property'}
      </button>
    </form>
  );
}
