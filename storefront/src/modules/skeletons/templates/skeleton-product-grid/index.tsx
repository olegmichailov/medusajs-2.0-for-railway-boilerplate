import SkeletonProductPreview from "@modules/skeletons/components/skeleton-product-preview"

const SkeletonProductGrid = () => {
  const skeletons = Array.from({ length: 8 }, (_, i) => i)

  return (
    <ul
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 px-4 sm:px-0"
      data-testid="products-list-loader"
    >
      {skeletons.map((index) => (
        <SkeletonProductPreview key={index} />
      ))}
    </ul>
  )
}

export default SkeletonProductGrid
