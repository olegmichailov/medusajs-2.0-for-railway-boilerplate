"use client"

import Image from "next/image"
import { usePathname } from "next/navigation"
import { useState } from "react"

export default function DarkroomPage() {
  const pathname = usePathname()
  const countryCode = pathname.split("/")[1] || "de"

  const [image, setImage] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImage(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const handleSubmit = () => {
    if (!image) return
    alert("Order received — mockup preview and original image will be sent to your email.")
    // Здесь можно будет добавить отправку в админку или на email
  }

  return (
    <div className="px-4 sm:px-8 py-8">
      <h1 className="text-4xl font-medium tracking-wider uppercase mb-6">Darkroom</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Редактор */}
        <div className="flex flex-col gap-4">
          <label className="text-base font-semibold tracking-wide uppercase">
            Upload your image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="border border-gray-300 p-2"
          />
          {previewUrl && (
            <Image
              src={previewUrl}
              alt="Preview"
              width={400}
              height={400}
              className="border border-gray-300"
            />
          )}
        </div>

        {/* Мокап */}
        <div className="relative w-full h-[500px] border border-gray-300 overflow-hidden">
          <Image
            src="/ShortFront.jpg"
            alt="T-Shirt Mockup"
            layout="fill"
            objectFit="cover"
          />
          {previewUrl && (
            <Image
              src={previewUrl}
              alt="Print Preview"
              width={150}
              height={150}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-90 pointer-events-none"
            />
          )}
        </div>
      </div>

      {/* Checkout */}
      <div className="mt-6">
        <button
          onClick={handleSubmit}
          className="px-6 py-2 border border-black text-base font-medium tracking-wide uppercase hover:bg-black hover:text-white transition-all"
        >
          Checkout
        </button>
      </div>
    </div>
  )
}
