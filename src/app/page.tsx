'use client';

import { useEffect } from 'react';
import { Activity, Hash, Users, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PoolsFilters } from '@/components/pools/pools-filters';
import { PoolsTable } from '@/components/pools/pools-table';
import { PoolDetailsModal } from '@/components/pools/pool-details-modal';
import { PoolsSkeleton } from '@/components/pools/pools-skeleton';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { usePoolsStore } from '@/store/pools-store';
import { MiningPool } from '@/types/mining-pool';

export default function DashboardPage() {
  const {
    filteredPools,
    filters,
    sortConfig,
    selectedPool,
    isLoading,
    error,
    setFilters,
    setSortConfig,
    setSelectedPool,
    applyFiltersAndSort,
    resetFilters,
  } = usePoolsStore();

  useEffect(() => {
    applyFiltersAndSort();
  }, [filters, sortConfig]);

  const handleSort = (key: keyof MiningPool) => {
    const newDirection = sortConfig?.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ key, direction: newDirection });
  };

  const handleViewDetails = (pool: MiningPool) => {
    setSelectedPool(pool);
  };

  const handleCloseModal = () => {
    setSelectedPool(null);
  };

  const totalHashrate = filteredPools.reduce((sum, pool) => sum + pool.hashrate, 0);
  const totalWorkers = filteredPools.reduce((sum, pool) => sum + pool.workers, 0);
  const avgUptime = filteredPools.length > 0 
    ? filteredPools.reduce((sum, pool) => sum + pool.uptime, 0) / filteredPools.length 
    : 0;
  const activePools = filteredPools.filter(pool => pool.status === 'active').length;

  const formatHashrate = (hashrate: number) => {
    if (hashrate >= 1000) {
      return `${(hashrate / 1000).toFixed(1)}k EH/s`;
    }
    return `${hashrate.toFixed(1)} EH/s`;
  };

  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-8">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Ошибка</h2>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Дашборд майнинг пулов</h1>
          <p className="text-muted-foreground">
            Мониторинг и сравнение Bitcoin майнинг пулов
          </p>
        </div>
        <ThemeToggle />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Общий хешрейт</CardTitle>
            <Hash className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatHashrate(totalHashrate)}</div>
            <p className="text-xs text-muted-foreground">
              По {filteredPools.length} пулам
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Всего воркеров</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(totalWorkers)}</div>
            <p className="text-xs text-muted-foreground">
              Активных майнеров
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Средний аптайм</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgUptime.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              Надежность пулов
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Активные пулы</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activePools}</div>
            <p className="text-xs text-muted-foreground">
              Из {filteredPools.length} всего
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Table */}
      {isLoading ? (
        <PoolsSkeleton />
      ) : (
        <>
          <PoolsFilters
            filters={filters}
            onFiltersChange={setFilters}
            onReset={resetFilters}
          />
          
          <PoolsTable
            pools={filteredPools}
            onSort={handleSort}
            sortConfig={sortConfig}
            onViewDetails={handleViewDetails}
          />
        </>
      )}

      {/* Pool Details Modal */}
      <PoolDetailsModal
        pool={selectedPool}
        isOpen={!!selectedPool}
        onClose={handleCloseModal}
      />
    </div>
  );
}
