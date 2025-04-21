"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"

export default function DarkroomPage() {
  const [image, setImage] = useState<string | null>(null)
  const [mockup, setMockup] = useState<string>("/il_fullxfull.6008848563_7wnj.jpeg") // default

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setImage(url)
    }
  }

  return (
    <div className="min-h-screen p-6 sm:p-10 font-sans">
      <h1 className="text-4xl font-[505] tracking-wider uppercase mb-6">Darkroom</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Editor panel */}
        <div className="border border-black p-6 space-y-6">
          <div>
            <label className="block text-sm uppercase font-medium mb-2">Upload your artwork</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full text-sm border border-gray-300 rounded px-2 py-1"
            />
          </div>

          <div>
            <label className="block text-sm uppercase font-medium mb-2">Choose a mockup</label>
            <select
              value={mockup}
              onChange={(e) => setMockup(e.target.value)}
              className="w-full border border-gray-300 px-2 py-1 text-sm rounded"
            >
              <option value="/il_fullxfull.6008848563_7wnj.jpeg">Mockup A (Front)</option>
              <option value="/il_570xN.6002672805_egkj.jpeg">Mockup B (Back)</option>
            </select>
          </div>

          {image && (
            <div>
              <p className="text-sm uppercase mb-2">Your upload</p>
              <Image
                src={image}
                alt="Uploaded design"
                width={400}
                height={400}
                className="object-contain border border-gray-200"
              />
            </div>
          )}
        </div>

        {/* Mockup preview panel */}
        <div className="border border-black p-6 relative">
          <Image
            src={mockup}
            alt="T-shirt mockup"
            width={600}
            height={800}
            className="w-full h-auto object-contain"
          />

          {image && (
            <Image
              src={image}
              alt="Preview on mockup"
              width={200}
              height={200}
              className="absolute top-[40%] left-[35%] opacity-80"
            />
          )}
        </div>
      </div>

      <div className="mt-10 flex justify-end">
        <Link
          href="/checkout?product=custom-print&price=80"
          className="px-6 py-2 border border-black uppercase tracking-wide hover:bg-black hover:text-white transition-all"
        >
          Proceed to Checkout (€80)
        </Link>
      </div>
    </div>
  )
}
