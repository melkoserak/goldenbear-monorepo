import { NextResponse } from 'next/server';
import { getWidgetToken } from '@/lib/mag-api/client';
import { MAG_Logger } from '@/lib/mag-api/logger';

export const dynamic = 'force-dynamic';

/**
 * (Tradução de handle_get_widget_token)
 *
 */
export async function POST() {
  try {
    // A função no client.ts já usa o escopo combinado 'apiseguradora apiunderwriting'
    const token = await getWidgetToken(); 
    return NextResponse.json({ token });
  } catch (error) {
    const err = error as Error;
    MAG_Logger.error('Erro em /api/widget/token', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}