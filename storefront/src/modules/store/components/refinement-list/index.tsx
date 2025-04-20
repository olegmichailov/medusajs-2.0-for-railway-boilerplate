"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import { SortOptions } from "./sort-products"
import SortProducts from "./sort-products"
import { getCategoriesList } from "@lib/data/categories"
import { getCollectionsList } from "@lib/data/collections"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

// Types
interface RefinementListProps {
  sortBy: SortOptions
  "data-testid"?: string
}

interface Category {
  id: string
  name: string
  handle: string
  parent_category?: any
  category_children?: Category[]
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
  const [isOpen, setIsOpen] = useState(false)

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
    <div className="w-full">
      {/* Toggle button only on mobile */}
      <div className="md:hidden px-6 mb-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-sm uppercase tracking-wider text-gray-800 border border-gray-300 rounded px-4 py-2 w-full bg-white"
        >
          {isOpen ? "HIDE FILTERS" : "FILTERS"}
        </button>
      </div>

      {/* Desktop layout — original inline layout */}
      <div className="hidden md:flex small:flex-col gap-12 py-4 mb-8 small:px-0 pl-6 small:min-w-[250px] small:ml-[1.675rem] font-sans text-base tracking-wider">
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
            {categories.filter((c) => !c.parent_category).map((category) => (
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

      {/* Mobile layout — toggled */}
      {isOpen && (
        <div className="grid grid-cols-1 gap-8 px-6 mb-6 font-sans text-base tracking-wider sm:grid-cols-3 md:hidden">
          {/* Sort */}
          <div className="flex flex-col gap-2 text-left">
            <span className="text-sm uppercase text-gray-500">Sort by</span>
            <div className="whitespace-nowrap">
              <SortProducts
                sortBy={sortBy}
                setQueryParams={setQueryParams}
                data-testid={dataTestId}
              />
            </div>
          </div>

          {/* Categories */}
          <div className="flex flex-col gap-2 text-left">
            <span className="text-sm uppercase text-gray-500">Category</span>
            <ul className="flex flex-col gap-2 text-sm">
              <li className="whitespace-nowrap">
                <LocalizedClientLink
                  href="/store"
                  className="hover:underline text-gray-600"
                >
                  All Products
                </LocalizedClientLink>
              </li>
              {categories.filter((c) => !c.parent_category).map((category) => (
                <li key={category.id} className="whitespace-nowrap">
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
          <div className="flex flex-col gap-2 text-left">
            <span className="text-sm uppercase text-gray-500">Collection</span>
            <ul className="flex flex-col gap-2 text-sm">
              {collections.map((collection) => (
                <li key={collection.id} className="whitespace-nowrap">
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
      )}
    </div>
  )
}

export default RefinementList
