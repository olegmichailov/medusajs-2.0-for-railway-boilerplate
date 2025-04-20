import React from "react"
import { useRouter, useSearchParams } from "next/navigation"

const sortOptions = [
  { label: "Latest Arrivals", value: "created_at" },
  { label: "Price: Low -> High", value: "price_asc" },
  { label: "Price: High -> Low", value: "price_desc" },
]

const categories = ["All Products", "Shirts", "Sweatshirts", "Merch", "art prints"]
const collections = ["Springtime!", "gmorkl & friends"]

const RefinementList = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentSort = searchParams.get("sortBy") || "created_at"

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams)
    params.set("sortBy", value)
    router.push(`?${params.toString()}`)
  }

  return (
    <div className="flex flex-col gap-6 sm:flex-row sm:justify-between sm:items-start sm:gap-12">
      <div className="flex-1">
        <h3 className="text-xs uppercase tracking-wide mb-2">Sort By</h3>
        <ul className="space-y-1">
          {sortOptions.map((option) => (
            <li
              key={option.value}
              onClick={() => handleSortChange(option.value)}
              className={`cursor-pointer text-sm hover:underline ${
                currentSort === option.value ? "font-semibold" : ""
              }`}
            >
              {option.label}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex-1">
        <h3 className="text-xs uppercase tracking-wide mb-2">Category</h3>
        <ul className="space-y-1">
          {categories.map((category) => (
            <li key={category} className="cursor-pointer text-sm hover:underline">
              {category}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex-1">
        <h3 className="text-xs uppercase tracking-wide mb-2">Collection</h3>
        <ul className="space-y-1">
          {collections.map((collection) => (
            <li key={collection} className="cursor-pointer text-sm hover:underline">
              {collection}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default RefinementList
