"use client"

import Image from "next/image"
import { Text } from "@medusajs/ui"
import Link from "next/link"
import { getProductPrice } from "@lib/util/get-product-price"
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
  const { cheapestPrice } = getProductPrice({
    product,
    region,
  })

  return (
    <LocalizedClientLink href={`/products/${product.handle}`} className="group">
      <div data-testid="product-wrapper">
        <div className="w-full overflow-hidden bg-white">
          <Image
            src={product.thumbnail || "/placeholder.png"}
            alt={product.title}
            width={800}
            height={800}
            quality={90}
            sizes="(max-width: 768px) 100vw, 33vw"
            className="w-full h-auto object-contain transition-transform duration-300 ease-in-out group-hover:scale-105"
          />
        </div>
        <div className="flex txt-compact-medium mt-2 justify-between px-1">
          <Text className="text-ui-fg-subtle text-sm sm:text-base" data-testid="product-title">
            {product.title}
          </Text>
          <div className="flex items-center gap-x-1 text-sm sm:text-base">
            {cheapestPrice && <span>{cheapestPrice.calculated_price}</span>}
          </div>
        </div>
      </div>
    </LocalizedClientLink>
  )
}
