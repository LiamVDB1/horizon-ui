"use client"

import { TrendingDown, TrendingUp } from "lucide-react"
import { useEffect, useState } from "react"
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { type ChartConfig, ChartContainer, ChartTooltip } from "@/components/ui/chart"
import { DAYS_TO_SHOW, HOUR_INTERVAL } from "@/lib/tools/price-api";

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
        <Card className={`w-full max-w-[500px] ${className}`}>
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <span>
                        {cryptoData.name} ({cryptoData.symbol})
                    </span>
                    <span>{formatPrice(cryptoData.current_price)}</span>
                </CardTitle>
                <CardDescription>
                    {DAYS_TO_SHOW}d High: {formatPrice(cryptoData.high_7d)} | Low: {formatPrice(cryptoData.low_7d)}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <LineChart
                        accessibilityLayer
                        data={chartData}
                        margin={{
                            top: 5,
                            right: 10,
                            left: 10,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="timestamp"
                            tickFormatter={(unixTime) => new Date(unixTime).toLocaleDateString([], { weekday: "short" })}
                            interval={Math.floor((24 * DAYS_TO_SHOW) / (HOUR_INTERVAL * 10))}
                            minTickGap={5}
                        />
                        <YAxis
                            tickFormatter={(value) => `$${value.toLocaleString()}`}
                            width={80}
                        />
                        <ChartTooltip
                            content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                    return (
                                        <div className="bg-background p-2 rounded shadow">
                                            <p className="text-sm font-semibold">
                                                {new Date(payload[0].payload.timestamp).toLocaleString()}
                                            </p>
                                            <p className="text-sm">
                                                {formatPrice(payload[0].value as number)}
                                            </p>
                                        </div>
                                    )
                                }
                                return null
                            }}
                        />
                        <Line
                            type="monotone"
                            dataKey="price"
                            stroke="var(--color-price)"
                            dot={false}
                        />
                    </LineChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className={`flex gap-2 font-medium leading-none ${priceChangeColor}`}>
                    {cryptoData.price_change_percentage_7d >= 0 ? (
                        <>
                            Trending up by {cryptoData.price_change_percentage_7d.toFixed(2)}% in {DAYS_TO_SHOW} days
                            <TrendingUp className="h-4 w-4" />
                        </>
                    ) : (
                        <>
                            Trending down by {Math.abs(cryptoData.price_change_percentage_7d).toFixed(2)}% in {DAYS_TO_SHOW} days
                            <TrendingDown className="h-4 w-4" />
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