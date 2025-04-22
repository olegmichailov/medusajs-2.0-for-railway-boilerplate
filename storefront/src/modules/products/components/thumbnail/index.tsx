// storefront/src/modules/products/components/product-preview.tsx

"use client"

import Image from "next/image"
import { Text } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"

export default function ProductPreview({
  product,
  isFeatured,
  region,
}: {
  product: HttpTypes.StoreProduct
  isFeatured?: boolean
  region: HttpTypes.StoreRegion
}) {
  const price = product.variants?.[0]?.prices?.[0]?.amount

  return (
    <LocalizedClientLink href={`/products/${product.handle}`} className="group">
      <div data-testid="product-wrapper">
        <div className="relative w-full overflow-hidden bg-white aspect-[9/13.5]">
          <Image
            src={product.thumbnail || "/placeholder.png"}
            alt={product.title}
            fill
            sizes="(max-width: 576px) 100vw, (max-width: 768px) 50vw, 25vw"
            quality={90}
            className="object-contain object-center transition-transform duration-300 ease-in-out group-hover:scale-105"
          />
        </div>
        <div className="flex txt-compact-medium mt-2 justify-between px-1">
          <Text className="text-ui-fg-subtle text-sm sm:text-base" data-testid="product-title">
            {product.title}
          </Text>
          <div className="flex items-center gap-x-1 text-sm sm:text-base">
            {price && <span>{region.currency_code.toUpperCase()} {price / 100}</span>}
          </div>
        </div>
      </div>
    </LocalizedClientLink>
  )
}
