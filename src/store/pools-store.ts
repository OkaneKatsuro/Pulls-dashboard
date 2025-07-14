import { create } from 'zustand';
import { MiningPool, PoolFilters, SortConfig } from '@/types/mining-pool';
import { mockPools } from '@/data/mock-pools';

interface PoolsStore {
  pools: MiningPool[];
  filteredPools: MiningPool[];
  filters: PoolFilters;
  sortConfig: SortConfig | null;
  selectedPool: MiningPool | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setPools: (pools: MiningPool[]) => void;
  setFilters: (filters: Partial<PoolFilters>) => void;
  setSortConfig: (config: SortConfig | null) => void;
  setSelectedPool: (pool: MiningPool | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Computed actions
  applyFiltersAndSort: () => void;
  resetFilters: () => void;
}

export const usePoolsStore = create<PoolsStore>((set, get) => ({
  pools: mockPools,
  filteredPools: mockPools,
  filters: {
    algorithm: '',
    status: '',
    region: '',
    search: '',
  },
  sortConfig: null,
  selectedPool: null,
  isLoading: false,
  error: null,

  setPools: (pools) => set({ pools }),
  setFilters: (filters) => {
    try {
      set((state) => ({ 
        filters: { ...state.filters, ...filters } 
      }));
    } catch (error) {
      console.error('Error setting filters:', error);
    }
  },
  setSortConfig: (sortConfig) => set({ sortConfig }),
  setSelectedPool: (selectedPool) => set({ selectedPool }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  applyFiltersAndSort: () => {
    const { pools, filters, sortConfig } = get();
    
    let filtered = pools.filter((pool) => {
      const matchesAlgorithm = !filters.algorithm || pool.algorithm === filters.algorithm;
      const matchesStatus = !filters.status || pool.status === filters.status;
      const matchesRegion = !filters.region || pool.region === filters.region;
      const matchesSearch = !filters.search || 
        pool.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        pool.algorithm.toLowerCase().includes(filters.search.toLowerCase()) ||
        pool.region.toLowerCase().includes(filters.search.toLowerCase());

      return matchesAlgorithm && matchesStatus && matchesRegion && matchesSearch;
    });

    if (sortConfig) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortConfig.direction === 'asc' 
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }
        
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortConfig.direction === 'asc' 
            ? aValue - bValue
            : bValue - aValue;
        }
        
        return 0;
      });
    }

    set({ filteredPools: filtered });
  },

  resetFilters: () => {
    try {
      set({
        filters: {
          algorithm: '',
          status: '',
          region: '',
          search: '',
        },
        sortConfig: null,
      });
      get().applyFiltersAndSort();
    } catch (error) {
      console.error('Error resetting filters:', error);
    }
  },
})); 