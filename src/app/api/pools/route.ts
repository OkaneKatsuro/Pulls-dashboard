import { NextRequest, NextResponse } from 'next/server';
import { mockPools } from '@/data/mock-pools';

export async function GET(request: NextRequest) {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const { searchParams } = new URL(request.url);
    const algorithm = searchParams.get('algorithm');
    const status = searchParams.get('status');
    const region = searchParams.get('region');
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy');
    const sortDirection = searchParams.get('sortDirection');

    let filteredPools = [...mockPools];

    // Apply filters
    if (algorithm) {
      filteredPools = filteredPools.filter(pool => pool.algorithm === algorithm);
    }
    if (status) {
      filteredPools = filteredPools.filter(pool => pool.status === status);
    }
    if (region) {
      filteredPools = filteredPools.filter(pool => pool.region === region);
    }
    if (search) {
      filteredPools = filteredPools.filter(pool => 
        pool.name.toLowerCase().includes(search.toLowerCase()) ||
        pool.algorithm.toLowerCase().includes(search.toLowerCase()) ||
        pool.region.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Apply sorting
    if (sortBy && sortDirection) {
      filteredPools.sort((a, b) => {
        const aValue = a[sortBy as keyof typeof a];
        const bValue = b[sortBy as keyof typeof b];
        
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortDirection === 'asc' 
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }
        
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortDirection === 'asc' 
            ? aValue - bValue
            : bValue - aValue;
        }
        
        return 0;
      });
    }

    return NextResponse.json({
      pools: filteredPools,
      total: filteredPools.length,
      success: true
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch pools', success: false },
      { status: 500 }
    );
  }
} 