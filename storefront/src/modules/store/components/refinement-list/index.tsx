"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import { SortOptions } from "./sort-products"
import SortProducts from "./sort-products"
import { getCategoriesList } from "@lib/data/categories"
import { getCollectionsList } from "@lib/data/collections"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

interface RefinementListProps {
  sortBy: SortOptions
  "data-testid"?: string
}

interface Category {
  id: string
  name: string
  handle: string
  parent_category?: any
}

interface Collection {
  id: string
  title: string
  handle: string
}

const RefinementList = ({ sortBy, "data-testid": dataTestId }: RefinementListProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [categories, setCategories] = useState<Category[]>([])
  const [collections, setCollections] = useState<Collection[]>([])
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      const { product_categories } = await getCategoriesList(0, 100)
      const { collections } = await getCollectionsList(0, 100)
      setCategories(product_categories || [])
      setCollections(collections || [])
    }
    fetchData()
  }, [])

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

  return (
    <div className="w-full mb-8 px-4">
      <div className="block small:hidden mb-4">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="w-full py-2 text-sm tracking-wider uppercase border border-black"
        >
          {showFilters ? "Hide Filters" : "Filters"}
        </button>
      </div>

      <div
        className={`${
          showFilters ? "block" : "hidden"
        } small:flex flex-col gap-8 text-sm tracking-wide font-sans`}
      >
        {/* Sort */}
        <div className="flex flex-col gap-2">
          <span className="text-xs uppercase text-gray-500">Sort by</span>
          <SortProducts
            sortBy={sortBy}
            setQueryParams={setQueryParams}
            data-testid={dataTestId}
          />
        </div>

        {/* Categories */}
        <div className="flex flex-col gap-2">
          <span className="text-xs uppercase text-gray-500">Category</span>
          <ul className="flex flex-col gap-1">
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

        {/* Collections */}
        <div className="flex flex-col gap-2">
          <span className="text-xs uppercase text-gray-500">Collection</span>
          <ul className="flex flex-col gap-1">
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
      </div>
    </div>
  )
}

export default RefinementList
