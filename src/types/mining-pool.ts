export interface MiningPool {
  id: string;
  name: string;
  algorithm: string;
  url: string;
  port: number;
  fee: number;
  minPayout: number;
  hashrate: number;
  workers: number;
  uptime: number;
  lastBlock: string;
  status: 'active' | 'inactive' | 'maintenance';
  region: string;
  description?: string;
}

export interface PoolFilters {
  algorithm: string;
  status: string;
  region: string;
  search: string;
}

export interface SortConfig {
  key: keyof MiningPool;
  direction: 'asc' | 'desc';
} 