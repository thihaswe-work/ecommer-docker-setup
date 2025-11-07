import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export function ProductCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      {/* Image skeleton */}
      <div className="relative aspect-square">
        <Skeleton className="h-full w-full" />
      </div>

      {/* Content skeleton */}
      <CardContent className="p-4 space-y-3">
        <Skeleton className="h-5 w-2/3" /> {/* title */}
        <Skeleton className="h-4 w-full" /> {/* description line 1 */}
        <Skeleton className="h-4 w-5/6" /> {/* description line 2 */}
        <Skeleton className="h-5 w-20" /> {/* price */}
      </CardContent>

      {/* Footer skeleton */}
      <CardFooter className="p-4 pt-0 flex gap-2">
        <Skeleton className="h-10 w-24 rounded-md" /> {/* Add to Cart */}
        <Button variant="outline" disabled className="w-full">
          <Skeleton className="h-4 w-12" />
        </Button>
      </CardFooter>
    </Card>
  );
}
