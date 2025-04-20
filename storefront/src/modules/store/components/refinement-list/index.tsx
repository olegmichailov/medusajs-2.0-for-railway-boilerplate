"use client"

import { usePathname, useSearchParams } from "next/navigation"
import { useMemo } from "react"
import { getCategoriesList } from "@lib/data/categories"
import { getCollectionsList } from "@lib/data/collections"
import SortProducts, { SortOptions } from "./sort-products"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type RefinementListProps = {
  sortBy: SortOptions
  search?: boolean
  "data-testid"?: string
}

export default async function RefinementList({
  sortBy,
  "data-testid": dataTestId,
}: RefinementListProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const currentCategory = searchParams.get("category")
  const currentCollection = searchParams.get("collection")

  const { product_categories } = await getCategoriesList(0, 100)
  const { collections } = await getCollectionsList(0, 100)

  return (
    <div className="flex small:flex-col gap-12 py-4 mb-8 small:px-0 pl-6 small:min-w-[250px] small:ml-[1.675rem] font-sans text-sm tracking-wide">
      {/* СОРТИРОВКА */}
      <div className="flex flex-col gap-2">
        <span className="text-xs uppercase text-gray-500">Sort by</span>
        <SortProducts sortBy={sortBy} data-testid={dataTestId} />
      </div>

      {/* КАТЕГОРИИ */}
      {product_categories && (
        <div className="flex flex-col gap-2">
          <span className="text-xs uppercase text-gray-500">Category</span>
          <LocalizedClientLink
            href={`${pathname.split("?")[0]}`}
            className={`text-left text-sm hover:underline ${
              !currentCategory ? "font-semibold" : "text-gray-600"
            }`}
          >
            All Categories
          </LocalizedClientLink>
          {product_categories.map((c) => {
            if (c.parent_category) return null
            return (
              <LocalizedClientLink
                key={c.id}
                href={`/categories/${c.handle}`}
                className={`text-left text-sm hover:underline ${
                  pathname.includes(c.handle) ? "font-semibold" : "text-gray-600"
                }`}
              >
                {c.name}
              </LocalizedClientLink>
            )
          })}
        </div>
      )}

      {/* КОЛЛЕКЦИИ */}
      {collections && (
        <div className="flex flex-col gap-2">
          <span className="text-xs uppercase text-gray-500">Collection</span>
          <LocalizedClientLink
            href={`${pathname.split("?")[0]}`}
            className={`text-left text-sm hover:underline ${
              !currentCollection ? "font-semibold" : "text-gray-600"
            }`}
          >
            All Collections
          </LocalizedClientLink>
          {collections.map((c) => (
            <LocalizedClientLink
              key={c.id}
              href={`/collections/${c.handle}`}
              className={`text-left text-sm hover:underline ${
                pathname.includes(c.handle) ? "font-semibold" : "text-gray-600"
              }`}
            >
              {c.title}
            </LocalizedClientLink>
          ))}
        </div>
      )}
    </div>
  )
}
