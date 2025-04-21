// storefront/src/modules/store/templates/paginated-products.tsx

"use client"

import { useEffect, useState } from "react"
import { getProductsListWithSort } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import ProductPreview from "@modules/products/components/product-preview"
import { Pagination } from "@modules/store/components/pagination"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

const PRODUCT_LIMIT = 12

type PaginatedProductsParams = {
  limit: number
  collection_id?: string[]
  category_id?: string[]
  id?: string[]
  order?: string
}

export default function PaginatedProducts({
  sortBy,
  page,
  collectionId,
  categoryId,
  productsIds,
  countryCode,
}: {
  sortBy?: SortOptions
  page: number
  collectionId?: string
  categoryId?: string
  productsIds?: string[]
  countryCode: string
}) {
  const [products, setProducts] = useState<any[]>([])
  const [region, setRegion] = useState<any>(null)
  const [count, setCount] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      const queryParams: PaginatedProductsParams = {
        limit: PRODUCT_LIMIT,
      }

      if (collectionId) queryParams["collection_id"] = [collectionId]
      if (categoryId) queryParams["category_id"] = [categoryId]
      if (productsIds) queryParams["id"] = productsIds
      if (sortBy === "created_at") queryParams["order"] = "created_at"

      const regionData = await getRegion(countryCode)
      if (!regionData) return
      setRegion(regionData)

      const {
        response: { products, count },
      } = await getProductsListWithSort({ page, queryParams, sortBy, countryCode })

      setProducts(products)
      setCount(count)
    }

    fetchData()
  }, [sortBy, page, collectionId, categoryId, productsIds, countryCode])

  const totalPages = Math.ceil(count / PRODUCT_LIMIT)

  return (
    <>
      <ul
        className="grid grid-cols-1 small:grid-cols-2 gap-x-4 gap-y-10"
        data-testid="products-list"
      >
        {products.map((p) => (
          <li key={p.id}>
            <ProductPreview product={p} region={region} />
          </li>
        ))}
      </ul>

      {totalPages > 1 && (
        <Pagination
          data-testid="product-pagination"
          page={page}
          totalPages={totalPages}
        />
      )}
    </>
  )
}
