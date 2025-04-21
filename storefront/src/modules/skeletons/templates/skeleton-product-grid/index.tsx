import SkeletonProductPreview from "@modules/skeletons/components/skeleton-product-preview"

const SkeletonProductGrid = () => {
  return (
    <ul className="grid grid-cols-1 small:grid-cols-2 gap-x-6 gap-y-10">
      {Array.from(Array(4).keys()).map((i) => (
        <li key={i}>
          <SkeletonProductPreview />
        </li>
      ))}
    </ul>
  )
}

export default SkeletonProductGrid
