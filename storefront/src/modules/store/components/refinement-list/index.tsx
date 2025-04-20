"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { getCategoriesList } from "@lib/data/categories"
import { getCollectionsList } from "@lib/data/collections"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import SortProducts, { SortOptions } from "./sort-products"

type RefinementListProps = {
  sortBy: SortOptions
  search?: boolean
  "data-testid"?: string
}

const RefinementList = ({
  sortBy,
  "data-testid": dataTestId,
}: RefinementListProps) => {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()

  const [categories, setCategories] = useState([])
  const [collections, setCollections] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const { product_categories } = await getCategoriesList(0, 100)
      const { collections } = await getCollectionsList(0, 100)
      setCategories(product_categories || [])
      setCollections(collections || [])
    }
    fetchData()
  }, [])

  const countryCode = pathname?.split("/")[1] || "de"
  const storePath = `/${countryCode}/store`
  const sortQuery = sortBy !== "created_at" ? `?sortBy=${sortBy}` : ""

  return (
    <div className="flex small:flex-col gap-12 py-4 mb-8 small:px-0 pl-6 small:min-w-[250px] small:ml-[1.675rem]">
      {/* СОРТИРОВКА */}
      <div className="flex flex-col gap-2">
        <span className="text-xs uppercase text-gray-500">Sort by</span>
        <SortProducts
          sortBy={sortBy}
          setQueryParams={(name, value) => {
            const params = new URLSearchParams(searchParams)
            params.set(name, value)
            router.push(`${pathname?.split("?")[0]}?${params.toString()}`)
          }}
          data-testid={dataTestId}
        />
      </div>

      {/* КАТЕГОРИИ */}
      {categories.length > 0 && (
        <div className="flex flex-col gap-2">
          <span className="text-xs uppercase text-gray-500">Category</span>
          <ul className="flex flex-col gap-2 text-sm text-gray-600">
            <li>
              <LocalizedClientLink
                href={`${storePath}${sortQuery}`}
                className="hover:underline"
              >
                All Products
              </LocalizedClientLink>
            </li>
            {categories
              .filter((cat) => !cat.parent_category)
              .map((c) => (
                <li key={c.id}>
                  <LocalizedClientLink
                    href={`/${countryCode}/categories/${c.handle}${sortQuery}`}
                    className={`hover:underline ${
                      pathname.includes(`/categories/${c.handle}`)
                        ? "font-semibold"
                        : ""
                    }`}
                  >
                    {c.name}
                  </LocalizedClientLink>
                </li>
              ))}
          </ul>
        </div>
      )}

      {/* КОЛЛЕКЦИИ */}
      {collections.length > 0 && (
        <div className="flex flex-col gap-2">
          <span className="text-xs uppercase text-gray-500">Collection</span>
          <ul className="flex flex-col gap-2 text-sm text-gray-600">
            {collections.map((c) => (
              <li key={c.id}>
                <LocalizedClientLink
                  href={`/${countryCode}/collections/${c.handle}${sortQuery}`}
                  className={`hover:underline ${
                    pathname.includes(`/collections/${c.handle}`)
                      ? "font-semibold"
                      : ""
                  }`}
                >
                  {c.title}
                </LocalizedClientLink>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default RefinementList
