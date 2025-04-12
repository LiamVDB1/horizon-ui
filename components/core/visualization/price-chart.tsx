"use client"

import { TrendingDown, TrendingUp } from "lucide-react"
import { useEffect, useState } from "react"
import { CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { type ChartConfig, ChartContainer, ChartTooltip } from "@/components/ui/chart"
import { DAYS_TO_SHOW, HOUR_INTERVAL } from "@/lib/tools/price-api"

interface CryptoPriceData {
    symbol: string
    name: string
    current_price: number
    price_change_percentage_7d: number
    price_change_7d: number
    high_7d: number
    low_7d: number
    hourly_prices: {
        timestamp: string
        price: number
    }[]
}

function formatPrice(price: number): string {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(price)
}

const chartConfig = {
    price: {
        label: "Price",
        color: "hsl(var(--chart-1))",
    },
} satisfies ChartConfig

interface CryptoPriceWidgetProps {
    data: CryptoPriceData
    className?: string
}

export function CryptoPriceWidget({ data: cryptoData, className = "" }: CryptoPriceWidgetProps) {
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768)
        }

        handleResize()
        window.addEventListener("resize", handleResize)

        return () => window.removeEventListener("resize", handleResize)
    }, [])

    const chartData = cryptoData.hourly_prices.map((data) => ({
        timestamp: new Date(data.timestamp),
        price: data.price,
    }))

    const priceChangeColor = cryptoData.price_change_7d >= 0 ? "text-green-500" : "text-red-500"

    return (
        <Card className={`w-full sm:max-w-[500px] ${className}`}>
            <CardHeader>
                <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <span className="text-lg sm:text-xl">
                        {cryptoData.name} ({cryptoData.symbol})
                    </span>
                    <span className="text-xl sm:text-2xl font-bold">{formatPrice(cryptoData.current_price)}</span>
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm mt-2">
                    {DAYS_TO_SHOW}d High: {formatPrice(cryptoData.high_7d)} | Low: {formatPrice(cryptoData.low_7d)}
                </CardDescription>
            </CardHeader>
            <CardContent className="p-0 sm:p-6">
                <ChartContainer config={chartConfig} className="w-full">
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart
                            accessibilityLayer
                            data={chartData}
                            margin={{
                                top: 5,
                                right: isMobile ? 5 : 10,
                                left: isMobile ? 0 : 10,
                                bottom: 5,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                dataKey="timestamp"
                                tickFormatter={(unixTime) => new Date(unixTime).toLocaleDateString([], { weekday: "short" })}
                                interval={isMobile ? "preserveStartEnd" : Math.floor((24 * DAYS_TO_SHOW) / (HOUR_INTERVAL * 10))}
                                minTickGap={5}
                                tick={{ fontSize: isMobile ? 10 : 12 }}
                            />
                            <YAxis
                                tickFormatter={(value) => `$${value.toLocaleString()}`}
                                width={isMobile ? 50 : 80}
                                tick={{ fontSize: isMobile ? 10 : 12 }}
                            />
                            <ChartTooltip
                                content={({ active, payload }) => {
                                    if (active && payload && payload.length) {
                                        return (
                                            <div className="bg-background p-2 rounded shadow">
                                                <p className="text-xs sm:text-sm font-semibold">
                                                    {new Date(payload[0].payload.timestamp).toLocaleString()}
                                                </p>
                                                <p className="text-xs sm:text-sm">{formatPrice(payload[0].value as number)}</p>
                                            </div>
                                        )
                                    }
                                    return null
                                }}
                            />
                            <Line type="monotone" dataKey="price" stroke="var(--color-price)" dot={false} />
                        </LineChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-xs sm:text-sm">
                <div className={`flex gap-2 font-medium leading-none ${priceChangeColor}`}>
                    {cryptoData.price_change_percentage_7d >= 0 ? (
                        <>
                            Trending up by {cryptoData.price_change_percentage_7d.toFixed(2)}% in {DAYS_TO_SHOW} days
                            <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" />
                        </>
                    ) : (
                        <>
                            Trending down by {Math.abs(cryptoData.price_change_percentage_7d).toFixed(2)}% in {DAYS_TO_SHOW} days
                            <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4" />
                        </>
                    )}
                </div>
                <div className="leading-none text-muted-foreground">
                    Showing {HOUR_INTERVAL}-hourly prices for the last {DAYS_TO_SHOW} days
                </div>
            </CardFooter>
        </Card>
    )
}

export default CryptoPriceWidget

