"use client"

import { Suspense, useState } from "react"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import PaginatedProducts from "./paginated-products"

const StoreTemplate = ({
  sortBy,
  page,
  countryCode,
}: {
  sortBy?: SortOptions
  page?: string
  countryCode: string
}) => {
  const [showFilters, setShowFilters] = useState(false)
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  return (
    <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-20 2xl:px-28">
      <div className="flex items-center justify-between pt-8 pb-6">
        <h1 className="text-4xl tracking-wider font-[505]">All Products</h1>
        <button
          onClick={() => setShowFilters((prev) => !prev)}
          className="border px-5 py-2 tracking-widest text-xs uppercase"
        >
          {showFilters ? "Hide Filters" : "Filters"}
        </button>
      </div>

      {showFilters && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-12">
          <RefinementList sortBy={sort} />
        </div>
      )}

      <Suspense fallback={<SkeletonProductGrid />}>
        <PaginatedProducts
          sortBy={sort}
          page={pageNumber}
          countryCode={countryCode}
        />
      </Suspense>
    </div>
  )
}

export default StoreTemplate
