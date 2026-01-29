const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Types - matching Laravel backend enums (integer values)
export enum AssetType {
  Residential = 0,
  Commercial = 1,
  Land = 2,
}

export enum Condition {
  New = 0,
  Old = 1,
}

export interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface Property {
  id: number;
  user_id: number;
  asset_type: AssetType;
  condition: Condition;
  features: string[];
  price: number;
  taxes: number;
  income: number;
  expenditure: number;
  external_id?: string;
  address?: string;
  created_at: string;
  updated_at: string;
}

export interface CreatePropertyData {
  asset_type: AssetType;
  condition: Condition;
  features: string[];
  price: number;
  taxes: number;
  income: number;
  expenditure: number;
  external_id?: string;
  address?: string;
}

export type UpdatePropertyData = Partial<CreatePropertyData>;

export interface AuthResponse {
  token: string;
  user: User;
}

// Token management
export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token');
}

export function setToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('auth_token', token);
}

export function removeToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('auth_token');
}

// API client
async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...options.headers,
  };

  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `HTTP error ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

// Auth methods
export async function login(email: string, password: string): Promise<string> {
  try {
    const response = await request<AuthResponse>('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setToken(response.token);
    return response.token;
  } catch (error) {
    throw error instanceof Error ? error : new Error('Login failed');
  }
}

export async function register(
  name: string,
  email: string,
  password: string
): Promise<AuthResponse> {
  try {
    const response = await request<AuthResponse>('/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, password_confirmation: password }),
    });
    setToken(response.token);
    return response;
  } catch (error) {
    throw error instanceof Error ? error : new Error('Registration failed');
  }
}

export async function logout(): Promise<void> {
  try {
    await request<void>('/logout', { method: 'POST' });
  } finally {
    removeToken();
  }
}

// Property methods
export async function getProperties(): Promise<Property[]> {
  try {
    const response = await request<{ data: Property[] }>('/properties');
    return response.data;
  } catch (error) {
    throw error instanceof Error ? error : new Error('Failed to fetch properties');
  }
}

export async function getProperty(id: number): Promise<Property> {
  try {
    const response = await request<{ data: Property }>(`/properties/${id}`);
    return response.data;
  } catch (error) {
    throw error instanceof Error ? error : new Error('Failed to fetch property');
  }
}

export async function createProperty(data: CreatePropertyData): Promise<Property> {
  try {
    const response = await request<{ data: Property }>('/properties', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.data;
  } catch (error) {
    throw error instanceof Error ? error : new Error('Failed to create property');
  }
}

export async function updateProperty(
  id: number,
  data: UpdatePropertyData
): Promise<Property> {
  try {
    const response = await request<{ data: Property }>(`/properties/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response.data;
  } catch (error) {
    throw error instanceof Error ? error : new Error('Failed to update property');
  }
}

export async function deleteProperty(id: number): Promise<void> {
  try {
    await request<void>(`/properties/${id}`, { method: 'DELETE' });
  } catch (error) {
    throw error instanceof Error ? error : new Error('Failed to delete property');
  }
}
