// storefront/src/app/[countryCode]/darkroom/page.tsx

"use client"

import { useState } from "react"
import Image from "next/image"
import { usePathname } from "next/navigation"

const mockups = [
  {
    name: "Front Side",
    filename: "/mockups/il_fullxfull.6008848563_7wnj.avif",
    side: "front",
  },
  {
    name: "Back Side",
    filename: "/mockups/il_570xN.6002672805_egkj.avif",
    side: "back",
  },
]

export default function Darkroom() {
  const pathname = usePathname()
  const countryCode = pathname.split("/")[1] || "de"

  const [selectedMockup, setSelectedMockup] = useState(mockups[0])
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setUploadedImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="px-6 pt-10">
      <h1 className="text-4xl tracking-wider uppercase mb-8 font-medium">
        Darkroom Editor
      </h1>

      <div className="flex flex-col sm:flex-row gap-10">
        {/* Controls */}
        <div className="flex flex-col gap-4 w-full sm:w-1/3">
          <label className="text-sm uppercase tracking-wide">Upload Print</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            className="border border-black p-2 text-sm"
          />

          <label className="text-sm mt-6 uppercase tracking-wide">Choose Side</label>
          <div className="flex flex-col gap-2">
            {mockups.map((mockup) => (
              <button
                key={mockup.side}
                onClick={() => setSelectedMockup(mockup)}
                className={`border text-sm px-3 py-2 text-left tracking-wider uppercase font-medium transition-colors hover:bg-black hover:text-white ${
                  selectedMockup.side === mockup.side
                    ? "bg-black text-white"
                    : "bg-white text-black"
                }`}
              >
                {mockup.name}
              </button>
            ))}
          </div>
        </div>

        {/* Preview */}
        <div className="relative w-full sm:w-2/3 aspect-[4/5] border border-gray-300">
          <Image
            src={selectedMockup.filename}
            alt="Mockup preview"
            fill
            className="object-contain"
          />

          {uploadedImage && (
            <Image
              src={uploadedImage}
              alt="Uploaded Print"
              width={200}
              height={200}
              className="absolute top-1/3 left-1/3 opacity-90"
              draggable={false}
            />
          )}
        </div>
      </div>
    </div>
  )
}
