"use client"

import EditorCanvas from "../../../modules/darkroom/EditorCanvas"

export default function DarkroomPage() {
  return (
    <div className="px-6 pt-10">
      <h1 className="text-4xl tracking-wider uppercase mb-8 font-medium">
        Darkroom Editor
      </h1>
      <EditorCanvas />
    </div>
  )
}
