function readApiBaseUrl(): string {
  const value = import.meta.env.VITE_API_BASE_URL?.trim();
  if (!value) {
    throw new Error('VITE_API_BASE_URL is required.');
  }
  return value.replace(/\/$/, '');
}

export const apiBaseUrl = readApiBaseUrl();
