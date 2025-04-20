"use client"

import { useEffect, useState } from "react"
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
  const [categories, setCategories] = useState<Category[]>([])
  const [collections, setCollections] = useState<Collection[]>([])

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
    <div className="flex small:flex-col gap-12 py-4 mb-8 small:px-0 pl-6 small:min-w-[250px] small:ml-[1.675rem] font-sans text-base tracking-wider">
      {/* Sort */}
      <div className="flex flex-col gap-2">
        <span className="text-xs uppercase text-gray-500">Sort by</span>
        <SortProducts
          sortBy={sortBy}
          data-testid={dataTestId}
        />
      </div>

      {/* Categories */}
      <div className="flex flex-col gap-2">
        <span className="text-xs uppercase text-gray-500">Category</span>
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
        <span className="text-xs uppercase text-gray-500">Collection</span>
        <ul className="flex flex-col gap-2 text-sm">
          <li>
            <LocalizedClientLink
              href="/store"
              className="hover:underline text-gray-600"
            >
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
    </div>
  )
}

export default RefinementList
