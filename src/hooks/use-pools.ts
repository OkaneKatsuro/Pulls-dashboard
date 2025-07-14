import { useState, useEffect } from 'react';
import { MiningPool, PoolFilters, SortConfig } from '@/types/mining-pool';

interface UsePoolsOptions {
  filters?: Partial<PoolFilters>;
  sortConfig?: SortConfig | null;
}

interface UsePoolsReturn {
  pools: MiningPool[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function usePools(options: UsePoolsOptions = {}): UsePoolsReturn {
  const [pools, setPools] = useState<MiningPool[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPools = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const params = new URLSearchParams();
      
      if (options.filters?.algorithm) params.append('algorithm', options.filters.algorithm);
      if (options.filters?.status) params.append('status', options.filters.status);
      if (options.filters?.region) params.append('region', options.filters.region);
      if (options.filters?.search) params.append('search', options.filters.search);
      if (options.sortConfig?.key) params.append('sortBy', options.sortConfig.key);
      if (options.sortConfig?.direction) params.append('sortDirection', options.sortConfig.direction);

      const response = await fetch(`/api/pools?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch pools');
      }

      const data = await response.json();
      
      if (data.success) {
        setPools(data.pools);
      } else {
        throw new Error(data.error || 'Failed to fetch pools');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPools();
  }, [options.filters, options.sortConfig]);

  return {
    pools,
    isLoading,
    error,
    refetch: fetchPools,
  };
}

export function usePoolDetails(id: string) {
  const [pool, setPool] = useState<MiningPool | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPoolDetails = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(`/api/pools/${id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch pool details');
        }

        const data = await response.json();
        
        if (data.success) {
          setPool(data.pool);
        } else {
          throw new Error(data.error || 'Failed to fetch pool details');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchPoolDetails();
    }
  }, [id]);

  return {
    pool,
    isLoading,
    error,
  };
} 