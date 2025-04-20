"use client"

import { getCategoriesList } from "@lib/data/categories"
import { getCollectionsList } from "@lib/data/collections"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { useEffect, useState } from "react"
import SortProducts, { SortOptions } from "./sort-products"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback } from "react"

export default function RefinementSidebar({ sortBy }: { sortBy: SortOptions }) {
  const [categories, setCategories] = useState([])
  const [collections, setCollections] = useState([])

  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams)
      if (value) {
        params.set(name, value)
      } else {
        params.delete(name)
      }
      return params.toString()
    },
    [searchParams]
  )

  const setQueryParams = (name: string, value: string) => {
    const query = createQueryString(name, value)
    router.push(`${pathname}?${query}`)
  }

  useEffect(() => {
    const fetchData = async () => {
      const { product_categories } = await getCategoriesList(0, 100)
      const { collections } = await getCollectionsList(0, 100)

      setCategories(product_categories || [])
      setCollections(collections || [])
    }

    fetchData()
  }, [])

  return (
    <div className="flex flex-col gap-y-10 px-6 py-6 text-sm tracking-wider font-sans">
      {/* Sort */}
      <div className="flex flex-col gap-y-2">
        <span className="uppercase text-xs text-gray-500">Sort by</span>
        <SortProducts sortBy={sortBy} setQueryParams={setQueryParams} />
      </div>

      {/* Categories */}
      {categories.length > 0 && (
        <div className="flex flex-col gap-y-2">
          <span className="uppercase text-xs text-gray-500">Category</span>
          <ul className="flex flex-col gap-2">
            <li>
              <LocalizedClientLink href="/store" className="hover:underline text-gray-600">
                All Products
              </LocalizedClientLink>
            </li>
            {categories
              .filter((c) => !c.parent_category)
              .map((category) => (
                <li key={category.id}>
                  <LocalizedClientLink
                    href={`/categories/${category.handle}`}
                    className="hover:underline text-gray-600"
                  >
                    {category.name}
                  </LocalizedClientLink>
                </li>
              ))}
          </ul>
        </div>
      )}

      {/* Collections */}
      {collections.length > 0 && (
        <div className="flex flex-col gap-y-2">
          <span className="uppercase text-xs text-gray-500">Collection</span>
          <ul className="flex flex-col gap-2">
            <li>
              <LocalizedClientLink href="/store" className="hover:underline text-gray-600">
                All Products
              </LocalizedClientLink>
            </li>
            {collections.map((collection) => (
              <li key={collection.id}>
                <LocalizedClientLink
                  href={`/collections/${collection.handle}`}
                  className="hover:underline text-gray-600"
                >
                  {collection.title}
                </LocalizedClientLink>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
