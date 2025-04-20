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
    <>
      {/* Mobile button */}
      <div className="flex justify-start mb-4 sm:hidden px-6">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="border border-black px-4 py-2 uppercase text-xs tracking-widest"
        >
          {showFilters ? "Hide Filters" : "Show Filters"}
        </button>
      </div>

      {/* Filter block */}
      <div
        className={`${
          showFilters ? "flex" : "hidden"
        } sm:flex flex-col sm:gap-8 gap-6 sm:w-[250px] px-6 sm:px-0 mb-6 sm:mb-0`}
      >
        {/* Sort */}
        <div className="flex flex-col gap-2">
          <span className="text-sm uppercase text-gray-500">Sort by</span>
          <SortProducts
            sortBy={sortBy}
            setQueryParams={setQueryParams}
            data-testid={dataTestId}
          />
        </div>

        {/* Categories */}
        <div className="flex flex-col gap-2">
          <span className="text-sm uppercase text-gray-500">Category</span>
          <ul className="flex flex-col gap-2 text-sm">
            <li>
              <LocalizedClientLink
                href="/store"
                className="hover:underline text-gray-600"
              >
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
          <span className="text-sm uppercase text-gray-500">Collection</span>
          <ul className="flex flex-col gap-2 text-sm">
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
    </>
  )
}

export default RefinementList
