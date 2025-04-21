import { create } from "zustand"

type Tool = "select" | "draw" | "text"

interface DarkroomState {
  tool: Tool
  setTool: (t: Tool) => void
  color: string
  setColor: (c: string) => void
  brushSize: number
  setBrushSize: (s: number) => void
}

export const useDarkroomStore = create<DarkroomState>((set) => ({
  tool: "select",
  setTool: (tool) => set({ tool }),
  color: "#ffffff",
  setColor: (color) => set({ color }),
  brushSize: 4,
  setBrushSize: (brushSize) => set({ brushSize }),
}))
