import { Skeleton } from "./ui/skeleton";

export function ProductDetailSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Image skeleton */}
      <div className="relative aspect-square overflow-hidden rounded-lg">
        <Skeleton className="h-full w-full" />
      </div>

      {/* Content skeleton */}
      <div className="flex flex-col space-y-4">
        <Skeleton className="h-10 w-2/3" /> {/* Title */}
        <Skeleton className="h-8 w-1/3" /> {/* Price */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" /> {/* Description line 1 */}
          <Skeleton className="h-4 w-5/6" /> {/* Description line 2 */}
          <Skeleton className="h-4 w-2/3" /> {/* Description line 3 */}
        </div>
        <div className="flex flex-col space-y-2 mt-6">
          <Skeleton className="h-10 w-full rounded-md" /> {/* Add to Cart */}
          <Skeleton className="h-10 w-full rounded-md" /> {/* Wishlist */}
        </div>
      </div>
    </div>
  );
}
