// src/app/[countryCode]/darkroom/page.tsx
"use client"

import dynamic from "next/dynamic"
import { usePathname } from "next/navigation"

const EditorCanvas = dynamic(() => import("@/components/darkroom/EditorCanvas"), {
  ssr: false,
})

export default function DarkroomPage() {
  const pathname = usePathname()
  const countryCode = pathname.split("/")[1] || "de"

  return (
    <div className="px-6 pt-10">
      <h1 className="text-4xl tracking-wider uppercase mb-8 font-medium">
        Darkroom Editor
      </h1>
      <EditorCanvas countryCode={countryCode} />
    </div>
  )
}
