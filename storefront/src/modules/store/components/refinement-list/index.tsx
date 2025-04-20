"use client"

import { usePathname, useSearchParams } from "next/navigation"
import { useCallback } from "react"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import SortProducts, { SortOptions } from "./sort-products"

const categories = [
  { value: "", label: "All Categories" },
  { value: "tshirts", label: "T-Shirts" },
  { value: "sweatshirts", label: "Sweatshirts" },
  { value: "accessories", label: "Accessories" },
]

const collections = [
  { value: "", label: "All Collections" },
  { value: "spring", label: "Spring" },
  { value: "love", label: "Love" },
]

type RefinementListProps = {
  sortBy: SortOptions
  search?: boolean
  "data-testid"?: string
}

const RefinementList = ({ sortBy, "data-testid": dataTestId }: RefinementListProps) => {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const createSortQuery = useCallback(
    (sort: string) => {
      const params = new URLSearchParams()
      if (sort && sort !== "created_at") {
        params.set("sortBy", sort)
      }
      const query = params.toString()
      return query ? `?${query}` : ""
    },
    []
  )

  const currentSort = searchParams.get("sortBy") || "created_at"

  return (
    <div className="flex small:flex-col gap-12 py-4 mb-8 small:px-0 pl-6 small:min-w-[250px] small:ml-[1.675rem]">
      <div className="flex flex-col gap-2">
        <span className="text-xs uppercase text-gray-500">Sort by</span>
        <SortProducts
          sortBy={sortBy}
          setQueryParams={() => {}}
          data-testid={dataTestId}
        />
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs uppercase text-gray-500">Category</span>
        {categories.map(({ value, label }) => {
          const isActive = pathname.includes(`/categories/${value}`)
          const href = value
            ? `/categories/${value}${createSortQuery(currentSort)}`
            : `/store${createSortQuery(currentSort)}`

          return (
            <LocalizedClientLink
              key={value}
              href={href}
              className={`text-left text-sm hover:underline ${
                isActive || (!value && pathname.endsWith("/store"))
                  ? "font-semibold"
                  : "text-gray-600"
              }`}
            >
              {label}
            </LocalizedClientLink>
          )
        })}
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs uppercase text-gray-500">Collection</span>
        {collections.map(({ value, label }) => {
          const isActive = pathname.includes(`/collections/${value}`)
          const href = value
            ? `/collections/${value}${createSortQuery(currentSort)}`
            : `/store${createSortQuery(currentSort)}`

          return (
            <LocalizedClientLink
              key={value}
              href={href}
              className={`text-left text-sm hover:underline ${
                isActive || (!value && pathname.endsWith("/store"))
                  ? "font-semibold"
                  : "text-gray-600"
              }`}
            >
              {label}
            </LocalizedClientLink>
          )
        })}
      </div>
    </div>
  )
}

export default RefinementList
