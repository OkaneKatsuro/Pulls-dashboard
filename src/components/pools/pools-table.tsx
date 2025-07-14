'use client';

import { useState } from 'react';
import { ChevronUp, ChevronDown, ExternalLink, Eye } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MiningPool, SortConfig } from '@/types/mining-pool';

interface PoolsTableProps {
  pools: MiningPool[];
  onSort: (key: keyof MiningPool) => void;
  sortConfig: SortConfig | null;
  onViewDetails: (pool: MiningPool) => void;
}

export function PoolsTable({ pools, onSort, sortConfig, onViewDetails }: PoolsTableProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'inactive':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const formatHashrate = (hashrate: number) => {
    if (hashrate >= 1000) {
      return `${(hashrate / 1000).toFixed(1)}k EH/s`;
    }
    return `${hashrate.toFixed(1)} EH/s`;
  };

  const formatUptime = (uptime: number) => {
    return `${uptime.toFixed(1)}%`;
  };

  const SortableHeader = ({ 
    children, 
    sortKey, 
    currentSort 
  }: { 
    children: React.ReactNode; 
    sortKey: keyof MiningPool; 
    currentSort: SortConfig | null; 
  }) => (
    <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => onSort(sortKey)}>
      <div className="flex items-center gap-2">
        {children}
        {currentSort?.key === sortKey && (
          currentSort.direction === 'asc' ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )
        )}
      </div>
    </TableHead>
  );

  if (pools.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Пулы не найдены по вашим критериям.
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <SortableHeader sortKey="name" currentSort={sortConfig}>
              Название пула
            </SortableHeader>
            <SortableHeader sortKey="algorithm" currentSort={sortConfig}>
              Алгоритм
            </SortableHeader>
            <SortableHeader sortKey="hashrate" currentSort={sortConfig}>
              Хешрейт
            </SortableHeader>
            <SortableHeader sortKey="workers" currentSort={sortConfig}>
              Воркеры
            </SortableHeader>
            <SortableHeader sortKey="fee" currentSort={sortConfig}>
              Комиссия
            </SortableHeader>
            <SortableHeader sortKey="uptime" currentSort={sortConfig}>
              Аптайм
            </SortableHeader>
            <SortableHeader sortKey="status" currentSort={sortConfig}>
              Статус
            </SortableHeader>
            <SortableHeader sortKey="region" currentSort={sortConfig}>
              Регион
            </SortableHeader>
            <TableHead className="text-right">Действия</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pools.map((pool) => (
            <TableRow key={pool.id} className="hover:bg-muted/50">
              <TableCell className="font-medium">
                <div className="flex flex-col">
                  <span>{pool.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {pool.url}:{pool.port}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="secondary">{pool.algorithm}</Badge>
              </TableCell>
              <TableCell className="font-mono">
                {formatHashrate(pool.hashrate)}
              </TableCell>
              <TableCell>
                {pool.workers.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              </TableCell>
              <TableCell>
                {pool.fee}%
              </TableCell>
              <TableCell>
                {formatUptime(pool.uptime)}
              </TableCell>
              <TableCell>
                <Badge className={getStatusColor(pool.status)}>
                  {pool.status}
                </Badge>
              </TableCell>
              <TableCell>
                {pool.region}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewDetails(pool)}
                    className="h-8 w-8 p-0"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(pool.url, '_blank')}
                    className="h-8 w-8 p-0"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
} 