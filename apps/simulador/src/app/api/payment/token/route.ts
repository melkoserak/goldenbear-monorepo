import { NextResponse } from 'next/server';
import { getPaymentWidgetToken } from '@/lib/mag-api/client';
import { MAG_Logger } from '@/lib/mag-api/logger';

export const dynamic = 'force-dynamic';

/**
 * (Tradução de handle_get_payment_token)
 *
 */
export async function POST() {
  try {
    const token = await getPaymentWidgetToken();
    return NextResponse.json({ token });
  } catch (error) {
    const err = error as Error;
    MAG_Logger.error('Erro em /api/payment/token', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}