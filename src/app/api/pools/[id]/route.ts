import { NextRequest, NextResponse } from 'next/server';
import { mockPools } from '@/data/mock-pools';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const { id } = await params;
    const pool = mockPools.find(p => p.id === id);
    
    if (!pool) {
      return NextResponse.json(
        { error: 'Pool not found', success: false },
        { status: 404 }
      );
    }

    return NextResponse.json({
      pool,
      success: true
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch pool details', success: false },
      { status: 500 }
    );
  }
} 