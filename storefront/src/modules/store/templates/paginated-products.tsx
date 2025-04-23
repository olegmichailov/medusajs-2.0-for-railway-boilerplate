"use client"

import { useEffect, useState } from "react"
import { getProductsListWithSort } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import ProductPreview from "@modules/products/components/product-preview"
import { Pagination } from "@modules/store/components/pagination"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

const PRODUCT_LIMIT = 12

const columnOptionsMobile = [1, 2]
const columnOptionsDesktop = [1, 2, 3, 4]

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
  const [columns, setColumns] = useState<number | null>(null)
  const [products, setProducts] = useState<any[]>([])
  const [region, setRegion] = useState<any>(null)
  const [count, setCount] = useState(0)

  const columnOptions = typeof window !== "undefined" && window.innerWidth < 640
    ? columnOptionsMobile
    : columnOptionsDesktop

  useEffect(() => {
    const isMobile = window.innerWidth < 640
    setColumns(isMobile ? 1 : 2)
  }, [])

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

  if (columns === null) return null

  const totalPages = Math.ceil(count / PRODUCT_LIMIT)

  const gridColsClass =
    columns === 1
      ? "grid-cols-1"
      : columns === 2
      ? "grid-cols-2"
      : columns === 3
      ? "grid-cols-3"
      : "grid-cols-4"

  return (
    <>
      <div className="pt-4 pb-2 flex items-center justify-between sm:px-0 px-4">
        <div className="text-sm sm:text-base font-medium tracking-wide uppercase">
          {/* Динамический заголовок будет здесь от другого компонента */}
        </div>
        <div className="flex gap-1 ml-auto">
          {columnOptions.map((col) => (
            <button
              key={col}
              onClick={() => setColumns(col)}
              className={`w-6 h-6 flex items-center justify-center border text-xs font-medium transition-all duration-200 rounded-none ${
                columns === col
                  ? "bg-black text-white border-black"
                  : "bg-white text-black border-gray-300 hover:border-black"
              }`}
            >
              {col}
            </button>
          ))}
        </div>
      </div>

      <ul
        className={`grid ${gridColsClass} gap-x-4 gap-y-10 px-4 sm:px-0`}
        data-testid="products-list"
      >
        {products.map((p) => (
          <li key={p.id} className="w-full">
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
