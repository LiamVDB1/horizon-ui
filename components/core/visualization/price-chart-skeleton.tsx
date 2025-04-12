import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function CryptoPriceWidgetSkeleton({ className = "" }: { className?: string }) {
    return (
        <Card className={`w-full max-w-[500px] ${className}`}>
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-6 w-24" />
                </CardTitle>
                <CardDescription className="flex justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-24" />
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Skeleton className="h-[200px] w-full" />
            </CardContent>
            <CardFooter className="flex-col items-start gap-2">
                <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="size-4" /> {/* For the trend icon */}
                </div>
                <Skeleton className="h-4 w-56" />
            </CardFooter>
        </Card>
    )
}

