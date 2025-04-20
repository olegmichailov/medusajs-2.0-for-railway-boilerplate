import PaginatedProducts from "../components/paginated-products"
import RefinementList from "../components/refinement-list"
import { SortOptions } from "../components/refinement-list/sort-products"

export default function StoreTemplate({
  sortBy,
  page,
  collectionId,
  categoryId,
  countryCode,
}: {
  sortBy?: SortOptions
  page: number
  collectionId?: string
  categoryId?: string
  countryCode: string
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start w-full gap-6 sm:gap-10">
      <RefinementList sortBy={sortBy || "created_at"} />

      <div className="flex-1">
        <h1 className="text-2xl font-sans tracking-widest uppercase mb-6 px-6 sm:px-0">
          All Products
        </h1>

        <PaginatedProducts
          sortBy={sortBy}
          page={page}
          collectionId={collectionId}
          categoryId={categoryId}
          countryCode={countryCode}
        />
      </div>
    </div>
  )
}
