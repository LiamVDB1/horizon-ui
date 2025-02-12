// app/(chat)/api/crypto-price/route.ts
import { NextResponse } from 'next/server'

import { getCoinPriceData } from '@/lib/tools/price-api'


export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const ticker = searchParams.get('ticker')

    console.log('Received URL:', request.url)
    console.log('Search params:', Object.fromEntries(searchParams.entries()))
    console.log('Ticker value:', ticker)

    if (!ticker) {
        return NextResponse.json(
            { error: 'Ticker parameter is required' },
            { status: 400 }
        )
    }

    try {
        // Let's also log the cleaned ticker value
        const cleanedTicker = ticker.toLowerCase().trim()
        console.log('Cleaned ticker:', cleanedTicker)

        const data = await getCoinPriceData(cleanedTicker)
        return NextResponse.json(data)
    } catch (error) {
        console.error('Error fetching crypto price:', error)
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to fetch price data' },
            { status: 500 }
        )
    }
}