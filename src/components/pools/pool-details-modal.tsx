'use client';

import { ExternalLink, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MiningPool } from '@/types/mining-pool';

interface PoolDetailsModalProps {
  pool: MiningPool | null;
  isOpen: boolean;
  onClose: () => void;
}

export function PoolDetailsModal({ pool, isOpen, onClose }: PoolDetailsModalProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (!pool) return null;

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

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const connectionString = `${pool.url}:${pool.port}`;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto w-[95vw] max-w-4xl mx-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <span>{pool.name}</span>
            <Badge className={getStatusColor(pool.status)}>
              {pool.status}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Description */}
          {pool.description && (
            <div className="p-4 bg-muted/50 rounded-lg">
              <h3 className="font-semibold mb-2">Описание</h3>
              <p className="text-sm text-muted-foreground">{pool.description}</p>
            </div>
          )}

          {/* Connection Details */}
          <div className="p-4 bg-muted/50 rounded-lg">
            <h3 className="font-semibold mb-3">Детали подключения</h3>
            <div className="space-y-3">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="text-sm font-medium">Строка подключения:</span>
                  <div className="flex items-center gap-2">
                    <code className="px-2 py-1 bg-background rounded text-sm font-mono text-xs">
                      {connectionString}
                    </code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(connectionString, 'connection')}
                      className="h-8 w-8 p-0"
                    >
                      {copiedField === 'connection' ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <span className="text-sm font-medium">URL:</span>
                    <p className="text-xs text-muted-foreground break-all">{pool.url}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Порт:</span>
                    <p className="text-xs text-muted-foreground">{pool.port}</p>
                  </div>
                </div>
            </div>
          </div>

          {/* Pool Statistics */}
          <div className="p-4 bg-muted/50 rounded-lg">
            <h3 className="font-semibold mb-3">Статистика пула</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-xl font-bold text-primary">
                  {formatHashrate(pool.hashrate)}
                </div>
                <div className="text-xs text-muted-foreground">Хешрейт</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold">
                  {pool.workers.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                </div>
                <div className="text-xs text-muted-foreground">Воркеры</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-green-600">
                  {formatUptime(pool.uptime)}
                </div>
                <div className="text-xs text-muted-foreground">Аптайм</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold">
                  {pool.fee}%
                </div>
                <div className="text-xs text-muted-foreground">Комиссия</div>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="p-4 bg-muted/50 rounded-lg">
            <h3 className="font-semibold mb-3">Дополнительная информация</h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <span className="text-sm font-medium">Алгоритм:</span>
                  <div className="mt-1">
                    <Badge variant="secondary" className="text-xs">{pool.algorithm}</Badge>
                  </div>
                </div>
                <div>
                  <span className="text-sm font-medium">Регион:</span>
                  <p className="text-xs text-muted-foreground mt-1">{pool.region}</p>
                </div>
                <div>
                  <span className="text-sm font-medium">Мин. выплата:</span>
                  <p className="text-xs text-muted-foreground mt-1">
                    {pool.minPayout} BTC
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium">Последний блок:</span>
                  <p className="text-xs text-muted-foreground mt-1">
                    {pool.lastBlock}
                  </p>
                </div>
              </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <Button
              onClick={() => window.open(pool.url, '_blank')}
              className="flex items-center gap-2"
              size="sm"
            >
              <ExternalLink className="h-4 w-4" />
              Посетить сайт пула
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              size="sm"
            >
              Закрыть
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 