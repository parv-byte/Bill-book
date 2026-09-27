// Centralized API Base configuration
// Defaults to empty string for relative proxying in dev, or custom backend URL when deployed
export const API_BASE = import.meta.env.VITE_API_URL || '';
