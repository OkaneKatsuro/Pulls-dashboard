'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { PoolFilters } from '@/types/mining-pool';
import { mockPools } from '@/data/mock-pools';

interface PoolsFiltersProps {
  filters: PoolFilters;
  onFiltersChange: (filters: Partial<PoolFilters>) => void;
  onReset: () => void;
}

export function PoolsFilters({ filters, onFiltersChange, onReset }: PoolsFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [algorithms, setAlgorithms] = useState<string[]>([]);
  const [regions, setRegions] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      // Extract unique algorithms and regions from mock data
      const uniqueAlgorithms = [...new Set(mockPools.map(pool => pool.algorithm))];
      const uniqueRegions = [...new Set(mockPools.map(pool => pool.region))];
      
      setAlgorithms(uniqueAlgorithms);
      setRegions(uniqueRegions);
      setError(null);
    } catch (error) {
      console.error('Error loading filter options:', error);
      setError('Failed to load filter options');
    }
  }, []);

  const handleSearchChange = (value: string) => {
    try {
      onFiltersChange({ search: value });
    } catch (error) {
      console.error('Error updating search filter:', error);
    }
  };

  const handleAlgorithmChange = (value: string) => {
    try {
      onFiltersChange({ algorithm: value === 'all' ? '' : value });
    } catch (error) {
      console.error('Error updating algorithm filter:', error);
    }
  };

  const handleStatusChange = (value: string) => {
    try {
      onFiltersChange({ status: value === 'all' ? '' : value });
    } catch (error) {
      console.error('Error updating status filter:', error);
    }
  };

  const handleRegionChange = (value: string) => {
    try {
      onFiltersChange({ region: value === 'all' ? '' : value });
    } catch (error) {
      console.error('Error updating region filter:', error);
    }
  };

  const handleToggleExpanded = () => {
    try {
      console.log('Toggling filters, current state:', isExpanded);
      setIsExpanded(!isExpanded);
      console.log('Filters toggled successfully');
    } catch (error) {
      console.error('Error toggling filters:', error);
    }
  };

  const handleReset = () => {
    try {
      onReset();
    } catch (error) {
      console.error('Error resetting filters:', error);
    }
  };

  const hasActiveFilters = filters.algorithm || filters.status || filters.region || filters.search;

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
        <div className="flex flex-col gap-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Поиск пулов по названию, алгоритму или региону..."
              value={filters.search || ''}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filter Toggle */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={handleToggleExpanded}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Фильтры
              {hasActiveFilters && (
                <div className="h-2 w-2 rounded-full bg-primary" />
              )}
            </Button>
            
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReset}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
                Очистить все
              </Button>
            )}
          </div>

          {/* Advanced Filters */}
          {isExpanded && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
              <div className="space-y-2">
                <label className="text-sm font-medium">Алгоритм</label>
                <Select value={filters.algorithm || 'all'} onValueChange={handleAlgorithmChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Все алгоритмы" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все алгоритмы</SelectItem>
                    {algorithms.map((algorithm) => (
                      <SelectItem key={algorithm} value={algorithm}>
                        {algorithm}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Статус</label>
                <Select value={filters.status || 'all'} onValueChange={handleStatusChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Все статусы" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все статусы</SelectItem>
                    <SelectItem value="active">Активный</SelectItem>
                    <SelectItem value="inactive">Неактивный</SelectItem>
                    <SelectItem value="maintenance">Обслуживание</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Регион</label>
                <Select value={filters.region || 'all'} onValueChange={handleRegionChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Все регионы" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все регионы</SelectItem>
                    {regions.map((region) => (
                      <SelectItem key={region} value={region}>
                        {region}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 