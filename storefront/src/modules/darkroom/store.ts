import { create } from "zustand"

type DarkroomState = {
  tool: "select" | "draw" | "text"
  color: string
  brushSize: number
  setTool: (tool: DarkroomState["tool"]) => void
  setColor: (color: string) => void
  setBrushSize: (size: number) => void
}

export const useDarkroomStore = create<DarkroomState>((set) => ({
  tool: "select",
  color: "#ffffff",
  brushSize: 4,
  setTool: (tool) => set({ tool }),
  setColor: (color) => set({ color }),
  setBrushSize: (brushSize) => set({ brushSize }),
}))
