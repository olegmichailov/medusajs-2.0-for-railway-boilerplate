import { getProductsListWithSort } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import ProductPreview from "@modules/products/components/product-preview"
import { Pagination } from "@modules/store/components/pagination"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

const PRODUCT_LIMIT = 12

type PaginatedProductsParams = {
  limit: number
  collection_id?: string[]
  category_id?: string[]
  id?: string[]
  order?: string
}

export default async function PaginatedProducts({
  sortBy,
  page,
  collectionId,
  categoryId,
  productsIds,
  countryCode,
}: {
  sortBy?: SortOptions
  page: number
  collectionId?: string
  categoryId?: string
  productsIds?: string[]
  countryCode: string
}) {
  const queryParams: PaginatedProductsParams = {
    limit: PRODUCT_LIMIT,
  }

  if (collectionId) queryParams.collection_id = [collectionId]
  if (categoryId) queryParams.category_id = [categoryId]
  if (productsIds) queryParams.id = productsIds
  if (sortBy === "created_at") queryParams.order = "created_at"

  const region = await getRegion(countryCode)
  if (!region) return null

  const {
    response: { products, count },
  } = await getProductsListWithSort({
    page,
    queryParams,
    sortBy,
    countryCode,
  })

  const totalPages = Math.ceil(count / PRODUCT_LIMIT)

  return (
    <>
      <ul className="grid grid-cols-2 small:grid-cols-3 md:grid-cols-4 gap-x-4 gap-y-8 px-6 sm:px-0">
        {products.map((p) => (
          <li key={p.id}>
            <ProductPreview product={p} region={region} />
          </li>
        ))}
      </ul>
      {totalPages > 1 && (
        <Pagination page={page} totalPages={totalPages} />
      )}
    </>
  )
}
